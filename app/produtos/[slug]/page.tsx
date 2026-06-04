import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  BookOpen,
  Boxes,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileText,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Star,
  Wrench,
} from "lucide-react"
import { ProductAddToCartButton } from "@/components/product-add-to-cart-button"
import { ProductBuyButton } from "@/components/product-buy-button"
import { ProductMediaCarousel } from "@/components/product-media-carousel"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import {
  categoryToSlug,
  productToSlug,
  storeProducts,
} from "@/lib/store-data"
import { getProductBySlug, getProducts } from "@/lib/product-store"

export const dynamic = "force-dynamic"

export function generateStaticParams() {
  return storeProducts.map((product) => ({ slug: productToSlug(product) }))
}

function Stars({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-0.5" aria-label={`${rating} de 5 estrelas`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={
              i < rating
                ? "h-4 w-4 fill-primary text-primary"
                : "h-4 w-4 text-muted-foreground/40"
            }
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        {reviews} avaliacoes
      </span>
    </div>
  )
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const imageItems = Array.from(new Set([product.image, ...(product.gallery ?? [])]))
    .filter(Boolean)
    .map((src) => ({ type: "image" as const, src }))
  const mediaItems = product.videoUrl
    ? [...imageItems, { type: "video" as const, src: product.videoUrl }]
    : imageItems
  const imageMode = product.imageMode ?? "cover"
  const features =
    product.features ??
    [
      "Instalacao guiada e estrutura pronta para producao",
      "Configuracao organizada para adaptar ao seu servidor",
      "Codigo e fluxo pensados para performance em RedM",
      "Suporte pelo Discord para orientar a implantacao",
    ]
  const requirements =
    product.requirements ??
    [
      "Servidor RedM atualizado",
      "Permissao para instalar resources",
      "Framework e dependencias compativeis",
    ]
  const related = (await getProducts())
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 3)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border bg-background">
          <div className="absolute inset-x-0 top-0 h-px bg-primary/60" />
          <div className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid gap-6 pb-5 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
              <div className="grid min-h-[150px] gap-5 sm:grid-cols-[150px_minmax(0,1fr)] sm:items-end">
                <div className="relative hidden h-40 overflow-hidden rounded-lg border border-border sm:block">
                  <Image
                    src="/hero-gunslinger.png"
                    alt="RedM"
                    fill
                    sizes="150px"
                    className="object-cover opacity-90"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-transparent" />
                </div>

                <div className="pb-3">
                  <p className="font-display text-xs uppercase tracking-[0.28em] text-primary">
                    The Wanted Sole Studio
                  </p>
                  <div className="mt-3 font-display text-5xl font-bold uppercase leading-none text-primary sm:text-6xl">
                    RedM
                  </div>
                  <p className="mt-1 font-display text-lg font-semibold uppercase italic text-foreground">
                    Produto oficial para servidores
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card/70 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-primary/15">
                    <CheckCircle2 className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <p className="font-display text-lg font-bold uppercase text-foreground">
                      Bom saber
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Produto com pagina propria, carrinho Tebex e checkout via
                      login CFX quando a Tebex exigir autenticacao.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="h-10 border-primary/30 bg-card/70 font-display text-xs uppercase text-foreground hover:border-primary/60 hover:bg-card"
              asChild
            >
              <Link href="/loja">
                <ArrowLeft className="h-4 w-4" />
                Voltar para loja
              </Link>
            </Button>

            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_430px]">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/categorias/${categoryToSlug(product.category)}`}
                    className="rounded border border-primary/30 bg-primary/10 px-3 py-1.5 font-display text-xs uppercase text-primary transition-colors hover:border-primary/60"
                  >
                    {product.category}
                  </Link>
                  <span className="rounded border border-border bg-card/70 px-3 py-1.5 font-display text-xs uppercase text-muted-foreground">
                    Entrega automatica
                  </span>
                  <span className="rounded border border-border bg-card/70 px-3 py-1.5 font-display text-xs uppercase text-muted-foreground">
                    Tebex seguro
                  </span>
                </div>

                <h1 className="mt-5 max-w-4xl font-display text-4xl font-bold uppercase leading-tight text-foreground sm:text-5xl lg:text-6xl">
                  {product.title}
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
                  {product.fullDescription ?? product.subtitle}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-5">
                  <Stars rating={product.rating} reviews={product.reviews} />
                  {product.packageId && (
                    <span className="font-display text-xs uppercase text-muted-foreground">
                      Package #{product.packageId}
                    </span>
                  )}
                </div>

                <ProductMediaCarousel
                  title={product.title}
                  price={product.price}
                  badge={product.badge}
                  imageMode={imageMode}
                  media={mediaItems}
                />
              </div>

              <aside className="lg:sticky lg:top-24 lg:self-start">
                <div className="rounded-lg border border-primary/30 bg-card/90 p-5 shadow-2xl shadow-black/30">
                  <div className="flex items-center justify-between gap-4 border-b border-border pb-5">
                    <div>
                      <p className="font-display text-xs uppercase text-primary">
                        Compra segura
                      </p>
                      <h2 className="mt-1 font-display text-2xl font-bold uppercase text-foreground">
                        {product.price}
                      </h2>
                    </div>
                    <ShieldCheck className="h-8 w-8 text-primary" />
                  </div>

                  <div className="mt-5 grid gap-3">
                    {[
                      {
                        icon: PackageCheck,
                        label: "Entrega",
                        value: "Automatica apos pagamento",
                      },
                      {
                        icon: Boxes,
                        label: "Categoria",
                        value: product.category,
                      },
                      {
                        icon: Clock3,
                        label: "Atualizacoes",
                        value: "Incluidas no produto",
                      },
                      {
                        icon: Wrench,
                        label: "Suporte",
                        value: "Discord oficial",
                      },
                    ].map((item) => {
                      const Icon = item.icon
                      return (
                        <div
                          key={item.label}
                          className="flex items-start gap-3 rounded-md border border-border bg-background/45 p-3"
                        >
                          <Icon className="mt-0.5 h-4 w-4 text-primary" />
                          <div>
                            <p className="font-display text-xs uppercase text-muted-foreground">
                              {item.label}
                            </p>
                            <p className="mt-1 text-sm text-foreground">
                              {item.value}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="mt-5 grid gap-3">
                    <ProductAddToCartButton
                      product={product}
                      className="w-full"
                    />
                    <ProductBuyButton
                      product={product}
                      label={product.packageId ? "Comprar agora" : "Abrir Tebex"}
                      className="w-full"
                    />
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {product.docsUrl && (
                      <Button
                        variant="outline"
                        className="h-10 border-border bg-background/70 font-display text-xs uppercase text-foreground hover:border-primary/60"
                        asChild
                      >
                        <Link href={product.docsUrl}>
                          <BookOpen className="h-4 w-4" />
                          Docs
                        </Link>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="h-10 border-border bg-background/70 font-display text-xs uppercase text-foreground hover:border-primary/60"
                      asChild
                    >
                      <Link href={`/categorias/${categoryToSlug(product.category)}`}>
                        <ExternalLink className="h-4 w-4" />
                        Categoria
                      </Link>
                    </Button>
                  </div>

                  <p className="mt-5 rounded-md border border-primary/20 bg-primary/10 p-3 text-sm leading-6 text-muted-foreground">
                    O carrinho e o checkout usam Tebex. Ao adicionar, o produto
                    fica vinculado ao seu basket; se a Tebex pedir login CFX, voce
                    volta para esta mesma pagina com o item no carrinho.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
          <div className="grid gap-8">
            <div>
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="font-display text-3xl font-bold uppercase text-foreground">
                  O que vem incluso
                </h2>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {features.map((feature) => (
                  <div
                    key={feature}
                    className="flex min-h-20 items-start gap-3 rounded-md border border-border bg-card/60 p-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <p className="text-sm leading-6 text-muted-foreground">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card/55 p-5">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="font-display text-2xl font-bold uppercase text-foreground">
                  Descricao e licenca
                </h2>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {product.subtitle}. A compra libera o produto digital para uso no
                servidor informado durante o fluxo da Tebex. A distribuicao,
                revenda ou compartilhamento fora da licenca do comprador nao faz
                parte da permissao de uso.
              </p>
            </div>
          </div>

          <aside className="rounded-lg border border-border bg-card/55 p-5">
            <h2 className="font-display text-2xl font-bold uppercase text-foreground">
              Requisitos
            </h2>
            <div className="mt-5 grid gap-3">
              {requirements.map((requirement) => (
                <div key={requirement} className="flex gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{requirement}</span>
                </div>
              ))}
            </div>
          </aside>
        </section>

        {related.length > 0 && (
          <section className="border-t border-border">
            <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
              <h2 className="font-display text-2xl font-bold uppercase text-foreground">
                Mais em {product.category}
              </h2>
              <div className="mt-5 flex flex-wrap gap-3">
                {related.map((item) => (
                  <Link
                    key={item.id}
                    href={`/produtos/${productToSlug(item)}`}
                    className="rounded-md border border-border bg-card/70 px-4 py-3 font-display text-sm uppercase text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
