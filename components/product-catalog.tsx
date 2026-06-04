"use client"

import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
import {
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
  const visibleProducts = products.length > 0 ? products : storeProducts

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

    const filtered = visibleProducts.filter((product) => {
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
      if (Boolean(a.featured) !== Boolean(b.featured)) {
        return a.featured ? -1 : 1
      }
      return visibleProducts.indexOf(a) - visibleProducts.indexOf(b)
    })
  }, [visibleProducts, query, selectedCategory, sortMode])

  return (
    <section id="produtos" className="border-b border-border bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 border-b border-border pb-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div className="max-w-3xl">
            <p className="font-display text-xs uppercase tracking-[0.28em] text-primary">
              Loja RedM
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-none text-foreground sm:text-5xl">
              Produtos digitais
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              Scripts, systems, peds e add-ons organizados por categoria, com
              compra integrada pela Tebex.
            </p>

            <div className="mt-4 flex w-fit items-center gap-2 rounded-md border border-primary/25 bg-card/60 px-3 py-2">
              <Package className="h-4 w-4 text-primary" />
              <span className="font-display text-xs uppercase tracking-widest text-foreground">
                {visibleProducts.length} produtos
              </span>
            </div>
          </div>

          <div className="relative hidden h-44 overflow-hidden rounded-lg border border-primary/25 bg-card/70 shadow-2xl shadow-black/25 lg:block">
            <Image
              src="/store-background.png"
              alt="Paisagem do velho oeste ao por do sol"
              fill
              sizes="360px"
              className="object-cover object-[68%_center]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/75 via-background/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/20" />
            <span className="absolute bottom-4 left-4 rounded border border-primary/30 bg-background/80 px-3 py-1 font-display text-[0.65rem] uppercase tracking-widest text-primary">
              The Wanted Sole Studio
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
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
                      {getCategoryCount(category, visibleProducts)}
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
