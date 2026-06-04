import Image from "next/image"
import { CheckCircle2, Download, LockKeyhole, ShieldCheck } from "lucide-react"
import { LoginAccountPanel } from "@/components/login-account-panel"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="relative flex flex-1 overflow-hidden bg-background">
        <div className="absolute inset-0">
          <Image
            src="/store-background.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[62%_center] opacity-28"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/92 to-background/68" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-background/80" />
        </div>

        <section className="relative mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_520px] lg:items-center lg:px-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/70 px-4 py-1.5 text-primary backdrop-blur">
              <LockKeyhole className="h-4 w-4" />
              <span className="font-display text-xs uppercase tracking-widest">
                Area segura do cliente
              </span>
            </div>

            <h1 className="mt-6 max-w-3xl font-display text-5xl font-bold uppercase leading-none text-foreground sm:text-6xl">
              Acesse sua conta da loja
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
              Conecte sua conta CFX.re para manter sua sessao Tebex ativa,
              revisar carrinho e finalizar compras com mais seguranca.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-primary/25 bg-card/75 p-4">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <p className="mt-3 font-display text-sm font-bold uppercase text-foreground">
                  Sessao Tebex
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Login vinculado ao checkout da loja.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card/65 p-4">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <p className="mt-3 font-display text-sm font-bold uppercase text-foreground">
                  Compra segura
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Fluxo protegido pela autenticacao CFX.re.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card/65 p-4">
                <Download className="h-5 w-5 text-primary" />
                <p className="mt-3 font-display text-sm font-bold uppercase text-foreground">
                  Produtos digitais
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Acesso organizado para compras RedM.
                </p>
              </div>
            </div>
          </div>

          <div>
            <LoginAccountPanel />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
