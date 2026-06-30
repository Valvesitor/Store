import Link from "next/link"
import { ArrowRight, BookOpen } from "lucide-react"
import { ArticleList } from "@/components/article-list"
import { PageIntro } from "@/components/page-intro"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { getArticles } from "@/lib/blog-store"

export const dynamic = "force-dynamic"

export default async function DocsPage() {
  const docs = await getArticles({ section: "docs" })

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 bg-background">
        <PageIntro
          eyebrow="Docs"
          title="Documentação"
          description="Guias, instruções e materiais de referência do The Wanted Sole Studio."
        />

        <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
          <ArticleList
            articles={docs}
            basePath="/docs"
            emptyMessage="A documentação está sendo preparada."
          />

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-primary/25 bg-card/80 p-5">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 className="mt-4 font-display text-2xl font-bold uppercase text-foreground">
                Precisa de ajuda?
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Não encontrou o que procurava? Fale com a equipe no Discord oficial
                para suporte e dúvidas.
              </p>
              <Button
                className="mt-5 h-11 w-full bg-primary font-display text-xs uppercase text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <Link href="https://discord.gg/qE29trG84u">
                  Entrar no Discord
                  <ArrowRight className="h-4 w-4" />
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
