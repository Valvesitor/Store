"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { startTebexLogin } from "@/lib/tebex-client"

export function TebexLoginButton() {
  const [busy, setBusy] = useState(false)

  async function handleLogin() {
    try {
      setBusy(true)
      await startTebexLogin("/login")
    } catch (error) {
      console.error(error)
      window.alert(
        error instanceof Error
          ? error.message
          : "Não foi possível iniciar o login pela Tebex.",
      )
      setBusy(false)
    }
  }

  return (
    <Button
      className="h-12 w-full bg-primary font-display text-sm uppercase text-primary-foreground hover:bg-primary/90"
      onClick={handleLogin}
      disabled={busy}
    >
      {busy ? "Conectando..." : "Entrar com CFX.re"}
      <ArrowRight className="h-4 w-4" />
    </Button>
  )
}
