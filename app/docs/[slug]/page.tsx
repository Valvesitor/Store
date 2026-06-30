import { notFound } from "next/navigation"
import { ArticleView } from "@/components/article-view"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { getArticleBySlug } from "@/lib/blog-store"

export const dynamic = "force-dynamic"

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article || article.section !== "docs" || !article.published) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 bg-background">
        <ArticleView article={article} backHref="/docs" backLabel="Voltar para Docs" />
      </main>
      <SiteFooter />
    </div>
  )
}
