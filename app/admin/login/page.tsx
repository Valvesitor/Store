import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, KeyRound, ShieldCheck } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ADMIN_COOKIE_NAME,
  getAdminAccessKey,
  isAdminSessionValid,
} from "@/lib/admin-auth"

function errorMessage(error?: string) {
  if (error === "config") {
    return "Configure ADMIN_ACCESS_KEY nas variáveis do Cloudflare para liberar o painel."
  }

  if (error === "invalid") {
    return "Chave administrativa invalida."
  }

  if (error === "login") {
    return "Entre com a chave administrativa para acessar o painel."
  }

  return null
}

export const dynamic = "force-dynamic"

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ erro?: string; next?: string }>
}) {
  const adminKey = getAdminAccessKey()
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value

  if (adminKey && (await isAdminSessionValid(adminKey, sessionToken))) {
    redirect("/admin")
  }

  const params = await searchParams
  const message = errorMessage(params?.erro)
  const nextPath = params?.next?.startsWith("/admin") ? params.next : "/admin"

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
            className="object-cover object-center opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/92 to-background/70" />
        </div>

        <section className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="flex flex-col justify-center lg:col-span-5">
            <Button
              variant="outline"
              className="mb-8 h-10 w-fit border-primary/30 bg-card/70 font-display text-xs uppercase text-foreground hover:border-primary/60"
              asChild
            >
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Voltar ao site
              </Link>
            </Button>

            <p className="font-display text-xs uppercase tracking-[0.28em] text-primary">
              The Wanted Sole Studio
            </p>
            <h1 className="mt-4 font-display text-5xl font-bold uppercase leading-none text-foreground sm:text-6xl">
              Admin
            </h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
              Entrada reservada para gerenciar o conteúdo do blog: novidades,
              documentação e atualizações.
            </p>
          </div>

          <div className="lg:col-span-7">
            <form
              action="/api/admin/login"
              method="post"
              className="mx-auto max-w-md rounded-lg border border-primary/25 bg-card/90 p-6 shadow-2xl shadow-black/30"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div className="mt-6">
                <p className="font-display text-xs uppercase text-primary">
                  Acesso protegido
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold uppercase text-foreground">
                  Chave administrativa
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Clientes nao veem este painel. Use a chave definida no servidor
                  para liberar a sessao administrativa.
                </p>
              </div>

              {message && (
                <p className="mt-5 rounded-md border border-primary/30 bg-primary/10 p-3 text-sm leading-6 text-primary">
                  {message}
                </p>
              )}

              <input type="hidden" name="next" value={nextPath} />

              <label className="mt-5 block">
                <span className="font-display text-xs uppercase text-muted-foreground">
                  Admin access key
                </span>
                <Input
                  name="accessKey"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="mt-2 h-11 border-border bg-background/70"
                  placeholder="Digite a chave do admin"
                />
              </label>

              <Button
                type="submit"
                className="mt-5 h-11 w-full bg-primary font-display text-xs uppercase text-primary-foreground hover:bg-primary/90"
              >
                <KeyRound className="h-4 w-4" />
                Entrar no admin
              </Button>
            </form>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
