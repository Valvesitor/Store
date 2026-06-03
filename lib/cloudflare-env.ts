import { getCloudflareContext } from "@opennextjs/cloudflare"

type RuntimeEnv = Record<string, unknown>

export function getRuntimeEnvValue(name: string) {
  const fromProcess = process.env[name]

  if (typeof fromProcess === "string" && fromProcess.trim()) {
    return fromProcess.trim()
  }

  try {
    const context = getCloudflareContext()
    const value = (context.env as RuntimeEnv | undefined)?.[name]

    if (typeof value === "string" && value.trim()) {
      return value.trim()
    }
  } catch {
    // Em next build/local sem runtime Cloudflare, getCloudflareContext pode falhar.
  }

  return undefined
}
