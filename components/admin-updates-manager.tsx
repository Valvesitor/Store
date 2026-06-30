"use client"

import { useState } from "react"
import { FilePenLine, Plus, Save, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import type { ContentPersistence, Update } from "@/lib/blog-store"

type Draft = {
  id?: string
  version: string
  title: string
  description: string
  notes: string
  tag: string
  date: string
  published: boolean
}

function emptyDraft(): Draft {
  return {
    version: "",
    title: "",
    description: "",
    notes: "",
    tag: "Publicado",
    date: new Date().toISOString().slice(0, 10),
    published: true,
  }
}

function toDraft(update: Update): Draft {
  return {
    id: update.id,
    version: update.version,
    title: update.title,
    description: update.description,
    notes: update.notes.join("\n"),
    tag: update.tag,
    date: update.date,
    published: update.published,
  }
}

export function AdminUpdatesManager({
  initialUpdates,
  persistence,
}: {
  initialUpdates: Update[]
  persistence: ContentPersistence
}) {
  const [updates, setUpdates] = useState(initialUpdates)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  const canWrite = persistence.canWrite

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => (current ? { ...current, [key]: value } : current))
  }

  async function save() {
    if (!draft) return
    if (!draft.title.trim()) {
      setMessage("Informe um título.")
      return
    }

    setSaving(true)
    setMessage("")

    try {
      const isEdit = Boolean(draft.id)
      const url = isEdit
        ? `/api/admin/updates/${encodeURIComponent(draft.id as string)}`
        : "/api/admin/updates"
      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...draft,
          notes: draft.notes
            .split("\n")
            .map((note) => note.trim())
            .filter(Boolean),
        }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || "Erro ao salvar.")
      }

      setUpdates(data.updates)
      setDraft(null)
      setMessage(isEdit ? "Atualização salva." : "Atualização publicada.")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro inesperado ao salvar.")
    } finally {
      setSaving(false)
    }
  }

  async function remove(item: Update) {
    if (!confirm(`Excluir "${item.title}"?`)) return

    setSaving(true)
    setMessage("")

    try {
      const response = await fetch(
        `/api/admin/updates/${encodeURIComponent(item.id)}`,
        { method: "DELETE" },
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || "Erro ao excluir.")
      }

      setUpdates(data.updates)
      setMessage("Atualização excluída.")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro inesperado ao excluir.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <section id="atualizacoes-admin" className="rounded-lg border border-border bg-card/70">
      <div className="flex flex-col gap-4 border-b border-border p-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="font-display text-xs uppercase text-primary">Changelog</p>
          <h2 className="mt-1 font-display text-2xl font-bold uppercase text-foreground">
            Atualizações
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Registre versões e mudanças. Salvo no R2 <strong>PRODUCT_MEDIA</strong> em{" "}
            <strong>content/updates.json</strong>.
          </p>
        </div>

        <Button
          type="button"
          className="h-10 shrink-0 bg-primary px-4 font-display text-xs uppercase text-primary-foreground hover:bg-primary/90"
          onClick={() => {
            setMessage("")
            setDraft(emptyDraft())
          }}
          disabled={saving || Boolean(draft)}
        >
          <Plus className="h-4 w-4" />
          Nova atualização
        </Button>
      </div>

      {!canWrite && (
        <div className="border-b border-border bg-primary/5 px-5 py-3 text-xs leading-5 text-muted-foreground">
          Edição desativada neste ambiente (R2 indisponível). Faça o deploy ou rode{" "}
          <code>pnpm cf:preview</code> para gravar conteúdo.
        </div>
      )}

      {message && (
        <div className="border-b border-border bg-background/45 px-5 py-3 text-sm text-primary">
          {message}
        </div>
      )}

      {draft && (
        <div className="grid gap-4 border-b border-border bg-background/40 p-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="grid gap-2 sm:col-span-2">
              <Label className="font-display text-xs uppercase text-muted-foreground">Título</Label>
              <Input
                value={draft.title}
                onChange={(event) => update("title", event.target.value)}
                placeholder="O que mudou"
                className="bg-background/70"
              />
            </div>
            <div className="grid gap-2">
              <Label className="font-display text-xs uppercase text-muted-foreground">Versão</Label>
              <Input
                value={draft.version}
                onChange={(event) => update("version", event.target.value)}
                placeholder="Ex.: Site 1.1"
                className="bg-background/70"
              />
            </div>
            <div className="grid gap-2">
              <Label className="font-display text-xs uppercase text-muted-foreground">Tag</Label>
              <Input
                value={draft.tag}
                onChange={(event) => update("tag", event.target.value)}
                placeholder="Ex.: Publicado"
                className="bg-background/70"
              />
            </div>
            <div className="grid gap-2">
              <Label className="font-display text-xs uppercase text-muted-foreground">Data</Label>
              <Input
                type="date"
                value={draft.date}
                onChange={(event) => update("date", event.target.value)}
                className="bg-background/70"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="font-display text-xs uppercase text-muted-foreground">Descrição</Label>
            <Textarea
              value={draft.description}
              onChange={(event) => update("description", event.target.value)}
              placeholder="Resumo da atualização"
              className="min-h-20 bg-background/70"
            />
          </div>

          <div className="grid gap-2">
            <Label className="font-display text-xs uppercase text-muted-foreground">
              Notas (uma por linha)
            </Label>
            <Textarea
              value={draft.notes}
              onChange={(event) => update("notes", event.target.value)}
              placeholder={"Nova home\nHeader revisado\nCorreções"}
              className="min-h-28 bg-background/70 font-mono text-xs leading-5"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <label className="flex items-center gap-3">
              <Switch
                checked={draft.published}
                onCheckedChange={(checked) => update("published", checked)}
              />
              <span className="font-display text-xs uppercase text-muted-foreground">
                {draft.published ? "Publicado" : "Rascunho"}
              </span>
            </label>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-10 border-border bg-background/70 px-4 font-display text-xs uppercase text-muted-foreground hover:text-foreground"
                onClick={() => setDraft(null)}
                disabled={saving}
              >
                <X className="h-4 w-4" />
                Cancelar
              </Button>
              <Button
                type="button"
                className="h-10 bg-primary px-4 font-display text-xs uppercase text-primary-foreground hover:bg-primary/90"
                onClick={save}
                disabled={saving || !canWrite}
              >
                <Save className="h-4 w-4" />
                Salvar
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="divide-y divide-border">
        {updates.length === 0 && (
          <p className="p-5 text-sm text-muted-foreground">Nenhuma atualização ainda.</p>
        )}
        {updates.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {item.version && (
                  <span className="rounded border border-primary/25 bg-primary/10 px-2 py-0.5 font-display text-[0.6rem] uppercase tracking-widest text-primary">
                    {item.version}
                  </span>
                )}
                {!item.published && (
                  <span className="rounded border border-border bg-background/60 px-2 py-0.5 font-display text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                    Rascunho
                  </span>
                )}
                <span className="text-xs text-muted-foreground">{item.date}</span>
              </div>
              <p className="mt-1 truncate font-display text-sm font-semibold uppercase text-foreground">
                {item.title}
              </p>
            </div>

            <div className="flex shrink-0 gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-9 border-border bg-background/70 px-3 font-display text-xs uppercase text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setMessage("")
                  setDraft(toDraft(item))
                }}
                disabled={saving}
              >
                <FilePenLine className="h-4 w-4" />
                Editar
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-9 w-9 border-red-500/30 bg-background/70 p-0 text-red-400 hover:border-red-500/60 hover:text-red-300"
                onClick={() => remove(item)}
                disabled={saving || !canWrite}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
