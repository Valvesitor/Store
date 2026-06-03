import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { PageIntro } from "@/components/page-intro"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import {
  categorySlugs,
  slugToCategory,
  type ProductCategory,
} from "@/lib/store-data"
import { getProductsByCategory } from "@/lib/product-store"

export const dynamic = "force-dynamic"

export function generateStaticParams() {
  return Object.values(categorySlugs).map((slug) => ({ slug }))
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = slugToCategory(slug)

  if (!category) {
    notFound()
  }

  const products = await getProductsByCategory(category as ProductCategory)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <PageIntro
          eyebrow="Categoria"
          title={category}
          description="Produtos separados para você encontrar exatamente o recurso que precisa para o seu servidor."
        />

        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Button
            variant="outline"
            className="mb-8 h-11 border-primary/30 bg-card/70 font-display text-xs uppercase text-foreground hover:border-primary/60 hover:bg-card"
            asChild
          >
            <Link href="/categorias">
              <ArrowLeft className="h-4 w-4" />
              Todas as categorias
            </Link>
          </Button>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
