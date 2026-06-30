import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DiscordIcon } from "@/components/icons"

export function DiscordCta() {
  return (
    <section id="discord" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-card/70 shadow-sm">
        <Image
          src="/tws-mountains-banner.png"
          alt=""
          fill
          className="object-cover object-center opacity-45"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(239,228,208,0.95)_0%,rgba(239,228,208,0.82)_52%,rgba(239,228,208,0.54)_100%)]" />
        <div className="relative flex flex-col items-start gap-6 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <p className="font-display text-xs tracking-[0.3em] text-primary">
              SUA IDENTIDADE COMEÇA AQUI
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-tight tracking-tight text-balance sm:text-4xl">
              Entre na comunidade do Discord
            </h2>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
              Suporte rápido, novidades em primeira mão e contato direto com a
              equipe da The Wanted Sole Studio.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 rounded-full bg-primary px-7 font-display text-sm tracking-widest text-primary-foreground hover:bg-primary/90"
              asChild
            >
              <a href="https://discord.gg/qE29trG84u">
                <DiscordIcon className="h-5 w-5" />
                ENTRE NO DISCORD
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-primary/30 bg-card/70 px-7 font-display text-sm tracking-widest text-foreground hover:bg-card"
              asChild
            >
              <a href="/novidades">
                VER NOVIDADES
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
