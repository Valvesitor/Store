import { NextRequest, NextResponse } from "next/server"
import { ADMIN_COOKIE_NAME, createAdminSessionToken } from "@/lib/admin-auth"

function safeNextPath(value: FormDataEntryValue | null) {
  const nextPath = String(value || "/admin")

  if (
    nextPath.startsWith("/admin") &&
    nextPath !== "/admin/login" &&
    !nextPath.startsWith("/admin/login?")
  ) {
    return nextPath
  }

  return "/admin"
}

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const adminKey = process.env.ADMIN_ACCESS_KEY?.trim()
  const accessKey = String(formData.get("accessKey") || "").trim()
  const nextPath = safeNextPath(formData.get("next"))
  const loginUrl = new URL("/admin/login", request.url)
  loginUrl.searchParams.set("next", nextPath)

  if (!adminKey) {
    loginUrl.searchParams.set("erro", "config")
    return NextResponse.redirect(loginUrl)
  }

  if (accessKey !== adminKey) {
    loginUrl.searchParams.set("erro", "invalid")
    return NextResponse.redirect(loginUrl)
  }

  const response = NextResponse.redirect(new URL(nextPath, request.url))
  response.cookies.set(
    ADMIN_COOKIE_NAME,
    await createAdminSessionToken(adminKey),
    {
      httpOnly: true,
      maxAge: 60 * 60 * 8,
      path: "/admin",
      sameSite: "strict",
      secure: request.nextUrl.protocol === "https:",
    },
  )

  return response
}
