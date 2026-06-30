import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CalendarDays } from "lucide-react"
import { ArticleBody } from "@/components/article-body"
import { Button } from "@/components/ui/button"
import type { Article } from "@/lib/blog-store"

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date)
}

export function ArticleView({
  article,
  backHref,
  backLabel,
}: {
  article: Article
  backHref: string
  backLabel: string
}) {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Button
        variant="outline"
        className="mb-8 h-10 border-primary/30 bg-card/70 font-display text-xs uppercase text-foreground hover:border-primary/60"
        asChild
      >
        <Link href={backHref}>
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
      </Button>

      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded border border-primary/30 bg-primary/10 px-2 py-1 font-display text-[0.65rem] uppercase tracking-widest text-primary">
          {article.tag}
        </span>
        <span className="inline-flex items-center gap-2 font-display text-xs uppercase text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5 text-primary" />
          {formatDate(article.date)}
        </span>
      </div>

      <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-tight text-foreground sm:text-5xl">
        {article.title}
      </h1>

      {article.excerpt && (
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          {article.excerpt}
        </p>
      )}

      {article.coverImage && (
        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-lg border border-border bg-background">
          <Image
            src={article.coverImage}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="mt-8 border-t border-border pt-8">
        <ArticleBody body={article.body} />
      </div>
    </article>
  )
}
