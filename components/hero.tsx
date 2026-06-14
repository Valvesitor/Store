import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BadgeCheck, Package, Sparkles } from "lucide-react"
import { DiscordIcon } from "@/components/icons"
import { LogoMark } from "@/components/logo"
import { Button } from "@/components/ui/button"

const highlights = [
  { label: "Scripts", value: "Premium" },
  { label: "Custom Peds", value: "Exclusivos" },
  { label: "Suporte", value: "Discord" },
]

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden border-b border-primary/20 bg-background">
      <div className="absolute inset-0 tws-banner-bg opacity-35" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />

      <div className="relative mx-auto grid min-h-[720px] w-full max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.88fr] lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/35 bg-[#17130f]/75 px-4 py-1.5 text-primary shadow-[0_12px_35px_rgba(0,0,0,0.25)] backdrop-blur">
            <Sparkles className="h-4 w-4" />
            <span className="font-display text-xs uppercase tracking-[0.26em]">
              Novo visual oficial da TWS
            </span>
          </div>

          <h1 className="mt-6 max-w-3xl font-display text-5xl font-bold uppercase leading-[0.94] tracking-[0.04em] text-foreground sm:text-7xl lg:text-[5.8rem]">
            The Wanted
            <span className="block text-primary">Sole Studio</span>
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
            Uma loja premium para RedM com identidade visual inspirada no novo
            banner da TWS: montanhas em parchment, linhas pretas elegantes e
            destaque laranja em todos os pontos importantes.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 rounded-full bg-primary px-7 font-display text-xs uppercase tracking-[0.22em] text-primary-foreground hover:bg-primary/90"
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
              className="h-12 rounded-full border-primary/30 bg-[#17130f]/75 px-7 font-display text-xs uppercase tracking-[0.22em] text-foreground hover:border-primary/60 hover:bg-primary/10"
              asChild
            >
              <Link href="https://discord.gg/qE29trG84u">
                <DiscordIcon className="h-5 w-5" />
                Join Discord
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-primary/20 bg-card/70 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.22)] backdrop-blur"
              >
                <p className="font-display text-lg font-semibold uppercase tracking-[0.08em] text-foreground">
                  {item.value}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="tws-corner-waves rounded-[2rem]">
            <div className="tws-paper tws-frame relative overflow-hidden rounded-[2rem] p-4">
              <div className="overflow-hidden rounded-[1.35rem] border border-[#151412]/15 bg-[#151412]">
                <Image
                  src="/tws-studio-banner.gif"
                  alt="The Wanted Sole Studio novo banner"
                  width={680}
                  height={240}
                  className="h-auto w-full object-cover"
                  unoptimized
                />
              </div>

              <div className="mt-5 grid grid-cols-[auto_1fr] gap-4 p-2">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#151412]/15 bg-[#151412] text-primary">
                  <LogoMark className="h-7" />
                </span>
                <div>
                  <p className="font-display text-xs uppercase tracking-[0.35em] text-[#d88a33]">
                    Sua identidade começa aqui
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#312821]">
                    Layout com visual mais refinado, menos pesado e mais fiel à
                    marca The Wanted Sole Studio.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-8 left-8 rounded-2xl border border-primary/25 bg-[#11100e]/90 p-4 shadow-2xl backdrop-blur">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <BadgeCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">
                  Estilo aplicado
                </p>
                <p className="text-sm text-muted-foreground">Branding, cards e seções</p>
              </div>
            </div>
          </div>

          <div className="absolute -right-4 -top-6 rounded-full border border-primary/30 bg-[#11100e]/85 px-4 py-2 font-display text-xs uppercase tracking-[0.24em] text-foreground shadow-2xl backdrop-blur">
            <Package className="mr-2 inline h-4 w-4 text-primary" />
            RedM Store
          </div>
        </div>
      </div>
    </section>
  )
}
