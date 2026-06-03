# Deploy na Cloudflare

Este projeto deve ser hospedado na Cloudflare Workers usando o adapter OpenNext para Next.js.

## 1. Instalar o adapter

No computador onde o npm estiver baixando pacotes normalmente:

```bash
corepack pnpm add @opennextjs/cloudflare@latest
corepack pnpm add -D wrangler@latest
```

Se o lockfile ficar desatualizado, rode:

```bash
corepack pnpm install --no-frozen-lockfile
```

## 2. Variaveis no Cloudflare

Configure estas variaveis como secrets no painel da Cloudflare ou via Wrangler:

```bash
wrangler secret put TEBEX_WEBSTORE_TOKEN
wrangler secret put TEBEX_WEBHOOK_SECRET
wrangler secret put ADMIN_ACCESS_KEY
```

`NEXTJS_ENV=production` ja esta em `wrangler.jsonc`.

## 3. Bindings de dados do admin

Para o painel admin salvar produtos e imagens no Cloudflare, use estes bindings
no Worker:

```txt
Assets: ASSETS
D1 database: DB -> tws-studio
R2 bucket: PRODUCT_MEDIA -> tws-product-assets
```

O binding do R2 ja esta declarado no `wrangler.jsonc`. O D1 tambem pode ser
configurado pelo painel da Cloudflare. Se for publicar usando Wrangler como
fonte da verdade, adicione tambem o bloco abaixo ao `wrangler.jsonc`, trocando
`<DATABASE_ID>` pelo ID real do banco `tws-studio`:

```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "tws-studio",
    "database_id": "<DATABASE_ID>"
  }
]
```

## 4. Dominios

O `wrangler.jsonc` esta configurado para estes Custom Domains:

```txt
thewantedsolestudio.com
www.thewantedsolestudio.com
```

Como o Next inteiro roda no Worker, os caminhos `/api/*` ja funcionam nesses
mesmos dominios. Rotas separadas como `thewantedsolestudio.com/api/*` so sao
necessarias se voce for apontar a API para outro Worker.

## 5. Testar local no runtime da Cloudflare

```bash
corepack pnpm cf:preview
```

## 6. Publicar

```bash
corepack pnpm cf:deploy
```

## Observacoes

- O painel `/admin` continua protegido por `ADMIN_ACCESS_KEY`.
- A Tebex so cria carrinho/checkout se `TEBEX_WEBSTORE_TOKEN` estiver configurado.
- O admin ainda precisa ser conectado no codigo ao `DB` e ao `PRODUCT_MEDIA`
  para persistir catalogo e uploads.
- Nao coloque tokens em arquivos versionados. Use `.env.local` localmente e secrets na Cloudflare.
- O arquivo `public/_headers` faz cache dos assets estaticos.
- `wrangler.jsonc` usa `nodejs_compat`, exigido para o Next rodar via OpenNext na Cloudflare.
