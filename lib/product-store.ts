import { getCloudflareContext } from "@opennextjs/cloudflare"
import {
  productToSlug,
  slugifyProduct,
  storeCategories,
  storeProducts,
  type ProductCategory,
  type StoreProduct,
} from "@/lib/store-data"

const CATALOG_KEY = "catalog/products.json"

const PRODUCT_CATEGORIES = storeCategories.filter(
  (category): category is ProductCategory => category !== "All",
)

type R2ObjectLike = {
  text(): Promise<string>
}

type R2BucketLike = {
  get(key: string): Promise<R2ObjectLike | null>
  put(key: string, value: string, options?: Record<string, unknown>): Promise<unknown>
  delete(key: string): Promise<unknown>
}

type RuntimeEnv = {
  PRODUCT_MEDIA?: R2BucketLike
}

export type ProductPersistence = {
  mode: "r2" | "fallback"
  canWrite: boolean
  message: string
}

function getProductMediaBucket() {
  try {
    const context = getCloudflareContext()
    return (context.env as RuntimeEnv | undefined)?.PRODUCT_MEDIA
  } catch {
    return undefined
  }
}

function stringValue(value: unknown, fallback = "") {
  if (typeof value !== "string") return fallback
  return value.trim()
}

function numberValue(value: unknown, fallback: number) {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

function stringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean)
  }

  if (typeof value === "string") {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}

function categoryValue(value: unknown, fallback: ProductCategory = "Scripts") {
  const category = stringValue(value)
  return PRODUCT_CATEGORIES.includes(category as ProductCategory)
    ? (category as ProductCategory)
    : fallback
}

export function normalizeProduct(input: unknown, fallback?: Partial<StoreProduct>) {
  const source = (typeof input === "object" && input ? input : {}) as Record<string, unknown>
  const fallbackId = fallback?.id || fallback?.title || "produto"
  const id = slugifyProduct(stringValue(source.id, fallbackId)) || slugifyProduct(fallbackId)
  const title = stringValue(source.title, fallback?.title || id).toUpperCase()

  return {
    id,
    title,
    subtitle: stringValue(source.subtitle, fallback?.subtitle || "Produto oficial The Wanted Sole Studio"),
    category: categoryValue(source.category, fallback?.category),
    price: stringValue(source.price, fallback?.price || "R$ 0,00"),
    rating: Math.min(5, Math.max(0, numberValue(source.rating, fallback?.rating ?? 5))),
    reviews: Math.max(0, Math.floor(numberValue(source.reviews, fallback?.reviews ?? 0))),
    image: stringValue(source.image, fallback?.image || "/placeholder.jpg"),
    imageMode:
      source.imageMode === "contain" || source.imageMode === "cover"
        ? source.imageMode
        : fallback?.imageMode,
    badge: stringValue(source.badge, fallback?.badge || "") || undefined,
    tebexUrl: stringValue(source.tebexUrl, fallback?.tebexUrl || "") || undefined,
    packageId: stringValue(source.packageId, fallback?.packageId || "") || undefined,
    docsUrl: stringValue(source.docsUrl, fallback?.docsUrl || "") || undefined,
    fullDescription:
      stringValue(source.fullDescription, fallback?.fullDescription || "") || undefined,
    features: stringArray(source.features).length
      ? stringArray(source.features)
      : fallback?.features,
    requirements: stringArray(source.requirements).length
      ? stringArray(source.requirements)
      : fallback?.requirements,
    gallery: stringArray(source.gallery).length ? stringArray(source.gallery) : fallback?.gallery,
  } satisfies StoreProduct
}

export function normalizeProducts(input: unknown) {
  if (!Array.isArray(input)) return [...storeProducts]

  const products = input.map((product) => normalizeProduct(product))
  const unique = new Map<string, StoreProduct>()

  for (const product of products) {
    unique.set(product.id, product)
  }

  return Array.from(unique.values())
}

export function getProductPersistence(): ProductPersistence {
  const bucket = getProductMediaBucket()

  if (!bucket) {
    return {
      mode: "fallback",
      canWrite: false,
      message: "PRODUCT_MEDIA não está disponível neste ambiente. Usando catálogo fixo como fallback.",
    }
  }

  return {
    mode: "r2",
    canWrite: true,
    message: "Catálogo salvo no R2 PRODUCT_MEDIA em catalog/products.json.",
  }
}

async function readProductsFromR2(bucket: R2BucketLike) {
  const object = await bucket.get(CATALOG_KEY)

  if (!object) {
    await bucket.put(CATALOG_KEY, JSON.stringify(storeProducts, null, 2), {
      httpMetadata: { contentType: "application/json; charset=utf-8" },
    })
    return [...storeProducts]
  }

  try {
    return normalizeProducts(JSON.parse(await object.text()))
  } catch {
    return [...storeProducts]
  }
}

export async function getProducts() {
  const bucket = getProductMediaBucket()
  if (!bucket) return [...storeProducts]

  return readProductsFromR2(bucket)
}

export async function saveProducts(products: StoreProduct[]) {
  const bucket = getProductMediaBucket()

  if (!bucket) {
    throw new Error("PRODUCT_MEDIA não está conectado. Configure o binding R2 no Worker.")
  }

  const normalized = normalizeProducts(products)

  await bucket.put(CATALOG_KEY, JSON.stringify(normalized, null, 2), {
    httpMetadata: { contentType: "application/json; charset=utf-8" },
  })

  return normalized
}

export async function createProduct(input: unknown) {
  const products = await getProducts()
  const product = normalizeProduct(input)

  if (products.some((item) => item.id === product.id)) {
    throw new Error("Já existe um produto com esse ID.")
  }

  return saveProducts([product, ...products])
}

export async function updateProduct(id: string, input: unknown) {
  const products = await getProducts()
  const index = products.findIndex((product) => product.id === id)

  if (index < 0) {
    throw new Error("Produto não encontrado.")
  }

  const updated = normalizeProduct({ ...(products[index] ?? {}), ...(input as object), id }, products[index])
  const nextProducts = [...products]
  nextProducts[index] = updated

  return saveProducts(nextProducts)
}

export async function deleteProduct(id: string) {
  const products = await getProducts()
  const nextProducts = products.filter((product) => product.id !== id)

  if (nextProducts.length === products.length) {
    throw new Error("Produto não encontrado.")
  }

  return saveProducts(nextProducts)
}

export async function resetProducts() {
  return saveProducts([...storeProducts])
}

export async function getProductBySlug(slug: string) {
  const products = await getProducts()

  return products.find(
    (product) =>
      productToSlug(product) === slug ||
      slugifyProduct(product.title) === slug ||
      product.id === slug,
  )
}

export async function getProductsByCategory(category: ProductCategory) {
  const products = await getProducts()
  return products.filter((product) => product.category === category)
}
