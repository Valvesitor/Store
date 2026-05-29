const PUBLIC_TOKEN_FALLBACK = "132na-1c1984f72b78f7b52212dfbea35543ccb051bb66";

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Signature, X-Tebex-Signature",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
    }
  });
}

function getBearer(request) {
  const header = request.headers.get("Authorization") || "";
  return header.startsWith("Bearer ") ? header.slice(7).trim() : "";
}

function requireAdmin(request, env) {
  const token = getBearer(request);
  const configured = env.ADMIN_ACCESS_TOKEN || "";
  return configured && token && token === configured;
}

function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || crypto.randomUUID();
}

async function parseJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function safeJson(value, fallback) {
  if (Array.isArray(value) || typeof value === "object") return JSON.stringify(value ?? fallback);
  if (typeof value === "string" && value.trim()) return value;
  return JSON.stringify(fallback);
}

const PRODUCT_MEDIA_MAX_BYTES = 8 * 1024 * 1024;
const PRODUCT_MEDIA_ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);

function mediaCorsHeaders(extra = {}) {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    ...extra
  };
}

function sanitizeMediaFilename(value, fallback = "image.png") {
  const safeName = String(value || fallback)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return safeName || fallback;
}

function getR2ObjectKeyFromPath(pathname) {
  const key = decodeURIComponent(pathname.replace(/^\/api\/media\//, ""));
  return key.replace(/^\/+/, "");
}

function buildProductMediaKey({ productId, productName, filename, index }) {
  const folderSource = productId && !String(productId).startsWith("new-")
    ? productId
    : productName || productId || "produto";

  const folder = slugify(folderSource);
  const safeFilename = sanitizeMediaFilename(filename, `image-${Number(index || 0) + 1}.png`);
  const timestamp = Date.now();

  return `products/${folder}/${timestamp}-${Number(index || 0) + 1}-${safeFilename}`;
}

function mediaResponse(body, status = 200, headers = {}) {
  return new Response(body, {
    status,
    headers: mediaCorsHeaders(headers)
  });
}

async function handlePublicMediaRequest(request, env) {
  if (!env.PRODUCT_MEDIA) {
    return jsonResponse({ error: "Bucket R2 PRODUCT_MEDIA não configurado." }, 500);
  }

  const url = new URL(request.url);
  const key = getR2ObjectKeyFromPath(url.pathname);

  if (!key || key.includes("..")) {
    return jsonResponse({ error: "Arquivo inválido." }, 400);
  }

  const object = await env.PRODUCT_MEDIA.get(key);

  if (!object) {
    return jsonResponse({ error: "Mídia não encontrada." }, 404);
  }

  const headers = {
    "Content-Type": object.httpMetadata?.contentType || "application/octet-stream",
    "Cache-Control": "public, max-age=31536000, immutable",
    "ETag": object.httpEtag
  };

  return mediaResponse(object.body, 200, headers);
}

async function handleAdminMediaUpload(request, env) {
  if (!requireAdmin(request, env)) return jsonResponse({ error: "Admin token inválido." }, 401);
  if (!env.PRODUCT_MEDIA) return jsonResponse({ error: "Bucket R2 PRODUCT_MEDIA não configurado." }, 500);

  const form = await request.formData();
  const file = form.get("file");

  if (!file || typeof file === "string" || typeof file.arrayBuffer !== "function") {
    return jsonResponse({ error: "Nenhum arquivo enviado." }, 400);
  }

  const contentType = file.type || "application/octet-stream";

  if (!PRODUCT_MEDIA_ALLOWED_TYPES.has(contentType)) {
    return jsonResponse({ error: "Envie somente imagens JPG, PNG, WEBP, GIF ou AVIF." }, 400);
  }

  if (file.size > PRODUCT_MEDIA_MAX_BYTES) {
    return jsonResponse({ error: "Imagem muito grande. Use arquivo com até 8MB." }, 413);
  }

  const productId = String(form.get("productId") || "");
  const productName = String(form.get("productName") || "Produto");
  const index = Number(form.get("index") || 0);
  const key = buildProductMediaKey({ productId, productName, filename: file.name, index });
  const body = await file.arrayBuffer();

  await env.PRODUCT_MEDIA.put(key, body, {
    httpMetadata: {
      contentType,
      cacheControl: "public, max-age=31536000, immutable"
    },
    customMetadata: {
      originalName: file.name || "image",
      productId,
      productName
    }
  });

  const src = `/api/media/${key}`;

  return jsonResponse({
    ok: true,
    key,
    src,
    media: {
      type: "image",
      src,
      filename: file.name || key.split("/").pop(),
      alt: file.name || productName || "Product image"
    }
  });
}

function rowToProduct(row) {
  return {
    id: row.id,
    name: row.name,
    nameEn: row.name_en || "",
    category: normalizeDocsCategory(row.category),
    description: row.description,
    descriptionEn: row.description_en || "",
    fullDescription: row.full_description,
    fullDescriptionEn: row.full_description_en || "",
    price: row.price,
    status: row.status,
    tebexUrl: row.tebex_url,
    packageId: row.package_id,
    docsUrl: row.docs_url,
    features: JSON.parse(row.features || "[]"),
    featuresEn: JSON.parse(row.features_en || "[]"),
    requirements: JSON.parse(row.requirements || "[]"),
    requirementsEn: JSON.parse(row.requirements_en || "[]"),
    media: JSON.parse(row.media || "[]"),
    gradientFrom: row.gradient_from,
    gradientTo: row.gradient_to,
    iconName: row.icon_name,
    visible: row.visible === 1,
    featured: row.featured === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}


async function ensureProductEnglishColumns(env) {
  const columns = [
    ["name_en", "TEXT NOT NULL DEFAULT ''"],
    ["description_en", "TEXT NOT NULL DEFAULT ''"],
    ["full_description_en", "TEXT NOT NULL DEFAULT ''"],
    ["features_en", "TEXT NOT NULL DEFAULT '[]'"],
    ["requirements_en", "TEXT NOT NULL DEFAULT '[]'"]
  ];

  for (const [column, definition] of columns) {
    try {
      await env.DB.prepare(`ALTER TABLE products ADD COLUMN ${column} ${definition}`).run();
    } catch (error) {
      const message = String(error?.message || error || "").toLowerCase();
      if (!message.includes("duplicate column") && !message.includes("already exists")) {
        console.error(`Unable to ensure products.${column}`, error);
      }
    }
  }
}

async function listProducts(env, includeHidden = false) {
  await ensureProductEnglishColumns(env);
  const where = includeHidden ? "" : "WHERE visible = 1";
  const query = `
    SELECT * FROM products
    ${where}
    ORDER BY featured DESC, updated_at DESC, created_at DESC
  `;
  const { results } = await env.DB.prepare(query).all();
  return (results || []).map(rowToProduct);
}

function rowToCreatorCode(row) {
  return {
    id: row.id,
    label: row.label,
    originalCode: row.original_code,
    visible: row.visible === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function listCreatorCodes(env, includeHidden = false) {
  const where = includeHidden ? "" : "WHERE visible = 1";
  const query = `
    SELECT * FROM creator_codes
    ${where}
    ORDER BY updated_at DESC, created_at DESC
  `;
  const { results } = await env.DB.prepare(query).all();
  return (results || []).map(rowToCreatorCode);
}

async function upsertCreatorCode(env, payload, forcedId = null) {
  const id = forcedId || payload.id || crypto.randomUUID();
  const now = new Date().toISOString();
  const existing = await env.DB.prepare("SELECT id, created_at FROM creator_codes WHERE id = ?").bind(id).first();

  const creatorCode = {
    id,
    label: payload.label || payload.name || "Creator",
    original_code: payload.originalCode || payload.original_code || payload.code || "",
    visible: payload.visible === false ? 0 : 1,
    created_at: existing?.created_at || now,
    updated_at: now
  };

  if (!creatorCode.original_code) {
    throw new Error("Código original da Tebex é obrigatório.");
  }

  await env.DB.prepare(`
    INSERT INTO creator_codes (id, label, original_code, visible, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      label = excluded.label,
      original_code = excluded.original_code,
      visible = excluded.visible,
      updated_at = excluded.updated_at
  `).bind(
    creatorCode.id,
    creatorCode.label,
    creatorCode.original_code,
    creatorCode.visible,
    creatorCode.created_at,
    creatorCode.updated_at
  ).run();

  const row = await env.DB.prepare("SELECT * FROM creator_codes WHERE id = ?").bind(creatorCode.id).first();
  return rowToCreatorCode(row);
}

async function upsertProduct(env, payload, forcedId = null) {
  await ensureProductEnglishColumns(env);
  const id = forcedId || payload.id || slugify(payload.name);
  const now = new Date().toISOString();
  const existing = await env.DB.prepare("SELECT id, created_at FROM products WHERE id = ?").bind(id).first();

  const product = {
    id,
    name: payload.name || "Produto sem nome",
    name_en: payload.nameEn || payload.name_en || "",
    category: payload.category || "Scripts",
    description: payload.description || "",
    description_en: payload.descriptionEn || payload.description_en || "",
    full_description: payload.fullDescription || payload.full_description || payload.description || "",
    full_description_en: payload.fullDescriptionEn || payload.full_description_en || payload.descriptionEn || payload.description_en || "",
    price: Number(payload.price || 0),
    status: payload.status || "novo",
    tebex_url: payload.tebexUrl || payload.tebex_url || "",
    package_id: payload.packageId || payload.package_id || "",
    docs_url: payload.docsUrl || payload.docs_url || "https://docs.thewantedsolestudio.workers.dev",
    features: safeJson(payload.features, []),
    features_en: safeJson(payload.featuresEn || payload.features_en, []),
    requirements: safeJson(payload.requirements, []),
    requirements_en: safeJson(payload.requirementsEn || payload.requirements_en, []),
    media: safeJson(payload.media, []),
    gradient_from: payload.gradientFrom || payload.gradient_from || "#ece5d8",
    gradient_to: payload.gradientTo || payload.gradient_to || "#fffdf8",
    icon_name: payload.iconName || payload.icon_name || "Package",
    visible: payload.visible === false ? 0 : 1,
    featured: payload.featured ? 1 : 0,
    created_at: existing?.created_at || now,
    updated_at: now
  };

  await env.DB.prepare(`
    INSERT INTO products (
      id, name, name_en, category, description, description_en, full_description, full_description_en, price, status,
      tebex_url, package_id, docs_url, features, features_en, requirements, requirements_en, media,
      gradient_from, gradient_to, icon_name, visible, featured, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      name_en = excluded.name_en,
      category = excluded.category,
      description = excluded.description,
      description_en = excluded.description_en,
      full_description = excluded.full_description,
      full_description_en = excluded.full_description_en,
      price = excluded.price,
      status = excluded.status,
      tebex_url = excluded.tebex_url,
      package_id = excluded.package_id,
      docs_url = excluded.docs_url,
      features = excluded.features,
      features_en = excluded.features_en,
      requirements = excluded.requirements,
      requirements_en = excluded.requirements_en,
      media = excluded.media,
      gradient_from = excluded.gradient_from,
      gradient_to = excluded.gradient_to,
      icon_name = excluded.icon_name,
      visible = excluded.visible,
      featured = excluded.featured,
      updated_at = excluded.updated_at
  `).bind(
    product.id, product.name, product.name_en, product.category, product.description, product.description_en, product.full_description, product.full_description_en,
    product.price, product.status, product.tebex_url, product.package_id, product.docs_url,
    product.features, product.features_en, product.requirements, product.requirements_en, product.media, product.gradient_from, product.gradient_to,
    product.icon_name, product.visible, product.featured, product.created_at, product.updated_at
  ).run();

  const row = await env.DB.prepare("SELECT * FROM products WHERE id = ?").bind(product.id).first();
  return rowToProduct(row);
}

async function hmacSha256Hex(secret, body) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, body);
  return [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function sha256Hex(body) {
  const digest = await crypto.subtle.digest("SHA-256", body);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function verifyTebexWebhook(request, env, rawBody) {
  const secret = env.TEBEX_WEBHOOK_SECRET || "";
  if (!secret) return false;

  const signature =
    request.headers.get("X-Signature") ||
    request.headers.get("x-signature") ||
    request.headers.get("X-Tebex-Signature") ||
    request.headers.get("x-tebex-signature");

  if (!signature) return false;

  // Tebex signs HMAC_SHA256(secret, SHA256(raw JSON body as hex string)).
  const bodyHash = await sha256Hex(rawBody);
  const expected = await hmacSha256Hex(secret, new TextEncoder().encode(bodyHash));
  return signature.toLowerCase() === expected.toLowerCase();
}

function normalizeWebhookOrder(payload) {
  const subject = payload.subject || payload.data || payload.payment || payload;
  const customer = subject.customer || payload.customer || {};
  const usernameValue = customer.username || subject.username || payload.username || {};
  const products = subject.products || subject.packages || payload.products || payload.packages || [];
  const transactionId =
    subject.transaction_id ||
    subject.txn_id ||
    payload.transaction_id ||
    payload.id ||
    crypto.randomUUID();

  return {
    id: transactionId,
    transactionId,
    eventType: payload.type || payload.event_type || payload.event || "payment.completed",
    status: subject.status?.description || subject.status || payload.status || "completed",
    email: subject.email || customer.email || payload.email || "",
    username: typeof usernameValue === "object" ? (usernameValue.username || "") : String(usernameValue || ""),
    usernameId: String(
      (typeof usernameValue === "object" ? usernameValue.id : "") ||
      subject.username_id || customer.username_id || payload.username_id || ""
    ),
    basketIdent: subject.basket?.ident || subject.basket_ident || payload.basket_ident || "",
    currency: subject.price?.currency || subject.price_paid?.currency || subject.currency?.iso_4217 || subject.currency || payload.currency || "EUR",
    total: Number(subject.price?.amount || subject.price_paid?.amount || subject.total_price || payload.total_price || 0),
    packages: Array.isArray(products) ? products.map((item) => ({
      packageId: String(item.id || item.package_id || ""),
      productName: item.name || item.title || "Produto Tebex",
      quantity: Number(item.quantity || item.qty || 1),
      price: Number(item.paid_price?.amount || item.base_price?.amount || item.price?.amount || item.price || item.total_price || 0)
    })) : []
  };
}

async function storeOrder(env, order) {
  const now = new Date().toISOString();

  await env.DB.prepare(`
    INSERT INTO orders (
      id, transaction_id, event_type, status, email, username, username_id,
      basket_ident, currency, total, raw_json, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      event_type = excluded.event_type,
      status = excluded.status,
      email = excluded.email,
      username = excluded.username,
      username_id = excluded.username_id,
      basket_ident = excluded.basket_ident,
      currency = excluded.currency,
      total = excluded.total,
      raw_json = excluded.raw_json,
      updated_at = excluded.updated_at
  `).bind(
    order.id, order.transactionId, order.eventType, order.status, order.email,
    order.username, order.usernameId, order.basketIdent, order.currency, order.total,
    JSON.stringify(order), now, now
  ).run();

  await env.DB.prepare("DELETE FROM order_items WHERE order_id = ?").bind(order.id).run();

  for (const item of order.packages) {
    await env.DB.prepare(`
      INSERT INTO order_items (id, order_id, package_id, product_name, quantity, price)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      crypto.randomUUID(), order.id, item.packageId, item.productName, item.quantity, item.price
    ).run();
  }
}

async function getAccountSummary(env, request) {
  const url = new URL(request.url);
  const basketIdent = url.searchParams.get("basketIdent") || "";
  const usernameId = url.searchParams.get("usernameId") || "";

  let query = "SELECT * FROM orders";
  const params = [];

  if (basketIdent || usernameId) {
    query += " WHERE ";
    const parts = [];
    if (basketIdent) {
      parts.push("basket_ident = ?");
      params.push(basketIdent);
    }
    if (usernameId) {
      parts.push("username_id = ?");
      params.push(usernameId);
    }
    query += parts.join(" OR ");
  }

  query += " ORDER BY created_at DESC LIMIT 50";
  const stmt = params.length > 0 ? env.DB.prepare(query).bind(...params) : env.DB.prepare(query);

  const { results } = await stmt.all();
  const orders = [];

  for (const row of results || []) {
    const itemsResult = await env.DB.prepare("SELECT * FROM order_items WHERE order_id = ?").bind(row.id).all();
    orders.push({
      id: row.id,
      transactionId: row.transaction_id,
      eventType: row.event_type,
      status: row.status,
      email: row.email,
      username: row.username,
      usernameId: row.username_id,
      basketIdent: row.basket_ident,
      currency: row.currency,
      total: row.total,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      items: itemsResult.results || []
    });
  }

  return { ok: true, orders };
}


const DOCS_SEED_PAGES = [{"id": "overview", "product_id": "tws-identity-forge", "category": "Come Ando", "title": "TWS Identity Forge", "title_en": "TWS Identity Forge", "slug": "overview", "order_index": 10, "content_pt": "# TWS Identity Forge\n\nO **TWS Identity Forge** é um sistema premium para RedM focado em criação, edição e organização de identidade visual, personagens, outfits e recursos MetaPed.\n\nEle foi feito para clientes que precisam montar, testar, salvar e reaplicar visuais com uma interface moderna, organizada e prática.\n\n## O que você consegue fazer\n\n- Abrir um Studio de edição dentro do jogo.\n- Visualizar e testar componentes MetaPed.\n- Trabalhar com roupas, acessórios, albedos, normals, materials e paletas.\n- Organizar projetos.\n- Salvar outfits em slots.\n- Usar favoritos.\n- Ajustar câmera, luz, preview e visualização.\n- Exportar ou importar dados quando disponível.\n- Usar idiomas configurados no resource.\n\n## Público recomendado\n\nEste guia é para o **cliente final**: dono de servidor, administrador, equipe de roupas/peds ou pessoa responsável por configurar e utilizar o produto no servidor.\n\nAqui não ficam instruções internas de venda, geração de licença, Cloudflare ou gerenciamento comercial.", "content_en": "# TWS Identity Forge\n\n**TWS Identity Forge** is a premium RedM system focused on creating, editing, and organizing visual identity, characters, outfits, and MetaPed resources.\n\nIt was built for customers who need to build, test, save, and reapply looks through a modern, organized, and practical interface.\n\n## What you can do\n\n- Open an in-game editing Studio.\n- Preview and test MetaPed components.\n- Work with clothes, accessories, albedos, normals, materials, and palettes.\n- Organize projects.\n- Save outfits into slots.\n- Use favorites.\n- Adjust camera, lighting, preview, and visualization.\n- Export or import data when available.\n- Use configured resource languages.\n\n## Recommended audience\n\nThis guide is for the **end customer**: server owner, administrator, clothing/ped staff, or the person responsible for configuring and using the product on the server.\n\nIt does not include internal sales, license generation, Cloudflare, or commercial management instructions.", "visible": 1}, {"id": "requirements", "product_id": "tws-identity-forge", "category": "Come Ando", "title": "Requisitos", "title_en": "Requirements", "slug": "requirements", "order_index": 20, "content_pt": "# Requisitos\n\nAntes de instalar, confira se o servidor atende aos requisitos básicos.\n\n## Servidor\n\n- Servidor **RedM** atualizado.\n- Permissão para adicionar resources.\n- Acesso ao `server.cfg`.\n- Acesso à pasta `resources`.\n- Framework/ambiente compatível com MetaPed.\n\n## Resource MetaPed\n\nO TWS Identity Forge precisa saber qual resource aplica outfits/MetaPed no seu servidor.\n\nNo arquivo `shared/config.lua`, configure:\n\n```lua\nConfig.MetapedResource = 'MetaPedAssets'\n```\n\nSe você usa outro resource, troque pelo nome correto.\n\n## Licença\n\nSe sua versão usa validação de licença, você precisa das informações fornecidas pela The Wanted Sole Studio:\n\n```cfg\nsetr tws_license_enabled \"1\"\nset tws_license_validate_url \"URL_FORNECIDA\"\nset tws_license_key \"SUA_CHAVE\"\nset tws_license_owner_steam \"steam:1100001xxxxxxxx\"\nset tws_license_hwid \"ID-UNICO-DO-SERVIDOR\"\n```\n\nSem a licença correta, o Studio pode não abrir.", "content_en": "# Requirements\n\nBefore installing, make sure your server meets the basic requirements.\n\n## Server\n\n- Updated **RedM** server.\n- Permission to add resources.\n- Access to `server.cfg`.\n- Access to the `resources` folder.\n- MetaPed-compatible framework/environment.\n\n## MetaPed resource\n\nTWS Identity Forge must know which resource applies outfits/MetaPed on your server.\n\nIn `shared/config.lua`, configure:\n\n```lua\nConfig.MetapedResource = 'MetaPedAssets'\n```\n\nIf you use another resource, replace it with the correct name.\n\n## License\n\nIf your version uses license validation, you need the information provided by The Wanted Sole Studio:\n\n```cfg\nsetr tws_license_enabled \"1\"\nset tws_license_validate_url \"PROVIDED_URL\"\nset tws_license_key \"YOUR_KEY\"\nset tws_license_owner_steam \"steam:1100001xxxxxxxx\"\nset tws_license_hwid \"UNIQUE_SERVER_ID\"\n```\n\nWithout a valid license, the Studio may not open.", "visible": 1}, {"id": "installation", "product_id": "tws-identity-forge", "category": "Instala O", "title": "Instalação", "title_en": "Installation", "slug": "installation", "order_index": 30, "content_pt": "# Instalação\n\n## 1. Adicione o resource\n\nColoque a pasta do resource dentro da pasta de resources do seu servidor.\n\nExemplo:\n\n```txt\nresources/[local]/TWS_Identity_Forge\n```\n\n## 2. Garanta o nome correto\n\nO nome da pasta precisa ser o mesmo usado no `server.cfg`.\n\nSe a pasta se chama:\n\n```txt\nTWS_Identity_Forge\n```\n\nentão no `server.cfg` use:\n\n```cfg\nensure TWS_Identity_Forge\n```\n\n## 3. Configure a licença\n\nSe a versão recebida exige licença, adicione as linhas fornecidas pela The Wanted Sole Studio no `server.cfg`.\n\n## 4. Configure o MetaPed Resource\n\nAbra:\n\n```txt\nshared/config.lua\n```\n\ne ajuste:\n\n```lua\nConfig.MetapedResource = 'MetaPedAssets'\n```\n\n## 5. Reinicie o servidor\n\nDepois de instalar e configurar, reinicie o servidor ou dê ensure no resource.\n\n```cfg\nensure TWS_Identity_Forge\n```", "content_en": "# Installation\n\n## 1. Add the resource\n\nPlace the resource folder inside your server resources folder.\n\nExample:\n\n```txt\nresources/[local]/TWS_Identity_Forge\n```\n\n## 2. Use the correct name\n\nThe folder name must match the name used in `server.cfg`.\n\nIf the folder is called:\n\n```txt\nTWS_Identity_Forge\n```\n\nthen use this in `server.cfg`:\n\n```cfg\nensure TWS_Identity_Forge\n```\n\n## 3. Configure the license\n\nIf your version requires a license, add the lines provided by The Wanted Sole Studio to `server.cfg`.\n\n## 4. Configure the MetaPed resource\n\nOpen:\n\n```txt\nshared/config.lua\n```\n\nand adjust:\n\n```lua\nConfig.MetapedResource = 'MetaPedAssets'\n```\n\n## 5. Restart the server\n\nAfter installing and configuring, restart the server or ensure the resource.\n\n```cfg\nensure TWS_Identity_Forge\n```", "visible": 1}, {"id": "configuration", "product_id": "tws-identity-forge", "category": "Configura O", "title": "Configuração básica", "title_en": "Basic configuration", "slug": "configuration", "order_index": 40, "content_pt": "# Configuração básica\n\nAs configurações principais ficam em:\n\n```txt\nshared/config.lua\n```\n\n## Idioma\n\nIdiomas disponíveis:\n\n```lua\nConfig.Locale = 'pt-br'\n```\n\nOpções comuns:\n\n```txt\npt-br\nen-us\nes-es\n```\n\n## Tecla para abrir\n\nA tecla padrão do Studio é **J**.\n\n```lua\nConfig.OpenKey = 0xF3830D8E\n```\n\n## Limite de XML\n\nDefine o tamanho máximo aceito para XML.\n\n```lua\nConfig.MaxXml = 80000\n```\n\n## Slots de outfit\n\nDefine quantos slots de outfit cada projeto pode usar.\n\n```lua\nConfig.OutfitSlots = 10\n```\n\n## Resource MetaPed\n\nDefine qual resource será usado para aplicar outfits no servidor.\n\n```lua\nConfig.MetapedResource = 'MetaPedAssets'\n```\n\n## Debug\n\nUse somente para testes.\n\n```lua\nConfig.Debug = false\n```", "content_en": "# Basic configuration\n\nThe main settings are located in:\n\n```txt\nshared/config.lua\n```\n\n## Language\n\nAvailable languages:\n\n```lua\nConfig.Locale = 'pt-br'\n```\n\nCommon options:\n\n```txt\npt-br\nen-us\nes-es\n```\n\n## Open key\n\nThe default Studio key is **J**.\n\n```lua\nConfig.OpenKey = 0xF3830D8E\n```\n\n## XML limit\n\nDefines the maximum accepted XML size.\n\n```lua\nConfig.MaxXml = 80000\n```\n\n## Outfit slots\n\nDefines how many outfit slots each project can use.\n\n```lua\nConfig.OutfitSlots = 10\n```\n\n## MetaPed resource\n\nDefines which resource will be used to apply outfits on the server.\n\n```lua\nConfig.MetapedResource = 'MetaPedAssets'\n```\n\n## Debug\n\nUse only for testing.\n\n```lua\nConfig.Debug = false\n```", "visible": 1}, {"id": "license", "product_id": "tws-identity-forge", "category": "Configura O", "title": "Licença no servidor", "title_en": "Server license", "slug": "license", "order_index": 50, "content_pt": "# Licença no servidor\n\nAlgumas versões do TWS Identity Forge usam validação remota de licença.\n\nA The Wanted Sole Studio fornece os dados que devem ser adicionados ao `server.cfg`.\n\n## Exemplo\n\n```cfg\nsetr tws_license_enabled \"1\"\nset tws_license_validate_url \"https://SEU-ENDPOINT.workers.dev/\"\nset tws_license_key \"CHAVE-QUE-VOCE-RECEBEU\"\nset tws_license_owner_steam \"steam:1100001xxxxxxxx\"\nset tws_license_hwid \"ID-UNICO-DO-SERVIDOR\"\n```\n\n## Explicação\n\n- `tws_license_enabled`: ativa a validação.\n- `tws_license_validate_url`: URL de validação fornecida.\n- `tws_license_key`: chave recebida após a compra.\n- `tws_license_owner_steam`: Steam do dono do servidor.\n- `tws_license_hwid`: identificador único do servidor.\n\n## Importante\n\nSe os dados estiverem errados ou ausentes, o resource pode ser bloqueado e o Studio não abrirá.\n\nNão compartilhe sua chave de licença com terceiros.", "content_en": "# Server license\n\nSome versions of TWS Identity Forge use remote license validation.\n\nThe Wanted Sole Studio provides the data that must be added to `server.cfg`.\n\n## Example\n\n```cfg\nsetr tws_license_enabled \"1\"\nset tws_license_validate_url \"https://YOUR-ENDPOINT.workers.dev/\"\nset tws_license_key \"YOUR_LICENSE_KEY\"\nset tws_license_owner_steam \"steam:1100001xxxxxxxx\"\nset tws_license_hwid \"UNIQUE_SERVER_ID\"\n```\n\n## Explanation\n\n- `tws_license_enabled`: enables validation.\n- `tws_license_validate_url`: provided validation URL.\n- `tws_license_key`: key received after purchase.\n- `tws_license_owner_steam`: server owner's Steam identifier.\n- `tws_license_hwid`: unique server identifier.\n\n## Important\n\nIf the data is wrong or missing, the resource may be blocked and the Studio may not open.\n\nDo not share your license key with third parties.", "visible": 1}, {"id": "opening-studio", "product_id": "tws-identity-forge", "category": "Uso do Studio", "title": "Abrindo o Studio", "title_en": "Opening the Studio", "slug": "opening-studio", "order_index": 60, "content_pt": "# Abrindo o Studio\n\nA tecla padrão para abrir o TWS Identity Forge é:\n\n```txt\nJ\n```\n\nEla é definida em:\n\n```lua\nConfig.OpenKey = 0xF3830D8E\n```\n\n## Se não abrir\n\nVerifique:\n\n- O resource está iniciado no `server.cfg`.\n- A licença está correta.\n- O resource MetaPed está configurado.\n- O jogador tem permissão caso o servidor use permissões.\n- Não existem erros no console do servidor ou F8.\n- O idioma configurado existe na pasta `locale`.\n\n## Boas práticas\n\n- Teste em um ambiente seguro antes de usar em produção.\n- Evite usar com outros menus de roupa abertos ao mesmo tempo.\n- Faça backup de arquivos antes de alterar configurações.", "content_en": "# Opening the Studio\n\nThe default key to open TWS Identity Forge is:\n\n```txt\nJ\n```\n\nIt is defined in:\n\n```lua\nConfig.OpenKey = 0xF3830D8E\n```\n\n## If it does not open\n\nCheck:\n\n- The resource is started in `server.cfg`.\n- The license is correct.\n- The MetaPed resource is configured.\n- The player has permission if your server uses permissions.\n- There are no errors in the server console or F8.\n- The configured language exists in the `locale` folder.\n\n## Best practices\n\n- Test in a safe environment before using in production.\n- Avoid using it while other clothing menus are open.\n- Backup files before changing configurations.", "visible": 1}, {"id": "interface", "product_id": "tws-identity-forge", "category": "Uso do Studio", "title": "Interface e painéis", "title_en": "Interface and panels", "slug": "interface", "order_index": 70, "content_pt": "# Interface e painéis\n\nO Studio é dividido em áreas para facilitar a criação e organização de personagens.\n\n## Painel principal\n\nÁrea onde você acessa categorias, itens, busca e ações principais.\n\n## Preview\n\nÁrea visual onde o ped/personagem é exibido em tempo real.\n\n## Projetos\n\nUse projetos para separar criações diferentes, testes ou outfits por tema.\n\n## Favoritos\n\nMarque itens importantes para acessar rapidamente depois.\n\n## Itens aplicados\n\nMostra componentes aplicados no personagem atual.\n\n## Ferramentas extras\n\nDependendo da versão, podem existir opções para iluminação, câmera, XML, filtros, presets e exportações.", "content_en": "# Interface and panels\n\nThe Studio is divided into areas to make character creation and organization easier.\n\n## Main panel\n\nArea where you access categories, items, search, and main actions.\n\n## Preview\n\nVisual area where the ped/character is displayed in real time.\n\n## Projects\n\nUse projects to separate different creations, tests, or themed outfits.\n\n## Favorites\n\nMark important items so you can access them quickly later.\n\n## Applied items\n\nShows components currently applied to the character.\n\n## Extra tools\n\nDepending on the version, there may be options for lighting, camera, XML, filters, presets, and exports.", "visible": 1}, {"id": "projects-outfits", "product_id": "tws-identity-forge", "category": "Uso do Studio", "title": "Projetos e outfits", "title_en": "Projects and outfits", "slug": "projects-outfits", "order_index": 80, "content_pt": "# Projetos e outfits\n\nProjetos ajudam a organizar criações e manter diferentes versões de personagens.\n\n## Para que servem\n\n- Separar personagens diferentes.\n- Criar variações de roupas.\n- Testar combinações sem perder referência.\n- Organizar pacotes ou coleções.\n\n## Slots de outfit\n\nO número de slots é definido em:\n\n```lua\nConfig.OutfitSlots = 10\n```\n\nVocê pode ajustar conforme a necessidade do servidor.\n\n## Dica\n\nUse nomes claros nos projetos para facilitar a organização, por exemplo:\n\n```txt\nSheriff - Outfit formal\nCivilian - Winter outfit\nGang member - Variant 01\n```", "content_en": "# Projects and outfits\n\nProjects help organize creations and keep different character versions.\n\n## What they are for\n\n- Separate different characters.\n- Create clothing variations.\n- Test combinations without losing reference.\n- Organize packs or collections.\n\n## Outfit slots\n\nThe number of slots is defined in:\n\n```lua\nConfig.OutfitSlots = 10\n```\n\nYou can adjust it according to your server needs.\n\n## Tip\n\nUse clear project names to keep things organized, for example:\n\n```txt\nSheriff - Formal outfit\nCivilian - Winter outfit\nGang member - Variant 01\n```", "visible": 1}, {"id": "components", "product_id": "tws-identity-forge", "category": "Uso do Studio", "title": "Componentes, paletas e tint", "title_en": "Components, palettes, and tint", "slug": "components", "order_index": 90, "content_pt": "# Componentes, paletas e tint\n\nO TWS Identity Forge trabalha com recursos MetaPed e componentes visuais.\n\n## Componentes\n\nComponentes representam partes do visual, como cabeça, cabelo, corpo, acessórios, roupas e itens relacionados.\n\n## Paletas\n\nPaletas são usadas para trabalhar variações de cor/tint.\n\nExemplos de paletas conhecidas:\n\n```txt\nmetaped_tint_skin\nmetaped_tint_hair\nmetaped_tint_cloth\nmetaped_tint_leather\nmetaped_tint_hat\nmetaped_tint_makeup\n```\n\n## Albedo, Normal e Material\n\nDependendo do componente, você pode trabalhar com variações como:\n\n- Albedo\n- Normal\n- Material\n- Palette\n- Tint\n\n## Dica\n\nTeste alterações em preview antes de salvar ou aplicar em produção.", "content_en": "# Components, palettes, and tint\n\nTWS Identity Forge works with MetaPed resources and visual components.\n\n## Components\n\nComponents represent visual parts such as head, hair, body, accessories, clothes, and related items.\n\n## Palettes\n\nPalettes are used to work with color/tint variations.\n\nExamples of known palettes:\n\n```txt\nmetaped_tint_skin\nmetaped_tint_hair\nmetaped_tint_cloth\nmetaped_tint_leather\nmetaped_tint_hat\nmetaped_tint_makeup\n```\n\n## Albedo, Normal, and Material\n\nDepending on the component, you can work with variations such as:\n\n- Albedo\n- Normal\n- Material\n- Palette\n- Tint\n\n## Tip\n\nTest changes in preview before saving or applying them in production.", "visible": 1}, {"id": "camera-lighting", "product_id": "tws-identity-forge", "category": "Ferramentas", "title": "Câmera e iluminação", "title_en": "Camera and lighting", "slug": "camera-lighting", "order_index": 100, "content_pt": "# Câmera e iluminação\n\nA câmera e a iluminação ajudam a analisar detalhes do personagem com mais precisão.\n\n## Câmera\n\nUse os controles disponíveis para aproximar, girar, mover e observar o ped de diferentes ângulos.\n\n## Iluminação\n\nAs opções de iluminação ajudam a visualizar cores, texturas e detalhes que podem mudar conforme o ambiente.\n\n## Boas práticas\n\n- Veja o outfit em diferentes ângulos.\n- Teste cores com iluminação neutra.\n- Verifique chapéus, cabelo, acessórios e partes pequenas com zoom.\n- Faça prints ou vídeos para revisão se necessário.", "content_en": "# Camera and lighting\n\nCamera and lighting tools help analyze character details more accurately.\n\n## Camera\n\nUse the available controls to zoom, rotate, move, and inspect the ped from different angles.\n\n## Lighting\n\nLighting options help preview colors, textures, and details that may change depending on the environment.\n\n## Best practices\n\n- View the outfit from different angles.\n- Test colors under neutral lighting.\n- Check hats, hair, accessories, and small parts with zoom.\n- Take screenshots or videos for review when needed.", "visible": 1}, {"id": "xml-import-export", "product_id": "tws-identity-forge", "category": "Ferramentas", "title": "XML, importação e exportação", "title_en": "XML, import and export", "slug": "xml-import-export", "order_index": 110, "content_pt": "# XML, importação e exportação\n\nAlgumas versões do TWS Identity Forge permitem trabalhar com XML e dados de outfit.\n\n## Limite de XML\n\nO tamanho máximo é definido em:\n\n```lua\nConfig.MaxXml = 80000\n```\n\n## Uso recomendado\n\n- Use XML para guardar ou testar estruturas.\n- Revise o conteúdo antes de aplicar.\n- Não importe arquivos desconhecidos sem verificar.\n- Faça backup dos dados importantes.\n\n## Erros comuns\n\nSe o XML não carregar:\n\n- Verifique se o arquivo não ultrapassa o limite.\n- Confirme se o conteúdo está completo.\n- Confira erros no console/F8.\n- Teste com um XML menor para validar.", "content_en": "# XML, import and export\n\nSome versions of TWS Identity Forge allow working with XML and outfit data.\n\n## XML limit\n\nThe maximum size is defined in:\n\n```lua\nConfig.MaxXml = 80000\n```\n\n## Recommended use\n\n- Use XML to store or test structures.\n- Review the content before applying it.\n- Do not import unknown files without checking them.\n- Backup important data.\n\n## Common errors\n\nIf XML does not load:\n\n- Check that the file does not exceed the limit.\n- Confirm the content is complete.\n- Check console/F8 errors.\n- Test with a smaller XML to validate.", "visible": 1}, {"id": "troubleshooting", "product_id": "tws-identity-forge", "category": "Suporte", "title": "Problemas comuns", "title_en": "Troubleshooting", "slug": "troubleshooting", "order_index": 120, "content_pt": "# Problemas comuns\n\n## O Studio não abre\n\nVerifique:\n\n- Resource iniciado com `ensure`.\n- Tecla correta.\n- Licença correta.\n- `Config.MetapedResource` configurado.\n- Console do servidor sem erros.\n- F8 sem erros importantes.\n\n## Roupa não aplica\n\nVerifique:\n\n- Resource MetaPed correto.\n- Dependências ativas.\n- Componentes compatíveis com o ped usado.\n- Se outro script não está sobrescrevendo o visual.\n\n## Idioma não muda\n\nConfira:\n\n```lua\nConfig.Locale = 'pt-br'\n```\n\ne se o arquivo correspondente existe em:\n\n```txt\nlocale/\n```\n\n## Erros visuais\n\nTente:\n\n- Limpar cache quando necessário.\n- Reiniciar resource.\n- Testar outro ped.\n- Verificar se o item é compatível com o modelo usado.", "content_en": "# Troubleshooting\n\n## The Studio does not open\n\nCheck:\n\n- Resource started with `ensure`.\n- Correct key.\n- Correct license.\n- `Config.MetapedResource` configured.\n- Server console without errors.\n- F8 without major errors.\n\n## Clothing does not apply\n\nCheck:\n\n- Correct MetaPed resource.\n- Active dependencies.\n- Components compatible with the selected ped.\n- Whether another script is overriding the appearance.\n\n## Language does not change\n\nCheck:\n\n```lua\nConfig.Locale = 'pt-br'\n```\n\nand whether the corresponding file exists in:\n\n```txt\nlocale/\n```\n\n## Visual issues\n\nTry:\n\n- Clearing cache when needed.\n- Restarting the resource.\n- Testing another ped.\n- Checking whether the item is compatible with the model used.", "visible": 1}, {"id": "faq", "product_id": "tws-identity-forge", "category": "Suporte", "title": "FAQ", "title_en": "FAQ", "slug": "faq", "order_index": 130, "content_pt": "# FAQ\n\n## Posso revender o produto?\n\nNão. A licença é de uso pessoal/servidor conforme os termos da The Wanted Sole Studio.\n\n## Posso editar o config?\n\nSim. O arquivo `shared/config.lua` existe para configuração do cliente.\n\n## Posso compartilhar minha licença?\n\nNão. A licença é vinculada ao comprador/servidor conforme as regras de uso.\n\n## A primeira instalação precisa de suporte?\n\nNem sempre. Siga esta documentação. Se houver erro, envie prints, vídeos e logs no suporte oficial.\n\n## Posso usar com qualquer ped?\n\nDepende da compatibilidade do ped e dos componentes MetaPed usados.\n\n## Onde peço suporte?\n\nUse os canais oficiais da The Wanted Sole Studio, principalmente Discord.", "content_en": "# FAQ\n\n## Can I resell the product?\n\nNo. The license is for personal/server use according to The Wanted Sole Studio terms.\n\n## Can I edit the config?\n\nYes. The `shared/config.lua` file exists for customer configuration.\n\n## Can I share my license?\n\nNo. The license is linked to the buyer/server according to usage rules.\n\n## Do I need support for the first installation?\n\nNot always. Follow this documentation. If there is an error, send screenshots, videos, and logs through official support.\n\n## Can I use it with any ped?\n\nIt depends on the ped compatibility and the MetaPed components used.\n\n## Where do I request support?\n\nUse The Wanted Sole Studio official channels, mainly Discord.", "visible": 1}, {"id": "changelog", "product_id": "tws-identity-forge", "category": "Refer Ncia", "title": "Versão e changelog", "title_en": "Version and changelog", "slug": "changelog", "order_index": 140, "content_pt": "# Versão e changelog\n\nA versão atual do resource é definida no `fxmanifest.lua`.\n\n```lua\nversion '2.0.7'\n```\n\n## Recomendação\n\nSempre verifique a versão antes de abrir ticket de suporte.\n\nAo pedir suporte, informe:\n\n- Versão do produto.\n- Nome do resource.\n- Prints ou vídeo do problema.\n- Logs do console do servidor.\n- Logs do F8, se existir.\n- Alterações feitas no `shared/config.lua`.\n\n## Atualizações\n\nAtualizações podem incluir correções, melhorias visuais, novas funções ou ajustes de compatibilidade.", "content_en": "# Version and changelog\n\nThe current resource version is defined in `fxmanifest.lua`.\n\n```lua\nversion '2.0.7'\n```\n\n## Recommendation\n\nAlways check the version before opening a support ticket.\n\nWhen requesting support, include:\n\n- Product version.\n- Resource name.\n- Screenshots or video of the issue.\n- Server console logs.\n- F8 logs, if available.\n- Changes made to `shared/config.lua`.\n\n## Updates\n\nUpdates may include fixes, visual improvements, new features, or compatibility adjustments.", "visible": 1}];


function normalizeDocsCategory(category) {
  const value = String(category || "").trim().toLowerCase();

  if (["comeando", "come ando", "comecando", "começando", "getting started"].includes(value)) return "Começando";
  if (["instalao", "instala o", "instalacao", "instalação", "installation"].includes(value)) return "Instalação";
  if (["configurao", "configura o", "configuracao", "configuração", "configuration"].includes(value)) return "Configuração";
  if (["uso do studio", "studio usage"].includes(value)) return "Uso do Studio";
  if (["ferramentas", "tools"].includes(value)) return "Ferramentas";
  if (["suporte", "support"].includes(value)) return "Suporte";
  if (["referncia", "referencia", "referência", "reference"].includes(value)) return "Referência";

  return category || "Geral";
}

function rowToDocsPage(row) {
  return {
    id: row.id,
    productId: row.product_id,
    category: row.category,
    title: row.title,
    titleEn: row.title_en || "",
    slug: row.slug,
    orderIndex: row.order_index,
    contentPt: row.content_pt || "",
    contentEn: row.content_en || "",
    visible: row.visible === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function ensureDocsTables(env) {
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS docs_pages (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL DEFAULT 'tws-identity-forge',
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    title_en TEXT NOT NULL DEFAULT '',
    slug TEXT NOT NULL UNIQUE,
    order_index INTEGER NOT NULL DEFAULT 0,
    content_pt TEXT NOT NULL DEFAULT '',
    content_en TEXT NOT NULL DEFAULT '',
    visible INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`).run();

  await env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_docs_pages_visible_order ON docs_pages(visible, order_index)`).run();
  await env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_docs_pages_category ON docs_pages(category, order_index)`).run();

  await env.DB.prepare("UPDATE docs_pages SET category = 'Começando', updated_at = datetime('now') WHERE id IN ('overview','requirements')").run();
  await env.DB.prepare("UPDATE docs_pages SET category = 'Instalação', updated_at = datetime('now') WHERE id IN ('installation')").run();
  await env.DB.prepare("UPDATE docs_pages SET category = 'Configuração', updated_at = datetime('now') WHERE id IN ('configuration','license')").run();
  await env.DB.prepare("UPDATE docs_pages SET category = 'Uso do Studio', updated_at = datetime('now') WHERE id IN ('opening-studio','interface','projects-outfits','components')").run();
  await env.DB.prepare("UPDATE docs_pages SET category = 'Ferramentas', updated_at = datetime('now') WHERE id IN ('camera-lighting','xml-import-export')").run();
  await env.DB.prepare("UPDATE docs_pages SET category = 'Suporte', updated_at = datetime('now') WHERE id IN ('troubleshooting','faq')").run();
  await env.DB.prepare("UPDATE docs_pages SET category = 'Referência', updated_at = datetime('now') WHERE id IN ('changelog')").run();

  const count = await env.DB.prepare("SELECT COUNT(*) AS total FROM docs_pages").first();
  if (!count || Number(count.total) === 0) {
    for (const page of DOCS_SEED_PAGES) {
      await env.DB.prepare(`INSERT INTO docs_pages (
        id, product_id, category, title, title_en, slug, order_index, content_pt, content_en, visible, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`)
        .bind(page.id, page.product_id, page.category, page.title, page.title_en, page.slug, page.order_index, page.content_pt, page.content_en, page.visible)
        .run();
    }
  }
}

async function listDocsPages(env, includeHidden = false) {
  await ensureDocsTables(env);
  const sql = includeHidden
    ? "SELECT * FROM docs_pages ORDER BY order_index ASC, title ASC"
    : "SELECT * FROM docs_pages WHERE visible = 1 ORDER BY order_index ASC, title ASC";
  const result = await env.DB.prepare(sql).all();
  return (result.results || []).map(rowToDocsPage);
}

function normalizeDocsPayload(payload, fallbackId) {
  const slug = slugify(payload.slug || payload.title || fallbackId || "");
  return {
    id: String(payload.id || fallbackId || slug || crypto.randomUUID()),
    productId: String(payload.productId || payload.product_id || "tws-identity-forge"),
    category: normalizeDocsCategory(payload.category || "Geral"),
    title: String(payload.title || "Sem título"),
    titleEn: String(payload.titleEn || payload.title_en || payload.title || ""),
    slug,
    orderIndex: Number(payload.orderIndex ?? payload.order_index ?? 999),
    contentPt: String(payload.contentPt || payload.content_pt || ""),
    contentEn: String(payload.contentEn || payload.content_en || payload.contentPt || payload.content_pt || ""),
    visible: payload.visible === false || payload.visible === 0 ? 0 : 1
  };
}

async function upsertDocsPage(env, payload, idOverride) {
  await ensureDocsTables(env);
  const page = normalizeDocsPayload(payload, idOverride);

  await env.DB.prepare(`INSERT INTO docs_pages (
    id, product_id, category, title, title_en, slug, order_index, content_pt, content_en, visible, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  ON CONFLICT(id) DO UPDATE SET
    product_id = excluded.product_id,
    category = excluded.category,
    title = excluded.title,
    title_en = excluded.title_en,
    slug = excluded.slug,
    order_index = excluded.order_index,
    content_pt = excluded.content_pt,
    content_en = excluded.content_en,
    visible = excluded.visible,
    updated_at = datetime('now')`)
    .bind(page.id, page.productId, page.category, page.title, page.titleEn, page.slug, page.orderIndex, page.contentPt, page.contentEn, page.visible)
    .run();

  const row = await env.DB.prepare("SELECT * FROM docs_pages WHERE id = ?").bind(page.id).first();
  return rowToDocsPage(row);
}


async function handleApi(request, env) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (request.method === "OPTIONS") {
    return jsonResponse({}, 204);
  }

  if (pathname === "/api/health") {
    return jsonResponse({ ok: true, service: "TWS Worker API" });
  }

  if (pathname === "/api/tebex/headless") {
    const headlessPath = url.searchParams.get("path") || "";

    if (!headlessPath.startsWith("/accounts/") && !headlessPath.startsWith("/baskets/")) {
      return jsonResponse({ error: "Rota Tebex não permitida." }, 400);
    }

    const upstreamUrl = new URL(`https://headless.tebex.io/api${headlessPath}`);

    const upstreamResponse = await fetch(upstreamUrl.toString(), {
      method: request.method,
      headers: {
        "Accept": "application/json",
        "Content-Type": request.headers.get("Content-Type") || "application/json"
      },
      body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.text()
    });

    const contentType = upstreamResponse.headers.get("Content-Type") || "application/json";
    const body = await upstreamResponse.text();

    return new Response(body, {
      status: upstreamResponse.status,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
    });
  }

  if (pathname.startsWith("/api/media/") && request.method === "GET") {
    return handlePublicMediaRequest(request, env);
  }

  if (pathname === "/api/admin/media/upload" && request.method === "POST") {
    return handleAdminMediaUpload(request, env);
  }

  if (pathname === "/api/docs" && request.method === "GET") {
    return jsonResponse({ pages: await listDocsPages(env, false) });
  }

  if (pathname === "/api/admin/docs" && request.method === "GET") {
    if (!requireAdmin(request, env)) return jsonResponse({ error: "Admin token inválido." }, 401);
    return jsonResponse({ pages: await listDocsPages(env, true) });
  }

  if (pathname === "/api/admin/docs" && request.method === "POST") {
    if (!requireAdmin(request, env)) return jsonResponse({ error: "Admin token inválido." }, 401);
    const payload = await parseJson(request);
    return jsonResponse({ page: await upsertDocsPage(env, payload) });
  }

  const adminDocsMatch = pathname.match(/^\/api\/admin\/docs\/([^/]+)$/);
  if (adminDocsMatch && request.method === "PUT") {
    if (!requireAdmin(request, env)) return jsonResponse({ error: "Admin token inválido." }, 401);
    const payload = await parseJson(request);
    return jsonResponse({ page: await upsertDocsPage(env, payload, decodeURIComponent(adminDocsMatch[1])) });
  }

  if (adminDocsMatch && request.method === "DELETE") {
    if (!requireAdmin(request, env)) return jsonResponse({ error: "Admin token inválido." }, 401);
    await ensureDocsTables(env);
    await env.DB.prepare("DELETE FROM docs_pages WHERE id = ?").bind(decodeURIComponent(adminDocsMatch[1])).run();
    return jsonResponse({ ok: true });
  }

  if (pathname === "/api/products" && request.method === "GET") {
    return jsonResponse({ products: await listProducts(env, false) });
  }

  if (pathname === "/api/admin/products" && request.method === "GET") {
    if (!requireAdmin(request, env)) return jsonResponse({ error: "Admin token inválido." }, 401);
    return jsonResponse({ products: await listProducts(env, true) });
  }

  if (pathname === "/api/admin/products" && request.method === "POST") {
    if (!requireAdmin(request, env)) return jsonResponse({ error: "Admin token inválido." }, 401);
    const payload = await parseJson(request);
    return jsonResponse({ product: await upsertProduct(env, payload) });
  }

  const adminProductMatch = pathname.match(/^\/api\/admin\/products\/([^/]+)$/);
  if (adminProductMatch && request.method === "PUT") {
    if (!requireAdmin(request, env)) return jsonResponse({ error: "Admin token inválido." }, 401);
    const payload = await parseJson(request);
    return jsonResponse({ product: await upsertProduct(env, payload, decodeURIComponent(adminProductMatch[1])) });
  }

  if (adminProductMatch && request.method === "DELETE") {
    if (!requireAdmin(request, env)) return jsonResponse({ error: "Admin token inválido." }, 401);
    await env.DB.prepare("DELETE FROM products WHERE id = ?")
      .bind(decodeURIComponent(adminProductMatch[1]))
      .run();
    return jsonResponse({ ok: true });
  }

  if (pathname === "/api/creator-codes" && request.method === "GET") {
    return jsonResponse({ creatorCodes: await listCreatorCodes(env, false) });
  }

  if (pathname === "/api/admin/creator-codes" && request.method === "GET") {
    if (!requireAdmin(request, env)) return jsonResponse({ error: "Admin token inválido." }, 401);
    return jsonResponse({ creatorCodes: await listCreatorCodes(env, true) });
  }

  if (pathname === "/api/admin/creator-codes" && request.method === "POST") {
    if (!requireAdmin(request, env)) return jsonResponse({ error: "Admin token inválido." }, 401);
    const payload = await parseJson(request);
    return jsonResponse({ creatorCode: await upsertCreatorCode(env, payload) });
  }

  const adminCreatorCodeMatch = pathname.match(/^\/api\/admin\/creator-codes\/([^/]+)$/);
  if (adminCreatorCodeMatch && request.method === "PUT") {
    if (!requireAdmin(request, env)) return jsonResponse({ error: "Admin token inválido." }, 401);
    const payload = await parseJson(request);
    return jsonResponse({ creatorCode: await upsertCreatorCode(env, payload, decodeURIComponent(adminCreatorCodeMatch[1])) });
  }

  if (adminCreatorCodeMatch && request.method === "DELETE") {
    if (!requireAdmin(request, env)) return jsonResponse({ error: "Admin token inválido." }, 401);
    await env.DB.prepare("DELETE FROM creator_codes WHERE id = ?")
      .bind(decodeURIComponent(adminCreatorCodeMatch[1]))
      .run();
    return jsonResponse({ ok: true });
  }

  if (pathname === "/api/account/summary" && request.method === "GET") {
    return jsonResponse(await getAccountSummary(env, request));
  }

  if (pathname === "/api/tebex/webhook" && request.method === "GET") {
    return jsonResponse({
      ok: true,
      endpoint: "tebex-webhook",
      message: "Webhook endpoint online. Tebex validation must use POST."
    });
  }

  if (pathname === "/api/tebex/webhook" && request.method === "POST") {
    const rawBody = await request.arrayBuffer();
    const rawText = new TextDecoder().decode(rawBody);

    let payload;
    try {
      payload = JSON.parse(rawText || "{}");
    } catch {
      return jsonResponse({ ok: false, error: "Invalid JSON body." }, 400);
    }

    // Tebex first sends a validation.webhook request.
    // It must receive HTTP 200 with { id: payload.id }, otherwise the endpoint is not validated.
    if (payload.type === "validation.webhook") {
      return jsonResponse({ id: payload.id });
    }

    const valid = await verifyTebexWebhook(request, env, rawBody);

    if (!valid) {
      return jsonResponse({ ok: false, error: "Assinatura Tebex inválida." }, 401);
    }

    const order = normalizeWebhookOrder(payload);
    await storeOrder(env, order);
    return jsonResponse({ ok: true, stored: true });
  }

  return jsonResponse({ error: "API route not found." }, 404);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      try {
        return await handleApi(request, env);
      } catch (error) {
        console.error(error);
        return jsonResponse({ error: error?.message || "Erro interno." }, 500);
      }
    }

    return env.ASSETS.fetch(request);
  }
};
