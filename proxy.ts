import { NextRequest, NextResponse } from "next/server"
import { ADMIN_COOKIE_NAME, createAdminSessionToken } from "@/lib/admin-auth"

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return NextResponse.next()
  }

  const adminKey = process.env.ADMIN_ACCESS_KEY?.trim()
  const loginUrl = new URL("/admin/login", request.url)
  loginUrl.searchParams.set("next", `${pathname}${search}`)

  if (!adminKey) {
    loginUrl.searchParams.set("erro", "config")
    return NextResponse.redirect(loginUrl)
  }

  const session = request.cookies.get(ADMIN_COOKIE_NAME)?.value
  const expectedSession = await createAdminSessionToken(adminKey)

  if (session !== expectedSession) {
    loginUrl.searchParams.set("erro", "login")
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
