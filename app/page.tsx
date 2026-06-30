import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { HomeFeed } from "@/components/home-feed"
import { DiscordCta } from "@/components/discord-cta"
import { SiteFooter } from "@/components/site-footer"
import { getArticles, getUpdates } from "@/lib/blog-store"

export const dynamic = "force-dynamic"

export default async function Page() {
  const [novidades, updates] = await Promise.all([
    getArticles({ section: "novidades" }),
    getUpdates(),
  ])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <HomeFeed novidades={novidades} updates={updates} />
        <DiscordCta />
      </main>
      <SiteFooter />
    </div>
  )
}
