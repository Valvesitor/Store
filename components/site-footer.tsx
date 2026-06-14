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
  { label: "Início", href: "/" },
  { label: "Loja", href: "/loja" },
  { label: "Categorias", href: "/#categorias" },
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
    text: "Produtos vinculados à Tebex",
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
    <footer className="relative overflow-hidden border-t border-primary/20 bg-[#0d0c0a]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
      <div className="absolute inset-0 tws-banner-bg opacity-10" />

      <div className="relative border-b border-primary/15">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_1.25fr_1fr] lg:items-start lg:px-8">
          <div>
            <Logo />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Scripts exclusivos, custom peds e sistemas premium para servidores
              RedM. Qualidade, originalidade e identidade própria no novo estilo
              The Wanted Sole Studio.
            </p>

            <div className="mt-5 flex gap-2">
              {socials.map((social) => {
                const Icon = social.icon
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/25 bg-card/70 text-muted-foreground transition-colors hover:border-primary/60 hover:bg-primary/10 hover:text-primary"
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
                    className="rounded-2xl border border-primary/20 bg-card/55 p-4 backdrop-blur"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <p className="mt-3 font-display text-xs uppercase tracking-[0.2em] text-foreground">
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
              aria-label="Navegação principal do rodapé"
              className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-primary/15 pt-5"
            >
              {mainLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-display text-xs uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="grid grid-cols-2 gap-8 text-center lg:justify-self-end">
            <div className="flex flex-col items-center">
              <p className="font-display text-xs uppercase tracking-[0.28em] text-foreground">
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
              <p className="font-display text-xs uppercase tracking-[0.28em] text-foreground">
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
                className="mt-5 inline-flex h-9 items-center justify-center gap-2 rounded-full border border-primary/30 bg-card/70 px-4 font-display text-xs uppercase tracking-[0.22em] text-foreground transition-colors hover:border-primary/60 hover:bg-primary/10 hover:text-primary"
              >
                Discord
                <DiscordIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-primary/15">
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
                  className="rounded-full border border-primary/20 bg-card/70 px-3 py-1 font-display text-[0.6rem] tracking-[0.2em] text-muted-foreground"
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
