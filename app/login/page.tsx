import Image from "next/image"
import { BadgeCheck, Download, ShieldCheck, User } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { TebexLoginButton } from "@/components/tebex-login-button"

const benefits = [
  {
    icon: User,
    title: "Conta CFX.re",
    desc: "Use sua conta da plataforma para identificar seu acesso.",
  },
  {
    icon: Download,
    title: "Downloads",
    desc: "Acesse produtos vinculados ao seu perfil da loja.",
  },
  {
    icon: ShieldCheck,
    title: "Segurança",
    desc: "Autenticação centralizada para reduzir contas duplicadas.",
  },
]

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="relative flex flex-1 items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero-gunslinger.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/65" />
          <div className="absolute inset-0 tech-grid opacity-40" />
        </div>

        <section className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="flex flex-col justify-center lg:col-span-5">
            <p className="font-display text-xs uppercase text-primary">
              Área do cliente
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-tight text-foreground sm:text-5xl">
              Login via CFX.re
            </h1>
            <p className="mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
              Acesse sua conta usando CFX.re para acompanhar compras, downloads
              e suporte dos seus produtos RedM.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="mx-auto max-w-md rounded-lg border border-border bg-card/85 p-6 backdrop-blur">
              <div className="flex h-12 w-12 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
                <BadgeCheck className="h-5 w-5" />
              </div>

              <div className="mt-6">
                <p className="font-display text-xs uppercase text-primary">
                  CFX.re Account
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold uppercase text-foreground">
                  Entrar com CFX.re
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Você será enviado para autenticar sua conta CFX.re e depois
                  poderá voltar para acessar seus recursos.
                </p>
              </div>

              <TebexLoginButton />

              <div className="mt-6 grid gap-3">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon
                  return (
                    <div key={benefit.title} className="flex gap-3 border-t border-border pt-3">
                      <span className="mt-0.5 text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <h3 className="font-display text-sm font-semibold uppercase text-foreground">
                          {benefit.title}
                        </h3>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {benefit.desc}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
