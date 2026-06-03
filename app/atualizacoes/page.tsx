import Link from "next/link"
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react"
import { DiscordIcon } from "@/components/icons"
import { PageIntro } from "@/components/page-intro"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"

const updates = [
  {
    date: "Jun 2026",
    version: "Store 1.4",
    tag: "Publicado",
    icon: PackageCheck,
    title: "Paginas individuais para produtos",
    description:
      "Cada produto agora pode ter sua propria pagina com galeria, informacoes, requisitos, documentacao e acao de compra.",
    notes: [
      "Pagina dedicada por slug em /produtos",
      "Botao para adicionar ao carrinho Tebex",
      "Layout mais forte para produtos premium",
    ],
    href: "/loja",
  },
  {
    date: "Jun 2026",
    version: "Store 1.3",
    tag: "Publicado",
    icon: Sparkles,
    title: "Inicio reorganizado",
    description:
      "A pagina inicial ficou focada em destaque, com produtos principais primeiro e categorias logo abaixo.",
    notes: [
      "Produtos em destaque na home",
      "Categorias compactas abaixo dos destaques",
      "Menu superior mais limpo",
    ],
    href: "/",
  },
  {
    date: "Jun 2026",
    version: "Store 1.2",
    tag: "Publicado",
    icon: ShieldCheck,
    title: "Login CFX e area admin",
    description:
      "A loja recebeu base para login via CFX e area administrativa protegida para operacao interna.",
    notes: [
      "Login com fluxo CFX",
      "Admin escondido do menu publico",
      "Protecao por chave de acesso",
    ],
    href: "/login",
  },
  {
    date: "Jun 2026",
    version: "Store 1.1",
    tag: "Publicado",
    icon: Wrench,
    title: "Base Tebex preparada",
    description:
      "Foram adicionadas rotas de basket, integracao de carrinho e estrutura para checkout pela Tebex.",
    notes: [
      "Carrinho integrado ao header",
      "Rotas API para basket Tebex",
      "Links legais do Studio e da Tebex",
    ],
    href: "/docs",
  },
]

const roadmap = [
  "Historico por produto com versao e data",
  "Filtro por Scripts, Systems, Peds e Add-ons",
  "Avisos de update conectados ao painel admin",
  "Notas tecnicas com arquivos alterados e dependencias",
]

export default function UpdatesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 bg-[#101014]">
        <PageIntro
          eyebrow="Atualizacoes"
          title="Novidades e melhorias da loja"
          description="Acompanhe o que mudou no site, nos produtos, na integracao Tebex e nos recursos do studio."
        />

        <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
          <div className="space-y-4">
            {updates.map((update) => {
              const Icon = update.icon

              return (
                <article
                  key={`${update.version}-${update.title}`}
                  className="rounded-lg border border-border bg-card/70 p-5"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div className="flex gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="inline-flex items-center gap-2 font-display text-xs uppercase text-primary">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {update.date}
                          </span>
                          <span className="rounded border border-primary/25 bg-primary/10 px-2 py-1 font-display text-[0.65rem] uppercase tracking-widest text-primary">
                            {update.version}
                          </span>
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
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="h-10 shrink-0 border-primary/30 bg-background/70 font-display text-xs uppercase text-foreground hover:border-primary/60"
                      asChild
                    >
                      <Link href={update.href}>
                        Ver
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </article>
              )
            })}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-primary/25 bg-card/80 p-5">
              <Clock className="h-6 w-6 text-primary" />
              <h2 className="mt-4 font-display text-2xl font-bold uppercase text-foreground">
                Proximos ajustes
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
                Novas versoes, correcoes e anuncios importantes tambem podem
                ser acompanhados pelo Discord oficial.
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
