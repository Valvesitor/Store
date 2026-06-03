import { getRuntimeEnvValue } from "@/lib/cloudflare-env"

export const ADMIN_COOKIE_NAME = "tws_admin_session"

export function getAdminAccessKey() {
  return getRuntimeEnvValue("ADMIN_ACCESS_KEY")
}

export async function createAdminSessionToken(secret: string) {
  const payload = new TextEncoder().encode(`tws-admin-v1:${secret}`)
  const digest = await crypto.subtle.digest("SHA-256", payload)

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

export async function isAdminSessionValid(secret: string, token?: string) {
  if (!token) return false
  return token === (await createAdminSessionToken(secret))
}
