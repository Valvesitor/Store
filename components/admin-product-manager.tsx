"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState, type ReactNode } from "react"
import { ExternalLink, FilePenLine, Plus, RotateCcw, Save, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  categoryToSlug,
  productToSlug,
  storeCategories,
  type ProductCategory,
  type StoreProduct,
} from "@/lib/store-data"
import type { ProductPersistence } from "@/lib/product-store"

type ProductFormState = {
  id: string
  title: string
  subtitle: string
  category: ProductCategory
  price: string
  rating: string
  reviews: string
  image: string
  imageMode: "cover" | "contain"
  badge: string
  tebexUrl: string
  packageId: string
  docsUrl: string
  fullDescription: string
  features: string
  requirements: string
  gallery: string
}

const productCategories = storeCategories.filter(
  (category): category is ProductCategory => category !== "All",
)

function productToForm(product: StoreProduct): ProductFormState {
  return {
    id: product.id,
    title: product.title,
    subtitle: product.subtitle,
    category: product.category,
    price: product.price,
    rating: String(product.rating ?? 5),
    reviews: String(product.reviews ?? 0),
    image: product.image,
    imageMode: product.imageMode ?? "cover",
    badge: product.badge ?? "",
    tebexUrl: product.tebexUrl ?? "",
    packageId: product.packageId ?? "",
    docsUrl: product.docsUrl ?? "",
    fullDescription: product.fullDescription ?? "",
    features: (product.features ?? []).join("\n"),
    requirements: (product.requirements ?? []).join("\n"),
    gallery: (product.gallery ?? []).join("\n"),
  }
}

function blankProduct(): ProductFormState {
  const id = `produto-${Date.now()}`

  return {
    id,
    title: "NOVO PRODUTO",
    subtitle: "Descrição curta do produto",
    category: "Scripts",
    price: "R$ 0,00",
    rating: "5",
    reviews: "0",
    image: "/placeholder.jpg",
    imageMode: "cover",
    badge: "",
    tebexUrl: "",
    packageId: "",
    docsUrl: "/docs",
    fullDescription: "",
    features: "Instalação guiada\nSuporte via Discord",
    requirements: "Servidor RedM atualizado",
    gallery: "",
  }
}

function formToProduct(form: ProductFormState) {
  const toList = (value: string) =>
    value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)

  return {
    ...form,
    rating: Number(form.rating) || 5,
    reviews: Number(form.reviews) || 0,
    badge: form.badge || undefined,
    tebexUrl: form.tebexUrl || undefined,
    packageId: form.packageId || undefined,
    docsUrl: form.docsUrl || undefined,
    fullDescription: form.fullDescription || undefined,
    features: toList(form.features),
    requirements: toList(form.requirements),
    gallery: toList(form.gallery),
  }
}

function statusClass(enabled: boolean) {
  return enabled
    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
    : "border-primary/30 bg-primary/10 text-primary"
}

function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="grid gap-2">
      <span className="font-display text-[0.65rem] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  )
}

export function AdminProductManager({
  initialProducts,
  persistence,
}: {
  initialProducts: StoreProduct[]
  persistence: ProductPersistence
}) {
  const [products, setProducts] = useState(initialProducts)
  const [editing, setEditing] = useState<ProductFormState | null>(null)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  const catalogValue = useMemo(() => {
    return products.reduce((total, product) => {
      if (product.price.toLowerCase().includes("gratis")) return total
      const value = Number.parseFloat(
        product.price.replace(/[^\d,.-]/g, "").replace(",", "."),
      )
      return total + (Number.isFinite(value) ? value : 0)
    }, 0)
  }, [products])

  async function refreshProducts(nextProducts?: StoreProduct[]) {
    if (nextProducts) {
      setProducts(nextProducts)
      return
    }

    const response = await fetch("/api/admin/products", { cache: "no-store" })
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data?.error || "Não foi possível carregar os produtos.")
    }

    setProducts(data.products)
  }

  async function saveProduct() {
    if (!editing) return

    setSaving(true)
    setMessage("")

    try {
      const method = creating ? "POST" : "PUT"
      const url = creating
        ? "/api/admin/products"
        : `/api/admin/products/${encodeURIComponent(editing.id)}`
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formToProduct(editing)),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || "Erro ao salvar produto.")
      }

      await refreshProducts(data.products)
      setEditing(null)
      setCreating(false)
      setMessage("Produto salvo com sucesso.")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro inesperado ao salvar.")
    } finally {
      setSaving(false)
    }
  }

  async function removeProduct(product: StoreProduct) {
    if (!confirm(`Excluir ${product.title}?`)) return

    setSaving(true)
    setMessage("")

    try {
      const response = await fetch(`/api/admin/products/${encodeURIComponent(product.id)}`, {
        method: "DELETE",
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || "Erro ao excluir produto.")
      }

      await refreshProducts(data.products)
      setMessage("Produto excluído.")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro inesperado ao excluir.")
    } finally {
      setSaving(false)
    }
  }

  async function resetCatalog() {
    if (!confirm("Resetar o catálogo para os produtos padrão do código?")) return

    setSaving(true)
    setMessage("")

    try {
      const response = await fetch("/api/admin/products/reset", { method: "POST" })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || "Erro ao resetar catálogo.")
      }

      await refreshProducts(data.products)
      setEditing(null)
      setCreating(false)
      setMessage("Catálogo resetado.")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro inesperado ao resetar.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <section id="produtos-admin" className="rounded-lg border border-border bg-card/70">
      <div className="flex flex-col gap-4 border-b border-border p-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="font-display text-xs uppercase text-primary">Catálogo editável</p>
          <h2 className="mt-1 font-display text-2xl font-bold uppercase text-foreground">
            Produtos da loja
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            As alterações são salvas no R2 <strong>PRODUCT_MEDIA</strong>, no arquivo
            <strong> catalog/products.json</strong>. O catálogo fixo continua como fallback.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Status: {persistence.message}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            className="h-10 bg-primary px-4 font-display text-xs uppercase text-primary-foreground hover:bg-primary/90"
            onClick={() => {
              setCreating(true)
              setEditing(blankProduct())
            }}
          >
            <Plus className="h-4 w-4" />
            Novo produto
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-10 border-primary/30 bg-background/70 font-display text-xs uppercase text-foreground hover:border-primary/60"
            onClick={resetCatalog}
            disabled={saving || !persistence.canWrite}
          >
            <RotateCcw className="h-4 w-4" />
            Resetar
          </Button>
        </div>
      </div>

      {message && (
        <div className="border-b border-border bg-background/45 px-5 py-3 text-sm text-primary">
          {message}
        </div>
      )}

      <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left">
            <thead className="border-b border-border bg-background/35">
              <tr className="font-display text-xs uppercase text-muted-foreground">
                <th className="px-5 py-3 font-medium">Produto</th>
                <th className="px-5 py-3 font-medium">Categoria</th>
                <th className="px-5 py-3 font-medium">Preço</th>
                <th className="px-5 py-3 font-medium">Package</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id} className="text-sm">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-16 overflow-hidden rounded-md border border-border bg-background">
                        <Image
                          src={product.image || "/placeholder.jpg"}
                          alt=""
                          fill
                          sizes="64px"
                          className={
                            product.imageMode === "contain"
                              ? "object-contain p-1.5"
                              : "object-cover"
                          }
                        />
                      </div>
                      <div>
                        <p className="font-display text-sm font-semibold uppercase text-foreground">
                          {product.title}
                        </p>
                        <p className="mt-1 line-clamp-1 max-w-64 text-xs text-muted-foreground">
                          {product.subtitle}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">
                    <Link
                      href={`/categorias/${categoryToSlug(product.category)}`}
                      className="transition-colors hover:text-primary"
                    >
                      {product.category}
                    </Link>
                  </td>
                  <td className="px-5 py-4 font-display text-base text-primary">
                    {product.price}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {product.packageId ? `#${product.packageId}` : "Pendente"}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded border px-2 py-1 font-display text-[0.65rem] uppercase ${statusClass(Boolean(product.packageId))}`}
                    >
                      {product.packageId ? "Tebex OK" : "Configurar"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="h-9 w-9 border-border bg-background/70 p-0 text-muted-foreground hover:text-foreground"
                        asChild
                      >
                        <Link href={`/produtos/${productToSlug(product)}`}>
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-9 w-9 border-border bg-background/70 p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setCreating(false)
                          setEditing(productToForm(product))
                        }}
                      >
                        <FilePenLine className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-9 w-9 border-red-500/30 bg-background/70 p-0 text-red-300 hover:border-red-500/60 hover:text-red-200"
                        onClick={() => removeProduct(product)}
                        disabled={saving || !persistence.canWrite}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <aside className="border-t border-border bg-background/30 p-5 xl:border-l xl:border-t-0">
          {editing ? (
            <div className="grid gap-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-xs uppercase text-primary">
                    {creating ? "Novo produto" : "Editando"}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold uppercase text-foreground">
                    {editing.title || editing.id}
                  </h3>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 w-9 border-border bg-card/70 p-0"
                  onClick={() => {
                    setEditing(null)
                    setCreating(false)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <Field label="ID / slug">
                <Input
                  value={editing.id}
                  onChange={(event) => setEditing({ ...editing, id: event.target.value })}
                  disabled={!creating}
                  className="bg-background/70"
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Título">
                  <Input
                    value={editing.title}
                    onChange={(event) => setEditing({ ...editing, title: event.target.value })}
                    className="bg-background/70"
                  />
                </Field>
                <Field label="Categoria">
                  <select
                    value={editing.category}
                    onChange={(event) =>
                      setEditing({ ...editing, category: event.target.value as ProductCategory })
                    }
                    className="h-10 rounded-md border border-border bg-background/70 px-3 text-sm text-foreground"
                  >
                    {productCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Subtítulo">
                <Input
                  value={editing.subtitle}
                  onChange={(event) => setEditing({ ...editing, subtitle: event.target.value })}
                  className="bg-background/70"
                />
              </Field>

              <Field label="Descrição completa">
                <Textarea
                  value={editing.fullDescription}
                  onChange={(event) =>
                    setEditing({ ...editing, fullDescription: event.target.value })
                  }
                  className="min-h-28 bg-background/70"
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Preço">
                  <Input
                    value={editing.price}
                    onChange={(event) => setEditing({ ...editing, price: event.target.value })}
                    className="bg-background/70"
                  />
                </Field>
                <Field label="Rating">
                  <Input
                    value={editing.rating}
                    onChange={(event) => setEditing({ ...editing, rating: event.target.value })}
                    className="bg-background/70"
                  />
                </Field>
                <Field label="Reviews">
                  <Input
                    value={editing.reviews}
                    onChange={(event) => setEditing({ ...editing, reviews: event.target.value })}
                    className="bg-background/70"
                  />
                </Field>
              </div>

              <Field label="Imagem principal">
                <Input
                  value={editing.image}
                  onChange={(event) => setEditing({ ...editing, image: event.target.value })}
                  className="bg-background/70"
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Modo da imagem">
                  <select
                    value={editing.imageMode}
                    onChange={(event) =>
                      setEditing({ ...editing, imageMode: event.target.value as "cover" | "contain" })
                    }
                    className="h-10 rounded-md border border-border bg-background/70 px-3 text-sm text-foreground"
                  >
                    <option value="cover">cover</option>
                    <option value="contain">contain</option>
                  </select>
                </Field>
                <Field label="Badge">
                  <Input
                    value={editing.badge}
                    onChange={(event) => setEditing({ ...editing, badge: event.target.value })}
                    className="bg-background/70"
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Package ID Tebex">
                  <Input
                    value={editing.packageId}
                    onChange={(event) => setEditing({ ...editing, packageId: event.target.value })}
                    className="bg-background/70"
                  />
                </Field>
                <Field label="Docs URL">
                  <Input
                    value={editing.docsUrl}
                    onChange={(event) => setEditing({ ...editing, docsUrl: event.target.value })}
                    className="bg-background/70"
                  />
                </Field>
              </div>

              <Field label="Tebex URL">
                <Input
                  value={editing.tebexUrl}
                  onChange={(event) => setEditing({ ...editing, tebexUrl: event.target.value })}
                  className="bg-background/70"
                />
              </Field>

              <Field label="Features — uma por linha">
                <Textarea
                  value={editing.features}
                  onChange={(event) => setEditing({ ...editing, features: event.target.value })}
                  className="min-h-28 bg-background/70"
                />
              </Field>

              <Field label="Requisitos — um por linha">
                <Textarea
                  value={editing.requirements}
                  onChange={(event) => setEditing({ ...editing, requirements: event.target.value })}
                  className="min-h-24 bg-background/70"
                />
              </Field>

              <Field label="Galeria — uma imagem por linha">
                <Textarea
                  value={editing.gallery}
                  onChange={(event) => setEditing({ ...editing, gallery: event.target.value })}
                  className="min-h-24 bg-background/70"
                />
              </Field>

              <Button
                type="button"
                className="h-11 bg-primary font-display text-xs uppercase text-primary-foreground hover:bg-primary/90"
                onClick={saveProduct}
                disabled={saving || !persistence.canWrite}
              >
                <Save className="h-4 w-4" />
                {saving ? "Salvando..." : "Salvar produto"}
              </Button>

              {!persistence.canWrite && (
                <p className="rounded-md border border-primary/30 bg-primary/10 p-3 text-xs leading-5 text-primary">
                  Para salvar em produção, o Worker precisa ter o binding R2 PRODUCT_MEDIA.
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-md border border-border bg-card/70 p-4 text-sm leading-6 text-muted-foreground">
              <p className="font-display text-xs uppercase text-primary">Resumo</p>
              <p className="mt-2">Produtos: {products.length}</p>
              <p>
                Valor catálogo:{" "}
                {new Intl.NumberFormat("pt-BR", {
                  currency: "BRL",
                  style: "currency",
                }).format(catalogValue)}
              </p>
              <p className="mt-3">Clique no ícone de edição para alterar um produto.</p>
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}
