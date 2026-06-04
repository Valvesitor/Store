import Link from "next/link"
import { ArrowRight, BookOpen, ExternalLink, FileText, Package } from "lucide-react"
import { PageIntro } from "@/components/page-intro"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { productToSlug, storeProducts } from "@/lib/store-data"

const externalDocsUrl = "https://docs.thewantedsolestudio.workers.dev"

export default function DocsPage() {
  const productsWithDocs = storeProducts.filter(
    (product) => product.docsUrl || product.packageId,
  )

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 bg-background">
        <PageIntro
          eyebrow="Docs"
          title="Documentacao The Wanted Sole Studio"
          description="Guias de instalacao, requisitos, configuracao e links uteis dos produtos oficiais."
        />

        <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
          <div className="grid gap-4">
            {productsWithDocs.map((product) => (
              <article
                key={product.id}
                className="rounded-lg border border-border bg-card/70 p-5"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
                      <Package className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-display text-xs uppercase text-primary">
                        {product.category}
                      </p>
                      <h2 className="mt-1 font-display text-2xl font-bold uppercase text-foreground">
                        {product.title}
                      </h2>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                        {product.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-3">
                    <Button
                      variant="outline"
                      className="h-10 border-primary/30 bg-background/70 font-display text-xs uppercase text-foreground hover:border-primary/60"
                      asChild
                    >
                      <Link href={`/produtos/${productToSlug(product)}`}>
                        Produto
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      className="h-10 bg-primary font-display text-xs uppercase text-primary-foreground hover:bg-primary/90"
                      asChild
                    >
                      <Link href={product.docsUrl || externalDocsUrl}>
                        Abrir docs
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-primary/25 bg-card/80 p-5">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 className="mt-4 font-display text-2xl font-bold uppercase text-foreground">
                Docs externa
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Este hub pode ficar em `thewantedsolestudio.com/docs`, mas a
                documentacao tecnica tambem pode continuar no Workers separado.
              </p>
              <Button
                className="mt-5 h-11 w-full bg-primary font-display text-xs uppercase text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <Link href={externalDocsUrl}>
                  Abrir documentacao
                  <FileText className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </aside>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
