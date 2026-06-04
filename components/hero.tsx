import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { DiscordIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"

const highlights = [
  { label: "Scripts", value: "Premium" },
  { label: "Custom Peds", value: "Exclusivos" },
  { label: "Suporte", value: "Discord" },
]

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0">
        <Image
          src="/store-background.png"
          alt="Pistoleiro em uma cidade do velho oeste ao por do sol"
          fill
          priority
          className="object-cover object-[62%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/82 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-background/75" />
        <div className="absolute inset-0 bg-background/10" />
      </div>

      <div className="relative mx-auto flex min-h-[700px] w-full max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/35 bg-background/55 px-4 py-1.5 text-primary backdrop-blur">
            <Sparkles className="h-4 w-4" />
            <span className="font-display text-xs uppercase tracking-widest">
              Scripts & Custom Peds para RedM
            </span>
          </div>

          <h1 className="mt-6 max-w-3xl font-hero text-5xl font-bold uppercase leading-[0.92] tracking-wide text-foreground sm:text-7xl lg:text-[5.8rem] xl:text-[6.4rem]">
            <span className="block">The Wanted</span>
            <span className="block bg-gradient-to-r from-primary via-[#f1c27a] to-primary bg-clip-text text-transparent">
              Sole Studio
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
            Conteudo premium para servidores RedM: scripts exclusivos, custom
            peds e sistemas criados para performance, originalidade e identidade
            propria.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 bg-primary px-7 font-display text-sm uppercase text-primary-foreground hover:bg-primary/90"
              asChild
            >
              <Link href="/loja">
                Ver produtos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 border-border bg-card/70 px-7 font-display text-sm uppercase text-foreground hover:bg-card"
              asChild
            >
              <Link href="https://discord.gg/qE29trG84u">
                <DiscordIcon className="h-5 w-5" />
                Join Discord
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
            {highlights.map((item) => (
              <div key={item.label} className="border-l border-primary/40 pl-4">
                <p className="font-display text-lg font-semibold uppercase text-foreground">
                  {item.value}
                </p>
                <p className="mt-1 text-xs uppercase text-muted-foreground">
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
