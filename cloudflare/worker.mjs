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

function rowToProduct(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    fullDescription: row.full_description,
    price: row.price,
    status: row.status,
    tebexUrl: row.tebex_url,
    packageId: row.package_id,
    docsUrl: row.docs_url,
    features: JSON.parse(row.features || "[]"),
    requirements: JSON.parse(row.requirements || "[]"),
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

async function listProducts(env, includeHidden = false) {
  const where = includeHidden ? "" : "WHERE visible = 1";
  const query = `
    SELECT * FROM products
    ${where}
    ORDER BY featured DESC, updated_at DESC, created_at DESC
  `;
  const { results } = await env.DB.prepare(query).all();
  return (results || []).map(rowToProduct);
}

async function upsertProduct(env, payload, forcedId = null) {
  const id = forcedId || payload.id || slugify(payload.name);
  const now = new Date().toISOString();
  const existing = await env.DB.prepare("SELECT id, created_at FROM products WHERE id = ?").bind(id).first();

  const product = {
    id,
    name: payload.name || "Produto sem nome",
    category: payload.category || "Scripts",
    description: payload.description || "",
    full_description: payload.fullDescription || payload.full_description || payload.description || "",
    price: Number(payload.price || 0),
    status: payload.status || "novo",
    tebex_url: payload.tebexUrl || payload.tebex_url || "",
    package_id: payload.packageId || payload.package_id || "",
    docs_url: payload.docsUrl || payload.docs_url || "https://docs.thewantedsolestudio.workers.dev",
    features: safeJson(payload.features, []),
    requirements: safeJson(payload.requirements, []),
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
      id, name, category, description, full_description, price, status,
      tebex_url, package_id, docs_url, features, requirements, media,
      gradient_from, gradient_to, icon_name, visible, featured, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      category = excluded.category,
      description = excluded.description,
      full_description = excluded.full_description,
      price = excluded.price,
      status = excluded.status,
      tebex_url = excluded.tebex_url,
      package_id = excluded.package_id,
      docs_url = excluded.docs_url,
      features = excluded.features,
      requirements = excluded.requirements,
      media = excluded.media,
      gradient_from = excluded.gradient_from,
      gradient_to = excluded.gradient_to,
      icon_name = excluded.icon_name,
      visible = excluded.visible,
      featured = excluded.featured,
      updated_at = excluded.updated_at
  `).bind(
    product.id, product.name, product.category, product.description, product.full_description,
    product.price, product.status, product.tebex_url, product.package_id, product.docs_url,
    product.features, product.requirements, product.media, product.gradient_from, product.gradient_to,
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

async function handleApi(request, env) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (request.method === "OPTIONS") {
    return jsonResponse({}, 204);
  }

  if (pathname === "/api/health") {
    return jsonResponse({ ok: true, service: "TWS Worker API" });
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
    await env.DB.prepare("UPDATE products SET visible = 0, updated_at = ? WHERE id = ?")
      .bind(new Date().toISOString(), decodeURIComponent(adminProductMatch[1]))
      .run();
    return jsonResponse({ ok: true });
  }

  if (pathname === "/api/account/summary" && request.method === "GET") {
    return jsonResponse(await getAccountSummary(env, request));
  }

  if (pathname === "/api/tebex/webhook" && request.method === "POST") {
    const rawBody = await request.arrayBuffer();
    const valid = await verifyTebexWebhook(request, env, rawBody);

    if (!valid) {
      return jsonResponse({ ok: false, error: "Assinatura Tebex inválida." }, 401);
    }

    const payload = JSON.parse(new TextDecoder().decode(rawBody));

    if (payload.type === "validation.webhook") {
      return jsonResponse({ id: payload.id });
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
