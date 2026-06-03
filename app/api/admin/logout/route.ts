import { NextResponse } from "next/server"
import { ADMIN_COOKIE_NAME } from "@/lib/admin-auth"

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url))
  response.cookies.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
  })

  return response
}
