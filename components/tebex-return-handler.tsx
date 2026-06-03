"use client"

import { useEffect } from "react"
import {
  addPackageToTebexBasket,
  launchTebexCheckoutFromBasket,
  storeTebexBasket,
} from "@/lib/tebex-client"

export function TebexReturnHandler() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const basketIdent = params.get("tebexBasket")
    const packageId = params.get("tebexPackage")
    const action = params.get("tebexAction")

    if (!basketIdent) return

    storeTebexBasket(basketIdent)

    const cleanUrl = new URL(window.location.href)
    cleanUrl.searchParams.delete("tebexBasket")
    cleanUrl.searchParams.delete("tebexPackage")
    cleanUrl.searchParams.delete("tebexAction")
    window.history.replaceState(null, "", cleanUrl)

    if (!packageId) return

    if (action === "cart") {
      addPackageToTebexBasket(basketIdent, packageId)
        .then(() => {
          window.alert("Produto adicionado ao carrinho Tebex.")
        })
        .catch((error) => {
          console.error(error)
          window.alert(
            error instanceof Error
              ? error.message
              : "NÃ£o foi possÃ­vel adicionar o produto ao carrinho.",
          )
        })
      return
    }

    launchTebexCheckoutFromBasket(basketIdent, packageId).catch((error) => {
      console.error(error)
      window.alert(
        error instanceof Error
          ? error.message
          : "Não foi possível abrir o checkout da Tebex.",
      )
    })
  }, [])

  return null
}
