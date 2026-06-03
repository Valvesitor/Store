import { NextRequest, NextResponse } from "next/server"
import { ADMIN_COOKIE_NAME, isAdminTokenValid } from "@/lib/admin-auth"
import { deleteProduct, updateProduct } from "@/lib/product-store"

export const dynamic = "force-dynamic"

async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value
  return isAdminTokenValid(token)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const products = await updateProduct(id, body)

    return NextResponse.json({ products })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao salvar produto." },
      { status: 400 },
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  try {
    const { id } = await params
    const products = await deleteProduct(id)

    return NextResponse.json({ products })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao excluir produto." },
      { status: 400 },
    )
  }
}
