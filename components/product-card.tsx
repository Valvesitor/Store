"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Star } from "lucide-react"
import { ProductAddToCartButton } from "@/components/product-add-to-cart-button"
import { productToSlug, type StoreProduct } from "@/lib/store-data"

function Stars({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={
              i < rating
                ? "h-3.5 w-3.5 fill-primary text-primary"
                : "h-3.5 w-3.5 text-muted-foreground/40"
            }
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">({reviews})</span>
    </div>
  )
}

export function ProductCard({ product }: { product: StoreProduct }) {
  const href = `/produtos/${productToSlug(product)}`

  return (
    <article className="group flex min-h-full flex-col overflow-hidden rounded-lg border border-border bg-card/80 transition-colors hover:border-primary/50">
      <Link
        href={href}
        className="relative block aspect-[4/3] overflow-hidden bg-[#0f0f10]"
      >
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.title}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
          className="object-contain p-4 transition-opacity duration-300 group-hover:opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/25 to-transparent" />
        <span className="absolute left-3 top-3 rounded border border-primary/30 bg-background/85 px-2 py-1 font-display text-[0.65rem] text-primary">
          {product.badge || product.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="font-display text-[0.65rem] text-muted-foreground">
            {product.category}
          </p>
          <Link href={href}>
            <h3 className="mt-1 font-display text-base font-semibold text-foreground transition-colors hover:text-primary">
              {product.title}
            </h3>
          </Link>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {product.subtitle}
          </p>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div>
            <p className="font-display text-xl font-bold text-primary">
              {product.price}
            </p>
            <Stars rating={product.rating} reviews={product.reviews} />
          </div>
          <ProductAddToCartButton product={product} iconOnly />
        </div>
        <Link
          href={href}
          className="inline-flex w-fit items-center gap-2 font-display text-xs uppercase text-muted-foreground transition-colors hover:text-primary"
        >
          Ver detalhes
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  )
}
