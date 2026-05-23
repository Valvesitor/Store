CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Scripts',
  description TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  full_description TEXT NOT NULL DEFAULT '',
  full_description_en TEXT NOT NULL DEFAULT '',
  price REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'novo',
  tebex_url TEXT NOT NULL DEFAULT '',
  package_id TEXT NOT NULL DEFAULT '',
  docs_url TEXT NOT NULL DEFAULT '',
  features TEXT NOT NULL DEFAULT '[]',
  features_en TEXT NOT NULL DEFAULT '[]',
  requirements TEXT NOT NULL DEFAULT '[]',
  requirements_en TEXT NOT NULL DEFAULT '[]',
  media TEXT NOT NULL DEFAULT '[]',
  gradient_from TEXT NOT NULL DEFAULT '#ece5d8',
  gradient_to TEXT NOT NULL DEFAULT '#fffdf8',
  icon_name TEXT NOT NULL DEFAULT 'Package',
  visible INTEGER NOT NULL DEFAULT 1,
  featured INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  transaction_id TEXT,
  event_type TEXT,
  status TEXT,
  email TEXT,
  username TEXT,
  username_id TEXT,
  basket_ident TEXT,
  currency TEXT,
  total REAL,
  raw_json TEXT,
  created_at TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  package_id TEXT,
  product_name TEXT,
  quantity INTEGER,
  price REAL,
  FOREIGN KEY(order_id) REFERENCES orders(id)
);

CREATE TABLE IF NOT EXISTS creator_codes (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  original_code TEXT NOT NULL,
  visible INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

INSERT OR IGNORE INTO products (
  id, name, name_en, category, description, description_en, full_description, full_description_en, price, status,
  tebex_url, package_id, docs_url, features, features_en, requirements, requirements_en, media,
  gradient_from, gradient_to, icon_name, visible, featured, created_at, updated_at
) VALUES (
  'tws-identity-forge',
  'TWS Identity Forge',
  'TWS Identity Forge',
  'Systems',
  'Sistema premium para criação, edição e gerenciamento de identidade visual/personagens para RedM.',
  'Premium system for creating, editing and managing visual identity and characters for RedM.',
  'Sistema premium para criação, edição e gerenciamento de identidade visual, personagens e outfits para RedM. Interface moderna com organização por projetos, sistema de favoritos, preview em tempo real e recursos avançados de customização.',
  'Premium system for creating, editing and managing visual identity, characters and outfits for RedM. Modern interface with project organization, favorites, real-time preview and advanced customization features.',
  650.00,
  'popular',
  'https://the-wanted-sole-studio-webstore.tebex.io/package/7457637',
  '7457637',
  'https://docs.thewantedsolestudio.workers.dev',
  '["Interface moderna e intuitiva","Sistema otimizado para alta performance","Configuração simples via arquivo de config","Suporte dedicado via Discord"]',
  '["Modern and intuitive interface","Optimized system for high performance","Simple setup via config file","Dedicated Discord support"]',
  '["Servidor RedM atualizado","Framework compatível","Dependências listadas na documentação oficial"]',
  '["Updated RedM server","Compatible framework","Dependencies listed in the official documentation"]',
  '[{"type":"image","src":"/products/tws-identity-forge/logo.png","alt":"Preview principal do TWS Identity Forge"},{"type":"youtube","src":"https://www.youtube.com/watch?v=R8lHaEZYpCU","alt":"Video demonstrativo do TWS Identity Forge"}]',
  '#ece5d8',
  '#fffdf8',
  'Crown',
  1,
  1,
  datetime('now'),
  datetime('now')
);


-- Documentation pages
CREATE TABLE IF NOT EXISTS docs_pages (
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
);

CREATE INDEX IF NOT EXISTS idx_docs_pages_visible_order ON docs_pages(visible, order_index);
CREATE INDEX IF NOT EXISTS idx_docs_pages_category ON docs_pages(category, order_index);
