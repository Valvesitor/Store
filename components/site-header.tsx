"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Menu, Search, ShoppingCart, User, X } from "lucide-react"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getStoredTebexCartCount } from "@/lib/tebex-client"

const navLinks = [
  { label: "INICIO", href: "/" },
  { label: "LOJA", href: "/loja" },
  { label: "SUPORTE", href: "/suporte" },
  { label: "SOBRE NOS", href: "/about" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    function syncCartCount() {
      setCartCount(getStoredTebexCartCount())
    }

    syncCartCount()
    window.addEventListener("tws:tebex-cart-changed", syncCartCount)
    window.addEventListener("storage", syncCartCount)

    return () => {
      window.removeEventListener("tws:tebex-cart-changed", syncCartCount)
      window.removeEventListener("storage", syncCartCount)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
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
              className="rounded-md px-3 py-2 font-display text-sm tracking-widest text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar produtos..."
              className="h-9 w-44 border-border bg-secondary/60 pl-9 text-sm lg:w-56"
              aria-label="Buscar produtos"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            aria-label="Minha conta"
            asChild
          >
            <Link href="/login">
              <User className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground hover:text-foreground"
            aria-label="Carrinho Tebex"
            asChild
          >
            <Link href="/carrinho">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.6rem] font-bold text-primary-foreground">
                {cartCount}
              </span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground lg:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 font-display text-sm tracking-widest text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 font-display text-sm tracking-widest text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              LOGIN
            </Link>
            <Link
              href="/carrinho"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 font-display text-sm tracking-widest text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              CARRINHO
            </Link>
            <div className="relative mt-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar produtos..."
                className="h-10 w-full border-border bg-secondary/60 pl-9 text-sm"
                aria-label="Buscar produtos"
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
