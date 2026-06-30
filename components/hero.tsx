import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BookOpen, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

const highlights = [
  { label: "Novidades", value: "Sempre" },
  { label: "Documentação", value: "Completa" },
  { label: "Suporte", value: "Discord" },
]

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden border-b border-border bg-background">
      <div className="absolute inset-0">
        <Image
          src="/tws-mountains-banner.png"
          alt="Paisagem de montanhas no estilo The Wanted Sole Studio"
          fill
          priority
          className="object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(239,228,208,0.98)_0%,rgba(239,228,208,0.88)_46%,rgba(239,228,208,0.62)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_84%_26%,rgba(191,106,19,0.13),transparent_28%),radial-gradient(circle_at_10%_18%,rgba(36,31,24,0.10),transparent_30%)]" />
      </div>

      <div className="absolute -left-16 top-0 h-32 w-72 rotate-[-16deg] rounded-full border-y-[10px] border-primary/70 bg-[#231f1a]" />
      <div className="absolute -right-16 bottom-0 h-32 w-72 rotate-[-16deg] rounded-full border-y-[10px] border-primary/70 bg-[#231f1a]" />

      <div className="relative mx-auto flex min-h-[680px] w-full max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/35 bg-card/70 px-4 py-1.5 text-primary shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4" />
            <span className="font-display text-xs uppercase tracking-widest">
              Novidades · Docs · Atualizações
            </span>
          </div>

          <h1 className="mt-7 max-w-4xl font-hero text-5xl font-semibold leading-[0.96] tracking-wide text-foreground sm:text-7xl lg:text-[5.7rem] xl:text-[6.2rem]">
            <span className="block">The Wanted Sole</span>
            <span className="block text-primary">Studio</span>
          </h1>

          <div className="mt-5 h-px w-full max-w-xl bg-gradient-to-r from-transparent via-primary/70 to-transparent" />

          <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
            O espaço oficial do estúdio: novidades em primeira mão,
            documentação para tirar dúvidas e o histórico de tudo o que muda
            a cada versão.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 rounded-full bg-primary px-7 font-display text-sm uppercase text-primary-foreground shadow-md hover:bg-primary/90"
              asChild
            >
              <Link href="/novidades">
                Ver novidades
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-primary/35 bg-card/80 px-7 font-display text-sm uppercase text-foreground shadow-sm hover:border-primary/60 hover:bg-card"
              asChild
            >
              <Link href="/docs">
                <BookOpen className="h-5 w-5" />
                Documentação
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
            {highlights.map((item) => (
              <div key={item.label} className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur">
                <p className="font-display text-lg font-semibold uppercase text-foreground">
                  {item.value}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
