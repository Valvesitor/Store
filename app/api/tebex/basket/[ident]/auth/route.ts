import { NextRequest } from "next/server"
import { getTebexWebstoreToken, tebexRequest } from "@/lib/tebex-server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ident: string }> },
) {
  const token = getTebexWebstoreToken()
  const { ident } = await params
  const returnUrl =
    request.nextUrl.searchParams.get("returnUrl") ||
    `${request.nextUrl.origin}/loja`

  return tebexRequest(
    `/accounts/${token}/baskets/${encodeURIComponent(ident)}/auth?returnUrl=${encodeURIComponent(returnUrl)}`,
  )
}
