import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CircleAlert,
  FileText,
  Newspaper,
  RefreshCw,
  ShieldCheck,
} from "lucide-react"
import { AdminContentManager } from "@/components/admin-content-manager"
import { AdminUpdatesManager } from "@/components/admin-updates-manager"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import {
  ADMIN_COOKIE_NAME,
  getAdminAccessKey,
  isAdminSessionValid,
} from "@/lib/admin-auth"
import { getArticles, getContentPersistence, getUpdates } from "@/lib/blog-store"

export const dynamic = "force-dynamic"

async function requireAdminSession() {
  const adminKey = getAdminAccessKey()

  if (!adminKey) {
    redirect("/admin/login?erro=config")
  }

  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value

  if (!(await isAdminSessionValid(adminKey, sessionToken))) {
    redirect("/admin/login?erro=login&next=/admin")
  }
}

export default async function AdminPage() {
  await requireAdminSession()

  const [articles, updates] = await Promise.all([
    getArticles({ includeDrafts: true }),
    getUpdates({ includeDrafts: true }),
  ])
  const persistence = getContentPersistence()

  const novidades = articles.filter((article) => article.section === "novidades")
  const docs = articles.filter((article) => article.section === "docs")

  const stats = [
    { icon: Newspaper, label: "Novidades", value: String(novidades.length) },
    { icon: BookOpen, label: "Docs", value: String(docs.length) },
    { icon: RefreshCw, label: "Atualizações", value: String(updates.length) },
    {
      icon: FileText,
      label: "Rascunhos",
      value: String(
        articles.filter((a) => !a.published).length +
          updates.filter((u) => !u.published).length,
      ),
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 bg-background">
        <section className="relative overflow-hidden border-b border-border">
          <Image
            src="/tws-mountains-banner.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/92 to-background/70" />

          <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:px-8">
            <div>
              <p className="font-display text-xs uppercase tracking-[0.28em] text-primary">
                The Wanted Sole Studio
              </p>
              <h1 className="mt-4 font-display text-5xl font-bold uppercase leading-none text-foreground sm:text-6xl">
                Painel de conteúdo
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Publique novidades, escreva a documentação e registre as
                atualizações do site sem mexer no código.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button
                  className="h-11 bg-primary px-5 font-display text-xs uppercase text-primary-foreground hover:bg-primary/90"
                  asChild
                >
                  <Link href="#conteudo-admin">
                    Gerenciar conteúdo
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-11 border-primary/30 bg-card/70 px-5 font-display text-xs uppercase text-foreground hover:border-primary/60"
                  asChild
                >
                  <Link href="/">
                    Ver site
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <form action="/api/admin/logout" method="post">
                  <Button
                    type="submit"
                    variant="outline"
                    className="h-11 border-border bg-card/70 px-5 font-display text-xs uppercase text-muted-foreground hover:border-primary/60 hover:text-foreground"
                  >
                    Sair do admin
                  </Button>
                </form>
              </div>
            </div>

            <div className="rounded-lg border border-primary/25 bg-card/85 p-5 shadow-2xl shadow-black/30">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-display text-xs uppercase text-primary">Status</p>
                  <h2 className="mt-2 font-display text-2xl font-bold uppercase text-foreground">
                    Admin ativo
                  </h2>
                </div>
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <div className="mt-5 flex items-start gap-3 rounded-md border border-border bg-background/55 p-3">
                {persistence.canWrite ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400" />
                ) : (
                  <CircleAlert className="mt-0.5 h-4 w-4 text-primary" />
                )}
                <div>
                  <p className="font-display text-xs uppercase text-foreground">
                    {persistence.canWrite ? "Persistência ativa" : "Somente leitura"}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {persistence.message}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.label}
                  className="rounded-lg border border-border bg-card/70 p-5"
                >
                  <Icon className="h-5 w-5 text-primary" />
                  <p className="mt-4 font-display text-xs uppercase text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-1 font-display text-3xl font-bold uppercase text-foreground">
                    {item.value}
                  </p>
                </div>
              )
            })}
          </div>

          <AdminContentManager initialArticles={articles} persistence={persistence} />
          <AdminUpdatesManager initialUpdates={updates} persistence={persistence} />
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
