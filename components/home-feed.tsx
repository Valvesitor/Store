import Link from "next/link"
import { ArrowRight, CalendarDays, CheckCircle2 } from "lucide-react"
import { ArticleList } from "@/components/article-list"
import { Button } from "@/components/ui/button"
import type { Article, Update } from "@/lib/blog-store"

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)
}

export function HomeFeed({
  novidades,
  updates,
}: {
  novidades: Article[]
  updates: Update[]
}) {
  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-display text-xs uppercase text-primary">Blog</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase text-foreground sm:text-4xl">
              Últimas novidades
            </h2>
          </div>
          <Button
            variant="outline"
            className="hidden h-10 shrink-0 border-primary/30 bg-card/70 font-display text-xs uppercase text-foreground hover:border-primary/60 sm:inline-flex"
            asChild
          >
            <Link href="/novidades">
              Ver todas
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-8">
          <ArticleList
            articles={novidades.slice(0, 4)}
            basePath="/novidades"
            emptyMessage="Em breve novidades por aqui."
          />
        </div>
      </section>

      <section className="border-t border-border bg-card/30">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-display text-xs uppercase text-primary">Changelog</p>
              <h2 className="mt-2 font-display text-3xl font-bold uppercase text-foreground sm:text-4xl">
                Atualizações recentes
              </h2>
            </div>
            <Button
              variant="outline"
              className="hidden h-10 shrink-0 border-primary/30 bg-card/70 font-display text-xs uppercase text-foreground hover:border-primary/60 sm:inline-flex"
              asChild
            >
              <Link href="/atualizacoes">
                Ver todas
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-4">
            {updates.slice(0, 3).map((update) => (
              <article
                key={update.id}
                className="rounded-lg border border-border bg-card/70 p-5"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 font-display text-xs uppercase text-primary">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDate(update.date)}
                  </span>
                  {update.version && (
                    <span className="rounded border border-primary/25 bg-primary/10 px-2 py-1 font-display text-[0.65rem] uppercase tracking-widest text-primary">
                      {update.version}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    {update.tag}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-xl font-bold uppercase text-foreground">
                  {update.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {update.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
