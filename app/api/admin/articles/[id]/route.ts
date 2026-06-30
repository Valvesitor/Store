import { NextRequest, NextResponse } from "next/server"
import { ADMIN_COOKIE_NAME, isAdminTokenValid } from "@/lib/admin-auth"
import { deleteArticle, updateArticle } from "@/lib/blog-store"

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
    const articles = await updateArticle(id, body)

    return NextResponse.json({ articles })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao salvar artigo." },
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
    const articles = await deleteArticle(id)

    return NextResponse.json({ articles })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao excluir artigo." },
      { status: 400 },
    )
  }
}
