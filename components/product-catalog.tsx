"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  CheckCircle2,
  Filter,
  Package,
  Search,
  SlidersHorizontal,
} from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  storeCategories,
  storeProducts,
  type StoreCategory,
  type StoreProduct,
} from "@/lib/store-data"

type SortMode = "featured" | "price-asc" | "price-desc" | "name"

function getCategoryCount(category: StoreCategory, products: StoreProduct[]) {
  if (category === "All") {
    return products.length
  }

  return products.filter((product) => product.category === category).length
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

function priceValue(product: StoreProduct) {
  if (product.price.toLowerCase().includes("gratis")) return 0

  const normalized = product.price.replace(/[^\d,.-]/g, "").replace(",", ".")
  const value = Number.parseFloat(normalized)
  return Number.isFinite(value) ? value : 0
}

export function ProductCatalog({
  products = storeProducts,
}: {
  products?: StoreProduct[]
}) {
  const searchRef = useRef<HTMLInputElement>(null)
  const [selectedCategory, setSelectedCategory] = useState<StoreCategory>("All")
  const [query, setQuery] = useState("")
  const [sortMode, setSortMode] = useState<SortMode>("featured")
  const [filtersOpen, setFiltersOpen] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const category = params.get("categoria")

    if (category && storeCategories.includes(category as StoreCategory)) {
      setSelectedCategory(category as StoreCategory)
    }

    function focusSearch(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }

    window.addEventListener("keydown", focusSearch)
    return () => window.removeEventListener("keydown", focusSearch)
  }, [])

  const filteredProducts = useMemo(() => {
    const search = normalize(query.trim())

    const filtered = products.filter((product) => {
      const inCategory =
        selectedCategory === "All" || product.category === selectedCategory
      const matchesSearch =
        !search ||
        normalize(
          `${product.title} ${product.subtitle} ${product.category} ${product.badge ?? ""}`,
        ).includes(search)

      return inCategory && matchesSearch
    })

    return [...filtered].sort((a, b) => {
      if (sortMode === "price-asc") return priceValue(a) - priceValue(b)
      if (sortMode === "price-desc") return priceValue(b) - priceValue(a)
      if (sortMode === "name") return a.title.localeCompare(b.title)
      return products.indexOf(a) - products.indexOf(b)
    })
  }, [products, query, selectedCategory, sortMode])

  return (
    <section
      id="produtos"
      className="relative overflow-hidden border-b border-border bg-[#101014]"
    >
      <div className="absolute inset-0 tech-grid opacity-35" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-end">
          <div className="grid min-h-[260px] gap-6 sm:grid-cols-[220px_minmax(0,1fr)] sm:items-end">
            <div className="relative hidden h-64 sm:block">
              <Image
                src="/hero-gunslinger.png"
                alt="RedM"
                fill
                sizes="220px"
                className="rounded-lg object-cover object-center opacity-90"
                priority
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-[#101014] via-transparent to-transparent" />
            </div>

            <div className="pb-3">
              <p className="font-display text-xs uppercase tracking-[0.28em] text-primary">
                The Wanted Sole Studio
              </p>
              <h1 className="mt-4 font-display text-6xl font-bold uppercase leading-none text-primary sm:text-7xl">
                RedM
              </h1>
              <p className="mt-2 font-display text-xl font-semibold uppercase italic text-foreground">
                Sistemas exclusivos para servidores
              </p>
              <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
                Scripts, systems, peds, add-ons e recursos prontos para vender
                em uma loja integrada com Tebex.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card/70 p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-primary/15">
                <CheckCircle2 className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="font-display text-lg font-bold uppercase text-foreground">
                  Bom saber
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Os produtos ficam organizados por categoria, com pagina propria
                  e acao direta para carrinho/checkout Tebex.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={searchRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="search"
              placeholder="Buscar scripts, sistemas, recursos..."
              className="h-12 border-border bg-background/80 pl-10 pr-20 text-sm"
              aria-label="Buscar produtos"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-card px-2 py-1 font-display text-[0.65rem] uppercase text-muted-foreground sm:block">
              Ctrl+K
            </span>
          </div>

          <div className="flex gap-3">
            <label className="relative flex h-12 items-center rounded-md border border-border bg-background/80 pl-10 pr-3">
              <SlidersHorizontal className="pointer-events-none absolute left-3 h-4 w-4 text-primary" />
              <span className="sr-only">Ordenar produtos</span>
              <select
                value={sortMode}
                onChange={(event) => setSortMode(event.target.value as SortMode)}
                className="h-full min-w-36 bg-transparent font-display text-xs uppercase text-foreground outline-none"
              >
                <option value="featured">Destaques</option>
                <option value="price-asc">Menor preco</option>
                <option value="price-desc">Maior preco</option>
                <option value="name">Nome</option>
              </select>
            </label>

            <Button
              type="button"
              className="h-12 bg-primary px-5 font-display text-xs uppercase text-primary-foreground hover:bg-primary/90"
              onClick={() => setFiltersOpen((value) => !value)}
            >
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </div>
        </div>

        {filtersOpen && (
          <div id="categorias" className="mt-5 overflow-x-auto pb-2">
            <div className="flex min-w-max gap-2">
              {storeCategories.map((category) => {
                const active = selectedCategory === category
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(category)
                      const url = new URL(window.location.href)
                      if (category === "All") {
                        url.searchParams.delete("categoria")
                      } else {
                        url.searchParams.set("categoria", category)
                      }
                      window.history.replaceState(null, "", url)
                    }}
                    className={
                      active
                        ? "flex h-11 items-center gap-2 rounded-md border border-primary bg-primary px-4 font-display text-xs uppercase text-primary-foreground transition-colors"
                        : "flex h-11 items-center gap-2 rounded-md border border-border bg-card/70 px-4 font-display text-xs uppercase text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                    }
                  >
                    <Package className="h-4 w-4" />
                    <span>{category}</span>
                    <span className="rounded bg-background/30 px-1.5 py-0.5 text-[0.65rem]">
                      {getCategoryCount(category, products)}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-6">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card/70 p-8 text-center">
              <p className="font-display text-xl uppercase text-foreground">
                Nenhum produto encontrado
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Ajuste a busca ou remova um filtro para ver mais produtos.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
