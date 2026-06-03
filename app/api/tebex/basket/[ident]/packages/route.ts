import { tebexRequest } from "@/lib/tebex-server"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ ident: string }> },
) {
  const { ident } = await params
  const body = await request.json()

  if (!body.packageId) {
    return Response.json({ error: "packageId é obrigatório." }, { status: 400 })
  }

  return tebexRequest(`/baskets/${encodeURIComponent(ident)}/packages`, {
    method: "POST",
    body: JSON.stringify({
      package_id: String(body.packageId),
      quantity: Number(body.quantity || 1),
    }),
  })
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ ident: string }> },
) {
  const { ident } = await params
  const body = await request.json()

  if (!body.packageId) {
    return Response.json({ error: "packageId Ã© obrigatÃ³rio." }, { status: 400 })
  }

  return tebexRequest(`/baskets/${encodeURIComponent(ident)}/packages/remove`, {
    method: "POST",
    body: JSON.stringify({
      package_id: String(body.packageId),
    }),
  })
}
