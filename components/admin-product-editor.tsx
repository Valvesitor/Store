"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ExternalLink, ImageIcon, Save, Star, Trash2, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  productToSlug,
  storeCategories,
  type ProductCategory,
  type StoreProduct,
} from "@/lib/store-data"
import type { ProductPersistence } from "@/lib/product-store"

export type ProductFormState = {
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
  videoUrl: string
  fullDescription: string
  features: string
  requirements: string
  gallery: string
  featured: boolean
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
    videoUrl: product.videoUrl ?? "",
    fullDescription: product.fullDescription ?? "",
    features: (product.features ?? []).join("\n"),
    requirements: (product.requirements ?? []).join("\n"),
    gallery: (product.gallery ?? []).join("\n"),
    featured: Boolean(product.featured),
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
    videoUrl: "",
    fullDescription: "",
    features: "Instalação guiada\nSuporte via Discord",
    requirements: "Servidor RedM atualizado",
    gallery: "",
    featured: false,
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
    videoUrl: form.videoUrl || undefined,
    fullDescription: form.fullDescription || undefined,
    features: toList(form.features),
    requirements: toList(form.requirements),
    gallery: toList(form.gallery),
  }
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="font-display text-[0.65rem] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  )
}

function isDirectVideo(url: string) {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url)
}

export function AdminProductEditor({
  product,
  persistence,
  mode,
}: {
  product?: StoreProduct | null
  persistence: ProductPersistence
  mode: "create" | "edit"
}) {
  const router = useRouter()
  const [form, setForm] = useState<ProductFormState>(
    product ? productToForm(product) : blankProduct(),
  )
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  const galleryItems = useMemo(() => {
    return form.gallery
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean)
  }, [form.gallery])

  function update<K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function removeGalleryItem(index: number) {
    const nextGallery = galleryItems.filter((_, itemIndex) => itemIndex !== index)
    update("gallery", nextGallery.join("\n"))
  }

  function removeMainImage() {
    update("image", "")
  }

  async function saveProduct() {
    setSaving(true)
    setMessage("")

    try {
      const method = mode === "create" ? "POST" : "PUT"
      const url =
        mode === "create"
          ? "/api/admin/products"
          : `/api/admin/products/${encodeURIComponent(form.id)}`
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formToProduct(form)),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || "Erro ao salvar produto.")
      }

      setMessage("Produto salvo com sucesso.")
      router.refresh()
      window.setTimeout(() => router.push("/admin#produtos-admin"), 600)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro inesperado ao salvar.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="outline"
          className="h-10 border-primary/30 bg-card/70 font-display text-xs uppercase text-foreground hover:border-primary/60"
          asChild
        >
          <Link href="/admin#produtos-admin">
            <ArrowLeft className="h-4 w-4" />
            Voltar para produtos
          </Link>
        </Button>

        <div className="flex flex-wrap gap-2">
          {mode === "edit" && product && (
            <Button
              variant="outline"
              className="h-10 border-border bg-card/70 font-display text-xs uppercase text-foreground hover:border-primary/60"
              asChild
            >
              <Link href={`/produtos/${productToSlug(product)}`}>
                <ExternalLink className="h-4 w-4" />
                Ver página
              </Link>
            </Button>
          )}
          <Button
            type="button"
            className="h-10 bg-primary px-5 font-display text-xs uppercase text-primary-foreground hover:bg-primary/90"
            onClick={saveProduct}
            disabled={saving || !persistence.canWrite}
          >
            <Save className="h-4 w-4" />
            {saving ? "Salvando..." : "Salvar produto"}
          </Button>
        </div>
      </div>

      {message && (
        <div className="mb-5 rounded-md border border-primary/25 bg-primary/10 px-4 py-3 text-sm text-primary">
          {message}
        </div>
      )}

      {!persistence.canWrite && (
        <div className="mb-5 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          PRODUCT_MEDIA não está disponível. Confira o binding R2 no Cloudflare antes de salvar.
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="grid gap-6">
          <div className="rounded-lg border border-border bg-card/70 p-5">
            <p className="font-display text-xs uppercase text-primary">Dados principais</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field label="ID / slug">
                <Input
                  value={form.id}
                  onChange={(event) => update("id", event.target.value)}
                  disabled={mode === "edit"}
                  className="bg-background/80"
                />
              </Field>
              <Field label="Categoria">
                <select
                  value={form.category}
                  onChange={(event) => update("category", event.target.value as ProductCategory)}
                  className="h-10 rounded-md border border-border bg-background/80 px-3 text-sm text-foreground outline-none"
                >
                  {productCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Título">
                <Input
                  value={form.title}
                  onChange={(event) => update("title", event.target.value)}
                  className="bg-background/80"
                />
              </Field>
              <Field label="Preço">
                <Input
                  value={form.price}
                  onChange={(event) => update("price", event.target.value)}
                  disabled={Boolean(form.packageId)}
                  className="bg-background/80"
                  placeholder="R$ 0,00 ou Grátis"
                />
              </Field>
              {form.packageId && (
                <span className="-mt-2 text-xs leading-5 text-muted-foreground">
                  O preco exibido na loja vem da Tebex pelo Package ID. Este
                  valor fica apenas como fallback.
                </span>
              )}
              <div className="md:col-span-2">
                <Field label="Descrição curta">
                  <Input
                    value={form.subtitle}
                    onChange={(event) => update("subtitle", event.target.value)}
                    className="bg-background/80"
                  />
                </Field>
              </div>
              <Field label="Avaliação">
                <Input
                  value={form.rating}
                  onChange={(event) => update("rating", event.target.value)}
                  className="bg-background/80"
                  type="number"
                  min="0"
                  max="5"
                />
              </Field>
              <Field label="Número de avaliações">
                <Input
                  value={form.reviews}
                  onChange={(event) => update("reviews", event.target.value)}
                  className="bg-background/80"
                  type="number"
                  min="0"
                />
              </Field>
              <Field label="Badge / selo">
                <Input
                  value={form.badge}
                  onChange={(event) => update("badge", event.target.value)}
                  className="bg-background/80"
                  placeholder="Popular, Tebex, Free..."
                />
              </Field>
              <div className="rounded-md border border-border bg-background/55 p-4 md:col-span-2">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 font-display text-xs uppercase tracking-wide text-foreground">
                      <Star className="h-4 w-4 text-primary" />
                      Produto em destaque na tela inicial
                    </div>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      Produtos marcados aqui aparecem no bloco de destaques da home; o primeiro tambem vira o produto recomendado do topo.
                    </p>
                  </div>
                  <Switch
                    checked={form.featured}
                    onCheckedChange={(checked) => update("featured", checked)}
                    aria-label="Marcar produto como destaque na tela inicial"
                  />
                </div>
              </div>
              <Field label="Modo da imagem">
                <select
                  value={form.imageMode}
                  onChange={(event) => update("imageMode", event.target.value as "cover" | "contain")}
                  className="h-10 rounded-md border border-border bg-background/80 px-3 text-sm text-foreground outline-none"
                >
                  <option value="cover">Cover / preencher</option>
                  <option value="contain">Contain / logo inteira</option>
                </select>
              </Field>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card/70 p-5">
            <p className="font-display text-xs uppercase text-primary">Mídia do produto</p>
            <div className="mt-5 grid gap-4">
              <div className="grid gap-2">
                <span className="font-display text-[0.65rem] uppercase tracking-wide text-muted-foreground">
                  Imagem principal
                </span>
                <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                  <Input
                    value={form.image}
                    onChange={(event) => update("image", event.target.value)}
                    className="bg-background/80"
                    placeholder="/products/produto.png ou https://..."
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 border-red-500/30 bg-background/70 px-3 font-display text-xs uppercase text-red-300 hover:border-red-500/60 hover:text-red-200"
                    onClick={removeMainImage}
                    disabled={!form.image}
                  >
                    <Trash2 className="h-4 w-4" />
                    Remover
                  </Button>
                </div>
              </div>
              <Field label="Vídeo do produto">
                <Input
                  value={form.videoUrl}
                  onChange={(event) => update("videoUrl", event.target.value)}
                  className="bg-background/80"
                  placeholder="https://.../preview.mp4 ou link YouTube"
                />
              </Field>
              <Field label="Galeria / slides — uma imagem por linha">
                <Textarea
                  value={form.gallery}
                  onChange={(event) => update("gallery", event.target.value)}
                  className="min-h-36 bg-background/80"
                  placeholder="/products/produto-1.png\n/products/produto-2.png"
                />
              </Field>
              {galleryItems.length > 0 && (
                <div className="grid gap-2">
                  {galleryItems.map((item, index) => (
                    <div
                      key={`${item}-${index}`}
                      className="grid gap-2 rounded-md border border-border bg-background/55 p-3 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <ImageIcon className="h-4 w-4" />
                      </span>
                      <p className="min-w-0 break-all text-xs leading-5 text-muted-foreground">
                        {item}
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-9 border-red-500/30 bg-background/70 px-3 font-display text-xs uppercase text-red-300 hover:border-red-500/60 hover:text-red-200"
                        onClick={() => removeGalleryItem(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Remover
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs leading-5 text-muted-foreground">
                Na página do produto, a imagem principal, as imagens da galeria e o vídeo aparecem em um slide com botões de anterior/próximo.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card/70 p-5">
            <p className="font-display text-xs uppercase text-primary">Tebex e documentação</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field label="Package ID Tebex">
                <Input
                  value={form.packageId}
                  onChange={(event) => update("packageId", event.target.value)}
                  className="bg-background/80"
                />
              </Field>
              <Field label="URL Tebex fallback">
                <Input
                  value={form.tebexUrl}
                  onChange={(event) => update("tebexUrl", event.target.value)}
                  className="bg-background/80"
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="URL da documentação">
                  <Input
                    value={form.docsUrl}
                    onChange={(event) => update("docsUrl", event.target.value)}
                    className="bg-background/80"
                    placeholder="/docs"
                  />
                </Field>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card/70 p-5">
            <p className="font-display text-xs uppercase text-primary">Conteúdo da página</p>
            <div className="mt-5 grid gap-4">
              <Field label="Descrição completa">
                <Textarea
                  value={form.fullDescription}
                  onChange={(event) => update("fullDescription", event.target.value)}
                  className="min-h-32 bg-background/80"
                />
              </Field>
              <Field label="Funcionalidades — uma por linha">
                <Textarea
                  value={form.features}
                  onChange={(event) => update("features", event.target.value)}
                  className="min-h-36 bg-background/80"
                />
              </Field>
              <Field label="Requisitos — um por linha">
                <Textarea
                  value={form.requirements}
                  onChange={(event) => update("requirements", event.target.value)}
                  className="min-h-32 bg-background/80"
                />
              </Field>
            </div>
          </div>
        </div>

        <aside className="xl:sticky xl:top-24 xl:self-start">
          <div className="rounded-lg border border-primary/25 bg-card/85 p-5 shadow-2xl shadow-black/30">
            <p className="font-display text-xs uppercase text-primary">Preview rápido</p>
            <h2 className="mt-2 font-display text-2xl font-bold uppercase text-foreground">
              {form.title || "Produto"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {form.subtitle || "Descrição curta do produto"}
            </p>

            <div className="mt-5 overflow-hidden rounded-md border border-border bg-background">
              <div className="relative aspect-[16/9]">
                {form.image ? (
                  <Image
                    src={form.image}
                    alt="Preview"
                    fill
                    sizes="420px"
                    className={form.imageMode === "contain" ? "object-contain p-6" : "object-cover"}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-8 w-8" />
                  </div>
                )}
              </div>
            </div>

            {form.videoUrl && (
              <div className="mt-4 rounded-md border border-border bg-background p-3">
                <div className="flex items-center gap-2 font-display text-xs uppercase text-primary">
                  <Video className="h-4 w-4" />
                  Vídeo configurado
                </div>
                <p className="mt-2 break-all text-xs leading-5 text-muted-foreground">
                  {form.videoUrl}
                </p>
                {isDirectVideo(form.videoUrl) && (
                  <video className="mt-3 w-full rounded border border-border" src={form.videoUrl} controls />
                )}
              </div>
            )}

            <div className="mt-4 grid gap-2 text-xs text-muted-foreground">
              <p>Galeria: {galleryItems.length} imagem(ns)</p>
              <p>Destaque na home: {form.featured ? "sim" : "nao"}</p>
              <p>Package ID: {form.packageId || "pendente"}</p>
              <p>Categoria: {form.category}</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
