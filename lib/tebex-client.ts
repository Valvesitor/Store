"use client"

import type { StoreProduct } from "@/lib/store-data"

const TEBEX_BASKET_KEY = "tws_tebex_basket"
const TEBEX_CART_COUNT_KEY = "tws_tebex_cart_count"

type TebexCheckout = {
  init: (options: {
    ident: string
    locale?: string
    theme?: "light" | "dark"
    colors?: Array<{ name: string; color: string }>
    closeOnPaymentComplete?: boolean
  }) => void
  launch: () => void
}

declare global {
  interface Window {
    Tebex?: {
      checkout?: TebexCheckout
    }
  }
}

async function apiJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(
      payload?.message ||
        payload?.detail ||
        payload?.error ||
        "Não foi possível comunicar com a Tebex.",
    )
  }

  return payload
}

export function getStoredTebexBasket() {
  return window.localStorage.getItem(TEBEX_BASKET_KEY)
}

export function storeTebexBasket(basketIdent: string) {
  window.localStorage.setItem(TEBEX_BASKET_KEY, basketIdent)
  window.dispatchEvent(new Event("tws:tebex-session-changed"))
}

export function clearTebexBasket() {
  window.localStorage.removeItem(TEBEX_BASKET_KEY)
  window.localStorage.removeItem(TEBEX_CART_COUNT_KEY)
  window.dispatchEvent(new Event("tws:tebex-session-changed"))
  window.dispatchEvent(new Event("tws:tebex-cart-changed"))
}

export function getStoredTebexCartCount() {
  const count = Number(window.localStorage.getItem(TEBEX_CART_COUNT_KEY) || 0)
  return Number.isFinite(count) && count > 0 ? count : 0
}

export function storeTebexCartCount(count: number) {
  const nextCount = Number.isFinite(count) && count > 0 ? Math.floor(count) : 0

  if (nextCount > 0) {
    window.localStorage.setItem(TEBEX_CART_COUNT_KEY, String(nextCount))
  } else {
    window.localStorage.removeItem(TEBEX_CART_COUNT_KEY)
  }

  window.dispatchEvent(new Event("tws:tebex-cart-changed"))
}

function bumpStoredTebexCartCount() {
  storeTebexCartCount(getStoredTebexCartCount() + 1)
}

export async function createTebexBasket() {
  const payload = await apiJson<{ data?: { ident?: string }; ident?: string }>(
    "/api/tebex/basket",
    {
      method: "POST",
      body: JSON.stringify({
        completeUrl: `${window.location.origin}/loja?checkout=complete`,
        cancelUrl: window.location.href,
      }),
    },
  )

  const ident = payload.data?.ident || payload.ident

  if (!ident) {
    throw new Error("A Tebex não retornou o identificador do carrinho.")
  }

  return ident
}

export async function createFreshTebexBasket() {
  clearTebexBasket()
  const ident = await createTebexBasket()
  storeTebexBasket(ident)
  return ident
}

export async function getOrCreateTebexBasket() {
  const existing = getStoredTebexBasket()
  if (existing) return existing

  const ident = await createTebexBasket()
  storeTebexBasket(ident)
  return ident
}

export async function addPackageToTebexBasket(
  basketIdent: string,
  packageId: string,
) {
  await apiJson(`/api/tebex/basket/${encodeURIComponent(basketIdent)}/packages`, {
    method: "POST",
    body: JSON.stringify({ packageId, quantity: 1 }),
  })

  bumpStoredTebexCartCount()
  return basketIdent
}

export async function removePackageFromTebexBasket(
  basketIdent: string,
  packageId: string,
) {
  const payload = await apiJson<{ data?: unknown } | unknown>(
    `/api/tebex/basket/${encodeURIComponent(basketIdent)}/packages`,
    {
      method: "DELETE",
      body: JSON.stringify({ packageId }),
    },
  )

  return typeof payload === "object" && payload && "data" in payload
    ? (payload as { data?: unknown }).data
    : payload
}

export async function fetchTebexBasket(basketIdent: string) {
  const payload = await apiJson<{ data?: unknown } | unknown>(
    `/api/tebex/basket/${encodeURIComponent(basketIdent)}`,
  )

  return typeof payload === "object" && payload && "data" in payload
    ? (payload as { data?: unknown }).data
    : payload
}

function buildReturnUrl(returnPath = "/loja") {
  try {
    return new URL(returnPath, window.location.origin)
  } catch {
    return new URL("/loja", window.location.origin)
  }
}

export async function getTebexAuthUrl(
  basketIdent: string,
  packageId?: string,
  returnPath = "/loja",
  action: "checkout" | "cart" = "checkout",
) {
  const returnUrl = buildReturnUrl(returnPath)
  returnUrl.searchParams.set("tebexBasket", basketIdent)
  returnUrl.searchParams.set("tebexAction", action)

  if (packageId) {
    returnUrl.searchParams.set("tebexPackage", packageId)
  }

  const payload = await apiJson<
    { data?: { url?: string } | Array<{ url?: string }> } | Array<{ url?: string }>
  >(
    `/api/tebex/basket/${encodeURIComponent(basketIdent)}/auth?returnUrl=${encodeURIComponent(returnUrl.toString())}`,
  )

  const data = Array.isArray(payload)
    ? payload[0]
    : Array.isArray(payload.data)
      ? payload.data[0]
      : payload.data

  if (!data?.url) {
    throw new Error("A Tebex não retornou a URL de autenticação.")
  }

  return data.url
}

export async function startTebexLogin(returnPath = "/login") {
  // CFX/Tebex costuma falhar quando o basket antigo fica salvo no navegador.
  // Para login manual, sempre cria uma basket nova.
  const basketIdent = await createFreshTebexBasket()
  const authUrl = await getTebexAuthUrl(basketIdent, undefined, returnPath)
  window.location.href = authUrl
}

function isTebexLoginRequiredError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error ?? "")
  const normalized = message.toLowerCase()

  return (
    normalized.includes("must login") ||
    normalized.includes("must log in") ||
    normalized.includes("login before") ||
    normalized.includes("log in before") ||
    normalized.includes("before adding packages") ||
    normalized.includes("unauthorized") ||
    normalized.includes("not authenticated") ||
    normalized.includes("username") ||
    normalized.includes("authentication")
  )
}

export async function addProductToTebexCart(product: StoreProduct) {
  if (!product.packageId) {
    if (product.tebexUrl) {
      window.open(product.tebexUrl, "_blank", "noopener,noreferrer")
      return null
    }

    throw new Error("Produto ainda não configurado com packageId da Tebex.")
  }

  let basketIdent = await getOrCreateTebexBasket()

  try {
    await addPackageToTebexBasket(basketIdent, product.packageId)
    storeTebexBasket(basketIdent)
    return fetchTebexBasket(basketIdent)
  } catch (error) {
    if (isTebexLoginRequiredError(error)) {
      // Evita reutilizar basket antiga/stale no retorno da CFX.re.
      basketIdent = await createFreshTebexBasket()
      const authUrl = await getTebexAuthUrl(
        basketIdent,
        product.packageId,
        window.location.pathname,
        "cart",
      )
      window.location.href = authUrl
      return null
    }

    clearTebexBasket()
    throw error
  }
}

export async function startTebexProductCheckout(product: StoreProduct) {
  if (!product.packageId) {
    if (product.tebexUrl) {
      window.open(product.tebexUrl, "_blank", "noopener,noreferrer")
      return
    }

    throw new Error("Produto ainda não configurado com packageId da Tebex.")
  }

  const basketIdent = await createFreshTebexBasket()
  const authUrl = await getTebexAuthUrl(basketIdent, product.packageId, "/loja")
  window.location.href = authUrl
}

export async function launchTebexCheckoutFromBasket(
  basketIdent: string,
  packageId?: string,
) {
  if (packageId) {
    await addPackageToTebexBasket(basketIdent, packageId)
  }

  if (!window.Tebex?.checkout) {
    const basket = await fetchTebexBasket(basketIdent)
    const checkoutUrl =
      (basket as { links?: { checkout?: string } } | null)?.links?.checkout

    if (checkoutUrl) {
      window.location.href = checkoutUrl
      return
    }

    throw new Error("Tebex.js ainda não carregou. Tente novamente em alguns segundos.")
  }

  window.Tebex.checkout.init({
    ident: basketIdent,
    locale: "pt_BR",
    theme: "dark",
    colors: [
      { name: "primary", color: "#e08a2c" },
      { name: "secondary", color: "#0a0a0b" },
    ],
    closeOnPaymentComplete: false,
  })
  window.Tebex.checkout.launch()
}

export async function openTebexCart() {
  const basketIdent = getStoredTebexBasket()

  if (!basketIdent) {
    await startTebexLogin("/loja")
    return
  }

  await launchTebexCheckoutFromBasket(basketIdent)
}
