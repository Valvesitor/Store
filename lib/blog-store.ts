import { getCloudflareContext } from "@opennextjs/cloudflare"

const ARTICLES_KEY = "content/articles.json"
const UPDATES_KEY = "content/updates.json"

export type ArticleSection = "novidades" | "docs"

export type Article = {
  id: string
  section: ArticleSection
  title: string
  excerpt: string
  body: string
  coverImage?: string
  tag: string
  date: string
  published: boolean
}

export type Update = {
  id: string
  version: string
  title: string
  description: string
  notes: string[]
  tag: string
  date: string
  published: boolean
}

export type ContentPersistence = {
  mode: "r2" | "fallback"
  canWrite: boolean
  message: string
}

type R2ObjectLike = {
  text(): Promise<string>
}

type R2BucketLike = {
  get(key: string): Promise<R2ObjectLike | null>
  put(key: string, value: string, options?: Record<string, unknown>): Promise<unknown>
}

type RuntimeEnv = {
  PRODUCT_MEDIA?: R2BucketLike
}

function getContentBucket() {
  try {
    const context = getCloudflareContext()
    return (context.env as RuntimeEnv | undefined)?.PRODUCT_MEDIA
  } catch {
    return undefined
  }
}

function stringValue(value: unknown, fallback = "") {
  if (typeof value !== "string") return fallback
  return value.trim()
}

function booleanValue(value: unknown, fallback = false) {
  if (typeof value === "boolean") return value
  if (typeof value === "string") {
    return ["1", "true", "sim", "yes", "on"].includes(value.trim().toLowerCase())
  }

  return fallback
}

function stringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean)
  }

  if (typeof value === "string") {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function dateValue(value: unknown, fallback: string) {
  const raw = stringValue(value)
  if (!raw) return fallback
  const parsed = new Date(raw)
  return Number.isNaN(parsed.getTime()) ? fallback : raw
}

// ---------------------------------------------------------------------------
// Seeds (fallback quando o R2 não está disponível, ex.: next dev)
// ---------------------------------------------------------------------------

const articleSeeds: Article[] = [
  {
    id: "bem-vindo-ao-blog",
    section: "novidades",
    title: "Bem-vindo ao novo The Wanted Sole Studio",
    excerpt:
      "O site virou um espaço de conteúdo: novidades, documentação e o histórico de atualizações do estúdio.",
    body: "## Um novo começo\n\nReformulamos o site para reunir tudo o que importa em um só lugar: anúncios, guias e o registro das mudanças.\n\nFique de olho na seção de Novidades para acompanhar lançamentos e bastidores, use a Documentação para tirar dúvidas e veja em Atualizações o que mudou a cada versão.\n\nQualquer dúvida, fale com a gente pelo Discord oficial.",
    coverImage: "",
    tag: "Anúncio",
    date: "2026-06-01",
    published: true,
  },
  {
    id: "como-usar-a-documentacao",
    section: "docs",
    title: "Como usar a documentação",
    excerpt:
      "Guia rápido para navegar pelos artigos, encontrar instruções e aproveitar melhor o conteúdo.",
    body: "## Visão geral\n\nA documentação reúne guias e instruções organizados por tema.\n\n## Como navegar\n\nAbra um artigo para ler o conteúdo completo. Os textos podem ter subtítulos, parágrafos e listas para facilitar a leitura.\n\n## Precisa de ajuda?\n\nSe não encontrar o que procura, entre no Discord oficial e fale com a equipe.",
    coverImage: "",
    tag: "Guia",
    date: "2026-06-01",
    published: true,
  },
]

const updateSeeds: Update[] = [
  {
    id: "site-1-0",
    version: "Site 1.0",
    title: "Site reformulado como blog",
    description:
      "O site deixou de ser loja e passou a ser um hub de conteúdo com novidades, documentação e atualizações.",
    notes: [
      "Nova home focada em conteúdo",
      "Seções de Novidades e Documentação",
      "Painel admin para publicar conteúdo",
    ],
    tag: "Publicado",
    date: "2026-06-29",
    published: true,
  },
  {
    id: "site-0-9",
    version: "Site 0.9",
    title: "Identidade visual consolidada",
    description:
      "Ajustes de layout, tipografia e navegação para uma experiência mais limpa e consistente.",
    notes: [
      "Header e footer revisados",
      "Tipografia e cores alinhadas",
      "Navegação simplificada",
    ],
    tag: "Publicado",
    date: "2026-06-15",
    published: true,
  },
]

// ---------------------------------------------------------------------------
// Normalização
// ---------------------------------------------------------------------------

function normalizeArticle(input: unknown, fallback?: Partial<Article>): Article {
  const source = (typeof input === "object" && input ? input : {}) as Record<string, unknown>
  const fallbackId = fallback?.id || fallback?.title || "artigo"
  const id = slugify(stringValue(source.id, fallbackId)) || slugify(fallbackId) || "artigo"
  const section: ArticleSection =
    source.section === "docs" || fallback?.section === "docs" ? "docs" : "novidades"

  return {
    id,
    section,
    title: stringValue(source.title, fallback?.title || "Sem título"),
    excerpt: stringValue(source.excerpt, fallback?.excerpt || ""),
    body: stringValue(source.body, fallback?.body || ""),
    coverImage: stringValue(source.coverImage, fallback?.coverImage || "") || undefined,
    tag: stringValue(source.tag, fallback?.tag || (section === "docs" ? "Guia" : "Novidade")),
    date: dateValue(source.date, fallback?.date || new Date().toISOString().slice(0, 10)),
    published: booleanValue(source.published, fallback?.published ?? true),
  }
}

function normalizeArticles(input: unknown): Article[] {
  if (!Array.isArray(input) || input.length === 0) return [...articleSeeds]

  const unique = new Map<string, Article>()
  for (const item of input) {
    const article = normalizeArticle(item)
    unique.set(article.id, article)
  }

  const result = Array.from(unique.values())
  return result.length > 0 ? result : [...articleSeeds]
}

function normalizeUpdate(input: unknown, fallback?: Partial<Update>): Update {
  const source = (typeof input === "object" && input ? input : {}) as Record<string, unknown>
  const fallbackId = fallback?.id || fallback?.version || fallback?.title || "update"
  const id = slugify(stringValue(source.id, fallbackId)) || slugify(fallbackId) || "update"

  return {
    id,
    version: stringValue(source.version, fallback?.version || ""),
    title: stringValue(source.title, fallback?.title || "Atualização"),
    description: stringValue(source.description, fallback?.description || ""),
    notes: Object.prototype.hasOwnProperty.call(source, "notes")
      ? stringArray(source.notes)
      : fallback?.notes ?? [],
    tag: stringValue(source.tag, fallback?.tag || "Publicado"),
    date: dateValue(source.date, fallback?.date || new Date().toISOString().slice(0, 10)),
    published: booleanValue(source.published, fallback?.published ?? true),
  }
}

function normalizeUpdates(input: unknown): Update[] {
  if (!Array.isArray(input) || input.length === 0) return [...updateSeeds]

  const unique = new Map<string, Update>()
  for (const item of input) {
    const update = normalizeUpdate(item)
    unique.set(update.id, update)
  }

  const result = Array.from(unique.values())
  return result.length > 0 ? result : [...updateSeeds]
}

function sortByDateDesc<T extends { date: string }>(items: T[]) {
  return [...items].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}

// ---------------------------------------------------------------------------
// Persistência
// ---------------------------------------------------------------------------

export function getContentPersistence(): ContentPersistence {
  const bucket = getContentBucket()

  if (!bucket) {
    return {
      mode: "fallback",
      canWrite: false,
      message:
        "PRODUCT_MEDIA não está disponível neste ambiente. Mostrando conteúdo de exemplo (somente leitura).",
    }
  }

  return {
    mode: "r2",
    canWrite: true,
    message: "Conteúdo salvo no R2 PRODUCT_MEDIA (content/articles.json e content/updates.json).",
  }
}

async function readArticlesFromR2(bucket: R2BucketLike) {
  const object = await bucket.get(ARTICLES_KEY)

  if (!object) {
    await bucket.put(ARTICLES_KEY, JSON.stringify(articleSeeds, null, 2), {
      httpMetadata: { contentType: "application/json; charset=utf-8" },
    })
    return [...articleSeeds]
  }

  try {
    return normalizeArticles(JSON.parse(await object.text()))
  } catch {
    return [...articleSeeds]
  }
}

async function readUpdatesFromR2(bucket: R2BucketLike) {
  const object = await bucket.get(UPDATES_KEY)

  if (!object) {
    await bucket.put(UPDATES_KEY, JSON.stringify(updateSeeds, null, 2), {
      httpMetadata: { contentType: "application/json; charset=utf-8" },
    })
    return [...updateSeeds]
  }

  try {
    return normalizeUpdates(JSON.parse(await object.text()))
  } catch {
    return [...updateSeeds]
  }
}

export async function getArticles(options?: { section?: ArticleSection; includeDrafts?: boolean }) {
  const bucket = getContentBucket()
  const articles = bucket ? await readArticlesFromR2(bucket) : [...articleSeeds]

  let result = sortByDateDesc(articles)
  if (options?.section) {
    result = result.filter((article) => article.section === options.section)
  }
  if (!options?.includeDrafts) {
    result = result.filter((article) => article.published)
  }

  return result
}

export async function getArticleBySlug(slug: string) {
  const bucket = getContentBucket()
  const articles = bucket ? await readArticlesFromR2(bucket) : [...articleSeeds]
  return articles.find((article) => article.id === slug)
}

async function saveArticles(articles: Article[]) {
  const bucket = getContentBucket()

  if (!bucket) {
    throw new Error("PRODUCT_MEDIA não está conectado. Configure o binding R2 no Worker.")
  }

  const normalized = normalizeArticles(articles)
  await bucket.put(ARTICLES_KEY, JSON.stringify(normalized, null, 2), {
    httpMetadata: { contentType: "application/json; charset=utf-8" },
  })

  return normalized
}

export async function createArticle(input: unknown) {
  const bucket = getContentBucket()
  const articles = bucket ? await readArticlesFromR2(bucket) : [...articleSeeds]
  const article = normalizeArticle(input)

  if (articles.some((item) => item.id === article.id)) {
    throw new Error("Já existe um artigo com esse título/ID.")
  }

  return saveArticles([article, ...articles])
}

export async function updateArticle(id: string, input: unknown) {
  const bucket = getContentBucket()
  const articles = bucket ? await readArticlesFromR2(bucket) : [...articleSeeds]
  const index = articles.findIndex((article) => article.id === id)

  if (index < 0) {
    throw new Error("Artigo não encontrado.")
  }

  const updated = normalizeArticle({ ...(articles[index] ?? {}), ...(input as object), id }, articles[index])
  const next = [...articles]
  next[index] = updated

  return saveArticles(next)
}

export async function deleteArticle(id: string) {
  const bucket = getContentBucket()
  const articles = bucket ? await readArticlesFromR2(bucket) : [...articleSeeds]
  const next = articles.filter((article) => article.id !== id)

  if (next.length === articles.length) {
    throw new Error("Artigo não encontrado.")
  }

  return saveArticles(next)
}

export async function getUpdates(options?: { includeDrafts?: boolean }) {
  const bucket = getContentBucket()
  const updates = bucket ? await readUpdatesFromR2(bucket) : [...updateSeeds]

  let result = sortByDateDesc(updates)
  if (!options?.includeDrafts) {
    result = result.filter((update) => update.published)
  }

  return result
}

async function saveUpdates(updates: Update[]) {
  const bucket = getContentBucket()

  if (!bucket) {
    throw new Error("PRODUCT_MEDIA não está conectado. Configure o binding R2 no Worker.")
  }

  const normalized = normalizeUpdates(updates)
  await bucket.put(UPDATES_KEY, JSON.stringify(normalized, null, 2), {
    httpMetadata: { contentType: "application/json; charset=utf-8" },
  })

  return normalized
}

export async function createUpdate(input: unknown) {
  const bucket = getContentBucket()
  const updates = bucket ? await readUpdatesFromR2(bucket) : [...updateSeeds]
  const update = normalizeUpdate(input)

  if (updates.some((item) => item.id === update.id)) {
    throw new Error("Já existe uma atualização com esse título/versão.")
  }

  return saveUpdates([update, ...updates])
}

export async function updateUpdate(id: string, input: unknown) {
  const bucket = getContentBucket()
  const updates = bucket ? await readUpdatesFromR2(bucket) : [...updateSeeds]
  const index = updates.findIndex((update) => update.id === id)

  if (index < 0) {
    throw new Error("Atualização não encontrada.")
  }

  const updated = normalizeUpdate({ ...(updates[index] ?? {}), ...(input as object), id }, updates[index])
  const next = [...updates]
  next[index] = updated

  return saveUpdates(next)
}

export async function deleteUpdate(id: string) {
  const bucket = getContentBucket()
  const updates = bucket ? await readUpdatesFromR2(bucket) : [...updateSeeds]
  const next = updates.filter((update) => update.id !== id)

  if (next.length === updates.length) {
    throw new Error("Atualização não encontrada.")
  }

  return saveUpdates(next)
}
