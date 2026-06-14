export const storeCategories = [
  "All",
  "Scripts",
  "Custom Peds",
  "Systems",
  "Outfit / Creator",
  "Add-ons",
  "Free Resources",
] as const

export type StoreCategory = (typeof storeCategories)[number]
export type ProductCategory = Exclude<StoreCategory, "All">

export const categorySlugs: Record<ProductCategory, string> = {
  Scripts: "scripts",
  "Custom Peds": "custom-peds",
  Systems: "systems",
  "Outfit / Creator": "outfit-creator",
  "Add-ons": "add-ons",
  "Free Resources": "free-resources",
}

export function categoryToSlug(category: ProductCategory) {
  return categorySlugs[category]
}

export function slugToCategory(slug: string): ProductCategory | undefined {
  return (Object.keys(categorySlugs) as ProductCategory[]).find(
    (category) => categorySlugs[category] === slug,
  )
}

export function slugifyProduct(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export type StoreProduct = {
  id: string
  title: string
  subtitle: string
  category: ProductCategory
  price: string
  priceSource?: "manual" | "tebex"
  rating: number
  reviews: number
  image: string
  imageMode?: "cover" | "contain"
  badge?: string
  tebexUrl?: string
  packageId?: string
  docsUrl?: string
  videoUrl?: string
  fullDescription?: string
  features?: string[]
  requirements?: string[]
  gallery?: string[]
  featured?: boolean
}

export const storeProducts: StoreProduct[] = [
  {
    id: "tws-identity-forge",
    title: "TWS IDENTITY FORGE",
    subtitle: "Criação, edição e gerenciamento de identidade visual para RedM",
    category: "Systems",
    price: "R$ 650,00",
    rating: 5,
    reviews: 36,
    image: "/products/tws-identity-forge/new-cover.png",
    imageMode: "cover",
    badge: "Tebex",
    tebexUrl: "https://the-wanted-sole-studio-webstore.tebex.io/package/7457637",
    packageId: "7457637",
    docsUrl: "/docs?product=tws-identity-forge",
    featured: true,
    fullDescription:
      "Sistema premium para criação, edição e gerenciamento de identidade visual, personagens e outfits para RedM. Interface moderna com organização por projetos, favoritos, preview em tempo real e recursos avançados de customização.",
    features: [
      "Interface moderna e intuitiva",
      "Sistema otimizado para alta performance",
      "Criação e organização de personagens/outfits",
      "Preview visual para testar componentes",
      "Configuração simples via arquivo de config",
      "Suporte dedicado via Discord",
    ],
    requirements: [
      "Servidor RedM atualizado",
      "Framework compatível",
      "Permissão para adicionar resources",
      "Dependências listadas na documentação oficial",
    ],
    gallery: [
      "/products/tws-identity-forge/new-cover.png",
      "/products/tws-identity-forge/new-details.png",
      "/products/tws-identity-forge/logo-transparent.png",
    ],
  },
  {
    id: "wanted-menu",
    title: "WANTED MENU",
    subtitle: "Sistema de menu avançado",
    category: "Scripts",
    price: "R$ 49,90",
    rating: 5,
    reviews: 120,
    image: "/products/wanted-menu.png",
    badge: "Popular",
    featured: true,
  },
  {
    id: "banking-system",
    title: "BANKING SYSTEM",
    subtitle: "Banco completo para servidor",
    category: "Systems",
    price: "R$ 69,90",
    rating: 5,
    reviews: 85,
    image: "/products/banking-system.png",
    featured: true,
  },
  {
    id: "illegal-activities",
    title: "ILLEGAL ACTIVITIES",
    subtitle: "Rotas e atividades ilegais",
    category: "Scripts",
    price: "R$ 59,90",
    rating: 4,
    reviews: 64,
    image: "/products/illegal-activities.png",
    featured: true,
  },
  {
    id: "vehicle-control",
    title: "VEHICLE CONTROL",
    subtitle: "Controle avançado de veículos",
    category: "Add-ons",
    price: "R$ 49,90",
    rating: 5,
    reviews: 93,
    image: "/products/vehicle-control.png",
  },
  {
    id: "crafting-system",
    title: "CRAFTING SYSTEM",
    subtitle: "Criação e receitas customizadas",
    category: "Systems",
    price: "R$ 39,90",
    rating: 4,
    reviews: 77,
    image: "/products/crafting-system.png",
  },
  {
    id: "sheriff-custom-ped",
    title: "SHERIFF CUSTOM PED",
    subtitle: "Personagem exclusivo para law",
    category: "Custom Peds",
    price: "R$ 89,90",
    rating: 5,
    reviews: 48,
    image: "/products/illegal-activities.png",
  },
  {
    id: "outlaw-ped-pack",
    title: "OUTLAW PED PACK",
    subtitle: "Coleção de personagens do oeste",
    category: "Custom Peds",
    price: "R$ 119,90",
    rating: 5,
    reviews: 42,
    image: "/products/wanted-menu.png",
  },
  {
    id: "ranch-outfit-creator",
    title: "RANCH OUTFIT CREATOR",
    subtitle: "Criador de roupas para roles",
    category: "Outfit / Creator",
    price: "R$ 79,90",
    rating: 4,
    reviews: 55,
    image: "/products/crafting-system.png",
  },
  {
    id: "character-creator",
    title: "CHARACTER CREATOR",
    subtitle: "Criação visual completa",
    category: "Outfit / Creator",
    price: "R$ 99,90",
    rating: 5,
    reviews: 73,
    image: "/products/banking-system.png",
  },
  {
    id: "stable-addons",
    title: "STABLE ADD-ONS",
    subtitle: "Extras para cavalos e estábulos",
    category: "Add-ons",
    price: "R$ 34,90",
    rating: 4,
    reviews: 31,
    image: "/products/vehicle-control.png",
  },
  {
    id: "starter-hud",
    title: "STARTER HUD",
    subtitle: "Interface base para RedM",
    category: "Free Resources",
    price: "Grátis",
    rating: 5,
    reviews: 150,
    image: "/products/wanted-menu.png",
    badge: "Free",
  },
  {
    id: "discord-template",
    title: "DISCORD TEMPLATE",
    subtitle: "Modelo para comunidade",
    category: "Free Resources",
    price: "Grátis",
    rating: 5,
    reviews: 96,
    image: "/products/banking-system.png",
    badge: "Free",
  },
]

export function productToSlug(product: StoreProduct) {
  return slugifyProduct(product.id || product.title)
}

export function slugToProduct(slug: string) {
  return storeProducts.find(
    (product) =>
      productToSlug(product) === slug ||
      slugifyProduct(product.title) === slug ||
      product.id === slug,
  )
}

export const featuredProductIds = [
  "tws-identity-forge",
  "wanted-menu",
  "banking-system",
  "illegal-activities",
] as const

export const featuredProducts = storeProducts.filter((product) =>
  featuredProductIds.includes(product.id as (typeof featuredProductIds)[number]),
)

export function getFeaturedProducts(products: StoreProduct[], limit = 4) {
  const explicitFeatured = products.filter((product) => product.featured)

  if (explicitFeatured.length > 0) {
    return explicitFeatured.slice(0, limit)
  }

  const legacyFeatured = products.filter((product) =>
    featuredProductIds.includes(product.id as (typeof featuredProductIds)[number]),
  )

  return (legacyFeatured.length > 0 ? legacyFeatured : products).slice(0, limit)
}
