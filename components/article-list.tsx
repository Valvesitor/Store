import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CalendarDays, FileText } from "lucide-react"
import type { Article } from "@/lib/blog-store"

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)
}

export function ArticleList({
  articles,
  basePath,
  emptyMessage = "Nenhum conteúdo publicado ainda.",
}: {
  articles: Article[]
  basePath: string
  emptyMessage?: string
}) {
  if (articles.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card/50 p-10 text-center">
        <FileText className="mx-auto h-8 w-8 text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {articles.map((article) => (
        <Link
          key={article.id}
          href={`${basePath}/${article.id}`}
          className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card/70 transition-colors hover:border-primary/50"
        >
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-background">
            {article.coverImage ? (
              <Image
                src={article.coverImage}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(191,106,19,0.18),transparent_55%)]">
                <FileText className="h-9 w-9 text-primary/60" />
              </div>
            )}
            <span className="absolute left-3 top-3 rounded border border-primary/30 bg-background/85 px-2 py-1 font-display text-[0.65rem] uppercase tracking-widest text-primary backdrop-blur">
              {article.tag}
            </span>
          </div>

          <div className="flex flex-1 flex-col p-5">
            <span className="inline-flex items-center gap-2 font-display text-xs uppercase text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5 text-primary" />
              {formatDate(article.date)}
            </span>
            <h2 className="mt-3 font-display text-xl font-bold uppercase leading-tight text-foreground">
              {article.title}
            </h2>
            <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-muted-foreground">
              {article.excerpt}
            </p>
            <span className="mt-4 inline-flex items-center gap-2 font-display text-xs uppercase text-muted-foreground transition-colors group-hover:text-primary">
              Ler
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
