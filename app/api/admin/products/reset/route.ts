import { NextRequest, NextResponse } from "next/server"
import { ADMIN_COOKIE_NAME, isAdminTokenValid } from "@/lib/admin-auth"
import { resetProducts } from "@/lib/product-store"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value

  if (!(await isAdminTokenValid(token))) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  try {
    const products = await resetProducts()
    return NextResponse.json({ products })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao resetar catálogo." },
      { status: 400 },
    )
  }
}
