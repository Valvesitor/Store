import { NextRequest } from "next/server"
import {
  getPublicSiteOrigin,
  getTebexWebstoreToken,
  tebexRequest,
} from "@/lib/tebex-server"

function safeReturnUrl(request: NextRequest) {
  const origin = getPublicSiteOrigin(request.nextUrl.origin)
  const rawReturnUrl = request.nextUrl.searchParams.get("returnUrl")

  if (!rawReturnUrl) return `${origin}/loja`

  try {
    const url = new URL(rawReturnUrl)
    const allowed = new URL(origin)

    if (url.host === allowed.host) {
      return url.toString()
    }
  } catch {
    // fallback abaixo
  }

  return `${origin}/loja`
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ident: string }> },
) {
  const token = getTebexWebstoreToken()
  const { ident } = await params
  const returnUrl = safeReturnUrl(request)

  return tebexRequest(
    `/accounts/${token}/baskets/${encodeURIComponent(ident)}/auth?returnUrl=${encodeURIComponent(returnUrl)}`,
  )
}
