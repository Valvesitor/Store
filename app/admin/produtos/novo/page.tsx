import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AdminProductEditor } from "@/components/admin-product-editor"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import {
  ADMIN_COOKIE_NAME,
  getAdminAccessKey,
  isAdminSessionValid,
} from "@/lib/admin-auth"
import { getProductPersistence } from "@/lib/product-store"

export const dynamic = "force-dynamic"

async function requireAdminSession() {
  const adminKey = getAdminAccessKey()

  if (!adminKey) {
    redirect("/admin/login?erro=config")
  }

  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value

  if (!(await isAdminSessionValid(adminKey, sessionToken))) {
    redirect("/admin/login?erro=login&next=/admin/produtos/novo")
  }
}

export default async function NewProductPage() {
  await requireAdminSession()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 bg-background">
        <section className="border-b border-border bg-background">
          <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <p className="font-display text-xs uppercase tracking-[0.28em] text-primary">
              Admin / Produto
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold uppercase text-foreground">
              Novo produto
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              Cadastre imagem principal, galeria, vídeo, Tebex package ID e conteúdo da página.
            </p>
          </div>
        </section>
        <AdminProductEditor persistence={getProductPersistence()} mode="create" />
      </main>
      <SiteFooter />
    </div>
  )
}
