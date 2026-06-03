"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import {
  AlertCircle,
  CheckCircle2,
  LifeBuoy,
  Loader2,
  LogOut,
  PackageCheck,
  RefreshCw,
  ReceiptText,
  ShieldCheck,
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
} from "@/lib/tebex-client"
import {
  getBasketPackageCount,
  getBasketUsername,
  shortBasketIdent,
} from "@/lib/tebex-account"
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

function AccountMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ShieldCheck
  label: string
  value: string
}) {
  return (
    <div className="rounded-md border border-border bg-background/45 p-3">
      <div className="flex items-center gap-2 text-primary">
        <Icon className="h-4 w-4" />
        <span className="font-display text-[0.65rem] uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="mt-2 break-words text-sm font-medium text-foreground">
        {value}
      </p>
    </div>
  )
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
        packageCount: getBasketPackageCount(basket),
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
  const accountTitle = connected
    ? "Conta conectada"
    : pending
      ? "Sessao em verificacao"
      : "Entrar com CFX.re"
  const accountDescription = connected
    ? "Sua sessao esta pronta para carrinho, checkout e compras pela Tebex."
    : pending
      ? "A sessao foi encontrada. Refaça o login CFX.re se o checkout pedir autenticacao."
      : "Use sua conta CFX.re para acessar compras e finalizar pedidos na loja."

  return (
    <div className="mx-auto w-full max-w-xl overflow-hidden rounded-lg border border-border bg-card/90 backdrop-blur">
      <div className="border-b border-border bg-background/35 p-5">
        <div className="flex items-start justify-between gap-4">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-md border",
              connected
                ? "border-primary/40 bg-primary/15 text-primary"
                : "border-border bg-secondary/70 text-muted-foreground",
            )}
          >
            <StatusIcon className={cn("h-5 w-5", checking && "animate-spin")} />
          </div>

          <span
            className={cn(
              "rounded border px-2.5 py-1 font-display text-[0.65rem] uppercase tracking-widest",
              connected
                ? "border-primary/35 bg-primary/10 text-primary"
                : pending
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
                  : "border-border bg-background/60 text-muted-foreground",
            )}
          >
            {connected ? "Online" : pending ? "Verificando" : "CFX.re"}
          </span>
        </div>

        <div className="mt-5">
          <p className="font-display text-xs uppercase tracking-[0.24em] text-primary">
            Minha conta
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase text-foreground">
            {accountTitle}
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            {accountDescription}
          </p>
        </div>
      </div>

      {account.status === "connected" || account.status === "pending" ? (
        <div className="grid gap-4 p-5">
          <div className="relative overflow-hidden rounded-md border border-primary/25 bg-[#0f0f10] p-4">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-primary/15 text-primary">
                  <UserRound className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-xl font-bold uppercase text-foreground">
                    {account.username || "Sessao CFX.re"}
                  </p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {shortBasketIdent(account.basketIdent)}
                  </p>
                </div>
              </div>
              <div className="rounded border border-primary/30 bg-background/70 px-3 py-2 text-left sm:text-right">
                <p className="font-display text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                  Carrinho
                </p>
                <p className="mt-1 font-display text-lg font-bold text-primary">
                  {account.packageCount} item
                  {account.packageCount === 1 ? "" : "s"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <AccountMetric
              icon={ShieldCheck}
              label="Status"
              value={connected ? "Conectado" : "Em verificacao"}
            />
            <AccountMetric
              icon={PackageCheck}
              label="Checkout"
              value={pending ? "Revalidar CFX.re" : "Liberado"}
            />
            <AccountMetric
              icon={ReceiptText}
              label="Sessao"
              value={shortBasketIdent(account.basketIdent)}
            />
          </div>

          {pending && (
            <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-4">
              <p className="font-display text-xs uppercase tracking-widest text-amber-100">
                Validacao CFX.re
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Se a compra pedir login novamente, refaca a conexao antes de
                abrir o checkout.
              </p>
              <div className="mt-4 [&_button]:mt-0">
                <TebexLoginButton />
              </div>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              className="h-12 bg-primary font-display text-sm uppercase text-primary-foreground hover:bg-primary/90"
              asChild
            >
              <Link href="/carrinho">
                <ShoppingCart className="h-4 w-4" />
                Ver carrinho
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-12 border-primary/30 bg-background/60 font-display text-sm uppercase text-foreground hover:border-primary/60"
              asChild
            >
              <Link href="/loja">
                <Store className="h-4 w-4" />
                Continuar na loja
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-11 border-border bg-background/60 font-display text-xs uppercase text-foreground hover:border-primary/60"
              asChild
            >
              <Link href="/suporte">
                <LifeBuoy className="h-4 w-4" />
                Suporte
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-11 border-border bg-background/60 font-display text-xs uppercase text-foreground hover:border-primary/60"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Sair da conta
            </Button>
          </div>
        </div>
      ) : null}

      {checking && (
        <div className="p-5">
          <div className="rounded-md border border-border bg-background/55 p-4 text-sm text-muted-foreground">
            Carregando sua sessao...
          </div>
        </div>
      )}

      {error && (
        <div className="grid gap-3 p-5">
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
        <div className="p-5">
          {account.authError && (
            <div className="mb-4 rounded-md border border-destructive/35 bg-destructive/10 p-4 text-sm leading-relaxed text-muted-foreground">
              Nao foi possivel concluir o login pela Tebex. Tente entrar
              novamente.
            </div>
          )}
          <TebexLoginButton />
        </div>
      )}
    </div>
  )
}
