import { ProductCatalog } from "@/components/product-catalog"
import { FeaturesStrip } from "@/components/features-strip"
import { DiscordCta } from "@/components/discord-cta"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { getProducts } from "@/lib/product-store"

export const dynamic = "force-dynamic"

export default async function StorePage() {
  const products = await getProducts()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <ProductCatalog products={products} />
        <FeaturesStrip />
        <DiscordCta />
      </main>
      <SiteFooter />
    </div>
  )
}
