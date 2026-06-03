"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  LogOut,
  RefreshCw,
  ShoppingCart,
  Store,
  UserRound,
} from "lucide-react"
import { TebexLoginButton } from "@/components/tebex-login-button"
import { Button } from "@/components/ui/button"
import {
  clearTebexBasket,
  fetchTebexBasket,
  getStoredTebexBasket,
  openTebexCart,
} from "@/lib/tebex-client"
import { cn } from "@/lib/utils"

type AccountState =
  | {
      status: "checking"
      basketIdent?: string
    }
  | {
      status: "signed-out"
      authError?: boolean
    }
  | {
      status: "connected" | "pending"
      basketIdent: string
      username?: string
      packageCount: number
    }
  | {
      status: "error"
      basketIdent?: string
      message: string
    }

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

function getBasketUsername(basket: unknown) {
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

function getPackageCount(basket: unknown) {
  const packages =
    readPath(basket, ["packages"]) ||
    readPath(basket, ["items"]) ||
    readPath(basket, ["basket", "packages"])

  return Array.isArray(packages) ? packages.length : 0
}

function shortBasketIdent(value?: string) {
  if (!value) return "sem sessao"
  if (value.length <= 16) return value
  return `${value.slice(0, 8)}...${value.slice(-6)}`
}

export function LoginAccountPanel() {
  const [account, setAccount] = useState<AccountState>({ status: "checking" })

  const syncAccount = useCallback(async () => {
    const params = new URLSearchParams(window.location.search)
    const authError = params.get("tebex") === "error"
    const basketIdent = getStoredTebexBasket()

    if (!basketIdent) {
      setAccount({ status: "signed-out", authError })
      return
    }

    setAccount({ status: "checking", basketIdent })

    try {
      const basket = await fetchTebexBasket(basketIdent)
      const username = getBasketUsername(basket)

      setAccount({
        status: username ? "connected" : "pending",
        basketIdent,
        username,
        packageCount: getPackageCount(basket),
      })
    } catch (error) {
      setAccount({
        status: "error",
        basketIdent,
        message:
          error instanceof Error
            ? error.message
            : "Nao foi possivel carregar sua sessao.",
      })
    }
  }, [])

  useEffect(() => {
    syncAccount()

    window.addEventListener("tws:tebex-session-changed", syncAccount)
    window.addEventListener("storage", syncAccount)

    return () => {
      window.removeEventListener("tws:tebex-session-changed", syncAccount)
      window.removeEventListener("storage", syncAccount)
    }
  }, [syncAccount])

  function handleLogout() {
    clearTebexBasket()
    setAccount({ status: "signed-out" })
  }

  const connected = account.status === "connected"
  const pending = account.status === "pending"
  const signedOut = account.status === "signed-out"
  const error = account.status === "error"
  const checking = account.status === "checking"
  const StatusIcon = connected
    ? CheckCircle2
    : pending || error
      ? AlertCircle
      : checking
        ? Loader2
        : UserRound

  return (
    <div className="mx-auto max-w-md rounded-lg border border-border bg-card/85 p-6 backdrop-blur">
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-md border",
          connected
            ? "border-primary/40 bg-primary/15 text-primary"
            : "border-border bg-secondary/70 text-muted-foreground",
        )}
      >
        <StatusIcon className={cn("h-5 w-5", checking && "animate-spin")} />
      </div>

      <div className="mt-6">
        <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">
          CFX.re Account
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold uppercase text-foreground">
          {connected
            ? "Conta conectada"
            : pending
              ? "Conexao pendente"
              : "Entrar com CFX.re"}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {connected
            ? "Sua conta esta conectada a loja e pronta para compras, carrinho e checkout Tebex."
            : pending
              ? "Encontramos uma sessao da Tebex, mas ainda nao recebemos o usuario CFX.re autenticado."
              : "Use sua conta CFX.re para acessar compras e finalizar pedidos na loja."}
        </p>
      </div>

      {account.status === "connected" || account.status === "pending" ? (
        <div className="mt-6 grid gap-3">
          <div className="rounded-md border border-border bg-background/55 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <UserRound className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="font-display text-sm uppercase text-foreground">
                  {account.username || "Aguardando CFX.re"}
                </p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  Sessao {shortBasketIdent(account.basketIdent)}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
              <div>
                <p className="font-display text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                  Status
                </p>
                <p className="mt-1 text-sm text-foreground">
                  {connected ? "Conectado" : "Pendente"}
                </p>
              </div>
              <div>
                <p className="font-display text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                  Carrinho
                </p>
                <p className="mt-1 text-sm text-foreground">
                  {account.packageCount} item
                  {account.packageCount === 1 ? "" : "s"}
                </p>
              </div>
            </div>
          </div>

          <Button
            className="h-12 bg-primary font-display text-sm uppercase text-primary-foreground hover:bg-primary/90"
            onClick={() => {
              openTebexCart().catch((cartError) => {
                console.error(cartError)
                window.alert(
                  cartError instanceof Error
                    ? cartError.message
                    : "Nao foi possivel abrir o carrinho da Tebex.",
                )
              })
            }}
          >
            <ShoppingCart className="h-4 w-4" />
            Abrir carrinho
          </Button>
          {pending && <TebexLoginButton />}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-11 border-border bg-background/60 font-display text-xs uppercase text-foreground hover:border-primary/60"
              asChild
            >
              <Link href="/loja">
                <Store className="h-4 w-4" />
                Ver loja
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-11 border-border bg-background/60 font-display text-xs uppercase text-foreground hover:border-primary/60"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      ) : null}

      {checking && (
        <div className="mt-6 rounded-md border border-border bg-background/55 p-4 text-sm text-muted-foreground">
          Carregando sua sessao...
        </div>
      )}

      {error && (
        <div className="mt-6 grid gap-3">
          <div className="rounded-md border border-destructive/35 bg-destructive/10 p-4 text-sm leading-relaxed text-muted-foreground">
            {account.message}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-11 border-border bg-background/60 font-display text-xs uppercase text-foreground hover:border-primary/60"
              onClick={syncAccount}
            >
              <RefreshCw className="h-4 w-4" />
              Tentar
            </Button>
            <Button
              variant="outline"
              className="h-11 border-border bg-background/60 font-display text-xs uppercase text-foreground hover:border-primary/60"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Limpar
            </Button>
          </div>
        </div>
      )}

      {signedOut && (
        <>
          {account.authError && (
            <div className="mt-6 rounded-md border border-destructive/35 bg-destructive/10 p-4 text-sm leading-relaxed text-muted-foreground">
              Nao foi possivel concluir o login pela Tebex. Tente entrar
              novamente.
            </div>
          )}
          <TebexLoginButton />
        </>
      )}
    </div>
  )
}
