"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { DiscordIcon } from "@/components/icons"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"

const navLinks = [
  { label: "INICIO", href: "/" },
  { label: "NOVIDADES", href: "/novidades" },
  { label: "DOCS", href: "/docs" },
  { label: "ATUALIZAÇÕES", href: "/atualizacoes" },
  { label: "SUPORTE", href: "/suporte" },
  { label: "SOBRE", href: "/sobre" },
]

const discordUrl = "https://discord.gg/qE29trG84u"

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-primary/25 bg-[#f3ead8]/85 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-[#f3ead8]/75">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="The Wanted Sole Studio - Inicio">
          <Logo className="md:hidden" compact />
          <Logo className="hidden md:flex" />
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-full px-3 py-2 font-display text-sm tracking-widest text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button
            className="hidden h-9 rounded-full bg-primary px-4 font-display text-xs uppercase tracking-widest text-primary-foreground hover:bg-primary/90 sm:inline-flex"
            asChild
          >
            <Link href={discordUrl}>
              <DiscordIcon className="h-4 w-4" />
              Discord
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-muted-foreground hover:bg-primary/10 hover:text-foreground lg:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-primary/20 bg-[#f3ead8]/95 lg:hidden">
          <nav className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 font-display text-sm tracking-widest text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={discordUrl}
              onClick={() => setOpen(false)}
              className="mt-1 flex items-center gap-2 rounded-xl bg-primary px-3 py-2.5 font-display text-sm tracking-widest text-primary-foreground"
            >
              <DiscordIcon className="h-4 w-4" />
              DISCORD
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
