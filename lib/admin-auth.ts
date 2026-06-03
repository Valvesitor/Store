export const ADMIN_COOKIE_NAME = "tws_admin_session"

export async function createAdminSessionToken(secret: string) {
  const payload = new TextEncoder().encode(`tws-admin-v1:${secret}`)
  const digest = await crypto.subtle.digest("SHA-256", payload)

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}
