CORRECAO: Admin editavel com persistencia em R2

O que este pacote muda:
- /admin agora lista produtos reais vindos de R2 PRODUCT_MEDIA.
- O botao editar agora funciona.
- Pode criar, editar, excluir e resetar produtos.
- O catalogo publico (/loja, home, categorias e paginas de produto) passa a ler o catalogo salvo.
- Se o R2 nao existir em local/build, o site usa lib/store-data.ts como fallback.
- O arquivo salvo no R2 fica em: catalog/products.json

Arquivos principais:
- lib/product-store.ts
- components/admin-product-manager.tsx
- app/api/admin/products/route.ts
- app/api/admin/products/[id]/route.ts
- app/api/admin/products/reset/route.ts
- app/admin/page.tsx

Cloudflare:
Build command: npm run cf:build
Deploy command: npm run cf:deploy
Root directory: /

Bindings/variaveis necessarias:
- ADMIN_ACCESS_KEY
- TEBEX_WEBSTORE_TOKEN
- VITE_TEBEX_WEBSTORE_TOKEN
- TEBEX_WEBHOOK_SECRET
- NEXT_PUBLIC_SITE_URL
- VITE_ACCOUNT_API_BASE_URL
- R2 binding: PRODUCT_MEDIA -> bucket tws-product-assets

IMPORTANTE:
O deploy anterior ja mostrou que PRODUCT_MEDIA existe. Se o painel salvar e depois nao aparecer na loja,
limpe cache do navegador e confira se o Worker em producao e o mesmo Worker com o binding PRODUCT_MEDIA.
