import { NextRequest, NextResponse } from "next/server"
import { ADMIN_COOKIE_NAME, isAdminTokenValid } from "@/lib/admin-auth"
import {
  createProduct,
  getProductPersistence,
  getProducts,
} from "@/lib/product-store"

export const dynamic = "force-dynamic"

async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value
  return isAdminTokenValid(token)
}

export async function GET(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  return NextResponse.json({
    products: await getProducts(),
    persistence: getProductPersistence(),
  })
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  try {
    const body = await request.json()
    const products = await createProduct(body)

    return NextResponse.json({ products })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao criar produto." },
      { status: 400 },
    )
  }
}
