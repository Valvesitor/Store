AJUSTES INCLUSOS

1. Loja sem produto em destaque por categoria
- O catálogo /loja agora mostra todos os produtos em grid.
- Removido o banner de destaque automático que aparecia ao trocar de categoria.

2. Produto com imagem, galeria e vídeo
- Adicionado campo videoUrl ao produto.
- Página do produto agora usa um slide/carrossel com botões anterior/próximo.
- O slide mostra imagem principal, imagens da galeria e vídeo.
- Suporta vídeo direto .mp4/.webm/.ogg e link YouTube/youtu.be.

3. Admin em página separada
- O botão Editar agora abre /admin/produtos/[id].
- O botão Novo produto abre /admin/produtos/novo.
- A edição ficou em uma página completa, com campos de imagem, vídeo e galeria.

4. CFX/Tebex
- O login CFX agora cria uma basket nova para evitar basket antiga/stale salva no navegador.
- O retorno da Tebex limpa melhor o carrinho quando dá erro.
- O servidor usa NEXT_PUBLIC_SITE_URL/VITE_ACCOUNT_API_BASE_URL como domínio oficial do returnUrl.

COMO APLICAR

1. Extraia este ZIP dentro da raiz do projeto.
2. Rode APLICAR_AJUSTES_LOJA_ADMIN.bat.
3. No Cloudflare deixe:
   Build command: npm run cf:build
   Deploy command: npm run cf:deploy
   Root directory: /
4. Faça Retry deployment com Clear build cache.

VARIÁVEIS IMPORTANTES NO CLOUDFLARE

ADMIN_ACCESS_KEY
TEBEX_WEBSTORE_TOKEN
VITE_TEBEX_WEBSTORE_TOKEN
NEXT_PUBLIC_SITE_URL=https://thewantedsolestudio.com
VITE_ACCOUNT_API_BASE_URL=https://thewantedsolestudio.com
TEBEX_WEBHOOK_SECRET

OBSERVAÇÃO SOBRE CFX.RE

Se continuar dando erro dentro de idms.fivem.net mesmo criando basket nova, teste também apagando localStorage/cookies do domínio da loja no navegador. O código agora força basket nova no login manual e no checkout direto.
