import { getTebexWebstoreToken, tebexRequest } from "@/lib/tebex-server"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ident: string }> },
) {
  const token = getTebexWebstoreToken()
  const { ident } = await params

  return tebexRequest(`/accounts/${token}/baskets/${encodeURIComponent(ident)}`)
}
