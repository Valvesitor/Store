import Link from "next/link"
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { DiscordIcon } from "@/components/icons"
import { PageIntro } from "@/components/page-intro"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { getUpdates } from "@/lib/blog-store"

export const dynamic = "force-dynamic"

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)
}

const roadmap = [
  "Mais guias na documentação",
  "Novidades com imagens de capa",
  "Histórico de versões detalhado",
  "Avisos de novos posts no Discord",
]

export default async function UpdatesPage() {
  const updates = await getUpdates()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 bg-background">
        <PageIntro
          eyebrow="Atualizações"
          title="O que mudou no site"
          description="Acompanhe o changelog do The Wanted Sole Studio: novas versões, melhorias e correções."
        />

        <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
          <div className="space-y-4">
            {updates.length === 0 && (
              <p className="rounded-lg border border-dashed border-border bg-card/50 p-10 text-center text-sm text-muted-foreground">
                Nenhuma atualização publicada ainda.
              </p>
            )}
            {updates.map((update) => (
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
                <h2 className="mt-3 font-display text-2xl font-bold uppercase text-foreground">
                  {update.title}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  {update.description}
                </p>
                {update.notes.length > 0 && (
                  <ul className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
                    {update.notes.map((note) => (
                      <li
                        key={note}
                        className="rounded-md border border-border bg-background/50 px-3 py-2"
                      >
                        {note}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-primary/25 bg-card/80 p-5">
              <Clock className="h-6 w-6 text-primary" />
              <h2 className="mt-4 font-display text-2xl font-bold uppercase text-foreground">
                Próximos ajustes
              </h2>
              <div className="mt-4 space-y-3">
                {roadmap.map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 rounded-md border border-border bg-background/50 p-3 text-sm text-muted-foreground"
                  >
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card/70 p-5">
              <DiscordIcon className="h-6 w-6 text-primary" />
              <h2 className="mt-4 font-display text-2xl font-bold uppercase text-foreground">
                Receber avisos
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Novas versões, correções e anúncios importantes também são
                divulgados no Discord oficial.
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
