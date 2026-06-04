"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import {
  AlertCircle,
  ArrowRight,
  Loader2,
  PackageX,
  RefreshCw,
  ShoppingCart,
  Store,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  clearTebexBasket,
  fetchTebexBasket,
  getStoredTebexBasket,
  launchTebexCheckoutFromBasket,
  removePackageFromTebexBasket,
  storeTebexCartCount,
} from "@/lib/tebex-client"
import { cn } from "@/lib/utils"

type CartState =
  | { status: "loading"; basketIdent?: string }
  | { status: "empty" }
  | { status: "ready"; basketIdent: string; basket: unknown }
  | { status: "error"; basketIdent?: string; message: string }

type CartItem = {
  packageId?: string
  name: string
  quantity: number
  unitPrice?: number
  totalPrice?: number
  currency?: string
}

function asRecord(value: unknown) {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : undefined
}

function readPath(value: unknown, path: string[]) {
  let current: unknown = value

  for (const key of path) {
    const record = asRecord(current)
    if (!record) return undefined
    current = record[key]
  }

  return current
}

function displayString(value: unknown) {
  if (typeof value === "string" && value.trim()) return value.trim()
  if (typeof value === "number" && Number.isFinite(value)) return String(value)
  return undefined
}

function numberValue(value: unknown) {
  const number = Number(value)
  return Number.isFinite(number) ? number : undefined
}

function formatPrice(value?: number, currency = "BRL") {
  if (value === undefined) return "Tebex"

  try {
    return new Intl.NumberFormat("pt-BR", {
      currency: currency.toUpperCase(),
      style: "currency",
    }).format(value)
  } catch {
    return `${currency.toUpperCase()} ${value.toFixed(2)}`
  }
}

function basketPackages(basket: unknown) {
  const packages =
    readPath(basket, ["packages"]) ||
    readPath(basket, ["basket", "packages"]) ||
    readPath(basket, ["data", "packages"])

  return Array.isArray(packages) ? packages : []
}

function packageFromItem(item: unknown) {
  return (
    readPath(item, ["package"]) ||
    readPath(item, ["product"]) ||
    readPath(item, ["details"]) ||
    item
  )
}

function parseCartItems(basket: unknown): CartItem[] {
  const currency =
    displayString(readPath(basket, ["currency"])) ||
    displayString(readPath(basket, ["basket", "currency"])) ||
    "BRL"

  return basketPackages(basket).map((item, index) => {
    const pack = packageFromItem(item)
    const quantity =
      numberValue(readPath(item, ["qty"])) ||
      numberValue(readPath(item, ["quantity"])) ||
      1
    const packageId =
      displayString(readPath(pack, ["id"])) ||
      displayString(readPath(item, ["package_id"])) ||
      displayString(readPath(item, ["id"]))
    const name =
      displayString(readPath(pack, ["name"])) ||
      displayString(readPath(item, ["name"])) ||
      `Package ${packageId || index + 1}`
    const itemCurrency =
      displayString(readPath(pack, ["currency"])) ||
      displayString(readPath(item, ["currency"])) ||
      currency
    const unitPrice =
      numberValue(readPath(item, ["price"])) ||
      numberValue(readPath(item, ["base_price"])) ||
      numberValue(readPath(pack, ["total_price"])) ||
      numberValue(readPath(pack, ["base_price"])) ||
      numberValue(readPath(pack, ["price"]))
    const totalPrice =
      numberValue(readPath(item, ["total_price"])) ||
      numberValue(readPath(item, ["base_price"])) ||
      (unitPrice !== undefined ? unitPrice * quantity : undefined)

    return {
      packageId,
      name,
      quantity,
      unitPrice,
      totalPrice,
      currency: itemCurrency,
    }
  })
}

function basketTotal(basket: unknown, items: CartItem[]) {
  const total =
    numberValue(readPath(basket, ["total_price"])) ||
    numberValue(readPath(basket, ["basket", "total_price"])) ||
    numberValue(readPath(basket, ["base_price"])) ||
    numberValue(readPath(basket, ["basket", "base_price"]))

  if (total !== undefined) return total

  const sum = items.reduce((value, item) => value + (item.totalPrice ?? 0), 0)
  return sum > 0 ? sum : undefined
}

function basketCurrency(basket: unknown, items: CartItem[]) {
  return (
    displayString(readPath(basket, ["currency"])) ||
    displayString(readPath(basket, ["basket", "currency"])) ||
    items.find((item) => item.currency)?.currency ||
    "BRL"
  )
}

export function TebexCartPanel() {
  const [cart, setCart] = useState<CartState>({ status: "loading" })
  const [busyPackage, setBusyPackage] = useState("")
  const [checkoutBusy, setCheckoutBusy] = useState(false)

  const loadCart = useCallback(async () => {
    const basketIdent = getStoredTebexBasket()

    if (!basketIdent) {
      setCart({ status: "empty" })
      storeTebexCartCount(0)
      return
    }

    setCart({ status: "loading", basketIdent })

    try {
      const basket = await fetchTebexBasket(basketIdent)
      const items = parseCartItems(basket)
      storeTebexCartCount(
        items.reduce((total, item) => total + item.quantity, 0),
      )
      setCart({ status: items.length > 0 ? "ready" : "empty", basketIdent, basket })
    } catch (error) {
      setCart({
        status: "error",
        basketIdent,
        message:
          error instanceof Error
            ? error.message
            : "Nao foi possivel carregar o carrinho.",
      })
    }
  }, [])

  useEffect(() => {
    loadCart()
  }, [loadCart])

  const items = useMemo(
    () => (cart.status === "ready" ? parseCartItems(cart.basket) : []),
    [cart],
  )
  const currency = cart.status === "ready" ? basketCurrency(cart.basket, items) : "BRL"
  const total = cart.status === "ready" ? basketTotal(cart.basket, items) : undefined
  const summaryTotal = items.length > 0 ? formatPrice(total, currency) : formatPrice(0, currency)

  async function removeItem(packageId?: string) {
    if (!packageId || cart.status !== "ready") return

    setBusyPackage(packageId)

    try {
      const basket = await removePackageFromTebexBasket(cart.basketIdent, packageId)
      const nextItems = parseCartItems(basket)
      storeTebexCartCount(
        nextItems.reduce((totalItems, item) => totalItems + item.quantity, 0),
      )
      setCart(
        nextItems.length > 0
          ? { status: "ready", basketIdent: cart.basketIdent, basket }
          : { status: "empty" },
      )
    } catch (error) {
      setCart({
        status: "error",
        basketIdent: cart.basketIdent,
        message:
          error instanceof Error
            ? error.message
            : "Nao foi possivel remover o item.",
      })
    } finally {
      setBusyPackage("")
    }
  }

  async function checkout() {
    if (cart.status !== "ready") return

    setCheckoutBusy(true)

    try {
      await launchTebexCheckoutFromBasket(cart.basketIdent)
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Nao foi possivel abrir o checkout.",
      )
    } finally {
      setCheckoutBusy(false)
    }
  }

  function clearCart() {
    clearTebexBasket()
    setCart({ status: "empty" })
  }

  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div className="relative mx-auto grid w-full max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <div>
          <p className="font-display text-xs uppercase tracking-[0.28em] text-primary">
            Carrinho Tebex
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-tight text-foreground sm:text-5xl">
            Revise sua compra
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            Confira os produtos adicionados antes de abrir o checkout seguro da
            Tebex.
          </p>

          <div className="mt-8 overflow-hidden rounded-lg border border-border bg-card/75">
            {cart.status === "loading" && (
              <div className="flex min-h-64 items-center justify-center gap-3 p-8 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                Carregando carrinho...
              </div>
            )}

            {cart.status === "empty" && (
              <div className="grid min-h-64 place-items-center p-8 text-center">
                <div>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-md border border-border bg-background/70 text-primary">
                    <PackageX className="h-6 w-6" />
                  </div>
                  <h2 className="mt-5 font-display text-2xl font-bold uppercase text-foreground">
                    Carrinho vazio
                  </h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                    Adicione um produto da loja para ver o resumo aqui antes do
                    checkout.
                  </p>
                  <Button
                    className="mt-5 h-11 bg-primary px-5 font-display text-xs uppercase text-primary-foreground hover:bg-primary/90"
                    asChild
                  >
                    <Link href="/loja">
                      <Store className="h-4 w-4" />
                      Ver loja
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            {cart.status === "error" && (
              <div className="grid gap-4 p-6">
                <div className="rounded-md border border-destructive/35 bg-destructive/10 p-4">
                  <div className="flex gap-3 text-sm leading-6 text-muted-foreground">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                    <span>{cart.message}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    className="h-10 border-border bg-background/70 font-display text-xs uppercase text-foreground hover:border-primary/60"
                    onClick={loadCart}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Tentar de novo
                  </Button>
                  <Button
                    variant="outline"
                    className="h-10 border-border bg-background/70 font-display text-xs uppercase text-foreground hover:border-primary/60"
                    onClick={clearCart}
                  >
                    <Trash2 className="h-4 w-4" />
                    Limpar carrinho
                  </Button>
                </div>
              </div>
            )}

            {cart.status === "ready" && (
              <div className="divide-y divide-border">
                {items.map((item, index) => (
                  <div
                    key={`${item.packageId || item.name}-${index}`}
                    className="grid gap-4 p-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-md border border-primary/25 bg-primary/10 text-primary">
                      <ShoppingCart className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="font-display text-lg font-bold uppercase text-foreground">
                        {item.name}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span className="rounded border border-border bg-background/50 px-2 py-1">
                          Qtd. {item.quantity}
                        </span>
                        {item.packageId && (
                          <span className="rounded border border-border bg-background/50 px-2 py-1">
                            Package #{item.packageId}
                          </span>
                        )}
                        <span className="rounded border border-border bg-background/50 px-2 py-1">
                          Unidade {formatPrice(item.unitPrice, item.currency)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <p className="font-display text-xl font-bold text-primary">
                        {formatPrice(item.totalPrice, item.currency)}
                      </p>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className="h-9 w-9 border-red-500/30 bg-background/70 text-red-300 hover:border-red-500/60 hover:text-red-200"
                        onClick={() => removeItem(item.packageId)}
                        disabled={!item.packageId || busyPackage === item.packageId}
                        aria-label={`Remover ${item.name}`}
                      >
                        {busyPackage === item.packageId ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg border border-primary/25 bg-card/85 p-5 shadow-2xl shadow-black/30">
            <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">
              Resumo
            </p>
            <div className="mt-5 grid gap-3 text-sm">
              <div className="flex items-center justify-between border-b border-border pb-3 text-muted-foreground">
                <span>Itens</span>
                <span className="text-foreground">
                  {items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-3 text-muted-foreground">
                <span>Total</span>
                <span className="font-display text-2xl font-bold text-primary">
                  {summaryTotal}
                </span>
              </div>
            </div>

            <Button
              className={cn(
                "mt-5 h-12 w-full bg-primary font-display text-sm uppercase text-primary-foreground hover:bg-primary/90",
                cart.status !== "ready" && "opacity-60",
              )}
              disabled={cart.status !== "ready" || checkoutBusy}
              onClick={checkout}
            >
              {checkoutBusy ? "Abrindo..." : "Finalizar compra"}
              {checkoutBusy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="outline"
              className="mt-3 h-11 w-full border-border bg-background/60 font-display text-xs uppercase text-foreground hover:border-primary/60"
              asChild
            >
              <Link href="/loja">
                <Store className="h-4 w-4" />
                Continuar comprando
              </Link>
            </Button>

            {cart.status === "ready" && (
              <Button
                variant="outline"
                className="mt-3 h-10 w-full border-red-500/30 bg-background/60 font-display text-xs uppercase text-red-300 hover:border-red-500/60 hover:text-red-200"
                onClick={clearCart}
              >
                <Trash2 className="h-4 w-4" />
                Limpar carrinho
              </Button>
            )}
          </div>
        </aside>
      </div>
    </section>
  )
}
