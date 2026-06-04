import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Layers3, Package, ShieldCheck } from "lucide-react"
import {
  storeCategories,
  type ProductCategory,
} from "@/lib/store-data"
import { getProducts } from "@/lib/product-store"

const categoryImages: Record<ProductCategory, string> = {
  Scripts: "/categories/sistemas.png",
  "Custom Peds": "/products/illegal-activities.png",
  Systems: "/categories/economia.png",
  "Outfit / Creator": "/categories/utilitarios.png",
  "Add-ons": "/categories/combate.png",
  "Free Resources": "/categories/mapas.png",
}

export async function HomeCategories() {
  const products = await getProducts()
  const categories = storeCategories.filter(
    (category): category is ProductCategory => category !== "All",
  )
  const productCount = products.length

  return (
    <section
      id="categorias"
      className="relative overflow-hidden border-y border-border bg-background"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(224,138,44,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(224,138,44,0.035)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <span className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 font-display text-[0.65rem] uppercase tracking-[0.24em] text-primary">
              Catalogo organizado
            </span>
            <h2 className="mt-5 max-w-3xl font-display text-4xl font-bold uppercase leading-none text-primary sm:text-5xl">
              Encontre o recurso certo para o seu servidor
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-foreground/80">
              Navegue por scripts, custom peds, sistemas, creators, add-ons e
              recursos gratuitos sem misturar categorias. Cada filtro leva direto
              aos produtos daquele tipo na loja.
            </p>
          </div>

          <div className="grid gap-3 rounded-lg border border-primary/25 bg-card/70 p-4">
            <div className="flex items-center gap-3 rounded-md border border-border bg-background/55 p-3">
              <Layers3 className="h-5 w-5 text-primary" />
              <div>
                <p className="font-display text-lg font-bold uppercase text-foreground">
                  {categories.length} categorias
                </p>
                <p className="text-xs text-muted-foreground">
                  Separadas para comprar mais rapido
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-md border border-border bg-background/55 p-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <div>
                <p className="font-display text-lg font-bold uppercase text-foreground">
                  {productCount} produtos
                </p>
                <p className="text-xs text-muted-foreground">
                  Com pagina propria e checkout Tebex
                </p>
              </div>
            </div>
            <Link
              href="/loja"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 font-display text-xs uppercase text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Abrir loja completa
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
          {categories.map((category) => {
            const count = products.filter(
              (product) => product.category === category,
            ).length

            return (
              <Link
                key={category}
                href={`/loja?categoria=${encodeURIComponent(category)}`}
                className="group relative min-h-44 overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/50"
              >
                <Image
                  src={categoryImages[category]}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover opacity-45 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/85 to-card/35" />
                <div className="relative flex min-h-44 flex-col justify-end p-4">
                  <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
                    <Package className="h-4 w-4" />
                  </span>
                  <p className="font-display text-[0.65rem] uppercase text-primary">
                    {count} produtos
                  </p>
                  <h3 className="mt-1 font-display text-lg font-bold uppercase leading-tight text-foreground">
                    {category}
                  </h3>
                  <span className="mt-3 inline-flex items-center gap-2 font-display text-xs uppercase text-muted-foreground transition-colors group-hover:text-primary">
                    Ver na loja
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
