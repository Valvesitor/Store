import {
  Globe,
  Headphones,
  Instagram,
  PackageCheck,
  ShieldCheck,
  Youtube,
} from "lucide-react"
import Link from "next/link"
import { DiscordIcon } from "@/components/icons"
import { Logo } from "@/components/logo"
import { studioLinks, tebexLegalLinks } from "@/lib/legal-content"

const mainLinks = [
  { label: "Inicio", href: "/" },
  { label: "Loja", href: "/loja" },
  { label: "Suporte", href: "/suporte" },
  { label: "About", href: studioLinks.about },
]

const studioLegalLinks = [
  { label: "Terms", href: studioLinks.terms },
  { label: "Privacy Policy", href: studioLinks.privacy },
]

const tebexLinks = [
  { label: "Impressum", href: tebexLegalLinks.impressum },
  { label: "Tebex Terms", href: tebexLegalLinks.terms },
  { label: "Tebex Privacy", href: tebexLegalLinks.privacy },
]

const socials = [
  { icon: DiscordIcon, label: "Discord", href: "https://discord.gg/qE29trG84u" },
  { icon: Instagram, label: "Instagram", href: "/suporte" },
  { icon: Youtube, label: "YouTube", href: "/suporte" },
  { icon: Globe, label: "Website", href: "https://thewantedsolestudio.com" },
]

const highlights = [
  {
    icon: PackageCheck,
    title: "Entrega digital",
    text: "Produtos vinculados a Tebex",
  },
  {
    icon: ShieldCheck,
    title: "Compra segura",
    text: "Checkout protegido",
  },
  {
    icon: Headphones,
    title: "Suporte",
    text: "Atendimento via Discord",
  },
]

const payments = ["VISA", "MASTERCARD", "PIX", "BOLETO"]

export function SiteFooter() {
  return (
    <footer className="border-t border-primary/20 bg-[#070708]">
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 tech-grid opacity-25" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_1.25fr_1fr] lg:items-start lg:px-8">
          <div>
            <Logo />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Scripts exclusivos, custom peds e sistemas premium para
              servidores RedM. Qualidade, originalidade e identidade propria.
            </p>

            <div className="mt-5 flex gap-2">
              {socials.map((social) => {
                const Icon = social.icon
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-secondary/60 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                )
              })}
            </div>
          </div>

          <div>
            <div className="grid gap-3 sm:grid-cols-3">
              {highlights.map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.title}
                    className="border-l border-primary/35 pl-4"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <p className="mt-3 font-display text-xs uppercase tracking-widest text-foreground">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {item.text}
                    </p>
                  </div>
                )
              })}
            </div>

            <nav
              aria-label="Navegacao principal do rodape"
              className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-5"
            >
              {mainLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-display text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="grid grid-cols-2 gap-8 text-center lg:justify-self-end">
            <div className="flex flex-col items-center">
              <p className="font-display text-xs uppercase tracking-[0.25em] text-foreground">
                Studio
              </p>
              <nav
                aria-label="Links legais do Studio"
                className="mt-3 flex flex-col items-center gap-2"
              >
                {studioLegalLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-xs text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex flex-col items-center">
              <p className="font-display text-xs uppercase tracking-[0.25em] text-foreground">
                Tebex
              </p>
              <nav
                aria-label="Links legais da Tebex"
                className="mt-3 flex flex-col items-center gap-2"
              >
                {tebexLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-xs text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <Link
                href="https://discord.gg/qE29trG84u"
                className="mt-5 inline-flex h-9 items-center justify-center gap-2 rounded-md border border-primary/30 bg-background/70 px-3 font-display text-xs uppercase tracking-widest text-foreground transition-colors hover:border-primary/60 hover:text-primary"
              >
                Discord
                <DiscordIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-4 px-4 py-5 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} The Wanted Sole Studio. Todos os
            direitos reservados.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-muted-foreground">
              Formas de pagamento
            </span>
            <div className="flex gap-2">
              {payments.map((payment) => (
                <span
                  key={payment}
                  className="rounded border border-border bg-secondary/60 px-2 py-1 font-display text-[0.6rem] tracking-widest text-muted-foreground"
                >
                  {payment}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
