"use client"

import { useState } from "react"
import { FilePenLine, Plus, Save, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import type { Article, ArticleSection, ContentPersistence } from "@/lib/blog-store"

type Draft = {
  id?: string
  section: ArticleSection
  title: string
  excerpt: string
  body: string
  coverImage: string
  tag: string
  date: string
  published: boolean
}

function emptyDraft(): Draft {
  return {
    section: "novidades",
    title: "",
    excerpt: "",
    body: "",
    coverImage: "",
    tag: "",
    date: new Date().toISOString().slice(0, 10),
    published: true,
  }
}

function toDraft(article: Article): Draft {
  return {
    id: article.id,
    section: article.section,
    title: article.title,
    excerpt: article.excerpt,
    body: article.body,
    coverImage: article.coverImage ?? "",
    tag: article.tag,
    date: article.date,
    published: article.published,
  }
}

const sectionLabel: Record<ArticleSection, string> = {
  novidades: "Novidades",
  docs: "Documentação",
}

export function AdminContentManager({
  initialArticles,
  persistence,
}: {
  initialArticles: Article[]
  persistence: ContentPersistence
}) {
  const [articles, setArticles] = useState(initialArticles)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  const canWrite = persistence.canWrite

  function startNew() {
    setMessage("")
    setDraft(emptyDraft())
  }

  function startEdit(article: Article) {
    setMessage("")
    setDraft(toDraft(article))
  }

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
        ? `/api/admin/articles/${encodeURIComponent(draft.id as string)}`
        : "/api/admin/articles"
      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || "Erro ao salvar.")
      }

      setArticles(data.articles)
      setDraft(null)
      setMessage(isEdit ? "Conteúdo atualizado." : "Conteúdo publicado.")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro inesperado ao salvar.")
    } finally {
      setSaving(false)
    }
  }

  async function remove(article: Article) {
    if (!confirm(`Excluir "${article.title}"?`)) return

    setSaving(true)
    setMessage("")

    try {
      const response = await fetch(
        `/api/admin/articles/${encodeURIComponent(article.id)}`,
        { method: "DELETE" },
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || "Erro ao excluir.")
      }

      setArticles(data.articles)
      setMessage("Conteúdo excluído.")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro inesperado ao excluir.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <section id="conteudo-admin" className="rounded-lg border border-border bg-card/70">
      <div className="flex flex-col gap-4 border-b border-border p-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="font-display text-xs uppercase text-primary">Conteúdo do blog</p>
          <h2 className="mt-1 font-display text-2xl font-bold uppercase text-foreground">
            Novidades e Documentação
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Crie e edite posts e guias. Salvo no R2 <strong>PRODUCT_MEDIA</strong> em{" "}
            <strong>content/articles.json</strong>.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">Status: {persistence.message}</p>
        </div>

        <Button
          type="button"
          className="h-10 shrink-0 bg-primary px-4 font-display text-xs uppercase text-primary-foreground hover:bg-primary/90"
          onClick={startNew}
          disabled={saving || Boolean(draft)}
        >
          <Plus className="h-4 w-4" />
          Novo conteúdo
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label className="font-display text-xs uppercase text-muted-foreground">Título</Label>
              <Input
                value={draft.title}
                onChange={(event) => update("title", event.target.value)}
                placeholder="Título do conteúdo"
                className="bg-background/70"
              />
            </div>
            <div className="grid gap-2">
              <Label className="font-display text-xs uppercase text-muted-foreground">Seção</Label>
              <select
                value={draft.section}
                onChange={(event) => update("section", event.target.value as ArticleSection)}
                className="h-10 rounded-md border border-input bg-background/70 px-3 text-sm"
              >
                <option value="novidades">Novidades</option>
                <option value="docs">Documentação</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label className="font-display text-xs uppercase text-muted-foreground">Tag</Label>
              <Input
                value={draft.tag}
                onChange={(event) => update("tag", event.target.value)}
                placeholder="Ex.: Anúncio, Guia"
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
            <Label className="font-display text-xs uppercase text-muted-foreground">
              Imagem de capa (URL, opcional)
            </Label>
            <Input
              value={draft.coverImage}
              onChange={(event) => update("coverImage", event.target.value)}
              placeholder="/capa.png ou https://..."
              className="bg-background/70"
            />
          </div>

          <div className="grid gap-2">
            <Label className="font-display text-xs uppercase text-muted-foreground">Resumo</Label>
            <Textarea
              value={draft.excerpt}
              onChange={(event) => update("excerpt", event.target.value)}
              placeholder="Resumo curto exibido nos cards"
              className="min-h-20 bg-background/70"
            />
          </div>

          <div className="grid gap-2">
            <Label className="font-display text-xs uppercase text-muted-foreground">Conteúdo</Label>
            <Textarea
              value={draft.body}
              onChange={(event) => update("body", event.target.value)}
              placeholder={"Use linha em branco para separar parágrafos.\n## Subtítulo\n- item de lista"}
              className="min-h-48 bg-background/70 font-mono text-xs leading-5"
            />
            <p className="text-xs text-muted-foreground">
              Dica: <code>## </code> vira subtítulo e <code>- </code> vira item de lista.
            </p>
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
        {articles.length === 0 && (
          <p className="p-5 text-sm text-muted-foreground">Nenhum conteúdo ainda.</p>
        )}
        {articles.map((article) => (
          <div
            key={article.id}
            className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded border border-primary/25 bg-primary/10 px-2 py-0.5 font-display text-[0.6rem] uppercase tracking-widest text-primary">
                  {sectionLabel[article.section]}
                </span>
                {!article.published && (
                  <span className="rounded border border-border bg-background/60 px-2 py-0.5 font-display text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                    Rascunho
                  </span>
                )}
                <span className="text-xs text-muted-foreground">{article.date}</span>
              </div>
              <p className="mt-1 truncate font-display text-sm font-semibold uppercase text-foreground">
                {article.title}
              </p>
            </div>

            <div className="flex shrink-0 gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-9 border-border bg-background/70 px-3 font-display text-xs uppercase text-muted-foreground hover:text-foreground"
                onClick={() => startEdit(article)}
                disabled={saving}
              >
                <FilePenLine className="h-4 w-4" />
                Editar
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-9 w-9 border-red-500/30 bg-background/70 p-0 text-red-400 hover:border-red-500/60 hover:text-red-300"
                onClick={() => remove(article)}
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
