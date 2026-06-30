import { ArticleList } from "@/components/article-list"
import { PageIntro } from "@/components/page-intro"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { getArticles } from "@/lib/blog-store"

export const dynamic = "force-dynamic"

export default async function NovidadesPage() {
  const novidades = await getArticles({ section: "novidades" })

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 bg-background">
        <PageIntro
          eyebrow="Novidades"
          title="Novidades do The Wanted Sole Studio"
          description="Anúncios, lançamentos e bastidores do estúdio. Acompanhe o que está acontecendo."
        />
        <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <ArticleList
            articles={novidades}
            basePath="/novidades"
            emptyMessage="Em breve novidades por aqui."
          />
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
