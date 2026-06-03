function asRecord(value: unknown) {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : undefined
}

function readPath(value: unknown, path: string[]) {
  let current: unknown = value

  for (const key of path) {
    const record = asRecord(current)
    if (!record) return undefined
    current = record[key]
  }

  return current
}

function asDisplayString(value: unknown) {
  if (typeof value === "string") {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : undefined
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value)
  }

  return undefined
}

export function getBasketUsername(basket: unknown) {
  const candidates = [
    ["username"],
    ["name"],
    ["ign"],
    ["player", "username"],
    ["player", "name"],
    ["user", "username"],
    ["user", "name"],
    ["customer", "username"],
    ["customer", "name"],
    ["account", "username"],
    ["account", "name"],
  ]

  for (const path of candidates) {
    const direct = asDisplayString(readPath(basket, path))
    if (direct) return direct

    const nested = asDisplayString(readPath(basket, [...path, "username"]))
    if (nested) return nested
  }

  return undefined
}

export function getBasketPackageCount(basket: unknown) {
  const packages =
    readPath(basket, ["packages"]) ||
    readPath(basket, ["items"]) ||
    readPath(basket, ["basket", "packages"])

  return Array.isArray(packages) ? packages.length : 0
}

export function shortBasketIdent(value?: string) {
  if (!value) return "sem sessao"
  if (value.length <= 16) return value
  return `${value.slice(0, 8)}...${value.slice(-6)}`
}
