"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import {
  ExternalLink,
  FilePenLine,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  categoryToSlug,
  productToSlug,
  type StoreProduct,
} from "@/lib/store-data"
import type { ProductPersistence } from "@/lib/product-store"

function priceValue(product: StoreProduct) {
  if (product.price.toLowerCase().includes("gratis")) return 0
  const value = Number.parseFloat(
    product.price.replace(/[^\d,.-]/g, "").replace(",", "."),
  )
  return Number.isFinite(value) ? value : 0
}

function statusClass(enabled: boolean) {
  return enabled
    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
    : "border-primary/30 bg-primary/10 text-primary"
}

export function AdminProductManager({
  initialProducts,
  persistence,
}: {
  initialProducts: StoreProduct[]
  persistence: ProductPersistence
}) {
  const [products, setProducts] = useState(initialProducts)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  const catalogValue = useMemo(() => {
    return products.reduce((total, product) => total + priceValue(product), 0)
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
            A edição agora abre em uma página completa para ficar mais confortável.
            As alterações são salvas no R2 <strong>PRODUCT_MEDIA</strong>, no arquivo
            <strong> catalog/products.json</strong>.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">Status: {persistence.message}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Valor estimado do catálogo: {new Intl.NumberFormat("pt-BR", { currency: "BRL", style: "currency" }).format(catalogValue)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            className="h-10 bg-primary px-4 font-display text-xs uppercase text-primary-foreground hover:bg-primary/90"
            asChild
          >
            <Link href="/admin/produtos/novo">
              <Plus className="h-4 w-4" />
              Novo produto
            </Link>
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

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="border-b border-border bg-background/35">
            <tr className="font-display text-xs uppercase text-muted-foreground">
              <th className="px-5 py-3 font-medium">Produto</th>
              <th className="px-5 py-3 font-medium">Categoria</th>
              <th className="px-5 py-3 font-medium">Preço</th>
              <th className="px-5 py-3 font-medium">Mídia</th>
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
                  {product.videoUrl ? "Imagem + vídeo" : product.gallery?.length ? "Galeria" : "Imagem"}
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
                      className="h-9 border-border bg-background/70 px-3 font-display text-xs uppercase text-muted-foreground hover:text-foreground"
                      asChild
                    >
                      <Link href={`/admin/produtos/${encodeURIComponent(product.id)}`}>
                        <FilePenLine className="h-4 w-4" />
                        Editar
                      </Link>
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
    </section>
  )
}
