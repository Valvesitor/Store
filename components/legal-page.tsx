import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ExternalLink, FileText, ShieldCheck } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import type { LegalSection } from "@/lib/legal-content"
import { tebexLegalLinks } from "@/lib/legal-content"

export function LegalPage({
  eyebrow,
  title,
  description,
  sections,
  showTebexLinks = false,
}: {
  eyebrow: string
  title: string
  description: string
  sections: LegalSection[]
  showTebexLinks?: boolean
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 bg-[#101014]">
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 tech-grid opacity-35" />
          <Image
            src="/hero-gunslinger.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center opacity-18"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/92 to-background/75" />

          <div className="relative mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <p className="font-display text-xs uppercase tracking-[0.28em] text-primary">
              {eyebrow}
            </p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl font-bold uppercase leading-tight text-foreground sm:text-6xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              {description}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                className="h-11 bg-primary px-5 font-display text-xs uppercase text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <Link href="/loja">
                  Ver loja
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-11 border-primary/30 bg-card/70 px-5 font-display text-xs uppercase text-foreground hover:border-primary/60"
                asChild
              >
                <Link href="/suporte">
                  Suporte
                  <ShieldCheck className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
          <div className="grid gap-4">
            {sections.map((section) => (
              <article
                key={section.title}
                className="rounded-lg border border-border bg-card/70 p-5"
              >
                <div className="flex items-start gap-3">
                  <FileText className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <h2 className="font-display text-xl font-bold uppercase text-foreground">
                      {section.title}
                    </h2>
                    <div className="mt-3 grid gap-3">
                      {section.paragraphs?.map((paragraph) => (
                        <p
                          key={paragraph}
                          className="text-sm leading-7 text-muted-foreground"
                        >
                          {paragraph}
                        </p>
                      ))}
                      {section.list && (
                        <ul className="grid gap-2">
                          {section.list.map((item) => (
                            <li
                              key={item}
                              className="flex gap-3 text-sm leading-6 text-muted-foreground"
                            >
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {section.highlight && (
                        <div className="rounded-md border border-primary/25 bg-primary/10 p-3 text-sm font-semibold leading-6 text-primary">
                          {section.highlight}
                        </div>
                      )}
                      {section.warning && (
                        <div className="rounded-md border border-destructive/35 bg-destructive/10 p-3 text-sm leading-6 text-destructive-foreground">
                          {section.warning}
                        </div>
                      )}
                      {section.contacts && (
                        <div className="grid gap-2 pt-1">
                          {section.contacts.map((contact) => (
                            <Link
                              key={contact.href}
                              href={contact.href}
                              className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                            >
                              {contact.label}
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-primary/25 bg-card/80 p-5">
              <p className="font-display text-xs uppercase text-primary">
                The Wanted Sole Studio
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold uppercase text-foreground">
                Links oficiais
              </h2>
              <div className="mt-5 grid gap-2">
                <Button
                  variant="outline"
                  className="h-10 justify-start border-border bg-background/60 font-display text-xs uppercase text-foreground hover:border-primary/60"
                  asChild
                >
                  <Link href="/about">About</Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-10 justify-start border-border bg-background/60 font-display text-xs uppercase text-foreground hover:border-primary/60"
                  asChild
                >
                  <Link href="/terms">Terms</Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-10 justify-start border-border bg-background/60 font-display text-xs uppercase text-foreground hover:border-primary/60"
                  asChild
                >
                  <Link href="/privacy-policy">Privacy Policy</Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-10 justify-start border-border bg-background/60 font-display text-xs uppercase text-foreground hover:border-primary/60"
                  asChild
                >
                  <Link href="/docs">Docs</Link>
                </Button>
              </div>

              {showTebexLinks && (
                <div className="mt-6 border-t border-border pt-5">
                  <p className="font-display text-xs uppercase text-primary">
                    Tebex
                  </p>
                  <div className="mt-3 grid gap-2">
                    {[
                      { label: "Impressum", href: tebexLegalLinks.impressum },
                      { label: "Tebex Terms", href: tebexLegalLinks.terms },
                      { label: "Tebex Privacy", href: tebexLegalLinks.privacy },
                    ].map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {link.label}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
