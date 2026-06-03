import { getRuntimeEnvValue } from "@/lib/cloudflare-env"

const TEBEX_API_BASE = "https://headless.tebex.io/api"

type TebexPackagePayload = {
  id?: number | string
  base_price?: number | string | null
  total_price?: number | string | null
  price?: number | string | null
  currency?: string | null
}

function cleanUrl(value?: string | null) {
  if (!value) return undefined
  try {
    const url = new URL(value)
    return `${url.protocol}//${url.host}`
  } catch {
    return undefined
  }
}

export function getPublicSiteOrigin(fallbackOrigin?: string) {
  return (
    cleanUrl(getRuntimeEnvValue("NEXT_PUBLIC_SITE_URL")) ||
    cleanUrl(getRuntimeEnvValue("VITE_ACCOUNT_API_BASE_URL")) ||
    cleanUrl(fallbackOrigin) ||
    fallbackOrigin ||
    "https://thewantedsolestudio.com"
  )
}

export function getTebexWebstoreToken() {
  const token =
    getRuntimeEnvValue("TEBEX_WEBSTORE_TOKEN") ||
    getRuntimeEnvValue("VITE_TEBEX_WEBSTORE_TOKEN")

  if (!token) {
    throw new Error(
      "Configure TEBEX_WEBSTORE_TOKEN e VITE_TEBEX_WEBSTORE_TOKEN nas variáveis do Cloudflare.",
    )
  }

  return token.trim()
}

function packagePayload(value: unknown): TebexPackagePayload | undefined {
  if (!value || typeof value !== "object") return undefined

  const record = value as Record<string, unknown>
  const data = record.data

  if (Array.isArray(data)) {
    return packagePayload(data[0])
  }

  if (data && typeof data === "object") {
    return data as TebexPackagePayload
  }

  return record as TebexPackagePayload
}

function numberFromPrice(value: unknown) {
  const number = Number(value)
  return Number.isFinite(number) ? number : undefined
}

export function formatTebexPrice(
  amount: number,
  currency = "BRL",
  locale = "pt-BR",
) {
  try {
    return new Intl.NumberFormat(locale, {
      currency: currency.toUpperCase(),
      style: "currency",
    }).format(amount)
  } catch {
    return `${currency.toUpperCase()} ${amount.toFixed(2)}`
  }
}

export async function getTebexPackagePrice(packageId?: string | null) {
  const id = packageId?.trim()
  if (!id) return undefined

  try {
    const token = getTebexWebstoreToken()
    const response = await fetch(
      `${TEBEX_API_BASE}/accounts/${token}/packages/${encodeURIComponent(id)}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 300 },
      },
    )

    if (!response.ok) return undefined

    const payload = packagePayload(await response.json())
    const amount =
      numberFromPrice(payload?.total_price) ??
      numberFromPrice(payload?.base_price) ??
      numberFromPrice(payload?.price)

    if (amount === undefined) return undefined

    const currency =
      typeof payload?.currency === "string" && payload.currency.trim()
        ? payload.currency.trim()
        : "BRL"

    return {
      amount,
      currency,
      formatted: formatTebexPrice(amount, currency),
    }
  } catch {
    return undefined
  }
}

export async function tebexRequest(path: string, init?: RequestInit) {
  if (!path.startsWith("/accounts/") && !path.startsWith("/baskets/")) {
    return Response.json({ error: "Rota Tebex não permitida." }, { status: 400 })
  }

  try {
    const response = await fetch(`${TEBEX_API_BASE}${path}`, {
      method: init?.method ?? "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      body: init?.body,
    })

    const text = await response.text()

    return new Response(text, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/json",
      },
    })
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Não foi possível comunicar com a Tebex.",
      },
      { status: 502 },
    )
  }
}
