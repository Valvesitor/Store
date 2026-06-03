import { NextRequest } from "next/server"
import { getTebexWebstoreToken, tebexRequest } from "@/lib/tebex-server"

export async function POST(request: NextRequest) {
  const token = getTebexWebstoreToken()
  const origin = request.nextUrl.origin
  const body = await request.json().catch(() => ({}))

  return tebexRequest(`/accounts/${token}/baskets`, {
    method: "POST",
    body: JSON.stringify({
      complete_url: body.completeUrl || `${origin}/conta?checkout=complete`,
      cancel_url: body.cancelUrl || `${origin}/loja`,
      complete_auto_redirect: false,
    }),
  })
}
