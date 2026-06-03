import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { featuredProducts } from "@/lib/store-data"

export function FeaturedProducts() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-xs uppercase text-primary">
            Produtos em destaque
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase text-foreground sm:text-4xl">
            Escolhidos para começar
          </h2>
        </div>
        <Button
          variant="outline"
          className="h-11 w-fit border-primary/30 bg-card/70 px-5 font-display text-xs uppercase text-foreground hover:border-primary/60 hover:bg-card"
          asChild
        >
          <Link href="/loja">
            Ver loja completa
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
