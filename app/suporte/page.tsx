import Link from "next/link"
import {
  ArrowRight,
  FileText,
  Headphones,
  RefreshCw,
  ShieldCheck,
} from "lucide-react"
import { DiscordIcon } from "@/components/icons"
import { PageIntro } from "@/components/page-intro"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

const supportCards = [
  {
    icon: DiscordIcon,
    title: "Discord",
    desc: "Suporte direto, avisos de atualização e novidades da comunidade.",
    href: "https://discord.gg/qE29trG84u",
  },
  {
    icon: FileText,
    title: "Documentação",
    desc: "Guias para instalação, configuração e uso dos produtos.",
    href: "/docs",
  },
  {
    icon: RefreshCw,
    title: "Atualizações",
    desc: "Produtos revisados para manter estabilidade e compatibilidade.",
    href: "/atualizacoes",
  },
  {
    icon: ShieldCheck,
    title: "Compra segura",
    desc: "Pedidos protegidos e recursos entregues com acompanhamento.",
    href: "/loja",
  },
]

const faqs = [
  {
    question: "Os produtos são para RedM?",
    answer:
      "Sim. Os scripts, systems, peds e recursos são pensados para servidores RedM.",
  },
  {
    question: "Recebo suporte depois da compra?",
    answer:
      "Sim. O suporte é feito pelo Discord oficial para dúvidas, instalação e atualizações.",
  },
  {
    question: "Posso pedir um projeto customizado?",
    answer:
      "Sim. Projetos personalizados podem ser alinhados diretamente com a equipe pelo Discord.",
  },
  {
    question: "Os scripts recebem atualizações?",
    answer:
      "Sim. Produtos premium podem receber correções, melhorias e ajustes de compatibilidade.",
  },
]

export default function SupportPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <PageIntro
          eyebrow="Suporte"
          title="Ajuda rápida para manter seu servidor rodando"
          description="Encontre canais de atendimento, documentação, respostas frequentes e acesso direto ao Discord oficial."
        />

        <section className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {supportCards.map((card) => {
            const Icon = card.icon
            return (
              <Link
                key={card.title}
                href={card.href}
                className="group rounded-lg border border-border bg-card/70 p-5 transition-colors hover:border-primary/50"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="mt-5 font-display text-xl font-bold uppercase text-foreground">
                  {card.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {card.desc}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 font-display text-sm uppercase text-muted-foreground transition-colors group-hover:text-primary">
                  Acessar
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            )
          })}
        </section>

        <section
          id="faq"
          className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8"
        >
          <div className="border-t border-border pt-12">
            <div className="flex items-center gap-3">
              <Headphones className="h-6 w-6 text-primary" />
              <h2 className="font-display text-3xl font-bold uppercase text-foreground">
                Perguntas frequentes
              </h2>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {faqs.map((faq) => (
                <div key={faq.question} className="rounded-lg border border-border bg-card/60 p-5">
                  <h3 className="font-display text-lg font-semibold uppercase text-foreground">
                    {faq.question}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
