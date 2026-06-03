import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { StudioBenefits } from "@/components/studio-benefits"
import { HomeCategories } from "@/components/home-categories"
import { FeaturedProducts } from "@/components/featured-products"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <StudioBenefits />
        <FeaturedProducts />
        <HomeCategories />
      </main>
      <SiteFooter />
    </div>
  )
}
