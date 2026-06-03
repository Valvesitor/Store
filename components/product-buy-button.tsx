"use client"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { startTebexProductCheckout } from "@/lib/tebex-client"
import type { StoreProduct } from "@/lib/store-data"
import { cn } from "@/lib/utils"

export function ProductBuyButton({
  product,
  label = "Comprar",
  iconOnly = false,
  className,
}: {
  product: StoreProduct
  label?: string
  iconOnly?: boolean
  className?: string
}) {
  const [busy, setBusy] = useState(false)

  async function handleBuy() {
    try {
      setBusy(true)
      await startTebexProductCheckout(product)
    } catch (error) {
      console.error(error)
      window.alert(
        error instanceof Error
          ? error.message
          : "Não foi possível iniciar a compra pela Tebex.",
      )
    } finally {
      setBusy(false)
    }
  }

  if (iconOnly) {
    return (
      <Button
        size="icon"
        className={cn(
          "h-10 w-10 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90",
          className,
        )}
        aria-label={`Comprar ${product.title} pela Tebex`}
        disabled={busy}
        onClick={handleBuy}
      >
        <ShoppingCart className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      className={cn(
        "h-12 bg-primary px-7 font-display text-sm uppercase text-primary-foreground hover:bg-primary/90",
        className,
      )}
      disabled={busy}
      onClick={handleBuy}
    >
      <ShoppingCart className="h-4 w-4" />
      {busy ? "Abrindo..." : label}
    </Button>
  )
}
