CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Scripts',
  description TEXT NOT NULL DEFAULT '',
  full_description TEXT NOT NULL DEFAULT '',
  price REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'novo',
  tebex_url TEXT NOT NULL DEFAULT '',
  package_id TEXT NOT NULL DEFAULT '',
  docs_url TEXT NOT NULL DEFAULT '',
  features TEXT NOT NULL DEFAULT '[]',
  requirements TEXT NOT NULL DEFAULT '[]',
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

INSERT OR IGNORE INTO products (
  id, name, category, description, full_description, price, status,
  tebex_url, package_id, docs_url, features, requirements, media,
  gradient_from, gradient_to, icon_name, visible, featured, created_at, updated_at
) VALUES (
  'tws-identity-forge',
  'TWS Identity Forge',
  'Systems',
  'Sistema premium para criação, edição e gerenciamento de identidade visual/personagens para RedM.',
  'Sistema premium para criação, edição e gerenciamento de identidade visual, personagens e outfits para RedM. Interface moderna com organização por projetos, sistema de favoritos, preview em tempo real e recursos avançados de customização.',
  650.00,
  'popular',
  'https://the-wanted-sole-studio-webstore.tebex.io/package/7457637',
  '7457637',
  'https://docs.thewantedsolestudio.workers.dev',
  '["Interface moderna e intuitiva","Sistema otimizado para alta performance","Configuração simples via arquivo de config","Suporte dedicado via Discord"]',
  '["Servidor RedM atualizado","Framework compatível","Dependências listadas na documentação oficial"]',
  '[{"type":"image","src":"/products/tws-identity-forge/logo.png","alt":"Preview principal do TWS Identity Forge"},{"type":"youtube","src":"https://www.youtube.com/watch?v=R8lHaEZYpCU","alt":"Video demonstrativo do TWS Identity Forge"}]',
  '#ece5d8',
  '#fffdf8',
  'Crown',
  1,
  1,
  datetime('now'),
  datetime('now')
);
