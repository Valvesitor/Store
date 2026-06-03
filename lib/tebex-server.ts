import { getRuntimeEnvValue } from "@/lib/cloudflare-env"

const TEBEX_API_BASE = "https://headless.tebex.io/api"

export function getTebexWebstoreToken() {
  const token =
    getRuntimeEnvValue("TEBEX_WEBSTORE_TOKEN") ||
    getRuntimeEnvValue("VITE_TEBEX_WEBSTORE_TOKEN")

  if (!token) {
    throw new Error(
      "Configure TEBEX_WEBSTORE_TOKEN e VITE_TEBEX_WEBSTORE_TOKEN nas variáveis do Cloudflare.",
    )
  }

  return token
}

export async function tebexRequest(path: string, init?: RequestInit) {
  if (!path.startsWith("/accounts/") && !path.startsWith("/baskets/")) {
    return Response.json({ error: "Rota Tebex não permitida." }, { status: 400 })
  }

  const response = await fetch(`${TEBEX_API_BASE}${path}`, {
    method: init?.method ?? "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    body: init?.body,
  })

  const text = await response.text()

  return new Response(text, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") || "application/json",
    },
  })
}
