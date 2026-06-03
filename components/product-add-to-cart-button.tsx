"use client"

import { useState } from "react"
import { CheckCircle2, Loader2, ShoppingBasket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { addProductToTebexCart } from "@/lib/tebex-client"
import type { StoreProduct } from "@/lib/store-data"
import { cn } from "@/lib/utils"

export function ProductAddToCartButton({
  product,
  label = "Adicionar ao carrinho",
  className,
  iconOnly = false,
}: {
  product: StoreProduct
  label?: string
  className?: string
  iconOnly?: boolean
}) {
  const [busy, setBusy] = useState(false)
  const [added, setAdded] = useState(false)

  async function handleAddToCart() {
    try {
      setBusy(true)
      setAdded(false)
      const result = await addProductToTebexCart(product)

      if (result !== null) {
        setAdded(true)
        window.setTimeout(() => setAdded(false), 2400)
      }
    } catch (error) {
      console.error(error)
      window.alert(
        error instanceof Error
          ? error.message
          : "NÃ£o foi possÃ­vel adicionar o produto ao carrinho.",
      )
    } finally {
      setBusy(false)
    }
  }

  const Icon = busy ? Loader2 : added ? CheckCircle2 : ShoppingBasket

  if (iconOnly) {
    return (
      <Button
        size="icon"
        className={cn(
          "h-10 w-10 shrink-0 border border-primary/35 bg-background/70 text-primary hover:border-primary/70 hover:bg-secondary",
          className,
        )}
        aria-label={`Adicionar ${product.title} ao carrinho Tebex`}
        disabled={busy}
        onClick={handleAddToCart}
      >
        <Icon className={cn("h-4 w-4", busy && "animate-spin")} />
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      className={cn(
        "h-12 border-primary/35 bg-background/70 px-7 font-display text-sm uppercase text-foreground hover:border-primary/70 hover:bg-secondary",
        className,
      )}
      disabled={busy}
      onClick={handleAddToCart}
    >
      <Icon className={cn("h-4 w-4", busy && "animate-spin")} />
      {busy ? "Adicionando..." : added ? "Adicionado" : label}
    </Button>
  )
}
