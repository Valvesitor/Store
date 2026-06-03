import Image from "next/image"
import { Backpack, Coins, Cog, Crosshair, Map } from "lucide-react"

const categories = [
  { title: "SISTEMAS", count: "16 produtos", icon: Cog, image: "/categories/sistemas.png" },
  { title: "ECONOMIA", count: "12 produtos", icon: Coins, image: "/categories/economia.png" },
  { title: "UTILITÁRIOS", count: "9 produtos", icon: Backpack, image: "/categories/utilitarios.png" },
  { title: "COMBATE", count: "7 produtos", icon: Crosshair, image: "/categories/combate.png" },
  { title: "MAPAS", count: "5 produtos", icon: Map, image: "/categories/mapas.png" },
]

export function Categories() {
  return (
    <section id="categorias" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="font-display text-2xl font-bold uppercase tracking-wide sm:text-3xl">
        Categorias
      </h2>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <a
              key={category.title}
              href="#produtos"
              className="group relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-lg border border-border text-center transition-colors hover:border-primary/50"
            >
              <Image
                src={category.image || "/placeholder.svg"}
                alt=""
                fill
                className="object-cover opacity-40 transition-all duration-500 group-hover:scale-105 group-hover:opacity-55"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-card/30" />
              <div className="relative flex flex-col items-center gap-3 p-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-display text-sm font-semibold tracking-wide text-foreground">
                    {category.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">{category.count}</p>
                </div>
              </div>
            </a>
          )
        })}
      </div>
    </section>
  )
}
