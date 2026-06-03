import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  CheckCircle2,
  CircleAlert,
  DollarSign,
  KeyRound,
  Package,
  ReceiptText,
  Settings,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react"
import { AdminProductManager } from "@/components/admin-product-manager"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import {
  ADMIN_COOKIE_NAME,
  getAdminAccessKey,
  isAdminSessionValid,
} from "@/lib/admin-auth"
import { getRuntimeEnvValue } from "@/lib/cloudflare-env"
import { getProductPersistence, getProducts } from "@/lib/product-store"
import { storeCategories, type StoreProduct } from "@/lib/store-data"

export const dynamic = "force-dynamic"

function priceValue(product: StoreProduct) {
  if (product.price.toLowerCase().includes("gratis")) return 0

  const value = Number.parseFloat(
    product.price.replace(/[^\d,.-]/g, "").replace(",", "."),
  )
  return Number.isFinite(value) ? value : 0
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    style: "currency",
  }).format(value)
}

function statusClass(enabled: boolean) {
  return enabled
    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
    : "border-primary/30 bg-primary/10 text-primary"
}

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

  const products = await getProducts()
  const persistence = getProductPersistence()
  const paidProducts = products.filter((product) => priceValue(product) > 0)
  const freeProducts = products.length - paidProducts.length
  const packageProducts = products.filter((product) => product.packageId)
  const catalogValue = paidProducts.reduce(
    (total, product) => total + priceValue(product),
    0,
  )
  const tebexConfigured = Boolean(
    getRuntimeEnvValue("TEBEX_WEBSTORE_TOKEN") ||
      getRuntimeEnvValue("VITE_TEBEX_WEBSTORE_TOKEN"),
  )
  const webhookConfigured = Boolean(getRuntimeEnvValue("TEBEX_WEBHOOK_SECRET"))
  const r2Ready = persistence.canWrite
  const recentActions = [
    {
      title: "Tebex basket API",
      detail: tebexConfigured ? "Token configurado" : "Aguardando variável no Cloudflare",
      done: tebexConfigured,
    },
    {
      title: "Webhook de pedidos",
      detail: webhookConfigured ? "Secret configurado" : "Aguardando secret key",
      done: webhookConfigured,
    },
    {
      title: "Catálogo editável",
      detail: r2Ready ? "R2 PRODUCT_MEDIA ativo" : "Usando fallback fixo",
      done: r2Ready,
    },
    {
      title: "Package IDs",
      detail: `${packageProducts.length}/${products.length} produtos vinculados`,
      done: packageProducts.length === products.length,
    },
  ]

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
                Área do admin
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Painel para editar produtos, atualizar package IDs da Tebex,
                organizar o catálogo e manter a loja em produção sem mexer no código.
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
                  <Link href="#produtos-admin">
                    Gerenciar produtos
                    <Package className="h-4 w-4" />
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
                  <p className="font-display text-xs uppercase text-primary">
                    Status da loja
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-bold uppercase text-foreground">
                    Admin ativo
                  </h2>
                </div>
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Login protegido por ADMIN_ACCESS_KEY. Produtos editáveis via rotas
                /api/admin/products e persistência no R2 PRODUCT_MEDIA.
              </p>
              <div className="mt-5 grid gap-2">
                {recentActions.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 rounded-md border border-border bg-background/55 p-3"
                  >
                    {item.done ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />
                    ) : (
                      <CircleAlert className="mt-0.5 h-4 w-4 text-primary" />
                    )}
                    <div>
                      <p className="font-display text-xs uppercase text-foreground">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-8">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <nav className="grid gap-2 rounded-lg border border-border bg-card/70 p-3">
              {[
                { href: "#dashboard", icon: Store, label: "Dashboard" },
                { href: "#produtos-admin", icon: Boxes, label: "Produtos" },
                { href: "#pedidos-admin", icon: ReceiptText, label: "Pedidos" },
                { href: "#tebex-admin", icon: KeyRound, label: "Tebex" },
                { href: "#config-admin", icon: Settings, label: "Config" },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex h-11 items-center gap-3 rounded-md px-3 font-display text-xs uppercase text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </aside>

          <div className="grid gap-8">
            <section id="dashboard" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  icon: Package,
                  label: "Produtos",
                  value: String(products.length),
                  detail: `${freeProducts} grátis`,
                },
                {
                  icon: Boxes,
                  label: "Categorias",
                  value: String(storeCategories.length - 1),
                  detail: "Páginas individuais",
                },
                {
                  icon: DollarSign,
                  label: "Valor catálogo",
                  value: formatMoney(catalogValue),
                  detail: "Soma dos produtos pagos",
                },
                {
                  icon: BadgeCheck,
                  label: "Tebex packages",
                  value: `${packageProducts.length}/${products.length}`,
                  detail: "Produtos vinculados",
                },
              ].map((item) => {
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
                    <p className="mt-2 text-xs text-muted-foreground">
                      {item.detail}
                    </p>
                  </div>
                )
              })}
            </section>

            <AdminProductManager initialProducts={products} persistence={persistence} />

            <div className="grid gap-6 xl:grid-cols-2">
              <section
                id="pedidos-admin"
                className="rounded-lg border border-border bg-card/70 p-5"
              >
                <div className="flex items-center gap-3">
                  <ReceiptText className="h-5 w-5 text-primary" />
                  <h2 className="font-display text-2xl font-bold uppercase text-foreground">
                    Pedidos Tebex
                  </h2>
                </div>
                <div className="mt-5 grid gap-3">
                  {[
                    "Webhook de pagamento aprovado",
                    "Entrega automática/download",
                    "Histórico do cliente",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-md border border-border bg-background/45 p-3"
                    >
                      <ReceiptText className="mt-0.5 h-4 w-4 text-primary" />
                      <div>
                        <p className="font-display text-xs uppercase text-foreground">
                          {item}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Pronto para receber dados reais quando o webhook for conectado.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section
                id="tebex-admin"
                className="rounded-lg border border-border bg-card/70 p-5"
              >
                <div className="flex items-center gap-3">
                  <KeyRound className="h-5 w-5 text-primary" />
                  <h2 className="font-display text-2xl font-bold uppercase text-foreground">
                    Integração Tebex
                  </h2>
                </div>
                <div className="mt-5 grid gap-3">
                  {[
                    {
                      label: "TEBEX_WEBSTORE_TOKEN",
                      done: tebexConfigured,
                      detail: tebexConfigured ? "Configurado" : "Não configurado",
                    },
                    {
                      label: "TEBEX_WEBHOOK_SECRET",
                      done: webhookConfigured,
                      detail: webhookConfigured ? "Configurado" : "Não configurado",
                    },
                    {
                      label: "PRODUCT_MEDIA R2",
                      done: r2Ready,
                      detail: r2Ready ? "Catálogo editável ativo" : "Fallback fixo ativo",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between gap-4 rounded-md border border-border bg-background/45 p-3"
                    >
                      <div>
                        <p className="font-display text-xs uppercase text-foreground">
                          {item.label}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {item.detail}
                        </p>
                      </div>
                      <span
                        className={`rounded border px-2 py-1 font-display text-[0.65rem] uppercase ${statusClass(item.done)}`}
                      >
                        {item.done ? "OK" : "Pendente"}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <section
              id="config-admin"
              className="rounded-lg border border-border bg-card/70 p-5"
            >
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <h2 className="font-display text-2xl font-bold uppercase text-foreground">
                  Próxima etapa
                </h2>
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
                O catálogo agora salva no R2. Para pedidos completos, o próximo passo é
                gravar webhooks da Tebex em D1 e exibir histórico por cliente.
              </p>
            </section>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
