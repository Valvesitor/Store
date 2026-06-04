import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Package } from "lucide-react"
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

  return (
    <section id="categorias" className="bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-xs uppercase tracking-[0.28em] text-primary">
              Categorias
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold uppercase text-foreground sm:text-3xl">
              Escolha por tipo de recurso
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              Scripts, custom peds, systems, creators, add-ons e recursos
              gratuitos ficam visiveis ja no inicio. Ao abrir uma categoria, a
              loja mostra somente os produtos daquele tipo.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
          {categories.map((category) => {
            const count = products.filter(
              (product) => product.category === category,
            ).length

            return (
              <Link
                key={category}
                href={`/loja?categoria=${encodeURIComponent(category)}`}
                className="group relative min-h-40 overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/50"
              >
                <Image
                  src={categoryImages[category]}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover opacity-45 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-card/20" />
                <div className="relative flex min-h-40 flex-col justify-end p-4">
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
