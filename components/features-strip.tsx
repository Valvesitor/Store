import { Headphones, RefreshCw, ShieldCheck, Zap } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "ENTREGA AUTOMÁTICA",
    desc: "Receba seu produto na hora após a compra.",
  },
  {
    icon: ShieldCheck,
    title: "PAGAMENTO SEGURO",
    desc: "Transações protegidas e certificadas.",
  },
  {
    icon: RefreshCw,
    title: "ATUALIZAÇÕES",
    desc: "Produtos sempre atualizados e revisados.",
  },
  {
    icon: Headphones,
    title: "SUPORTE RÁPIDO",
    desc: "Equipe pronta para te atender.",
  },
]

export function FeaturesStrip() {
  return (
    <section id="suporte" className="border-y border-primary/25 bg-[#eadcc5]/55">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-px overflow-hidden px-4 py-2 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <div key={feature.title} className="flex items-center gap-3 px-2 py-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-sm font-semibold tracking-wide text-foreground">
                  {feature.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {feature.desc}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
