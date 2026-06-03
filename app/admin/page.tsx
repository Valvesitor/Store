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
  ClipboardList,
  DollarSign,
  ExternalLink,
  FilePenLine,
  KeyRound,
  Package,
  ReceiptText,
  Settings,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import {
  ADMIN_COOKIE_NAME,
  getAdminAccessKey,
  isAdminSessionValid,
} from "@/lib/admin-auth"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { getRuntimeEnvValue } from "@/lib/cloudflare-env"
import {
  categoryToSlug,
  featuredProductIds,
  productToSlug,
  storeCategories,
  storeProducts,
  type ProductCategory,
  type StoreProduct,
} from "@/lib/store-data"

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
  const paidProducts = storeProducts.filter((product) => priceValue(product) > 0)
  const freeProducts = storeProducts.length - paidProducts.length
  const packageProducts = storeProducts.filter((product) => product.packageId)
  const catalogValue = paidProducts.reduce(
    (total, product) => total + priceValue(product),
    0,
  )
  const tebexConfigured = Boolean(
    getRuntimeEnvValue("TEBEX_WEBSTORE_TOKEN") ||
      getRuntimeEnvValue("VITE_TEBEX_WEBSTORE_TOKEN"),
  )
  const webhookConfigured = Boolean(getRuntimeEnvValue("TEBEX_WEBHOOK_SECRET"))
  const cfxReady = tebexConfigured
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
      title: "Login CFX",
      detail: cfxReady ? "Fluxo conectado a Tebex auth" : "Depende do token Tebex",
      done: cfxReady,
    },
    {
      title: "Package IDs",
      detail: `${packageProducts.length}/${storeProducts.length} produtos vinculados`,
      done: packageProducts.length === storeProducts.length,
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
                Area do admin
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Painel para acompanhar catalogo, packages da Tebex, pedidos,
                recursos em destaque e configuracoes essenciais da loja.
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
                    Preview admin
                  </h2>
                </div>
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Esta area agora exige ADMIN_ACCESS_KEY para entrar. A edição
                real de produtos ainda precisa de banco/API, porque o catálogo
                atual está salvo fixo em lib/store-data.ts.
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
                  value: String(storeProducts.length),
                  detail: `${freeProducts} gratis`,
                },
                {
                  icon: Boxes,
                  label: "Categorias",
                  value: String(storeCategories.length - 1),
                  detail: "Paginas individuais",
                },
                {
                  icon: DollarSign,
                  label: "Valor catalogo",
                  value: formatMoney(catalogValue),
                  detail: "Soma dos produtos pagos",
                },
                {
                  icon: BadgeCheck,
                  label: "Tebex packages",
                  value: `${packageProducts.length}/${storeProducts.length}`,
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

            <section
              id="produtos-admin"
              className="rounded-lg border border-border bg-card/70"
            >
              <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-display text-xs uppercase text-primary">
                    Catalogo
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-bold uppercase text-foreground">
                    Produtos da loja
                  </h2>
                </div>
                <Button
                  variant="outline"
                  className="h-10 w-fit border-primary/30 bg-background/70 font-display text-xs uppercase text-foreground hover:border-primary/60"
                  asChild
                >
                  <Link href="/loja">
                    Abrir catalogo
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead className="border-b border-border bg-background/35">
                    <tr className="font-display text-xs uppercase text-muted-foreground">
                      <th className="px-5 py-3 font-medium">Produto</th>
                      <th className="px-5 py-3 font-medium">Categoria</th>
                      <th className="px-5 py-3 font-medium">Preco</th>
                      <th className="px-5 py-3 font-medium">Package</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium">Acoes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {storeProducts.map((product) => {
                      const featured = featuredProductIds.includes(
                        product.id as (typeof featuredProductIds)[number],
                      )
                      return (
                        <tr key={product.id} className="text-sm">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative h-12 w-16 overflow-hidden rounded-md border border-border bg-background">
                                <Image
                                  src={product.image}
                                  alt=""
                                  fill
                                  sizes="64px"
                                  className={
                                    product.imageMode === "contain"
                                      ? "object-contain p-1.5"
                                      : "object-cover"
                                  }
                                />
                              </div>
                              <div>
                                <p className="font-display text-sm font-semibold uppercase text-foreground">
                                  {product.title}
                                </p>
                                <p className="mt-1 line-clamp-1 max-w-64 text-xs text-muted-foreground">
                                  {product.subtitle}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-muted-foreground">
                            <Link
                              href={`/categorias/${categoryToSlug(product.category as ProductCategory)}`}
                              className="transition-colors hover:text-primary"
                            >
                              {product.category}
                            </Link>
                          </td>
                          <td className="px-5 py-4 font-display text-base text-primary">
                            {product.price}
                          </td>
                          <td className="px-5 py-4 text-muted-foreground">
                            {product.packageId ? `#${product.packageId}` : "Pendente"}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`rounded border px-2 py-1 font-display text-[0.65rem] uppercase ${statusClass(Boolean(product.packageId))}`}
                            >
                              {product.packageId ? "Tebex OK" : "Configurar"}
                            </span>
                            {featured && (
                              <span className="ml-2 rounded border border-primary/30 bg-primary/10 px-2 py-1 font-display text-[0.65rem] uppercase text-primary">
                                Destaque
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="icon-sm"
                                className="border-border bg-background/70 text-muted-foreground hover:text-foreground"
                                asChild
                              >
                                <Link href={`/produtos/${productToSlug(product)}`}>
                                  <ExternalLink className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button
                                variant="outline"
                                size="icon-sm"
                                className="border-border bg-background/70 text-muted-foreground hover:text-foreground"
                                title="Edição real precisa de banco/API. Hoje os produtos estão fixos em lib/store-data.ts."
                                disabled
                              >
                                <FilePenLine className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </section>

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
                    "Entrega automatica/download",
                    "Historico do cliente",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-md border border-border bg-background/45 p-3"
                    >
                      <ClipboardList className="mt-0.5 h-4 w-4 text-primary" />
                      <div>
                        <p className="font-display text-xs uppercase text-foreground">
                          {item}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Pronto para receber dados reais quando o webhook for
                          conectado.
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
                    Integracao Tebex
                  </h2>
                </div>
                <div className="mt-5 grid gap-3">
                  {[
                    {
                      label: "TEBEX_WEBSTORE_TOKEN",
                      done: tebexConfigured,
                      detail: tebexConfigured ? "Configurado" : "Nao configurado",
                    },
                    {
                      label: "TEBEX_WEBHOOK_SECRET",
                      done: webhookConfigured,
                      detail: webhookConfigured ? "Configurado" : "Nao configurado",
                    },
                    {
                      label: "Login CFX via Tebex auth",
                      done: cfxReady,
                      detail: cfxReady ? "Ativo" : "Aguardando token",
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
                  Proxima etapa
                </h2>
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
                O login administrativo foi corrigido para usar ADMIN_ACCESS_KEY.
                Para editar produtos direto pelo painel em produção, será preciso
                trocar o catálogo fixo de lib/store-data.ts por D1/KV/R2 com rotas
                de salvar, editar e excluir produtos.
              </p>
            </section>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
