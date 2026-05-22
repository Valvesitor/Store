# TWS Website — Admin + Account + Tebex + Cloudflare

## O que foi adicionado

- `/account` para cliente
- `/admin` para administradores
- Produtos dinâmicos vindos de `/api/products`
- Admin publica/edita/oculta produtos em `/api/admin/products`
- Integração Tebex no cliente:
  - basket
  - login/auth
  - cupom
  - checkout
  - histórico preparado pelo webhook
- Worker API no mesmo domínio:
  - `GET /api/health`
  - `GET /api/products`
  - `GET /api/account/summary`
  - `POST /api/tebex/webhook`
  - `GET/POST/PUT/DELETE /api/admin/products`
- Banco Cloudflare D1:
  - products
  - orders
  - order_items

## Como publicar

1. Criar banco D1:
```bash
npx wrangler d1 create tws_store_db
```

2. Copiar o `database_id` gerado e colocar no `wrangler.jsonc`.

3. Rodar schema:
```bash
npx wrangler d1 execute tws_store_db --remote --file=./cloudflare/schema.sql
```

4. Configurar secrets:
```bash
npx wrangler secret put ADMIN_ACCESS_TOKEN
npx wrangler secret put TEBEX_WEBHOOK_SECRET
```

5. Build:
```bash
npm install
npm run build
```

6. Deploy:
```bash
npx wrangler deploy
```

## Webhook no Tebex

Endpoint:
```text
https://official-website.thewantedsolestudio.workers.dev/api/tebex/webhook
```

Eventos recomendados:
- Pagamento Concluído
- Pagamento Reembolsado
- Pagamento Recusado

## Admin

Acesse:
```text
https://official-website.thewantedsolestudio.workers.dev/admin
```

Use o token configurado em `ADMIN_ACCESS_TOKEN`.

## Cliente

Acesse:
```text
https://official-website.thewantedsolestudio.workers.dev/account
```

A área do cliente é separada do admin e mostra basket, checkout e histórico sincronizado pelo webhook.


## VALIDADO ANTES DO ZIP FINAL

Este projeto compila com `npm run build`, mas a API/admin só funciona em produção depois de configurar:

- `database_id` real no `wrangler.jsonc`
- secret `ADMIN_ACCESS_TOKEN`
- secret `TEBEX_WEBHOOK_SECRET`
- D1 com o schema `cloudflare/schema.sql`

Não faça deploy direto sem trocar `d305422f-2527-4d95-ae7d-a16c4f8bf968`, senão o Worker não terá banco para salvar produtos e pedidos.
