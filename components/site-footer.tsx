import {
  BookOpen,
  Globe,
  Headphones,
  Instagram,
  Newspaper,
  RefreshCw,
  Youtube,
} from "lucide-react"
import Link from "next/link"
import { DiscordIcon } from "@/components/icons"
import { Logo } from "@/components/logo"
import { studioLinks } from "@/lib/legal-content"

const mainLinks = [
  { label: "Inicio", href: "/" },
  { label: "Novidades", href: "/novidades" },
  { label: "Docs", href: "/docs" },
  { label: "Atualizações", href: "/atualizacoes" },
  { label: "Suporte", href: "/suporte" },
]

const studioLegalLinks = [
  { label: "About", href: studioLinks.about },
  { label: "Terms", href: studioLinks.terms },
  { label: "Privacy Policy", href: studioLinks.privacy },
]

const socials = [
  { icon: DiscordIcon, label: "Discord", href: "https://discord.gg/qE29trG84u" },
  { icon: Instagram, label: "Instagram", href: "/suporte" },
  { icon: Youtube, label: "YouTube", href: "/suporte" },
  { icon: Globe, label: "Website", href: "https://thewantedsolestudio.com" },
]

const highlights = [
  {
    icon: Newspaper,
    title: "Novidades",
    text: "Anúncios e lançamentos",
  },
  {
    icon: BookOpen,
    title: "Documentação",
    text: "Guias e instruções",
  },
  {
    icon: Headphones,
    title: "Suporte",
    text: "Atendimento via Discord",
  },
]

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-primary/25 bg-[#eadcc5]">
      <div className="relative overflow-hidden border-b border-primary/25 tws-corner-lines">
        <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_1.25fr_1fr] lg:items-start lg:px-8">
          <div>
            <Logo />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              O blog oficial do The Wanted Sole Studio: novidades, documentação
              e atualizações com identidade, estilo e tecnologia.
            </p>

            <div className="mt-5 flex gap-2">
              {socials.map((social) => {
                const Icon = social.icon
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/25 bg-card/70 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
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
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
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
              className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-primary/25 pt-5"
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

          <div className="lg:justify-self-end">
            <div className="flex flex-col">
              <p className="font-display text-xs uppercase tracking-[0.25em] text-foreground">
                Studio
              </p>
              <nav
                aria-label="Links legais do Studio"
                className="mt-3 flex flex-col gap-2"
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

              <Link
                href="https://discord.gg/qE29trG84u"
                className="mt-5 inline-flex h-9 w-fit items-center justify-center gap-2 rounded-full border border-primary/30 bg-card/70 px-3 font-display text-xs uppercase tracking-widest text-foreground transition-colors hover:border-primary/60 hover:text-primary"
              >
                Discord
                <DiscordIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-primary/25">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-4 px-4 py-5 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} The Wanted Sole Studio. Todos os
            direitos reservados.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/atualizacoes"
              className="inline-flex items-center gap-2 font-display text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Atualizações
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
