import Image from "next/image"
import { Award, Box, Headphones, ShieldCheck, Sparkles } from "lucide-react"
import { PageIntro } from "@/components/page-intro"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

const pillars = [
  {
    icon: Sparkles,
    title: "Exclusividade total",
    desc: "Nada genérico. Cada produto nasce para servidores que querem se destacar.",
  },
  {
    icon: ShieldCheck,
    title: "Qualidade garantida",
    desc: "Produtos testados, organizados e desenvolvidos com foco em estabilidade.",
  },
  {
    icon: Headphones,
    title: "Suporte real",
    desc: "Atendimento para dúvidas, instalação, atualizações e acompanhamento.",
  },
  {
    icon: Award,
    title: "Identidade premium",
    desc: "Design, sistemas e recursos para dar personalidade única ao servidor.",
  },
]

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <PageIntro
          eyebrow="Sobre nós"
          title="O estúdio por trás de conteúdo premium para RedM"
          description="A The Wanted Sole Studio cria scripts, custom peds, systems e recursos visuais para servidores que precisam de performance, originalidade e identidade própria."
        />

        <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="relative min-h-96 overflow-hidden rounded-lg border border-border lg:col-span-5">
            <Image
              src="/hero-gunslinger.png"
              alt="Cena de velho oeste usada na identidade The Wanted Sole Studio"
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <p className="font-display text-sm uppercase text-primary">
                RedM · Scripts & Custom Peds
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold uppercase text-foreground">
                Feito para servidores com identidade
              </h2>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {pillars.map((pillar) => {
              const Icon = pillar.icon
              return (
                <div
                  key={pillar.title}
                  className="rounded-lg border border-border bg-card/60 p-5 transition-colors hover:border-primary/40"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold uppercase text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {pillar.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        <section className="border-y border-border bg-background">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <div>
              <p className="font-display text-xs uppercase text-primary">
                Official Store
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold uppercase text-foreground">
                Tudo para elevar sua comunidade RedM
              </h2>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
              <Box className="h-8 w-8 text-primary" />
              <p className="max-w-md text-sm leading-relaxed">
                Scripts, sistemas, peds e add-ons pensados para performance,
                estilo e manutenção simples.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
