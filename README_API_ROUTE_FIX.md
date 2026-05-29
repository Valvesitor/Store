# Correção: /api abrindo o site

Se `https://thewantedsolestudio.com/api/tebex/webhook` abre a página do site em vez de retornar JSON, o domínio está caindo no SPA/static antes do Worker.

Este pacote adiciona no `wrangler.jsonc`:

```jsonc
"routes": [
  {
    "pattern": "thewantedsolestudio.com/api/*",
    "zone_name": "thewantedsolestudio.com"
  },
  {
    "pattern": "www.thewantedsolestudio.com/api/*",
    "zone_name": "thewantedsolestudio.com"
  }
],
"assets": {
  "run_worker_first": ["/api/*"]
}
```

Depois rode:

```bash
npm run build
npx wrangler deploy
```

Teste no navegador:

```text
https://thewantedsolestudio.com/api/tebex/webhook
```

O correto é retornar JSON, não abrir o site.

Depois valide novamente na Tebex:

```text
https://thewantedsolestudio.com/api/tebex/webhook
```
