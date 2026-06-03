import { NextRequest, NextResponse } from "next/server"
import { getPublicSiteOrigin, getTebexWebstoreToken } from "@/lib/tebex-server"

export async function GET(request: NextRequest) {
  const token = getTebexWebstoreToken()
  const origin = getPublicSiteOrigin(request.nextUrl.origin)

  const basketResponse = await fetch(
    `https://headless.tebex.io/api/accounts/${token}/baskets`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        complete_url: `${origin}/loja?checkout=complete`,
        cancel_url: `${origin}/login`,
        complete_auto_redirect: false,
      }),
    },
  )

  if (!basketResponse.ok) {
    return NextResponse.redirect(new URL("/login?tebex=error", origin))
  }

  const basketPayload = await basketResponse.json()
  const basketIdent = basketPayload?.data?.ident || basketPayload?.ident

  if (!basketIdent) {
    return NextResponse.redirect(new URL("/login?tebex=error", origin))
  }

  const returnUrl = new URL("/login", origin)
  returnUrl.searchParams.set("tebexBasket", basketIdent)

  const authResponse = await fetch(
    `https://headless.tebex.io/api/accounts/${token}/baskets/${basketIdent}/auth?returnUrl=${encodeURIComponent(returnUrl.toString())}`,
    { headers: { Accept: "application/json" } },
  )

  if (!authResponse.ok) {
    return NextResponse.redirect(new URL("/login?tebex=error", origin))
  }

  const authPayload = await authResponse.json()
  const authData = Array.isArray(authPayload?.data)
    ? authPayload.data[0]
    : authPayload?.data || authPayload?.[0]

  if (!authData?.url) {
    return NextResponse.redirect(new URL("/login?tebex=error", origin))
  }

  return NextResponse.redirect(authData.url)
}
