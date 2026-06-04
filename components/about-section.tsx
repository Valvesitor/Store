import { Award, Box, Headphones, Lock, Star } from "lucide-react"

const benefits = [
  {
    icon: Box,
    title: "PRODUTOS EXCLUSIVOS",
    desc: "Plugins, scripts e sistemas únicos para elevar seu servidor.",
  },
  {
    icon: Lock,
    title: "COMPRA SEGURA",
    desc: "Ambiente 100% seguro e pagamentos protegidos.",
  },
  {
    icon: Star,
    title: "QUALIDADE E PERFORMANCE",
    desc: "Desenvolvido com excelência para máximo desempenho.",
  },
  {
    icon: Headphones,
    title: "SUPORTE DEDICADO",
    desc: "Atendimento especializado para ajudar você sempre.",
  },
  {
    icon: Award,
    title: "FEITO PARA REDM",
    desc: "Soluções otimizadas e pensadas para a comunidade RedM.",
  },
]

export function AboutSection() {
  return (
    <section id="sobre" className="relative overflow-hidden border-y border-border bg-background">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-5">
          <p className="font-display text-sm tracking-[0.3em] text-primary">
            OFFICIAL STORE
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-balance sm:text-5xl">
            Tudo que você precisa,
            <br />
            <span className="text-primary">em um só lugar.</span>
          </h2>
          <p className="mt-6 max-w-md text-pretty leading-relaxed text-muted-foreground">
            A The Wanted Sole Studio cria sistemas premium para servidores RedM,
            unindo qualidade, performance e suporte dedicado para elevar a sua
            comunidade.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          {benefits.map((benefit) => {
            const Icon = benefit.icon
            return (
              <div
                key={benefit.title}
                className="flex gap-4 rounded-lg border border-border bg-card/60 p-5 transition-colors hover:border-primary/40"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-sm font-semibold tracking-wide text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
