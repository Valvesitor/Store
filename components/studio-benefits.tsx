import { ChevronDown, Crown, MessageCircle, ShieldCheck, Star } from "lucide-react"

const benefits = [
  {
    icon: Crown,
    title: "Exclusividade Total",
    description:
      "Nenhum produto generico. Cada script ou ped e pensado para servidores que querem se destacar da concorrencia.",
  },
  {
    icon: ShieldCheck,
    title: "Qualidade Garantida",
    description:
      "Produtos testados, organizados e desenvolvidos com foco em estabilidade, performance e seguranca.",
  },
  {
    icon: MessageCircle,
    title: "Suporte de Verdade",
    description:
      "Suporte via Discord para duvidas, instalacao, atualizacoes e acompanhamento continuo.",
  },
  {
    icon: Star,
    title: "Identidade Premium",
    description:
      "Design, sistemas e recursos feitos para dar personalidade unica e diferenciada ao seu servidor RedM.",
  },
]

export function StudioBenefits() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-[#101014]">
      <div className="absolute inset-0 tech-grid opacity-35" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <span className="font-display text-[0.65rem] uppercase tracking-[0.28em] text-primary">
            Explorar
          </span>
          <ChevronDown className="mt-2 h-4 w-4 text-primary" />

          <span className="mt-10 rounded-full border border-primary/30 bg-background/55 px-4 py-1 font-display text-[0.65rem] uppercase tracking-[0.25em] text-primary backdrop-blur">
            Por que nos escolher
          </span>
          <h2 className="mt-4 max-w-3xl text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            O Studio por tras do melhor
            <span className="block text-primary">conteudo para RedM</span>
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon
            return (
              <article
                key={benefit.title}
                className="group min-h-44 rounded-lg border border-border bg-card/70 p-5 transition-colors hover:border-primary/50"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary transition-colors group-hover:border-primary/60 group-hover:bg-primary/15">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-sm font-semibold text-foreground">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {benefit.description}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
