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
    <section className="border-b border-[#ded8cc] bg-[#f3f0ea] text-[#20242b]">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <span className="font-display text-[0.65rem] uppercase tracking-[0.28em] text-[#c29a5d]">
            Explorar
          </span>
          <ChevronDown className="mt-2 h-4 w-4 text-[#c29a5d]" />

          <span className="mt-10 rounded-full border border-[#ddc99f] px-4 py-1 font-display text-[0.65rem] uppercase tracking-[0.25em] text-[#b2874a]">
            Por que nos escolher
          </span>
          <h2 className="mt-4 max-w-3xl text-3xl font-bold leading-tight text-[#20242b] sm:text-4xl">
            O Studio por tras do melhor
            <span className="block text-[#8d6b3e]">conteudo para RedM</span>
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon
            return (
              <article
                key={benefit.title}
                className="min-h-44 border border-[#ded8cc] bg-[#fbfaf7] p-5"
              >
                <span className="flex h-10 w-10 items-center justify-center border border-[#ddc99f] bg-[#f6efe4] text-[#b2874a]">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-sm font-semibold text-[#101316]">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#5f5b53]">
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
