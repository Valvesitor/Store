# The Wanted Sole Studio — Store R2 + Domain Update

Arquivos alterados:

- `src/app/App.tsx`
- `cloudflare/worker.mjs`
- `wrangler.jsonc`
- `.env.local`
- `.dev.vars.example`

## O que foi configurado

### Domínio novo

Frontend/API configurado para:

```env
VITE_ACCOUNT_API_BASE_URL=https://thewantedsolestudio.com
```

### R2

Bucket configurado no `wrangler.jsonc`:

```json
"r2_buckets": [
  {
    "binding": "PRODUCT_MEDIA",
    "bucket_name": "tws-product-assets"
  }
]
```

### Upload de imagens

Novo endpoint no Worker:

```txt
POST /api/admin/media/upload
```

Novo endpoint público para exibir imagens:

```txt
GET /api/media/products/...
```

Agora o admin envia a imagem para o R2 e o D1 salva somente a URL, evitando erro `SQLITE_TOOBIG`.

### Webhook Tebex

No painel da Tebex, use este endpoint:

```txt
https://thewantedsolestudio.com/api/tebex/webhook
```

Se regenerar a Secret Key da Tebex, salve no Worker:

```bash
npx wrangler secret put TEBEX_WEBHOOK_SECRET
```

## Deploy

```bash
npm run build
npx wrangler deploy
```
