import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Box, Headphones, ShieldCheck, Sparkles } from "lucide-react"
import { DiscordIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { featuredProducts } from "@/lib/store-data"

const heroProduct = featuredProducts[0]

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
          src="/hero-gunslinger.png"
          alt="Pistoleiro em uma cidade do velho oeste ao por do sol"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/88 to-background/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/35 to-background/70" />
        <div className="absolute inset-0 tech-grid opacity-30" />
      </div>

      <div className="relative mx-auto grid min-h-[680px] w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:items-center lg:px-8">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/35 bg-background/55 px-4 py-1.5 text-primary backdrop-blur">
            <Sparkles className="h-4 w-4" />
            <span className="font-display text-xs uppercase tracking-widest">
              RedM - Scripts & Custom Peds
            </span>
          </div>

          <h1 className="mt-6 max-w-4xl font-hero text-5xl font-bold uppercase leading-[0.9] tracking-wide text-foreground sm:text-7xl lg:text-[6.6rem]">
            <span className="block">The Wanted</span>
            <span className="block bg-gradient-to-r from-primary via-[#f1c27a] to-primary bg-clip-text text-transparent">
              Sole Studio
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Scripts exclusivos, custom peds e sistemas premium para servidores
            RedM que precisam de performance, originalidade e identidade unica.
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

        <div className="lg:col-span-5">
          <div className="relative overflow-hidden rounded-lg border border-primary/25 bg-card/80 shadow-2xl shadow-black/40 backdrop-blur">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
            <div className="relative aspect-[16/10]">
              <Image
                src={heroProduct.image}
                alt={heroProduct.title}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/35 to-transparent" />
              <span className="absolute left-4 top-4 rounded border border-primary/30 bg-background/80 px-3 py-1 font-display text-xs uppercase text-primary">
                Destaque
              </span>
            </div>

            <div className="p-5">
              <p className="font-display text-xs uppercase text-primary">
                Produto recomendado
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold uppercase text-foreground">
                {heroProduct.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {heroProduct.subtitle}
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Box className="h-4 w-4 text-primary" />
                  {heroProduct.category}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Seguro
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Headphones className="h-4 w-4 text-primary" />
                  Suporte
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
