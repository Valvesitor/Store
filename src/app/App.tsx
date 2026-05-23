import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, Menu, X, ExternalLink, BookOpen,
  MessageCircle, Star, Zap, Shield, Crown, ArrowRight,
  Package, Users, Palette, Code2, ChevronDown, Check,
  ChevronRight, Sparkles, LayoutGrid, Filter, LogIn, ShoppingCart,
  Play, Image as ImageIcon, User, LogOut, Github, Plus
} from "lucide-react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = "Todos" | "Scripts" | "Custom Peds" | "Systems" | "Outfit / Creator" | "Add-ons" | "Free Resources";
type SortOrder = "recent" | "popular" | "price-asc" | "price-desc";
type ProductStatus = "novo" | "atualizado" | "popular" | "em-breve";
type SiteLanguage = "pt_BR" | "en_US";
type CurrencyCode = "AUD" | "BRL" | "CAD" | "DKK" | "EUR" | "NOK" | "NZD" | "GBP" | "SEK" | "USD" | "PLN";
type ProductMedia = {
  type: "image" | "video" | "youtube";
  src: string;
  poster?: string;
  alt: string;
};

interface Product {
  id: string;
  name: string;
  nameEn?: string;
  category: Exclude<Category, "Todos">;
  description: string;
  descriptionEn?: string;
  fullDescription: string;
  fullDescriptionEn?: string;
  price: number;
  priceCurrency?: CurrencyCode;
  priceSource?: "tebex" | "fallback";
  status: ProductStatus;
  tebexUrl: string;
  packageId?: string;
  docsUrl?: string;
  features: string[];
  featuresEn?: string[];
  requirements: string[];
  requirementsEn?: string[];
  media?: ProductMedia[];
  gradientFrom: string;
  gradientTo: string;
  iconName: string;
  visible?: boolean;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface CreatorCode {
  id: string;
  label: string;
  originalCode: string;
  visible: boolean;
  createdAt?: string;
  updatedAt?: string;
}


interface DocsPageRecord {
  id: string;
  productId?: string;
  category: string;
  title: string;
  titleEn?: string;
  slug: string;
  orderIndex: number;
  contentPt: string;
  contentEn?: string;
  visible: boolean;
  updatedAt?: string;
}

declare global {
  interface Window {
    Tebex?: {
      checkout: {
        init: (config: {
          ident: string;
          locale?: string;
          theme?: "light" | "dark" | "auto" | "default";
          colors?: Array<{ name: "primary" | "secondary"; color: string }>;
          closeOnPaymentComplete?: boolean;
        }) => void;
        launch: () => void;
      };
    };
  }
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PRODUCTS: Product[] = [
  {
    id: "tws-identity-forge",
    name: "TWS Identity Forge",
    category: "Systems",
    description: "Sistema premium para criação, edição e gerenciamento de identidade visual/personagens para RedM.",
    fullDescription: "Sistema premium para criação, edição e gerenciamento de identidade visual, personagens e outfits para RedM. Interface moderna com organização por projetos, sistema de favoritos, preview em tempo real e recursos avançados de customização. Desenvolvido para servidores que exigem performance e originalidade.",
    price:650.00,
    status: "popular",
    tebexUrl: "https://the-wanted-sole-studio-webstore.tebex.io/package/7457637",
    packageId: "7457637",
    docsUrl: "https://docs.thewantedsolestudio.workers.dev",
    features: [
      "Interface moderna e intuitiva",
      "Sistema otimizado para alta performance",
      "Configuração simples via arquivo de config",
      "Suporte completo a RedM e frameworks compatíveis",
      "Documentação inclusa e detalhada",
      "Organização por projetos e favoritos",
      "Preview em tempo real de personagens",
      "Suporte dedicado via Discord"
    ],
    requirements: [
      "Servidor RedM atualizado",
      "Framework compatível (detalhado na documentação)",
      "Dependências listadas na documentação oficial"
    ],
    media: [
      {
        type: "image",
        src: "/products/tws-identity-forge/logo.png",
        alt: "Preview principal do TWS Identity Forge"
      },
      {
        type: "image",
        src: "/products/tws-identity-forge/preview-2.webp",
        alt: "Tela de customizacao do TWS Identity Forge"
      },
      {
        // Aceita .mp4 local, .mp4 externo ou YouTube.
        // Para YouTube, troque type para "youtube" e cole a URL normal ou embed no src.
        type: "youtube",
        src: "https://www.youtube.com/watch?v=R8lHaEZYpCU",
        poster: "/products/tws-identity-forge/video-poster.webp",
        alt: "Video demonstrativo do TWS Identity Forge"
      }
    ],
    gradientFrom: "#ece5d8",
    gradientTo: "#fffdf8",
    iconName: "Crown"
  },
/*
  {
    id: "tws-economy-plus",
    name: "TWS Economy Plus",
    category: "Scripts",
    description: "Sistema de economia avançado com bancos, mercados, impostos e painel administrativo completo.",
    fullDescription: "Sistema de economia completo para servidores RedM. Inclui banco, mercado dinâmico, sistema de impostos configurável, logs administrativos detalhados e interface de gerenciamento premium. Anti-exploit integrado e notificações em tempo real para uma experiência imersiva.",
    price: 89.9,
    status: "atualizado",
    tebexUrl: "#",
    docsUrl: "https://docs.thewantedsolestudio.workers.dev",
    features: [
      "Sistema bancário completo",
      "Mercado dinâmico configurável",
      "Sistema de impostos por zona",
      "Logs administrativos detalhados",
      "Interface de gerenciamento premium",
      "Anti-exploit integrado",
      "Notificações em tempo real",
      "Suporte a múltiplas moedas"
    ],
    requirements: [
      "Servidor RedM",
      "Base de dados MySQL/MariaDB",
      "Framework listado na documentação"
    ],
    media: [],
    gradientFrom: "#ebe3d3",
    gradientTo: "#fffdf8",
    iconName: "Star"
  },
  {
    id: "tws-outfit-manager",
    name: "TWS Outfit Manager",
    category: "Outfit / Creator",
    description: "Gerencie e organize outfits com interface limpa, múltiplos perfis por jogador e sistema de favoritos.",
    fullDescription: "Sistema completo de gerenciamento de outfits para servidores RedM. Organize, salve e carregue roupas de personagens com facilidade. Suporte a múltiplos perfis por jogador, integração com custom peds e interface elegante.",
    price: 49.9,
    status: "novo",
    tebexUrl: "#",
    docsUrl: "https://docs.thewantedsolestudio.workers.dev",
    features: [
      "Gerenciamento completo de outfits",
      "Múltiplos perfis por jogador",
      "Salvar e carregar outfits instantaneamente",
      "Interface limpa e elegante",
      "Sistema de favoritos",
      "Compatível com custom peds"
    ],
    requirements: [
      "Servidor RedM",
      "Framework QBCore ou ESX compatível",
      "Dependências detalhadas na documentação"
    ],
    media: [],
    gradientFrom: "#e9e4de",
    gradientTo: "#fffdf8",
    iconName: "Palette"
  },
  {
    id: "tws-ped-pack-vol1",
    name: "TWS Custom Ped Pack Vol.1",
    category: "Custom Peds",
    description: "Pack exclusivo com custom peds de alta qualidade, texturas otimizadas e compatibilidade total com RedM.",
    fullDescription: "Primeiro volume do pack exclusivo de custom peds da The Wanted Sole Studio. Modelos de alta qualidade com texturas otimizadas, perfeitamente compatíveis com servidores RedM. Sem impacto negativo na performance do servidor.",
    price: 39.9,
    status: "popular",
    tebexUrl: "#",
    features: [
      "Modelos de alta qualidade",
      "Texturas otimizadas e comprimidas",
      "Totalmente compatível com RedM",
      "Sem impacto na performance",
      "Inclui arquivos de instalação",
      "Suporte técnico via Discord"
    ],
    requirements: [
      "Servidor RedM",
      "Resource de custom peds configurado",
      "StreamLoader compatível"
    ],
    media: [],
    gradientFrom: "#e1e4dd",
    gradientTo: "#fffdf8",
    iconName: "Users"
  },
  {
    id: "tws-notification-system",
    name: "TWS Notification System",
    category: "Add-ons",
    description: "Sistema de notificações elegante e completamente customizável para servidores RedM.",
    fullDescription: "Sistema de notificações premium com design elegante, múltiplos tipos de alerta, posicionamento configurável e animações suaves. Substitui sistemas de notificação padrão com uma experiência visual superior.",
    price: 24.9,
    status: "novo",
    tebexUrl: "#",
    features: [
      "Design elegante e premium",
      "Múltiplos tipos de notificação",
      "Posição e duração configuráveis",
      "Animações suaves",
      "Sons customizáveis",
      "Fácil integração com outros scripts"
    ],
    requirements: [
      "Servidor RedM",
      "Framework compatível"
    ],
    media: [],
    gradientFrom: "#e2e2e2",
    gradientTo: "#fffdf8",
    iconName: "Zap"
  },
  {
    id: "tws-starter-pack",
    name: "TWS Starter Pack",
    category: "Free Resources",
    description: "Pack gratuito com recursos essenciais para quem está iniciando um servidor RedM.",
    fullDescription: "Pack gratuito com recursos essenciais para quem está começando um servidor RedM. Inclui scripts básicos, documentação completa e suporte inicial via Discord. A melhor forma de começar com qualidade.",
    price: 0,
    priceCurrency: PRODUCT_BASE_CURRENCY,
    priceSource: "fallback",
    status: "novo",
    tebexUrl: "#",
    features: [
      "Scripts básicos inclusos",
      "Documentação completa",
      "Suporte inicial via Discord",
      "Atualizações gratuitas",
      "Fácil instalação passo a passo"
    ],
    requirements: [
      "Servidor RedM básico"
    ],
    media: [],
    gradientFrom: "#ece6dc",
    gradientTo: "#fffdf8",
    iconName: "Package"
  }
*/
];

const CATEGORIES: Category[] = ["Todos", "Scripts", "Custom Peds", "Systems", "Outfit / Creator", "Add-ons", "Free Resources"];

const WHY_FEATURES = [
  {
    icon: Crown,
    title: "Exclusividade Total",
    description: "Nenhum produto genérico. Cada script ou ped é pensado para servidores que querem se destacar da concorrência."
  },
  {
    icon: Shield,
    title: "Qualidade Garantida",
    description: "Produtos testados, organizados e desenvolvidos com foco em estabilidade, performance e segurança."
  },
  {
    icon: MessageCircle,
    title: "Suporte de Verdade",
    description: "Suporte via Discord para dúvidas, instalação, atualizações e acompanhamento contínuo."
  },
  {
    icon: Star,
    title: "Identidade Premium",
    description: "Design, sistemas e recursos feitos para dar personalidade única e diferenciada ao seu servidor RedM."
  }
];

const FAQ_ITEMS = [
  {
    q: "Os produtos são para RedM?",
    a: "Sim. O foco principal da The Wanted Sole Studio é conteúdo premium exclusivo para RedM. Todos os scripts, peds e sistemas são desenvolvidos e testados especificamente para servidores RedM."
  },
  {
    q: "A compra é feita pelo site?",
    a: "O site apresenta os produtos e seus detalhes, mas o pagamento é processado de forma segura pela plataforma Tebex. Você será redirecionado ao clicar em Comprar."
  },
  {
    q: "Recebo suporte após comprar?",
    a: "Sim. O suporte técnico é feito pelo Discord oficial da The Wanted Sole Studio. Nossa equipe está disponível para ajudar com dúvidas, instalação e problemas."
  },
  {
    q: "Posso revender ou compartilhar os arquivos?",
    a: "Não. A licença é individual por servidor e não permite revenda, redistribuição, vazamento ou compartilhamento dos arquivos. Violações resultam em cancelamento imediato da licença."
  },
  {
    q: "Os scripts recebem atualizações?",
    a: "Sim. Produtos ativos podem receber melhorias, correções de bugs e novas funcionalidades conforme necessidade. Compradores recebem atualizações gratuitamente."
  },
  {
    q: "Posso pedir um projeto customizado?",
    a: "Sim. Abra um ticket no Discord para verificar disponibilidade, prazo e orçamento para desenvolvimento de scripts ou recursos personalizados."
  }
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ElementType> = {
  Crown, Palette, Users, Star, Zap, Package, Code2, Shield, Sparkles
};

const STATUS_CONFIG: Record<ProductStatus, { label: string; cls: string }> = {
  novo: { label: "Novo", cls: "bg-emerald-950 text-emerald-400 border border-emerald-800/50" },
  atualizado: { label: "Atualizado", cls: "bg-sky-950 text-sky-400 border border-sky-800/50" },
  popular: { label: "Popular", cls: "bg-amber-950 text-amber-400 border border-amber-800/50" },
  "em-breve": { label: "Em Breve", cls: "bg-zinc-900 text-zinc-400 border border-zinc-700/50" }
};

const PRODUCT_BASE_CURRENCY: CurrencyCode = "USD";
const PRODUCT_CURRENCY_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  BRL: 5.05,
  EUR: 0.92,
  GBP: 0.78,
  AUD: 1.52,
  CAD: 1.36,
  DKK: 6.86,
  NOK: 10.60,
  NZD: 1.66,
  SEK: 10.40,
  PLN: 3.95
};

function getCurrencyLocale(currency: CurrencyCode | string) {
  if (currency === "BRL") return "pt-BR";
  if (currency === "DKK" || currency === "NOK" || currency === "SEK") return "da-DK";
  if (currency === "PLN") return "pl-PL";
  return "en-US";
}

function normalizeCurrencyCode(value?: string | null): CurrencyCode {
  const upper = String(value ?? PRODUCT_BASE_CURRENCY).toUpperCase();
  return CURRENCIES.includes(upper as CurrencyCode) ? (upper as CurrencyCode) : PRODUCT_BASE_CURRENCY;
}

function convertProductPrice(price: number, targetCurrency: CurrencyCode, sourceCurrency: CurrencyCode = PRODUCT_BASE_CURRENCY) {
  if (price === 0) return 0;
  if (sourceCurrency === targetCurrency) return price;

  const priceInUsd = price / PRODUCT_CURRENCY_RATES[sourceCurrency];
  return priceInUsd * PRODUCT_CURRENCY_RATES[targetCurrency];
}

function formatPrice(price: number, currency: CurrencyCode = PRODUCT_BASE_CURRENCY) {
  if (price === 0) return "Grátis";
  return new Intl.NumberFormat(getCurrencyLocale(currency), {
    style: "currency",
    currency
  }).format(price);
}

function formatProductPrice(price: number, currency: CurrencyCode, sourceCurrency: CurrencyCode = PRODUCT_BASE_CURRENCY) {
  return formatPrice(convertProductPrice(price, currency, sourceCurrency), currency);
}

function getStoredCurrency(): CurrencyCode {
  const value = window.localStorage.getItem(SITE_CURRENCY_KEY);
  return CURRENCIES.includes(value as CurrencyCode) ? (value as CurrencyCode) : "USD";
}

function storeCurrency(currency: CurrencyCode) {
  window.localStorage.setItem(SITE_CURRENCY_KEY, currency);
}

function formatCurrencyValue(amount?: number, currency: CurrencyCode | string = "EUR") {
  if (typeof amount !== "number" || Number.isNaN(amount)) return "—";
  return new Intl.NumberFormat(getCurrencyLocale(currency), {
    style: "currency",
    currency
  }).format(amount);
}

function parseTebexMoney(value: any) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const normalized = value.replace(/[^\d.,-]/g, "").replace(",", ".");
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (value && typeof value === "object") {
    return parseTebexMoney(value.amount ?? value.total ?? value.value ?? value.price);
  }
  return 0;
}

function getTebexPackagePrice(pkg: any) {
  const candidates = [
    pkg?.total_price,
    pkg?.totalPrice,
    pkg?.price,
    pkg?.price?.amount,
    pkg?.base_price,
    pkg?.basePrice,
    pkg?.pricing?.price,
    pkg?.pricing?.amount,
    pkg?.prices?.price,
    pkg?.prices?.amount
  ];

  for (const candidate of candidates) {
    const parsed = parseTebexMoney(candidate);
    if (parsed > 0) return parsed;
  }

  return 0;
}

function getTebexPackageCurrency(pkg: any) {
  return normalizeCurrencyCode(
    pkg?.currency?.iso_4217 ??
    pkg?.currency ??
    pkg?.price?.currency ??
    pkg?.pricing?.currency ??
    pkg?.prices?.currency ??
    PRODUCT_BASE_CURRENCY
  );
}

async function fetchTebexPackagesForPricing() {
  const webstoreToken = getTebexWebstoreToken();
  const response = await tebexFetch(`/accounts/${webstoreToken}/packages`, {
    headers: { "Accept": "application/json" }
  });

  if (!response.ok) {
    throw new Error("Nao foi possivel carregar preços da Tebex.");
  }

  const payload = await response.json();
  const packages = Array.isArray(payload) ? payload : payload?.data ?? payload?.packages ?? [];

  return Array.isArray(packages) ? packages : [];
}

async function applyTebexPricesToProducts(products: Product[]) {
  try {
    const packages = await fetchTebexPackagesForPricing();
    const packagesById = new Map<string, any>();

    for (const pkg of packages) {
      const id = String(pkg?.id ?? pkg?.package_id ?? pkg?.packageId ?? "");
      if (id) packagesById.set(id, pkg);
    }

    return products.map((product) => {
      const packageId = String(product.packageId ?? "");
      const tebexPackage = packageId ? packagesById.get(packageId) : null;
      const tebexPrice = tebexPackage ? getTebexPackagePrice(tebexPackage) : 0;

      if (!tebexPackage || tebexPrice <= 0) {
        return {
          ...product,
          priceCurrency: product.priceCurrency ?? PRODUCT_BASE_CURRENCY,
          priceSource: "fallback" as const
        };
      }

      return {
        ...product,
        price: tebexPrice,
        priceCurrency: getTebexPackageCurrency(tebexPackage),
        priceSource: "tebex" as const
      };
    });
  } catch (error) {
    console.error(error);
    return products.map((product) => ({
      ...product,
      priceCurrency: product.priceCurrency ?? PRODUCT_BASE_CURRENCY,
      priceSource: "fallback" as const
    }));
  }
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function isValidUrl(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

function getYouTubeVideoId(url: string) {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace("www.", "");

    if (hostname === "youtu.be") {
      return parsedUrl.pathname.split("/").filter(Boolean)[0] ?? "";
    }

    if (hostname === "youtube.com" || hostname === "m.youtube.com" || hostname === "music.youtube.com") {
      if (parsedUrl.pathname.startsWith("/watch")) {
        return parsedUrl.searchParams.get("v") ?? "";
      }

      if (parsedUrl.pathname.startsWith("/embed/") || parsedUrl.pathname.startsWith("/shorts/")) {
        return parsedUrl.pathname.split("/").filter(Boolean)[1] ?? "";
      }
    }
  } catch {
    return "";
  }

  return "";
}

function isYouTubeUrl(url: string) {
  return Boolean(getYouTubeVideoId(url));
}

function getYouTubeEmbedUrl(url: string) {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

function getYouTubeThumbnail(url: string) {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";
}

const TEBEX_BASKET_KEY = "tws_tebex_basket";
const SITE_LANGUAGE_KEY = "tws_site_language";
const SITE_CURRENCY_KEY = "tws_site_currency";
const CURRENCIES: CurrencyCode[] = ["USD", "BRL", "EUR", "GBP", "AUD", "CAD", "DKK", "NOK", "NZD", "SEK", "PLN"];
let tebexCheckoutLocale: SiteLanguage = "pt_BR";

function getStoredTebexBasket() {
  return window.localStorage.getItem(TEBEX_BASKET_KEY);
}

function storeTebexBasket(basketIdent: string) {
  window.localStorage.setItem(TEBEX_BASKET_KEY, basketIdent);
  window.dispatchEvent(new Event("tws:tebex-session-changed"));
}

function clearTebexSession() {
  window.localStorage.removeItem(TEBEX_BASKET_KEY);
  window.dispatchEvent(new Event("tws:tebex-session-changed"));
}

function getTebexAccountName(basket: any) {
  const username =
    basket?.username?.name ??
    basket?.username?.username ??
    basket?.username ??
    basket?.customer?.username ??
    basket?.account?.username ??
    basket?.username_id ??
    "";

  return typeof username === "string" || typeof username === "number"
    ? String(username)
    : "";
}

function getStoredSiteLanguage(): SiteLanguage {
  return window.localStorage.getItem(SITE_LANGUAGE_KEY) === "en_US" ? "en_US" : "pt_BR";
}

function storeSiteLanguage(language: SiteLanguage) {
  tebexCheckoutLocale = language;
  window.localStorage.setItem(SITE_LANGUAGE_KEY, language);
}

function normalizeTranslationText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

const EN_TRANSLATIONS: Record<string, string> = {
  "Início": "Home",
  "Scripts": "Scripts",
  "Custom Peds": "Custom Peds",
  "Documentação": "Documentation",
  "Login": "Login",
  "Carrinho": "Cart",
  "Sair": "Logout",
  "Discord": "Discord",
  "The Wanted": "The Wanted",
  "Sole Studio": "Sole Studio",

  "RedM · Scripts & Custom Peds": "RedM · Scripts & Custom Peds",
  "The Wanted Sole Studio": "The Wanted Sole Studio",
  "Scripts exclusivos, custom peds e sistemas premium desenvolvidos para servidores RedM que exigem performance, originalidade e identidade própria.": "Exclusive scripts, custom peds and premium systems built for RedM servers that require performance, originality and unique identity.",
  "Ver Produtos": "View Products",
  "Acessar Discord": "Join Discord",
  "100% Original": "100% Original",
  "RedM": "RedM",
  "Suporte Dedicado": "Dedicated Support",
  "Qualidade Elite": "Elite Quality",
  "Explorar": "Explore",

  "Por que nos escolher": "Why choose us",
  "O Studio por trás do melhor conteúdo para RedM": "The studio behind premium RedM content",
  "Exclusividade Total": "Total Exclusivity",
  "Nenhum produto genérico. Cada script ou ped é pensado para servidores que querem se destacar da concorrência.": "No generic products. Each script or ped is designed for servers that want to stand out from competitors.",
  "Qualidade Garantida": "Guaranteed Quality",
  "Produtos testados, organizados e desenvolvidos com foco em estabilidade, performance e segurança.": "Products tested, organized and developed with stability, performance and security in mind.",
  "Suporte de Verdade": "Real Support",
  "Suporte via Discord para dúvidas, instalação, atualizações e acompanhamento contínuo.": "Discord support for questions, installation, updates and ongoing assistance.",
  "Identidade Premium": "Premium Identity",
  "Design, sistemas e recursos feitos para dar personalidade única e diferenciada ao seu servidor RedM.": "Design, systems and resources made to give your RedM server a unique premium identity.",

  "Vitrine": "Showcase",
  "Scripts & Recursos": "Scripts & Resources",
  "Produtos publicados pelo painel admin aparecem automaticamente aqui. Pagamento via Tebex.": "Products published from the admin panel appear here automatically. Payment via Tebex.",
  "Buscar produto...": "Search product...",
  "Mais recentes": "Newest",
  "Mais populares": "Most popular",
  "Menor preço": "Lowest price",
  "Maior preço": "Highest price",
  "Nenhum produto encontrado para essa busca.": "No product found for this search.",
  "Todos": "All",
  "Systems": "Systems",
  "Outfit / Creator": "Outfit / Creator",
  "Add-ons": "Add-ons",
  "Free Resources": "Free Resources",
  "Popular": "Popular",
  "Novo": "New",
  "Atualizado": "Updated",
  "Em breve": "Coming soon",
  "Grátis": "Free",
  "Comprar": "Buy",
  "Adicionar": "Add",
  "Adicionando...": "Adding...",
  "Adicionado": "Added",
  "Ver cesta": "View cart",
  "Download": "Download",
  "Abrindo...": "Opening...",
  "Valor": "Price",
  "Preço": "Price",

  "Detalhes do Produto": "Product Details",
  "Recursos Principais": "Main Features",
  "Requisitos": "Requirements",
  "Licença de Uso": "Usage License",
  "A compra concede licença de uso por servidor. É proibida revenda, redistribuição, vazamento, compartilhamento ou engenharia reversa dos arquivos.": "The purchase grants a usage license per server. Resale, redistribution, leaks, sharing or reverse engineering of the files are forbidden.",

  "Precisa de ajuda ou quer acompanhar novidades?": "Need help or want to follow updates?",
  "Entre no Discord oficial da The Wanted Sole Studio para suporte técnico, atualizações, prévias de novos produtos e atendimento da comunidade.": "Join the official The Wanted Sole Studio Discord for technical support, updates, new product previews and community help.",
  "Entrar no Discord": "Join Discord",
  "Dúvidas Frequentes": "FAQ",
  "Perguntas Frequentes": "Frequently Asked Questions",
  "Os produtos são para RedM?": "Are the products for RedM?",
  "A compra é feita pelo site?": "Is the purchase made through the website?",
  "Recebo suporte após comprar?": "Do I receive support after purchase?",
  "Posso revender ou compartilhar os arquivos?": "Can I resell or share the files?",
  "Os scripts recebem atualizações?": "Do scripts receive updates?",
  "Posso pedir um projeto customizado?": "Can I request a custom project?",

  "Login": "Login",
  "Acesse sua área": "Access your area",
  "Entre como cliente para acessar sua cesta e pedidos, ou como administrador para gerenciar os produtos da loja.": "Sign in as a customer to access your cart and orders, or as an administrator to manage store products.",
  "Cliente / CFX": "Customer / CFX",
  "Acesse sua conta para ver cesta, checkout, pedidos comprados e suporte. O login usa a autorização da Tebex.": "Access your account to view cart, checkout, purchases and support. Login uses Tebex authorization.",
  "Entrar como cliente": "Sign in as customer",
  "Administrador": "Administrator",
  "Entre no painel admin para cadastrar, editar, publicar e ocultar produtos da loja.": "Enter the admin panel to create, edit, publish and hide store products.",
  "Token admin": "Admin token",
  "Entrar como admin": "Sign in as admin",

  "Checkout": "Checkout",
  "Sua Cesta": "Your Cart",
  "Total": "Total",
  "Nome": "Name",
  "Ação": "Action",
  "Remover": "Remove",
  "Removendo...": "Removing...",
  "Sua cesta está vazia.": "Your cart is empty.",
  "Ver produtos": "View products",
  "Finalizar compra": "Complete purchase",
  "Checkout vazio": "Empty checkout",
  "Carregando cesta...": "Loading cart...",
  "Support on Discord": "Support on Discord",
  "Contact us": "Contact us",

  "Account": "Account",
  "Área do Cliente": "Customer Area",
  "Gerencie sua cesta, acompanhe suas compras e finalize seus pedidos com segurança pela Tebex.": "Manage your cart, track your purchases and complete your orders securely through Tebex.",
  "Status da integração Tebex": "Tebex integration status",
  "Basket ID": "Basket ID",
  "Conta": "Account",
  "Conta não conectada": "Account not connected",
  "Conta Tebex conectada": "Tebex account connected",
  "Conta / Tebex": "Account / Tebex",
  "Total atual": "Current total",
  "Cupom / Gift Card": "Coupon / Gift Card",
  "Digite seu cupom": "Enter your coupon",
  "Digite seu coupon/gift card": "Enter your coupon/gift card",
  "Coupon/Gift Card removido da cesta.": "Coupon/Gift Card removed from cart.",
  "Coupon/Gift Card removido da cesta. Se o checkout da Tebex estiver aberto, feche e abra novamente para atualizar o valor.": "Coupon/Gift Card removed from cart. If the Tebex checkout is already open, close and reopen it to refresh the value.",
  "Aplicar cupom": "Apply coupon",
  "Histórico de compras": "Purchase history",
  "Pedidos reais chegam aqui pelo webhook da Tebex no Worker.": "Real orders arrive here through the Tebex webhook in the Worker.",
  "Nenhuma compra sincronizada ainda. Depois que a Tebex enviar o webhook de pagamento concluído, o pedido aparece aqui.": "No purchase synced yet. After Tebex sends the completed payment webhook, the order appears here.",
  "Itens no carrinho / conta": "Cart / account items",
  "Tipo": "Type",
  "Nenhum item adicionado ainda.": "No item added yet.",
  "Moeda": "Currency",
  "Subtotal": "Subtotal",
  "Sair da conta": "Logout",
  "Atualizar": "Refresh",
  "Reconectar Tebex": "Reconnect Tebex",
  "Login com Tebex": "Login with Tebex",
  "Conectando...": "Connecting...",
  "Coupon/Gift Card": "Coupon/Gift Card",
  "Headless API + Tebex.js": "Headless API + Tebex.js",

  "Admin": "Admin",
  "Admin Dashboard": "Admin Dashboard",
  "Painel administrativo": "Admin panel",
  "Publicação de produtos": "Product publishing",
  "Cadastre produtos uma vez no admin. Eles aparecem automaticamente na vitrine pública, na categoria escolhida e com o package ID da Tebex.": "Register products once in admin. They automatically appear in the public showcase, in the chosen category and with the Tebex package ID.",
  "Novo produto": "New product",
  "Sair": "Logout",
  "Produtos": "Products",
  "Nenhum produto salvo ainda.": "No saved product yet.",
  "Apagar": "Hide/remove",
  "Publicar novo produto": "Publish new product",
  "Editar produto": "Edit product",
  "Salvar e publicar": "Save and publish",
  "Salvando...": "Saving...",
  "Nome": "Name",
  "Categoria": "Category",
  "Status": "Status",
  "Descrição curta": "Short description",
  "Descrição completa": "Full description",
  "Package ID Tebex": "Tebex Package ID",
  "URL Tebex": "Tebex URL",
  "Features, uma por linha": "Features, one per line",
  "Requisitos, um por linha": "Requirements, one per line",
  "Ícone do card + galeria, uma URL por linha": "Images/videos, one URL per line",
  "Visível na loja": "Visible in store",
  "Destaque": "Featured",
  "Produto salvo e publicado com sucesso.": "Product saved and published successfully.",
  "Produto removido da vitrine.": "Product removed from showcase.",
  "Voltar para o site": "Back to site"
};

const PT_TRANSLATIONS: Record<string, string> = Object.fromEntries(
  Object.entries(EN_TRANSLATIONS).map(([pt, en]) => [en, pt])
);

function translateStaticText(language: SiteLanguage) {
  if (typeof document === "undefined") return;

  const dictionary = language === "en_US" ? EN_TRANSLATIONS : PT_TRANSLATIONS;

  const translateValue = (value: string) => {
    const normalized = normalizeTranslationText(value);
    return dictionary[normalized] ?? value;
  };

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "OPTION"].includes(parent.tagName)) {
          return NodeFilter.FILTER_REJECT;
        }
        const value = normalizeTranslationText(node.textContent ?? "");
        if (!value || value.length > 220) return NodeFilter.FILTER_REJECT;
        return dictionary[value] ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    }
  );

  const textNodes: Text[] = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode as Text);
  }

  for (const node of textNodes) {
    const current = normalizeTranslationText(node.textContent ?? "");
    const next = dictionary[current];
    if (next && node.textContent !== next) {
      node.textContent = next;
    }
  }

  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input[placeholder], textarea[placeholder]").forEach((element) => {
    const current = element.getAttribute("placeholder") ?? "";
    const next = translateValue(current);
    if (next !== current) element.setAttribute("placeholder", next);
  });

  document.querySelectorAll<HTMLOptionElement>("option").forEach((option) => {
    const current = normalizeTranslationText(option.textContent ?? "");
    const next = dictionary[current];
    if (next && option.textContent !== next) option.textContent = next;
  });
}

function getTebexWebstoreToken() {
  const webstoreToken = import.meta.env.VITE_TEBEX_WEBSTORE_TOKEN;

  if (!webstoreToken) {
    throw new Error("Configure VITE_TEBEX_WEBSTORE_TOKEN no arquivo .env.local.");
  }

  return webstoreToken;
}

async function createTebexBasket() {
  const webstoreToken = getTebexWebstoreToken();

  const basketResponse = await tebexFetch(`/accounts/${webstoreToken}/baskets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      complete_url: window.location.origin,
      cancel_url: window.location.href,
      complete_auto_redirect: false
    })
  });

  if (!basketResponse.ok) {
    throw new Error("Nao foi possivel criar o carrinho na Tebex.");
  }

  const basketPayload = await basketResponse.json();
  const basketIdent = basketPayload?.data?.ident ?? basketPayload?.ident;

  if (!basketIdent) {
    throw new Error("A Tebex nao retornou o ident do carrinho.");
  }

  return basketIdent;
}

async function addPackageToTebexBasket(basketIdent: string, packageId: string) {
  const packageResponse = await tebexFetch(`/baskets/${basketIdent}/packages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      package_id: packageId,
      quantity: 1
    })
  });

  if (!packageResponse.ok) {
    const errorPayload = await packageResponse.json().catch(() => null);
    throw new Error(errorPayload?.message ?? errorPayload?.detail ?? "Nao foi possivel adicionar o produto ao carrinho.");
  }

  // The add-package endpoint updates the basket server-side.
  // Keep the original basket ident saved; do not replace it with the response body.
  return basketIdent;
}

async function getTebexAuthUrl(basketIdent: string, packageId?: string, returnPath = window.location.pathname) {
  const webstoreToken = getTebexWebstoreToken();
  const returnUrl = new URL(window.location.origin + returnPath);
  returnUrl.searchParams.set("tebexBasket", basketIdent);
  if (packageId) {
    returnUrl.searchParams.set("tebexPackage", packageId);
  }

  const authResponse = await tebexFetch(`/accounts/${webstoreToken}/baskets/${basketIdent}/auth?returnUrl=${encodeURIComponent(returnUrl.toString())}`);

  if (!authResponse.ok) {
    throw new Error("Nao foi possivel iniciar o login da Tebex.");
  }

  const authPayload = await authResponse.json();
  const authData = authPayload?.data ?? authPayload;
  const authOption = Array.isArray(authData) ? authData[0] : authData;
  const authUrl = authOption?.url;

  if (!authUrl) {
    throw new Error("A Tebex nao retornou a URL de login.");
  }

  return authUrl;
}

async function launchTebexCheckoutFromBasket(basketIdent: string, packageId?: string) {
  if (!window.Tebex?.checkout) {
    throw new Error("Tebex.js ainda nao carregou. Tente novamente em alguns segundos.");
  }

  const ident = packageId ? await addPackageToTebexBasket(basketIdent, packageId) : basketIdent;

  window.Tebex.checkout.init({
    ident,
    locale: tebexCheckoutLocale,
    theme: "dark",
    colors: [
      { name: "primary", color: "#b89458" },
      { name: "secondary", color: "#f7f5f0" }
    ],
    closeOnPaymentComplete: false
  });
  window.Tebex.checkout.launch();
}

async function launchTebexCheckout(product: Product) {
  if (product.packageId && window.Tebex?.checkout) {
    try {
      const basketIdent = getStoredTebexBasket() ?? await createTebexBasket();
      storeTebexBasket(basketIdent);
      const authUrl = await getTebexAuthUrl(basketIdent, product.packageId, "/account");
      window.location.href = authUrl;
      return;
    } catch (error) {
      console.error(error);
      window.alert(error instanceof Error ? error.message : "Nao foi possivel abrir o checkout da Tebex.");
      return;
    }
  }

  if (isValidUrl(product.tebexUrl)) {
    window.open(product.tebexUrl, "_blank", "noopener,noreferrer");
    return;
  }

  window.alert("Produto ainda nao configurado com packageId da Tebex.");
}


async function addProductToTebexCart(product: Product) {
  if (product.packageId) {
    const basketIdent = getStoredTebexBasket() ?? await createTebexBasket();
    storeTebexBasket(basketIdent);

    await addPackageToTebexBasket(basketIdent, product.packageId);

    const refreshedBasket = await fetchTebexBasket(basketIdent);
    window.dispatchEvent(new Event("tws:tebex-session-changed"));

    return refreshedBasket;
  }

  if (isValidUrl(product.tebexUrl)) {
    window.open(product.tebexUrl, "_blank", "noopener,noreferrer");
    return null;
  }

  throw new Error("Produto ainda nao configurado com packageId da Tebex.");
}


async function startTebexLogin(returnPath = "/account") {
  if (getAdminToken()) {
    window.alert("Você está logado como admin. Saia do admin antes de acessar a conta de cliente.");
    window.location.href = "/admin";
    return;
  }

  try {
    const basketIdent = getStoredTebexBasket() ?? await createTebexBasket();
    storeTebexBasket(basketIdent);
    const authUrl = await getTebexAuthUrl(basketIdent, undefined, returnPath);
    window.location.href = authUrl;
  } catch (error) {
    console.error(error);
    window.alert(error instanceof Error ? error.message : "Nao foi possivel iniciar o login da Tebex. Verifique se o Worker foi publicado e se a API /api/tebex/headless está ativa.");
  }
}

async function openTebexCart() {
  try {
    const basketIdent = getStoredTebexBasket();

    if (!basketIdent) {
      await startTebexLogin();
      return;
    }

    await launchTebexCheckoutFromBasket(basketIdent);
  } catch (error) {
    console.error(error);
    window.alert(error instanceof Error ? error.message : "Nao foi possivel abrir o carrinho da Tebex.");
  }
}


async function fetchTebexBasket(basketIdent: string) {
  const webstoreToken = getTebexWebstoreToken();
  const response = await tebexFetch(`/accounts/${webstoreToken}/baskets/${basketIdent}`);
  if (!response.ok) {
    throw new Error("Nao foi possivel carregar os dados do basket na Tebex.");
  }
  const payload = await response.json();
  return payload?.data ?? payload;
}

async function applyCouponToTebexBasket(basketIdent: string, couponCode: string) {
  const webstoreToken = getTebexWebstoreToken();

  const couponResponse = await tebexFetch(`/accounts/${webstoreToken}/baskets/${basketIdent}/coupons`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ coupon_code: couponCode })
  });

  if (couponResponse.ok) {
    return fetchTebexBasket(basketIdent);
  }

  const couponError = await couponResponse.json().catch(() => null);

  const creatorResponse = await tebexFetch(`/accounts/${webstoreToken}/baskets/${basketIdent}/creator-codes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ creator_code: couponCode })
  });

  if (creatorResponse.ok) {
    return fetchTebexBasket(basketIdent);
  }

  const creatorError = await creatorResponse.json().catch(() => null);
  throw new Error(
    creatorError?.message ?? creatorError?.detail ?? couponError?.message ?? couponError?.detail ??
    "Nao foi possivel aplicar o cupom ou creator code."
  );
}


function getBasketItems(basket: any) {
  if (!basket) return [];

  const source =
    basket?.rows ??
    basket?.packages ??
    basket?.data?.rows ??
    basket?.data?.packages ??
    basket?.basket?.rows ??
    basket?.basket?.packages ??
    [];

  return Array.isArray(source) ? source : [];
}

function getBasketRowPackageId(row: any) {
  const packageId =
    row?.package_id ??
    row?.packageId ??
    row?.package?.id ??
    row?.package?.package_id ??
    row?.package?.packageId ??
    row?.id;

  return packageId ? String(packageId) : "";
}

function getBasketRowName(row: any) {
  return (
    row?.name ??
    row?.package?.name ??
    row?.package_name ??
    row?.package?.title ??
    row?.title ??
    "Item Tebex"
  );
}

function normalizeMoneyValue(value: any) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const normalized = value.replace(/[^\d.,-]/g, "").replace(",", ".");
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (value && typeof value === "object") {
    return normalizeMoneyValue(value.amount ?? value.total ?? value.value ?? value.price);
  }
  return 0;
}

function getBasketRowPrice(row: any, basket?: any) {
  const directCandidates = [
    row?.total_price,
    row?.totalPrice,
    row?.row_price,
    row?.rowPrice,
    row?.price,
    row?.price?.amount,
    row?.base_price,
    row?.basePrice,
    row?.package_price,
    row?.packagePrice,
    row?.package?.total_price,
    row?.package?.totalPrice,
    row?.package?.price,
    row?.package?.price?.amount,
    row?.package?.base_price,
    row?.package?.basePrice,
    row?.package?.pricing?.price,
    row?.package?.pricing?.amount,
    row?.package?.prices?.price,
    row?.package?.prices?.amount
  ];

  for (const candidate of directCandidates) {
    const parsed = normalizeMoneyValue(candidate);
    if (parsed > 0) return parsed;
  }

  const quantity = Number(row?.quantity ?? row?.qty ?? 1) || 1;
  const basketItems = getBasketItems(basket);

  // Se a Tebex não devolver preço por linha, mas devolver total do basket,
  // usamos o total como fallback quando há só um item na cesta.
  if (basketItems.length === 1) {
    return getBasketTotal(basket);
  }

  // Fallback dividido para evitar mostrar $0.00 quando a cesta tem múltiplos itens,
  // mas a Tebex não enviou preço individual no payload público.
  const basketTotal = getBasketTotal(basket);
  if (basketTotal > 0 && basketItems.length > 0) {
    return basketTotal / basketItems.length / quantity;
  }

  return 0;
}

function getBasketTotal(basket: any) {
  const total =
    basket?.total_price ??
    basket?.totalPrice ??
    basket?.price?.amount ??
    basket?.price ??
    basket?.data?.total_price ??
    basket?.data?.price?.amount ??
    0;

  return typeof total === "number" ? total : Number(total) || 0;
}

async function removePackageFromTebexBasket(basketIdent: string, packageId: string) {
  const response = await tebexFetch(`/baskets/${basketIdent}/packages/remove`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ package_id: packageId })
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => null);
    throw new Error(errorPayload?.message ?? errorPayload?.detail ?? "Nao foi possivel remover o item do carrinho.");
  }

  const payload = await response.json().catch(() => null);
  return payload?.data ?? payload ?? fetchTebexBasket(basketIdent);
}



function getApiBaseUrl() {
  return (import.meta.env.VITE_ACCOUNT_API_BASE_URL ?? "").replace(/\/$/, "");
}

function apiUrl(path: string) {
  const base = getApiBaseUrl();
  return base ? `${base}${path}` : path;
}

function slugifyClient(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getProductPagePath(product: Product) {
  const category = String(product.category || "scripts").toLowerCase();

  const base =
    category.includes("ped") ? "custom-peds" :
    category.includes("system") ? "systems" :
    category.includes("outfit") ? "outfit-creator" :
    category.includes("addon") || category.includes("add-on") ? "add-ons" :
    "script";

  return `/${base}/${slugifyClient(product.name)}`;
}

async function tebexFetch(path: string, init?: RequestInit) {
  const response = await fetch(apiUrl(`/api/tebex/headless?path=${encodeURIComponent(path)}`), {
    method: init?.method ?? "GET",
    headers: {
      "Accept": "application/json",
      ...(init?.headers ?? {}),
    },
    body: init?.body,
  });

  return response;
}

function getAdminToken() {
  return localStorage.getItem("tws_admin_token") ?? "";
}

function storeAdminToken(token: string) {
  if (token.trim()) {
    localStorage.setItem("tws_admin_token", token.trim());
  } else {
    localStorage.removeItem("tws_admin_token");
  }
  window.dispatchEvent(new Event("tws:admin-session-changed"));
}

function parseProductList(value: any) {
  let source = value;

  if (typeof source === "string" && source.trim()) {
    try {
      source = JSON.parse(source);
    } catch {
      source = source.split(/\r?\n/);
    }
  }

  if (!Array.isArray(source)) return [];

  return source
    .flatMap((item) => String(item ?? "").split(/\r?\n/))
    .map((line) => line.trim())
    .filter(Boolean);
}

function normalizeProductFromApi(item: any): Product {
  const media = Array.isArray(item.media)
    ? item.media
    : typeof item.media === "string" && item.media.trim()
      ? JSON.parse(item.media)
      : [];

  const features = parseProductList(item.features);
  const requirements = parseProductList(item.requirements);
  const featuresEn = parseProductList(item.featuresEn ?? item.features_en);
  const requirementsEn = parseProductList(item.requirementsEn ?? item.requirements_en);

  return {
    id: item.id ?? item.slug ?? crypto.randomUUID(),
    name: item.name ?? "Produto sem nome",
    nameEn: item.nameEn ?? item.name_en ?? "",
    category: item.category ?? "Scripts",
    description: item.description ?? "",
    descriptionEn: item.descriptionEn ?? item.description_en ?? "",
    fullDescription: item.fullDescription ?? item.full_description ?? item.description ?? "",
    fullDescriptionEn: item.fullDescriptionEn ?? item.full_description_en ?? item.descriptionEn ?? item.description_en ?? "",
    price: Number(item.price ?? 0),
    priceCurrency: normalizeCurrencyCode(item.priceCurrency ?? item.price_currency ?? PRODUCT_BASE_CURRENCY),
    priceSource: item.priceSource ?? item.price_source ?? "fallback",
    status: item.status ?? "novo",
    tebexUrl: item.tebexUrl ?? item.tebex_url ?? "#",
    packageId: item.packageId ?? item.package_id ?? "",
    docsUrl: item.docsUrl ?? item.docs_url ?? "https://docs.thewantedsolestudio.workers.dev",
    features,
    featuresEn,
    requirements,
    requirementsEn,
    media,
    gradientFrom: item.gradientFrom ?? item.gradient_from ?? "#ece5d8",
    gradientTo: item.gradientTo ?? item.gradient_to ?? "#fffdf8",
    iconName: item.iconName ?? item.icon_name ?? "Package",
    visible: item.visible !== false && item.visible !== 0,
    featured: item.featured === true || item.featured === 1,
    createdAt: item.createdAt ?? item.created_at,
    updatedAt: item.updatedAt ?? item.updated_at
  };
}

function getProductThumbnail(product: Product) {
  const firstMedia = product.media?.[0];

  if (!firstMedia?.src) return "";

  const isYoutube = firstMedia.type === "youtube" || isYouTubeUrl(firstMedia.src);

  if (isYoutube) return getYouTubeThumbnail(firstMedia.src);

  if (firstMedia.type === "video") return firstMedia.poster || "";

  return firstMedia.src;
}

function getLocalizedProduct(product: Product, language: SiteLanguage) {
  const useEnglish = language === "en_US";

  const name =
    useEnglish && product.nameEn?.trim()
      ? product.nameEn
      : product.name;

  const description =
    useEnglish && product.descriptionEn?.trim()
      ? product.descriptionEn
      : product.description;

  const fullDescription =
    useEnglish && product.fullDescriptionEn?.trim()
      ? product.fullDescriptionEn
      : product.fullDescription || description;

  const features =
    useEnglish && product.featuresEn && product.featuresEn.length > 0
      ? product.featuresEn
      : product.features;

  const requirements =
    useEnglish && product.requirementsEn && product.requirementsEn.length > 0
      ? product.requirementsEn
      : product.requirements;

  return { name, description, fullDescription, features, requirements };
}

async function fetchPublicProducts() {
  const response = await fetch(apiUrl("/api/products"), { headers: { "Accept": "application/json" } });
  if (!response.ok) throw new Error("Nao foi possivel carregar os produtos.");
  const payload = await response.json();
  const rows = Array.isArray(payload) ? payload : payload.products ?? [];
  return applyTebexPricesToProducts(rows.map(normalizeProductFromApi));
}

async function fetchAdminProducts(token: string) {
  const response = await fetch(apiUrl("/api/admin/products"), {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error ?? "Nao foi possivel carregar produtos do admin.");
  }

  const payload = await response.json();
  const rows = Array.isArray(payload) ? payload : payload.products ?? [];
  return applyTebexPricesToProducts(rows.map(normalizeProductFromApi));
}

async function saveAdminProduct(token: string, product: Product) {
  const editing = !!product.id && !product.id.startsWith("new-");
  const endpoint = editing ? `/api/admin/products/${encodeURIComponent(product.id)}` : "/api/admin/products";
  const normalizedProduct = {
    ...product,
    features: parseProductList(product.features),
    featuresEn: parseProductList(product.featuresEn),
    requirements: parseProductList(product.requirements),
    requirementsEn: parseProductList(product.requirementsEn)
  };
  const productPayload = editing ? normalizedProduct : { ...normalizedProduct, id: undefined };

  const response = await fetch(apiUrl(endpoint), {
    method: editing ? "PUT" : "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(productPayload)
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error ?? "Nao foi possivel salvar o produto.");
  }

  const payload = await response.json();
  return normalizeProductFromApi(payload.product ?? payload);
}

async function deleteAdminProduct(token: string, productId: string) {
  const response = await fetch(apiUrl(`/api/admin/products/${encodeURIComponent(productId)}`), {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error ?? "Nao foi possivel remover o produto.");
  }
}

function normalizeCreatorCode(item: any): CreatorCode {
  return {
    id: String(item.id ?? crypto.randomUUID()),
    label: String(item.label ?? item.display_name ?? item.name ?? item.original_code ?? item.originalCode ?? "Creator"),
    originalCode: String(item.originalCode ?? item.original_code ?? item.code ?? ""),
    visible: item.visible !== false && item.visible !== 0,
    createdAt: item.createdAt ?? item.created_at,
    updatedAt: item.updatedAt ?? item.updated_at
  };
}

async function fetchCreatorCodes() {
  const response = await fetch(apiUrl("/api/creator-codes"), {
    headers: { "Accept": "application/json" }
  });

  if (!response.ok) return [];

  const payload = await response.json();
  const rows = Array.isArray(payload) ? payload : payload.creatorCodes ?? payload.codes ?? [];
  return rows.map(normalizeCreatorCode).filter((item: CreatorCode) => item.visible && item.originalCode);
}

async function fetchAdminCreatorCodes(token: string) {
  const response = await fetch(apiUrl("/api/admin/creator-codes"), {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error ?? "Nao foi possivel carregar creator codes.");
  }

  const payload = await response.json();
  const rows = Array.isArray(payload) ? payload : payload.creatorCodes ?? payload.codes ?? [];
  return rows.map(normalizeCreatorCode);
}

async function saveAdminCreatorCode(token: string, creatorCode: CreatorCode) {
  const editing = !!creatorCode.id && !creatorCode.id.startsWith("new-");
  const endpoint = editing ? `/api/admin/creator-codes/${encodeURIComponent(creatorCode.id)}` : "/api/admin/creator-codes";
  const payload = editing ? creatorCode : { ...creatorCode, id: undefined };

  const response = await fetch(apiUrl(endpoint), {
    method: editing ? "PUT" : "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => null);
    throw new Error(errorPayload?.error ?? "Nao foi possivel salvar creator code.");
  }

  const responsePayload = await response.json();
  return normalizeCreatorCode(responsePayload.creatorCode ?? responsePayload);
}

async function deleteAdminCreatorCode(token: string, creatorCodeId: string) {
  const response = await fetch(apiUrl(`/api/admin/creator-codes/${encodeURIComponent(creatorCodeId)}`), {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error ?? "Nao foi possivel remover creator code.");
  }
}

async function applyCreatorCodeToBasket(basketIdent: string, originalCode: string) {
  const webstoreToken = getTebexWebstoreToken();

  const attempts = [
    {
      endpoint: `/accounts/${webstoreToken}/baskets/${basketIdent}/coupons`,
      body: { coupon_code: originalCode },
      label: "coupon"
    },
    {
      endpoint: `/accounts/${webstoreToken}/baskets/${basketIdent}/giftcards`,
      body: { card_number: originalCode },
      label: "gift card"
    },
    {
      endpoint: `/accounts/${webstoreToken}/baskets/${basketIdent}/creator-codes`,
      body: { creator_code: originalCode },
      label: "creator code"
    }
  ];

  const errors: string[] = [];

  for (const attempt of attempts) {
    const response = await tebexFetch(attempt.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(attempt.body)
    });

    if (response.ok) {
      return fetchTebexBasket(basketIdent);
    }

    const payload = await response.json().catch(() => null);
    errors.push(payload?.message ?? payload?.detail ?? attempt.label);
  }

  throw new Error(errors.find(Boolean) ?? "Nao foi possivel aplicar o coupon/gift card.");
}

function basketPayloadContainsCode(payload: any, codeToFind: string): boolean {
  const normalizedCode = codeToFind.trim().toLowerCase();
  if (!normalizedCode) return false;

  const seen = new WeakSet<object>();

  const search = (value: any): boolean => {
    if (value == null) return false;

    if (typeof value === "string" || typeof value === "number") {
      return String(value).toLowerCase().includes(normalizedCode);
    }

    if (typeof value !== "object") return false;
    if (seen.has(value)) return false;
    seen.add(value);

    if (Array.isArray(value)) {
      return value.some(search);
    }

    return Object.values(value).some(search);
  };

  return search(payload);
}

async function removeCreatorCodeFromBasket(basketIdent: string, codeToRemove = "") {
  const webstoreToken = getTebexWebstoreToken();
  const normalizedCode = codeToRemove.trim();

  const attempts = [
    {
      endpoint: `/accounts/${webstoreToken}/baskets/${basketIdent}/coupons/remove`,
      body: null,
      label: "coupon"
    },
    {
      endpoint: `/accounts/${webstoreToken}/baskets/${basketIdent}/coupons/remove`,
      body: normalizedCode ? { coupon_code: normalizedCode } : null,
      label: "coupon com código"
    },
    {
      endpoint: `/accounts/${webstoreToken}/baskets/${basketIdent}/giftcards/remove`,
      body: normalizedCode ? { card_number: normalizedCode } : null,
      label: "gift card"
    },
    {
      endpoint: `/accounts/${webstoreToken}/baskets/${basketIdent}/creator-codes/remove`,
      body: null,
      label: "creator code"
    }
  ];

  const errors: string[] = [];
  let lastBasket: any | null = null;

  for (const attempt of attempts) {
    const response = await tebexFetch(attempt.endpoint, {
      method: "POST",
      headers: attempt.body ? { "Content-Type": "application/json" } : undefined,
      body: attempt.body ? JSON.stringify(attempt.body) : undefined
    });

    if (response.ok || response.status === 204 || response.status === 404) {
      const refreshedBasket = await fetchTebexBasket(basketIdent);
      lastBasket = refreshedBasket;

      // Se sabemos qual código foi aplicado, só mostra sucesso quando ele sumir do payload do basket.
      // Isso evita a mensagem falsa de "removido" quando a Tebex respondeu 200 mas manteve o desconto.
      if (!normalizedCode || !basketPayloadContainsCode(refreshedBasket, normalizedCode)) {
        return refreshedBasket;
      }

      continue;
    }

    const payload = await response.json().catch(() => null);
    errors.push(payload?.message ?? payload?.detail ?? attempt.label);
  }

  if (lastBasket) {
    throw new Error("A Tebex respondeu a remoção, mas o coupon/gift card ainda aparece na cesta. Feche o checkout aberto e tente remover novamente antes de finalizar.");
  }

  throw new Error(errors.find(Boolean) ?? "Nao foi possivel remover o coupon/gift card.");
}

async function fetchAccountSummary(basketIdent?: string | null, usernameId?: string | null) {
  const url = new URL(apiUrl("/api/account/summary"), window.location.origin);
  if (basketIdent) url.searchParams.set("basketIdent", basketIdent);
  if (usernameId) url.searchParams.set("usernameId", usernameId);

  const response = await fetch(url.toString(), { headers: { "Accept": "application/json" } });
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error ?? "Nao foi possivel carregar o historico da conta.");
  }

  return response.json();
}


function GoldButton({ children, className = "", onClick, href, external }: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  external?: boolean;
}) {
  const cls = `inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-semibold tracking-wide
    bg-primary text-primary-foreground transition-all duration-200
    hover:brightness-110 hover:shadow-[0_0_20px_rgba(201,168,76,0.35)] active:scale-[0.98]
    ${className}`;
  if (href) {
    return (
      <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className={cls}>
        {children}
      </a>
    );
  }
  return <button onClick={onClick} className={cls}>{children}</button>;
}

function GhostButton({ children, className = "", onClick, href, external }: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  external?: boolean;
}) {
  const cls = `inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-semibold tracking-wide
    border border-primary/30 text-primary/90 transition-all duration-200
    hover:border-primary/70 hover:text-primary hover:bg-primary/5
    active:scale-[0.98] ${className}`;
  if (href) {
    return (
      <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className={cls}>
        {children}
      </a>
    );
  }
  return <button onClick={onClick} className={cls}>{children}</button>;
}

function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase
      border border-primary/30 text-primary/80 bg-primary/5">
      {children}
    </span>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({ onNavigate, activeSection, onLogin, onCart, language, onLanguageChange, currency, onCurrencyChange }: {
  onNavigate: (section: string) => void;
  activeSection: string;
  onLogin: () => void;
  onCart: () => void;
  language: SiteLanguage;
  onLanguageChange: (language: SiteLanguage) => void;
  currency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);

  const refreshNavbarAccount = useCallback(async () => {
    const basketIdent = getStoredTebexBasket();

    if (!basketIdent) {
      setAccountName("");
      return;
    }

    try {
      const basketPayload = await fetchTebexBasket(basketIdent);
      setAccountName(getTebexAccountName(basketPayload));
    } catch (error) {
      console.error(error);
      setAccountName("");
    }
  }, []);

  const refreshNavbarAdmin = useCallback(() => {
    setAdminLoggedIn(Boolean(getAdminToken()));
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    refreshNavbarAccount();
    refreshNavbarAdmin();

    const handler = () => {
      refreshNavbarAccount();
      refreshNavbarAdmin();
    };

    window.addEventListener("tws:tebex-session-changed", handler);
    window.addEventListener("tws:admin-session-changed", handler);
    window.addEventListener("storage", handler);

    return () => {
      window.removeEventListener("tws:tebex-session-changed", handler);
      window.removeEventListener("tws:admin-session-changed", handler);
      window.removeEventListener("storage", handler);
    };
  }, [refreshNavbarAccount, refreshNavbarAdmin]);

  function handleNavbarLogout() {
    clearTebexSession();
    setAccountName("");
    if (window.location.pathname === "/account") {
      window.location.href = "/";
    }
  }

  function handleNavbarAdminLogout() {
    storeAdminToken("");
    setAdminLoggedIn(false);
    if (window.location.pathname === "/admin") {
      window.location.href = "/";
    }
  }


  const links = [
    { label: "Início", id: "hero" },
    { label: "Scripts", id: "products" },
    { label: "Custom Peds", id: "custom-peds" },
    { label: "Documentação", id: "docs", external: true, url: "/docs" },
    /*{ label: "Licença", id: "faq" },*/
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-background/90 backdrop-blur-md border-b border-border" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => onNavigate("hero")}
          className="flex flex-col items-start transition-opacity hover:opacity-80"
        >
          <span className="text-base font-bold tracking-[0.2em] uppercase"
            style={{ fontFamily: "'Cinzel', serif", color: "#b89458" }}>
            The Wanted
          </span>
          <span className="text-[10px] tracking-[0.35em] uppercase text-foreground/50 -mt-0.5"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Sole Studio
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {links.map((link) =>
            link.external ? (
              <a
                key={link.id}
                href={link.url}
                target={link.url?.startsWith("/") ? undefined : "_blank"}
                rel={link.url?.startsWith("/") ? undefined : "noopener noreferrer"}
                className="px-3 py-2 text-sm text-foreground/50 hover:text-foreground/90 transition-colors duration-150"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {link.label}
              </a>
            ) : (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`px-3 py-2 text-sm transition-colors duration-150 ${
                  activeSection === link.id
                    ? "text-primary"
                    : "text-foreground/50 hover:text-foreground/90"
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {link.label}
              </button>
            )
          )}
        </nav>

        {/* CTA buttons */}
        <div className="hidden lg:flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as SiteLanguage)}
            className="h-9 rounded-full border border-primary/20 bg-primary px-3 text-[11px] font-semibold tracking-wide text-primary-foreground outline-none transition-all hover:brightness-105"
            title="Idioma"
          >
            <option value="pt_BR">PT</option>
            <option value="en_US">EN</option>
          </select>
          <select
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
            className="h-9 rounded-full border border-primary/20 bg-background/40 px-3 text-[11px] font-semibold tracking-wide text-foreground/70 outline-none transition-all hover:border-primary/35 hover:text-primary"
            title="Moeda"
          >
            {CURRENCIES.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          {adminLoggedIn ? (
            <div className="inline-flex h-9 items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2">
              <a
                href="/admin"
                className="inline-flex items-center gap-2 px-2 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
                title="Abrir painel admin"
              >
                <User size={14} />
                <span className="max-w-[120px] truncate">Admin</span>
              </a>
              <button
                type="button"
                onClick={handleNavbarAdminLogout}
                className="inline-flex h-7 items-center gap-1 rounded-full px-2 text-[11px] font-semibold text-foreground/45 transition-all hover:bg-background/60 hover:text-red-500"
                title="Sair"
              >
                <LogOut size={12} />
                Sair
              </button>
            </div>
          ) : accountName ? (
            <div className="inline-flex h-9 items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2">
              <a
                href="/account"
                className="inline-flex items-center gap-2 px-2 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
                title="Abrir conta"
              >
                <User size={14} />
                <span className="max-w-[120px] truncate">{accountName}</span>
              </a>
              <button
                type="button"
                onClick={handleNavbarLogout}
                className="inline-flex h-7 items-center gap-1 rounded-full px-2 text-[11px] font-semibold text-foreground/45 transition-all hover:bg-background/60 hover:text-red-500"
                title="Sair"
              >
                <LogOut size={12} />
                Sair
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onLogin}
              className="inline-flex h-9 items-center gap-2 px-3 rounded-full text-xs font-semibold
                text-foreground/60 hover:text-primary hover:bg-primary/5 transition-all"
            >
              <LogIn size={14} />
              Login
            </button>
          )}
          <button
            type="button"
            onClick={onCart}
            className="inline-flex h-9 items-center gap-2 px-3 rounded-full text-xs font-semibold
              text-foreground/60 hover:text-primary hover:bg-primary/5 transition-all"
          >
            <ShoppingCart size={14} />
            Carrinho
          </button>
          <a
            href="https://discord.gg/qE29trG84u"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-2 px-3 rounded-full text-xs font-semibold
              border border-primary/15 text-foreground/60 hover:text-primary hover:border-primary/35
              hover:bg-primary/5 transition-all"
          >
            <MessageCircle size={14} />
            Discord
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-foreground/60 hover:text-foreground/90 transition-colors"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="lg:hidden bg-card/95 backdrop-blur-md border-b border-border"
          >
            <nav className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
              {links.map((link) =>
                link.external ? (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2.5 text-sm text-foreground/60 hover:text-foreground/90 transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <button
                    key={link.id}
                    onClick={() => { onNavigate(link.id); setMobileOpen(false); }}
                    className="text-left px-3 py-2.5 text-sm text-foreground/60 hover:text-foreground/90 transition-colors"
                  >
                    {link.label}
                  </button>
                )
              )}
              <div className="flex items-center gap-2 pt-3 border-t border-border mt-2">
                <select
                  value={language}
                  onChange={(e) => onLanguageChange(e.target.value as SiteLanguage)}
                  className="h-9 rounded-full border border-primary/20 bg-primary px-3 text-xs font-semibold text-primary-foreground outline-none"
                  title="Idioma"
                >
                  <option value="pt_BR">PT</option>
                  <option value="en_US">EN</option>
                </select>
                <select
                  value={currency}
                  onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
                  className="h-9 rounded-full border border-primary/20 bg-background/40 px-3 text-xs font-semibold text-foreground/70 outline-none"
                  title="Moeda"
                >
                  {CURRENCIES.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                {adminLoggedIn ? (
                  <div className="flex-1 flex gap-2">
                    <a
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full
                        border border-primary/20 bg-primary/5 text-sm font-semibold text-primary"
                    >
                      <User size={14} />
                      Admin
                    </a>
                    <button
                      type="button"
                      onClick={() => { handleNavbarAdminLogout(); setMobileOpen(false); }}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full
                        border border-red-500/20 text-sm font-semibold text-red-500 hover:bg-red-500/5 transition-all"
                    >
                      <LogOut size={14} />
                      Sair
                    </button>
                  </div>
                ) : accountName ? (
                  <div className="flex-1 flex gap-2">
                    <a
                      href="/account"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full
                        border border-primary/20 bg-primary/5 text-sm font-semibold text-primary"
                    >
                      <User size={14} />
                      <span className="max-w-[120px] truncate">{accountName}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => { handleNavbarLogout(); setMobileOpen(false); }}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full
                        border border-red-500/20 text-sm font-semibold text-red-500 hover:bg-red-500/5 transition-all"
                    >
                      <LogOut size={14} />
                      Sair
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => { onLogin(); setMobileOpen(false); }}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full
                      border border-primary/15 text-sm font-semibold text-foreground/70 hover:text-primary
                      hover:bg-primary/5 transition-all"
                  >
                    <LogIn size={14} />
                    Login
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => { onCart(); setMobileOpen(false); }}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full
                    border border-primary/15 text-sm font-semibold text-foreground/70 hover:text-primary
                    hover:bg-primary/5 transition-all"
                >
                  <ShoppingCart size={14} />
                  Carrinho
                </button>
              </div>
              <div className="flex gap-2">
                <GhostButton href="https://discord.gg/qE29trG84u" external className="flex-1 justify-center rounded-full">
                  Discord
                </GhostButton>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <section
      id="hero"
      className="relative min-h-[640px] lg:min-h-[85vh] flex flex-col items-center justify-center px-6 py-12 lg:py-16 overflow-hidden"
    >
      {/* Background layers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Hero image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.34]"
          style={{
            backgroundImage: "url('/hero-bg.png')",
            backgroundPosition: "center right"
          }}
        />
        {/* Soft ivory overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(247,245,240,0.70) 0%, rgba(247,245,240,0.76) 45%, rgba(247,245,240,0.86) 100%)"
          }}
        />
        {/* Left fade for text readability */}
        <div
          className="absolute inset-y-0 left-0 w-[68%]"
          style={{
            background: "linear-gradient(90deg, rgba(247,245,240,0.92) 0%, rgba(247,245,240,0.76) 55%, rgba(247,245,240,0) 100%)"
          }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(201,168,76,0.06) 1px, transparent 0)",
            backgroundSize: "32px 32px"
          }}
        />
        {/* Radial glow top */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[320px] opacity-25"
          style={{
            background: "radial-gradient(ellipse at center top, rgba(201,168,76,0.14) 0%, transparent 70%)"
          }}
        />
        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{ background: "linear-gradient(to bottom, transparent, #f7f5f0)" }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center pt-4 lg:pt-6">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-5"
        >
          <SectionTag>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            RedM · Scripts &amp; Custom Peds
          </SectionTag>
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          <span
            className="block"
            style={{
              background: "linear-gradient(135deg, #202020 0%, #b89458 45%, #ded2bc 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            The Wanted
          </span>
          <span className="block text-foreground/90">Sole Studio</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base lg:text-lg text-foreground/55 max-w-2xl mx-auto mb-6 leading-relaxed"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Scripts exclusivos, custom peds e sistemas premium desenvolvidos para servidores RedM que exigem
          performance, originalidade e identidade própria.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-8"
        >
          <GoldButton onClick={() => onNavigate("products")} className="px-6 py-2.5 text-sm">
            Ver Produtos
            <ArrowRight size={15} />
          </GoldButton>
          <GhostButton href="https://discord.gg/qE29trG84u" external className="px-6 py-2.5 text-sm">
            <MessageCircle size={15} />
            Acessar Discord
          </GhostButton>
          <GhostButton href="https://docs.thewantedsolestudio.workers.dev" external className="px-6 py-2.5 text-sm">
            <BookOpen size={15} />
            Documentação
          </GhostButton>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4 lg:gap-5"
        >
          {[
            { icon: Check, label: "100% Original" },
            { icon: Code2, label: "RedM" },
            { icon: Shield, label: "Suporte Dedicado" },
            { icon: Crown, label: "Qualidade Elite" }
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-foreground/40">
              <Icon size={13} className="text-primary/60" />
              <span className="text-xs tracking-widest uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() => onNavigate("why")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-foreground/25 hover:text-foreground/50 transition-colors"
      >
        <span className="text-[10px] tracking-widest uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Explorar
        </span>
        <ChevronDown size={16} className="animate-bounce" />
      </motion.button>
    </section>
  );
}

// ─── Why Us ───────────────────────────────────────────────────────────────────

function WhySection({ language }: { language: SiteLanguage }) {
  return (
    <section id="why" className="py-14 lg:py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-9">
          <SectionTag>{language === "en_US" ? "Why choose us" : "Por que nos escolher"}</SectionTag>
          <h2
            className="mt-4 text-2xl lg:text-4xl font-bold text-foreground/90"
            style={{ fontFamily: "'Raleway', sans-serif" }}
          >
            {language === "en_US" ? "The studio behind premium" : "O Studio por trás do melhor"}
            <br />
            <span style={{ color: "#8b714b" }}>
              {language === "en_US" ? "RedM content" : "conteúdo para RedM"}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {WHY_FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative p-6 rounded-sm border border-border bg-card
                  hover:border-primary/30 hover:shadow-[0_0_24px_rgba(201,168,76,0.06)]
                  transition-all duration-300 group"
              >
                <div className="mb-4 inline-flex p-2.5 rounded-sm bg-primary/10 border border-primary/20
                  group-hover:bg-primary/15 transition-colors">
                  <Icon size={18} className="text-primary" />
                </div>
                <h3
                  className="text-sm font-semibold text-foreground/90 mb-2 tracking-wide"
                  style={{ fontFamily: "'Raleway', sans-serif" }}
                >
                  {feat.title}
                </h3>
                <p
                  className="text-sm text-muted-foreground leading-relaxed"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {feat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product, currency, language, onSelect }: { product: Product; currency: CurrencyCode; language: SiteLanguage; onSelect: (p: Product) => void }) {
  const Icon = ICON_MAP[product.iconName] ?? Package;
  const status = STATUS_CONFIG[product.status];
  const localized = getLocalizedProduct(product, language);
  const [thumbnailFailed, setThumbnailFailed] = useState(false);
  const thumbnailSrc = getProductThumbnail(product);
  const showThumbnail = Boolean(thumbnailSrc) && !thumbnailFailed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="group relative flex flex-col rounded-sm border border-border bg-card
        hover:border-primary/30 hover:shadow-[0_0_32px_rgba(201,168,76,0.07)]
        transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={() => { window.location.href = getProductPagePath(product); }}
    >
      {/* Thumbnail */}
      <div
        className="relative h-36 flex items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${product.gradientFrom}, ${product.gradientTo})` }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(201,168,76,0.15) 1px, transparent 0)",
            backgroundSize: "24px 24px"
          }}
        />

        {showThumbnail ? (
          <>
            <img
              src={thumbnailSrc}
              alt={localized.name || product.name}
              onError={() => setThumbnailFailed(true)}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/35 via-transparent to-transparent" />
          </>
        ) : (
          <div className="relative z-10 p-4 rounded-sm border border-primary/20 bg-primary/10
            group-hover:border-primary/40 group-hover:bg-primary/15 transition-all duration-300">
            <Icon size={24} className="text-primary" />
          </div>
        )}

        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-12 h-12 opacity-20"
          style={{ background: "radial-gradient(circle at top right, rgba(201,168,76,0.6), transparent)" }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2 py-0.5 rounded-sm text-[10px] font-semibold tracking-wider uppercase ${status.cls}`}>
            {status.label}
          </span>
          <span className="px-2 py-0.5 rounded-sm text-[10px] tracking-wider uppercase
            border border-border text-muted-foreground">
            {product.category}
          </span>
        </div>

        {/* Name */}
        <h3
          className="text-sm font-semibold text-foreground/90 leading-snug
            group-hover:text-primary transition-colors duration-200"
          style={{ fontFamily: "'Raleway', sans-serif" }}
        >
          {localized.name}
        </h3>

        {/* Description */}
        <p
          className="text-xs text-muted-foreground leading-relaxed flex-1"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {localized.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
          <span
            className="text-base font-bold"
            style={{ color: product.price === 0 ? "#5d8a5d" : "#8b714b", fontFamily: "'Cinzel', serif" }}
          >
            {formatProductPrice(product.price, currency, product.priceCurrency)}
          </span>
          <div className="flex items-center gap-1.5">
            {product.docsUrl && (
              <a
                href={product.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-sm border border-border text-muted-foreground
                  hover:border-primary/30 hover:text-primary transition-all duration-150"
                title="Documentação"
              >
                <BookOpen size={13} />
              </a>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                launchTebexCheckout(product);
              }}
              className="px-3 py-1.5 rounded-sm text-[11px] font-semibold
                bg-primary text-primary-foreground hover:brightness-110
                hover:shadow-[0_0_12px_rgba(201,168,76,0.3)] transition-all duration-150"
            >
              {product.price === 0 ? "Download" : "Comprar"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Products Section ─────────────────────────────────────────────────────────


function ProductsSection({
  products,
  loading,
  error,
  currency,
  language,
  onSelectProduct
}: {
  products: Product[];
  loading: boolean;
  error: string | null;
  currency: CurrencyCode;
  language: SiteLanguage;
  onSelectProduct: (p: Product) => void;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("Todos");
  const [sort, setSort] = useState<SortOrder>("recent");

  const sourceProducts = products.length > 0 ? products : PRODUCTS;

  const filtered = sourceProducts
    .filter((p) => {
      const matchCat = category === "Todos" || p.category === category;
      const q = search.toLowerCase();
      const localized = getLocalizedProduct(p, language);
      const matchSearch = !q || localized.name.toLowerCase().includes(q) || localized.description.toLowerCase().includes(q);
      const matchVisible = p.visible !== false;
      return matchCat && matchSearch && matchVisible;
    })
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "popular") {
        const order = ["popular", "atualizado", "novo", "em-breve"];
        return order.indexOf(a.status) - order.indexOf(b.status);
      }
      return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
    });

  return (
    <section id="products" className="py-14 lg:py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <SectionTag>Vitrine</SectionTag>
          <div className="mt-5 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2
              className="text-3xl lg:text-4xl font-bold text-foreground/90"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              Scripts &amp; Recursos
            </h2>
            <p
              className="text-sm text-muted-foreground max-w-sm"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Produtos publicados pelo painel admin aparecem automaticamente aqui. Pagamento via Tebex.
            </p>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-600">
              {error} Usando produtos locais como fallback.
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`shrink-0 px-3 py-1.5 rounded-sm text-xs font-semibold tracking-wide
                  border transition-all duration-150 ${
                  category === cat
                    ? "border-primary/60 text-primary bg-primary/10"
                    : "border-border text-muted-foreground hover:border-primary/25 hover:text-foreground/70"
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar produto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-sm border border-border bg-card text-sm
                  text-foreground/80 placeholder:text-muted-foreground/50
                  focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20
                  transition-all duration-150"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOrder)}
              className="px-4 py-2 rounded-sm border border-border bg-card text-sm
                text-foreground/70 focus:outline-none focus:border-primary/40
                transition-colors cursor-pointer"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <option value="recent">Mais recentes</option>
              <option value="popular">Mais populares</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-72 rounded-2xl border border-border bg-card animate-pulse" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} currency={currency} language={language} onSelect={onSelectProduct} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <LayoutGrid size={32} className="text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Nenhum produto encontrado para essa busca.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Product Detail Modal ─────────────────────────────────────────────────────

function ProductMediaGallery({ product }: { product: Product }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedMedia, setFailedMedia] = useState<Record<string, boolean>>({});
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const Icon = ICON_MAP[product.iconName] ?? Package;
  const media = (product.media ?? []).slice(1).map((item) => {
    const normalizedType = item.type === "youtube" || isYouTubeUrl(item.src)
      ? "youtube"
      : item.type === "video"
        ? "video"
        : "image";
    return { ...item, type: normalizedType as ProductMedia["type"] };
  });

  const activeMedia = media[activeIndex] ?? media[0];
  const activeIsYouTube = activeMedia ? activeMedia.type === "youtube" : false;
  const activeYouTubeEmbedUrl = activeMedia ? getYouTubeEmbedUrl(activeMedia.src) : "";
  const hasActiveMedia = !!(activeMedia && !failedMedia[activeMedia.src]);
  const canNavigate = media.length > 1;

  function goToMedia(direction: "prev" | "next") {
    if (media.length === 0) return;

    setActiveIndex((current) => {
      if (direction === "prev") {
        return current === 0 ? media.length - 1 : current - 1;
      }

      return current === media.length - 1 ? 0 : current + 1;
    });
  }

  useEffect(() => {
    if (!lightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowLeft") goToMedia("prev");
      if (event.key === "ArrowRight") goToMedia("next");
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxOpen, media.length]);

  const renderMainMedia = (isLightbox = false) => {
    if (!hasActiveMedia || !activeMedia) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
          <div className="p-4 rounded-sm border border-primary/25 bg-primary/10">
            <Icon size={28} className="text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-primary/80">
              Galeria do Produto
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              A primeira mídia é usada como ícone do card. Adicione mais URLs para aparecerem na galeria.
            </p>
          </div>
        </div>
      );
    }

    if (activeMedia.type === "image") {
      return (
        <img
          src={activeMedia.src}
          alt={activeMedia.alt}
          onClick={() => setLightboxOpen(true)}
          onError={() => setFailedMedia((prev) => ({ ...prev, [activeMedia.src]: true }))}
          className={isLightbox
            ? "max-h-[82vh] max-w-[86vw] rounded-xl object-contain shadow-[0_35px_120px_rgba(0,0,0,0.55)]"
            : "h-full w-full cursor-zoom-in object-contain"
          }
        />
      );
    }

    if (activeMedia.type === "video" && !activeIsYouTube) {
      return (
        <video
          src={activeMedia.src}
          poster={activeMedia.poster}
          controls
          playsInline
          onError={() => setFailedMedia((prev) => ({ ...prev, [activeMedia.src]: true }))}
          className={isLightbox
            ? "max-h-[82vh] max-w-[86vw] rounded-xl bg-black object-contain shadow-[0_35px_120px_rgba(0,0,0,0.55)]"
            : "h-full w-full rounded-xl bg-black object-contain shadow-[0_18px_55px_rgba(32,32,32,0.14)]"
          }
        />
      );
    }

    return (
      <div className={isLightbox
        ? "aspect-video w-[86vw] max-w-6xl overflow-hidden rounded-xl bg-black shadow-[0_35px_120px_rgba(0,0,0,0.55)]"
        : "h-full w-full overflow-hidden rounded-xl bg-black shadow-[0_18px_55px_rgba(32,32,32,0.14)]"
      }>
        <iframe
          src={activeYouTubeEmbedUrl}
          title={activeMedia.alt}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    );
  };

  return (
    <>
      <div
        className="relative flex h-[560px] flex-col overflow-hidden bg-background"
        style={{ background: `linear-gradient(135deg, ${product.gradientFrom}, ${product.gradientTo})` }}
      >
        <div className="relative min-h-0 flex-1 overflow-hidden px-4 sm:px-5 lg:px-6">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, rgba(201,168,76,0.12) 1px, transparent 0)",
              backgroundSize: "24px 24px"
            }}
          />

          <div className="relative z-10 flex h-full min-h-0 items-center justify-center p-4 lg:p-5">
            {renderMainMedia(false)}

            {hasActiveMedia && (
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="absolute right-5 top-5 z-30 inline-flex h-9 items-center gap-2 rounded-full border border-primary/20 bg-card/90 px-3 text-[11px] font-semibold text-primary shadow-[0_10px_25px_rgba(32,32,32,0.10)] backdrop-blur-sm transition-all hover:bg-primary hover:text-primary-foreground"
                title="Abrir galeria ampliada"
              >
                <ExternalLink size={13} />
                Ampliar
              </button>
            )}
          </div>

          {media.length > 0 && (
            <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-primary/20 bg-card/90 px-3 py-1 text-[11px] font-semibold text-muted-foreground backdrop-blur-sm">
              <span>{activeIndex + 1}</span>
              <span>/</span>
              <span>{media.length}</span>
            </div>
          )}
        </div>

        <div className="relative z-20 h-[92px] shrink-0 border-t border-border bg-card/90 px-4 py-3 backdrop-blur-sm">
          <div className="flex h-full gap-2.5 overflow-hidden pb-1">
            {media.length > 0 ? media.map((item, index) => {
              const isActive = index === activeIndex;
              const isFailed = failedMedia[item.src];
              const itemIsYouTube = item.type === "youtube" || isYouTubeUrl(item.src);
              const thumbSrc = item.poster || (itemIsYouTube ? getYouTubeThumbnail(item.src) : "");

              return (
                <button
                  key={`${item.src}-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  onDoubleClick={() => setLightboxOpen(true)}
                  title={item.alt}
                  className={`relative h-[68px] w-28 shrink-0 overflow-hidden rounded-lg border bg-background transition-all ${
                    isActive
                      ? "border-primary shadow-[0_0_14px_rgba(201,168,76,0.22)]"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  {!isFailed && item.type === "image" && (
                    <img
                      src={item.src}
                      alt={item.alt}
                      onError={() => setFailedMedia((prev) => ({ ...prev, [item.src]: true }))}
                      className="h-full w-full object-cover"
                    />
                  )}

                  {!isFailed && (item.type === "video" || itemIsYouTube) && (
                    <div className="relative h-full w-full">
                      {thumbSrc && !failedMedia[thumbSrc] ? (
                        <img
                          src={thumbSrc}
                          alt=""
                          onError={() => setFailedMedia((prev) => ({ ...prev, [thumbSrc]: true }))}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-primary/10" />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-background/35">
                        <Play size={18} className="text-primary" />
                      </div>
                    </div>
                  )}

                  {isFailed && (
                    <div className="flex h-full w-full items-center justify-center bg-primary/5 text-primary/70">
                      {item.type === "video" || itemIsYouTube ? <Play size={18} /> : <ImageIcon size={18} />}
                    </div>
                  )}
                </button>
              );
            }) : (
              <div className="flex h-full items-center gap-2 text-xs text-muted-foreground">
                <ImageIcon size={14} />
                A primeira URL é usada como ícone do card. As próximas aparecem na galeria.
              </div>
            )}
          </div>
        </div>
      </div>

      {lightboxOpen && activeMedia && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 px-6 py-10 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxOpen(false)}
        >
          {activeMedia.type === "image" && (
            <div
              className="absolute inset-0 opacity-20 blur-2xl"
              style={{
                backgroundImage: `url('${activeMedia.src}')`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            />
          )}

          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-6 top-6 z-[130] flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20"
            aria-label="Fechar galeria"
          >
            <X size={22} />
          </button>

          <div
            className="relative z-[125] flex max-h-[90vh] w-full flex-col items-center gap-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex min-h-0 w-full flex-1 items-center justify-center">
              {renderMainMedia(true)}
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => goToMedia("prev")}
                disabled={!canNavigate}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 disabled:opacity-30"
                aria-label="Imagem anterior"
              >
                <ChevronRight size={22} className="rotate-180" />
              </button>

              <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                {activeIndex + 1} / {media.length}
              </div>

              <button
                type="button"
                onClick={() => goToMedia("next")}
                disabled={!canNavigate}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 disabled:opacity-30"
                aria-label="Próxima imagem"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}



function ProductPage({ product, currency, language }: { product: Product; currency: CurrencyCode; language: SiteLanguage }) {
  const status = STATUS_CONFIG[product.status];
  const localized = getLocalizedProduct(product, language);

  async function handleAddToCart() {
    try {
      const basket = await addProductToTebexCart(product);
      if (basket && getBasketItems(basket).length === 0) {
        window.alert("A cesta foi criada, mas a Tebex nao retornou o item no basket. Verifique se o Package ID do produto esta correto no admin.");
        return;
      }
      window.location.href = "/checkout";
    } catch (error) {
      console.error(error);
      window.alert(error instanceof Error ? error.message : "Nao foi possivel adicionar o produto ao carrinho.");
    }
  }

  async function handleBuyNow() {
    await launchTebexCheckout(product);
  }

  return (
    <main className="mx-auto max-w-[1320px] px-5 py-4">
      <div className="mb-3">
        <a href="/#products" className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80">
          <ChevronRight size={13} className="rotate-180" />
          Voltar para produtos
        </a>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,820px)_460px] gap-6 items-start">
        <div className="overflow-hidden rounded-[24px] border border-border bg-card shadow-[0_18px_55px_rgba(32,32,32,0.07)]">
          <ProductMediaGallery product={product} />
        </div>

        <aside className="overflow-hidden rounded-[24px] border border-border bg-card shadow-[0_18px_55px_rgba(32,32,32,0.07)]">
          <div className="p-5 pb-4">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`px-2 py-0.5 rounded-sm text-[9px] font-semibold tracking-wider uppercase ${status.cls}`}>
                {status.label}
              </span>
              <span className="px-2 py-0.5 rounded-sm text-[9px] tracking-wider uppercase border border-border text-muted-foreground">
                {product.category}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-foreground/95 mb-2" style={{ fontFamily: "'Raleway', sans-serif" }}>
              {localized.name}
            </h1>

            <p className="mb-4 text-sm text-muted-foreground leading-6">
              {localized.fullDescription || localized.description}
            </p>

            <div className="space-y-4">
              <div>
                <h2 className="text-[10px] font-semibold tracking-widest uppercase text-primary/70 mb-2">Recursos Principais</h2>
                <ul className="space-y-2">
                  {localized.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-xs text-foreground/75 leading-5">
                      <Check size={12} className="text-primary mt-1 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-[10px] font-semibold tracking-widest uppercase text-primary/70 mb-2">Requisitos</h2>
                <ul className="space-y-2">
                  {localized.requirements.map((req) => (
                    <li key={req} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-5">
                      <ChevronRight size={11} className="text-muted-foreground mt-1.5 shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-primary/20 bg-card/95 p-4">
            <div className="mb-3 rounded-xl border border-border bg-muted/30 p-3">
              <div className="flex items-start gap-2.5">
                <Shield size={13} className="text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] font-semibold text-foreground/70 mb-1 tracking-wide">Licença de Uso</p>
                  <p className="text-[11px] text-muted-foreground leading-5">
                    A compra concede licença de uso por servidor. É proibida revenda, redistribuição,
                    vazamento, compartilhamento ou engenharia reversa dos arquivos.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 mb-3">
              <p className="text-[9px] tracking-widest uppercase text-muted-foreground mb-1">Preço</p>
              <p className="text-2xl font-bold text-primary" style={{ fontFamily: "'Cinzel', serif" }}>
                {formatProductPrice(product.price, currency, product.priceCurrency)}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button onClick={handleAddToCart} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-primary/25 px-4 text-xs font-semibold text-primary hover:bg-primary/5">
                <ShoppingCart size={14} />
                Adicionar
              </button>
              <button onClick={handleBuyNow} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground">
                Comprar
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function ProductDetail({ product, currency, language, onClose }: { product: Product; currency: CurrencyCode; language: SiteLanguage; onClose: () => void }) {
  const status = STATUS_CONFIG[product.status];
  const localized = getLocalizedProduct(product, language);
  const [cartBusy, setCartBusy] = useState(false);
  const [buyBusy, setBuyBusy] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  async function handleAddToCart() {
    try {
      setCartBusy(true);
      setAddedToCart(false);

      const basket = await addProductToTebexCart(product);

      if (basket && getBasketItems(basket).length === 0) {
        window.alert("A cesta foi criada, mas a Tebex nao retornou o item no basket. Verifique se o Package ID do produto esta correto no admin.");
        return;
      }

      setAddedToCart(true);
      window.setTimeout(() => setAddedToCart(false), 2500);
    } catch (error) {
      console.error(error);
      window.alert(error instanceof Error ? error.message : "Nao foi possivel adicionar o produto ao carrinho.");
    } finally {
      setCartBusy(false);
    }
  }

  async function handleBuyNow() {
    try {
      setBuyBusy(true);
      await launchTebexCheckout(product);
    } finally {
      setBuyBusy(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        key="panel"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className="fixed inset-4 z-50 flex overflow-hidden rounded-sm border border-border bg-card shadow-[0_24px_80px_rgba(32,32,32,0.18)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="hidden min-w-0 flex-1 border-r border-border lg:block">
          <ProductMediaGallery product={product} />
        </div>

        <div className="flex w-full flex-col bg-card lg:w-[560px] xl:w-[620px]">
          {/* Close */}
          <div className="sticky top-0 z-20 flex items-center justify-between px-8 py-4
            bg-card/95 backdrop-blur-sm border-b border-border">
            <span className="text-xs tracking-widest uppercase text-muted-foreground"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Detalhes do Produto
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-sm border border-border text-muted-foreground
                hover:border-primary/30 hover:text-primary transition-all"
            >
              <X size={15} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="lg:hidden">
              <ProductMediaGallery product={product} />
            </div>

            {/* Content */}
            <div className="px-8 py-8 space-y-8 pb-28">
              {/* Title block */}
              <div>
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-sm text-[10px] font-semibold tracking-wider uppercase ${status.cls}`}>
                    {status.label}
                  </span>
                  <span className="px-2 py-0.5 rounded-sm text-[10px] tracking-wider uppercase
                    border border-border text-muted-foreground">
                    {product.category}
                  </span>
                </div>
                <h2
                  className="text-2xl font-bold text-foreground/90 mb-3"
                  style={{ fontFamily: "'Raleway', sans-serif" }}
                >
                  {localized.name}
                </h2>
                <p
                  className="max-w-3xl text-base text-muted-foreground leading-8"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {localized.fullDescription}
                </p>
              </div>

              {/* Features */}
              <div>
                <h3
                  className="text-xs font-semibold tracking-widest uppercase text-primary/70 mb-4"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Recursos Principais
                </h3>
                <ul className="space-y-3">
                  {localized.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3">
                      <Check size={14} className="text-primary mt-1 shrink-0" />
                      <span
                        className="text-base text-foreground/75 leading-7"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div>
                <h3
                  className="text-xs font-semibold tracking-widest uppercase text-primary/70 mb-4"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Requisitos
                </h3>
                <ul className="space-y-3">
                  {localized.requirements.map((req) => (
                    <li key={req} className="flex items-start gap-3">
                      <ChevronRight size={13} className="text-muted-foreground mt-1.5 shrink-0" />
                      <span
                        className="text-base text-muted-foreground leading-7"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {req}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* License notice */}
              <div className="p-4 rounded-sm border border-border bg-muted/30">
                <div className="flex items-start gap-3">
                  <Shield size={14} className="text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p
                      className="text-xs font-semibold text-foreground/70 mb-1 tracking-wide"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Licença de Uso
                    </p>
                    <p
                      className="text-xs text-muted-foreground leading-relaxed"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      A compra concede licença de uso por servidor. É proibida revenda, redistribuição,
                      vazamento, compartilhamento ou engenharia reversa dos arquivos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed purchase footer */}
          <div className="sticky bottom-0 z-20 border-t border-primary/20 bg-card/95 px-6 py-4 backdrop-blur-md">
            <div className="flex flex-col gap-3 rounded-sm border border-primary/20 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-[10px] tracking-widest uppercase text-muted-foreground mb-1"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Valor
                </div>
                <div
                  className="text-2xl font-bold"
                  style={{ color: product.price === 0 ? "#5d8a5d" : "#8b714b", fontFamily: "'Cinzel', serif" }}
                >
                  {formatProductPrice(product.price, currency, product.priceCurrency)}
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <GhostButton onClick={handleAddToCart} className="justify-center">
                  <ShoppingCart size={14} />
                  {cartBusy ? "Adicionando..." : addedToCart ? "Adicionado" : "Adicionar"}
                </GhostButton>
                <GhostButton href="/checkout" className="justify-center">
                  Ver cesta
                  <ChevronRight size={13} />
                </GhostButton>
                <GoldButton onClick={handleBuyNow} className="justify-center">
                  {buyBusy ? "Abrindo..." : product.price === 0 ? "Download" : "Comprar"}
                  <ArrowRight size={13} />
                </GoldButton>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Docs CTA ─────────────────────────────────────────────────────────────────

function DocsSection() {
  return (
    <section id="docs" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div
          className="relative rounded-sm border border-border overflow-hidden p-10 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(169,120,23,0.08) 0%, rgba(247,242,232,0) 60%)"
          }}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, rgba(201,168,76,0.08) 1px, transparent 0)",
              backgroundSize: "28px 28px"
            }}
          />
          <div className="relative z-10">
            <div className="inline-flex p-3 rounded-sm border border-primary/25 bg-primary/10 mb-6">
              <BookOpen size={20} className="text-primary" />
            </div>
            <h2
              className="text-2xl lg:text-3xl font-bold text-foreground/90 mb-4"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              Documentação completa para cada produto
            </h2>
            <p
              className="text-sm text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Guias de instalação, configuração, comandos, solução de problemas e licença comercial
              reunidos em um só lugar.
            </p>
            <GoldButton href="https://docs.thewantedsolestudio.workers.dev" external className="px-8 py-3">
              Acessar Documentação
              <ExternalLink size={14} />
            </GoldButton>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Discord CTA ──────────────────────────────────────────────────────────────

function DiscordSection() {
  return (
    <section id="discord" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div
          className="relative rounded-sm border border-primary/20 overflow-hidden p-10 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(169,120,23,0.1) 0%, rgba(247,242,232,0) 70%)"
          }}
        >
          {/* Discord background image */}
          <div
            className="absolute inset-y-0 right-0 w-[46%] bg-contain bg-right-bottom bg-no-repeat opacity-[0.46] pointer-events-none"
            style={{
              backgroundImage: "url('/discord-bg.png')"
            }}
          />

          {/* Soft ivory fade to keep the card clean and text readable */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(90deg, rgba(247,245,240,0.96) 0%, rgba(247,245,240,0.88) 58%, rgba(247,245,240,0.52) 100%)"
            }}
          />

          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="relative z-10">
            <div className="inline-flex p-3 rounded-sm border border-primary/25 bg-primary/10 mb-6">
              <MessageCircle size={20} className="text-primary" />
            </div>
            <h2
              className="text-2xl lg:text-3xl font-bold text-foreground/90 mb-4"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              Precisa de ajuda ou quer acompanhar novidades?
            </h2>
            <p
              className="text-sm text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Entre no Discord oficial da The Wanted Sole Studio para suporte técnico, atualizações,
              prévias de novos produtos e atendimento da comunidade.
            </p>
            <GoldButton href="https://discord.gg/qE29trG84u" external className="px-8 py-3">
              <MessageCircle size={15} />
              Entrar no Discord
            </GoldButton>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

function FAQSection() {
  return (
    <section id="faq" className="py-28 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <SectionTag>Dúvidas Frequentes</SectionTag>
          <h2
            className="mt-5 text-3xl lg:text-4xl font-bold text-foreground/90"
            style={{ fontFamily: "'Raleway', sans-serif" }}
          >
            Perguntas Frequentes
          </h2>
        </div>

        <AccordionPrimitive.Root type="single" collapsible className="space-y-2">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionPrimitive.Item
              key={i}
              value={`faq-${i}`}
              className="border border-border rounded-sm bg-card overflow-hidden
                data-[state=open]:border-primary/30 transition-colors duration-200"
            >
              <AccordionPrimitive.Header>
                <AccordionPrimitive.Trigger
                  className="group w-full flex items-center justify-between px-5 py-4 text-left
                    text-sm font-medium text-foreground/80 hover:text-foreground/95
                    transition-colors duration-150 [&[data-state=open]]:text-primary"
                  style={{ fontFamily: "'Raleway', sans-serif" }}
                >
                  {item.q}
                  <ChevronDown
                    size={15}
                    className="shrink-0 text-muted-foreground transition-transform duration-200
                      group-data-[state=open]:rotate-180 group-data-[state=open]:text-primary ml-4"
                  />
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionPrimitive.Content
                className="overflow-hidden text-sm data-[state=open]:animate-none data-[state=closed]:animate-none"
              >
                <p
                  className="px-5 pb-4 text-muted-foreground leading-relaxed border-t border-border pt-3"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {item.a}
                </p>
              </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
          ))}
        </AccordionPrimitive.Root>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────


function LegalPage({
  language,
  type
}: {
  language: SiteLanguage;
  type: "terms" | "privacy";
}) {
  const isEnglish = language === "en_US";

  const termsPt: any[] = [
    {
      title: "1. Introdução",
      paragraphs: [
        "Bem-vindo à The Wanted Sole Studio. Estes Termos de Uso regulam o acesso e a utilização do nosso site, produtos digitais, scripts, custom peds, documentações, serviços e demais conteúdos disponibilizados pela The Wanted Sole Studio.",
        "Ao acessar nosso site, realizar uma compra, baixar qualquer produto ou utilizar nossos serviços, você declara que leu, entendeu e concorda com estes Termos. Caso não concorde com alguma condição, recomendamos que não utilize o site nem adquira nossos produtos."
      ]
    },
    {
      title: "2. Sobre nossos produtos",
      paragraphs: [
        "A The Wanted Sole Studio trabalha com produtos digitais voltados principalmente para servidores RedM, incluindo scripts, sistemas, custom peds, interfaces, recursos visuais, documentações e arquivos relacionados.",
        "Todos os produtos são digitais. Não há envio físico. Após a confirmação do pagamento, o acesso poderá ser liberado automaticamente pela plataforma de pagamento, painel do cliente, Discord, documentação ou outro meio informado na página do produto."
      ]
    },
    {
      title: "3. Conta, acesso e responsabilidade",
      paragraphs: [
        "Para acessar determinados produtos, recursos ou áreas restritas, poderá ser necessário utilizar uma conta, e-mail, Discord, Tebex ou outro método de identificação.",
        "O usuário é responsável por manter suas informações corretas, proteger seus acessos e garantir que terceiros não utilizem sua conta sem autorização."
      ]
    },
    {
      title: "4. Licença de uso",
      paragraphs: [
        "Ao adquirir um produto da The Wanted Sole Studio, o usuário recebe uma licença limitada, pessoal, revogável, intransferível e não exclusiva para utilizar o produto conforme as condições descritas na página de venda, documentação ou instruções fornecidas."
      ],
      highlight: "A compra de um produto não transfere propriedade intelectual, código-fonte, marca, design, conceito, estrutura ou qualquer direito autoral relacionado ao produto."
    },
    {
      title: "5. Restrições de uso",
      paragraphs: ["O usuário não está autorizado a:"],
      list: [
        "Revender, redistribuir, compartilhar, vazar ou doar qualquer produto adquirido;",
        "Publicar arquivos, códigos, links privados ou conteúdos protegidos em grupos, fóruns, Discords ou sites;",
        "Remover créditos, proteções, licenças ou identificações dos produtos;",
        "Copiar, clonar ou reproduzir nossos sistemas, interfaces, layouts, nomes, marcas ou identidade visual;",
        "Realizar engenharia reversa, descompilação ou tentativa de extração indevida de código protegido;",
        "Compartilhar acesso de cliente, licença ou arquivos com outras pessoas, servidores ou comunidades."
      ],
      danger: "O descumprimento dessas regras poderá resultar na suspensão do suporte, revogação da licença, bloqueio de acesso aos produtos e, quando necessário, medidas legais."
    },
    {
      title: "6. Pagamentos",
      paragraphs: [
        "Os pagamentos podem ser processados por plataformas terceiras, como Tebex ou outros meios informados no momento da compra. A The Wanted Sole Studio não armazena dados completos de cartão, dados bancários ou informações financeiras sensíveis.",
        "Preços, moedas, promoções e disponibilidade dos produtos podem ser alterados a qualquer momento, sem aviso prévio. O valor válido será aquele exibido no momento da finalização da compra."
      ]
    },
    {
      title: "7. Política de reembolso",
      paragraphs: [
        "Por se tratarem de produtos digitais, entregues ou disponibilizados após a confirmação da compra, não oferecemos reembolso após a liberação do acesso, download, envio dos arquivos ou ativação da licença.",
        "Reembolsos poderão ser analisados apenas em situações excepcionais, como pagamento duplicado, erro comprovado de cobrança ou impossibilidade técnica confirmada pela equipe da The Wanted Sole Studio."
      ],
      danger: "A abertura de disputa, chargeback ou contestação indevida após o recebimento do produto poderá resultar na suspensão imediata da licença, bloqueio de acesso e remoção do suporte."
    },
    {
      title: "8. Suporte",
      paragraphs: [
        "O suporte é oferecido conforme a disponibilidade da equipe e pode ocorrer por Discord, ticket, documentação, e-mail ou outro canal oficial informado pela The Wanted Sole Studio.",
        "O suporte cobre dúvidas de instalação, configuração básica e problemas relacionados ao funcionamento original do produto. Não garantimos suporte para produtos modificados, arquivos alterados por terceiros, conflitos com outros scripts, bases muito modificadas ou uso fora das instruções fornecidas."
      ]
    },
    {
      title: "9. Atualizações",
      paragraphs: [
        "A The Wanted Sole Studio poderá disponibilizar atualizações, correções ou melhorias para seus produtos, mas não garante atualizações vitalícias, contínuas ou obrigatórias para todos os produtos.",
        "Algumas atualizações poderão ser gratuitas, enquanto outras poderão fazer parte de novas versões, pacotes pagos ou produtos separados."
      ]
    },
    {
      title: "10. Compatibilidade",
      paragraphs: [
        "Nossos produtos são desenvolvidos para funcionar conforme as informações descritas na página do produto e na documentação oficial. O usuário é responsável por verificar requisitos, dependências, framework, versão do servidor e compatibilidade antes da compra.",
        "Não garantimos funcionamento em ambientes alterados, bases privadas, versões desatualizadas, recursos modificados ou servidores que não sigam os requisitos informados."
      ]
    },
    {
      title: "11. Propriedade intelectual",
      paragraphs: [
        "Todo conteúdo disponibilizado pela The Wanted Sole Studio, incluindo códigos, designs, imagens, textos, vídeos, logotipos, nomes, interfaces, documentações, arquivos e materiais promocionais, é protegido por direitos autorais e outras leis aplicáveis.",
        "É proibido copiar, reproduzir, distribuir, vender, sublicenciar, publicar ou explorar qualquer conteúdo da The Wanted Sole Studio sem autorização prévia e por escrito."
      ]
    },
    {
      title: "12. Suspensão ou encerramento de acesso",
      paragraphs: [
        "A The Wanted Sole Studio reserva-se o direito de suspender, limitar ou encerrar o acesso de qualquer usuário que viole estes Termos, pratique fraude, compartilhe produtos indevidamente, abuse do suporte ou tente prejudicar a segurança dos nossos sistemas."
      ]
    },
    {
      title: "13. Alterações no site e nos termos",
      paragraphs: [
        "Podemos modificar, remover ou atualizar conteúdos, produtos, preços, páginas, funcionalidades e estes Termos de Uso a qualquer momento, sem aviso prévio.",
        "O uso contínuo do site ou dos produtos após alterações significa que o usuário concorda com a versão mais recente dos Termos."
      ]
    },
    {
      title: "14. Limitação de responsabilidade",
      paragraphs: [
        "A The Wanted Sole Studio não será responsável por perdas indiretas, lucros cessantes, danos ao servidor, perda de dados, conflitos com outros recursos, falhas causadas por má instalação, uso incorreto ou alterações realizadas pelo usuário ou por terceiros.",
        "Nossos produtos são fornecidos conforme disponibilizados, sem garantia de que atenderão a todas as necessidades específicas de cada servidor."
      ]
    },
    {
      title: "15. Plataformas terceiras",
      paragraphs: [
        "Nosso site e produtos podem utilizar ou direcionar para serviços de terceiros, como Tebex, Discord, GitHub, YouTube, plataformas de hospedagem, sistemas de pagamento ou documentações externas.",
        "A The Wanted Sole Studio não se responsabiliza por políticas, funcionamento, disponibilidade, cobranças ou decisões tomadas por essas plataformas terceiras."
      ]
    },
    {
      title: "16. Contato",
      paragraphs: ["Em caso de dúvidas sobre estes Termos de Uso, produtos, licenças ou suporte, entre em contato pelos canais oficiais da The Wanted Sole Studio."],
      contacts: [
        { label: "Discord", href: "https://discord.gg/qE29trG84u" },
        { label: "Site", href: "https://store-test.thewantedsolestudio.workers.dev/" }
      ]
    },
    {
      title: "17. Aceitação dos termos",
      paragraphs: ["Ao continuar utilizando o site, comprar produtos ou acessar qualquer conteúdo da The Wanted Sole Studio, você confirma que leu, compreendeu e aceita integralmente estes Termos de Uso."]
    }
  ];

  const termsEn: any[] = [
    {
      title: "1. Introduction",
      paragraphs: [
        "Welcome to The Wanted Sole Studio. These Terms of Use govern access to and use of our website, digital products, scripts, custom peds, documentation, services, and other content made available by The Wanted Sole Studio.",
        "By accessing our website, making a purchase, downloading any product, or using our services, you declare that you have read, understood, and agreed to these Terms. If you do not agree with any condition, we recommend that you do not use the website or purchase our products."
      ]
    },
    {
      title: "2. About our products",
      paragraphs: [
        "The Wanted Sole Studio works with digital products mainly intended for RedM servers, including scripts, systems, custom peds, interfaces, visual resources, documentation, and related files.",
        "All products are digital. There is no physical shipping. After payment confirmation, access may be released automatically through the payment platform, customer panel, Discord, documentation, or another method stated on the product page."
      ]
    },
    {
      title: "3. Account, access, and responsibility",
      paragraphs: [
        "To access certain products, resources, or restricted areas, it may be necessary to use an account, email, Discord, Tebex, or another identification method.",
        "The user is responsible for keeping their information accurate, protecting their access credentials, and ensuring that third parties do not use their account without authorization."
      ]
    },
    {
      title: "4. Usage license",
      paragraphs: [
        "When purchasing a product from The Wanted Sole Studio, the user receives a limited, personal, revocable, non-transferable, and non-exclusive license to use the product according to the conditions described on the sales page, documentation, or provided instructions."
      ],
      highlight: "Purchasing a product does not transfer intellectual property, source code, brand, design, concept, structure, or any copyright related to the product."
    },
    {
      title: "5. Usage restrictions",
      paragraphs: ["The user is not authorized to:"],
      list: [
        "Resell, redistribute, share, leak, or donate any purchased product;",
        "Publish files, code, private links, or protected content in groups, forums, Discord servers, or websites;",
        "Remove credits, protections, licenses, or product identifiers;",
        "Copy, clone, or reproduce our systems, interfaces, layouts, names, brands, or visual identity;",
        "Perform reverse engineering, decompilation, or any attempt to improperly extract protected code;",
        "Share customer access, licenses, or files with other people, servers, or communities."
      ],
      danger: "Violation of these rules may result in suspension of support, license revocation, product access blocking, and, when necessary, legal measures."
    },
    {
      title: "6. Payments",
      paragraphs: [
        "Payments may be processed by third-party platforms such as Tebex or other methods stated at checkout. The Wanted Sole Studio does not store complete card details, banking data, or sensitive financial information.",
        "Prices, currencies, promotions, and product availability may change at any time without prior notice. The valid amount will be the amount displayed when the purchase is completed."
      ]
    },
    {
      title: "7. Refund policy",
      paragraphs: [
        "Because these are digital products delivered or made available after purchase confirmation, we do not offer refunds after access is released, files are downloaded or sent, or the license is activated.",
        "Refunds may only be reviewed in exceptional situations, such as duplicate payment, confirmed billing error, or a technical impossibility verified by The Wanted Sole Studio team."
      ],
      danger: "Opening a dispute, chargeback, or improper payment contest after receiving the product may result in immediate license suspension, access blocking, and removal of support."
    },
    {
      title: "8. Support",
      paragraphs: [
        "Support is offered according to team availability and may take place through Discord, ticket, documentation, email, or another official channel stated by The Wanted Sole Studio.",
        "Support covers installation questions, basic configuration, and issues related to the product's original functionality. We do not guarantee support for modified products, files changed by third parties, conflicts with other scripts, heavily modified bases, or use outside the provided instructions."
      ]
    },
    {
      title: "9. Updates",
      paragraphs: [
        "The Wanted Sole Studio may provide updates, fixes, or improvements for its products, but does not guarantee lifetime, continuous, or mandatory updates for every product.",
        "Some updates may be free, while others may be part of new versions, paid packages, or separate products."
      ]
    },
    {
      title: "10. Compatibility",
      paragraphs: [
        "Our products are developed to work according to the information described on the product page and official documentation. The user is responsible for checking requirements, dependencies, framework, server version, and compatibility before purchasing.",
        "We do not guarantee functionality in altered environments, private bases, outdated versions, modified resources, or servers that do not follow the stated requirements."
      ]
    },
    {
      title: "11. Intellectual property",
      paragraphs: [
        "All content made available by The Wanted Sole Studio, including code, designs, images, texts, videos, logos, names, interfaces, documentation, files, and promotional materials, is protected by copyright and other applicable laws.",
        "It is forbidden to copy, reproduce, distribute, sell, sublicense, publish, or exploit any The Wanted Sole Studio content without prior written authorization."
      ]
    },
    {
      title: "12. Suspension or termination of access",
      paragraphs: ["The Wanted Sole Studio reserves the right to suspend, limit, or terminate access for any user who violates these Terms, commits fraud, improperly shares products, abuses support, or attempts to harm the security of our systems."]
    },
    {
      title: "13. Changes to the website and terms",
      paragraphs: [
        "We may modify, remove, or update content, products, prices, pages, features, and these Terms of Use at any time without prior notice.",
        "Continued use of the website or products after changes means that the user agrees to the most recent version of the Terms."
      ]
    },
    {
      title: "14. Limitation of liability",
      paragraphs: [
        "The Wanted Sole Studio will not be responsible for indirect losses, lost profits, server damage, data loss, conflicts with other resources, failures caused by poor installation, incorrect use, or changes made by the user or third parties.",
        "Our products are provided as made available, with no guarantee that they will meet every specific need of each server."
      ]
    },
    {
      title: "15. Third-party platforms",
      paragraphs: [
        "Our website and products may use or redirect to third-party services such as Tebex, Discord, GitHub, YouTube, hosting platforms, payment systems, or external documentation.",
        "The Wanted Sole Studio is not responsible for the policies, operation, availability, charges, or decisions made by these third-party platforms."
      ]
    },
    {
      title: "16. Contact",
      paragraphs: ["If you have questions about these Terms of Use, products, licenses, or support, contact The Wanted Sole Studio through the official channels."],
      contacts: [
        { label: "Discord", href: "https://discord.gg/qE29trG84u" },
        { label: "Website", href: "https://store-test.thewantedsolestudio.workers.dev/" }
      ]
    },
    {
      title: "17. Acceptance of the terms",
      paragraphs: ["By continuing to use the website, purchasing products, or accessing any The Wanted Sole Studio content, you confirm that you have read, understood, and fully accept these Terms of Use."]
    }
  ];

  const privacyPt: any[] = [
    {
      title: "1. Introdução",
      paragraphs: [
        "A sua privacidade é importante para a The Wanted Sole Studio. Esta Política de Privacidade explica como coletamos, usamos, armazenamos, protegemos e compartilhamos informações quando você acessa nosso site, compra produtos digitais, utiliza recursos vinculados à Tebex, entra em contato pelo Discord ou usa nossos serviços.",
        "Ao utilizar nosso site, você concorda com esta Política de Privacidade. Caso não concorde, recomendamos que não utilize o site nem realize compras."
      ]
    },
    {
      title: "2. Informações que podemos coletar",
      paragraphs: [
        "Podemos coletar informações fornecidas voluntariamente pelo usuário, como nome, e-mail, usuário/ID do Discord, identificador de conta Tebex, histórico de pedidos, mensagens enviadas ao suporte e informações necessárias para entrega de produtos digitais.",
        "Também podemos coletar informações técnicas automaticamente, como endereço IP, navegador, sistema operacional, páginas acessadas, data e horário de acesso, idioma, moeda selecionada, cookies e dados de uso do site."
      ]
    },
    {
      title: "3. Dados de pagamento",
      paragraphs: [
        "A The Wanted Sole Studio não armazena dados completos de cartão, dados bancários ou informações financeiras sensíveis. Pagamentos são processados por plataformas terceiras, como Tebex ou outros provedores exibidos no checkout.",
        "Podemos receber apenas informações necessárias para identificar e confirmar pedidos, como ID da transação, status do pagamento, produto comprado, valor, moeda, data da compra e dados básicos relacionados ao pedido."
      ],
      highlight: "Nunca solicitaremos que você envie dados completos de cartão por Discord, ticket ou mensagem privada."
    },
    {
      title: "4. Como usamos suas informações",
      paragraphs: ["Podemos usar as informações coletadas para:"],
      list: [
        "Processar pedidos, liberar produtos digitais e validar compras;",
        "Exibir informações da sua conta, cesta, checkout e histórico de compras;",
        "Prestar suporte técnico, responder dúvidas e resolver problemas;",
        "Prevenir fraudes, chargebacks indevidos, abuso de suporte ou violação de licença;",
        "Melhorar o site, os produtos, a documentação e a experiência do usuário;",
        "Enviar avisos importantes relacionados a compras, suporte, atualizações ou segurança."
      ]
    },
    {
      title: "5. Compartilhamento de informações",
      paragraphs: [
        "Podemos compartilhar informações com serviços necessários para operação do site e entrega dos produtos, como Tebex, Cloudflare, Discord, provedores de hospedagem, ferramentas de análise, sistemas de suporte e meios de pagamento.",
        "Também poderemos divulgar informações quando necessário para cumprir obrigação legal, proteger nossos direitos, investigar violações dos Termos de Uso, prevenir fraude ou responder a solicitações legítimas de autoridades competentes."
      ]
    },
    {
      title: "6. Cookies e tecnologias semelhantes",
      paragraphs: [
        "Podemos utilizar cookies, armazenamento local do navegador e tecnologias semelhantes para manter preferências do usuário, como idioma, moeda, sessão, cesta, login, experiência de navegação e funcionalidades do site.",
        "Você pode configurar seu navegador para bloquear cookies, mas algumas partes do site, checkout, login ou cesta podem não funcionar corretamente."
      ]
    },
    {
      title: "7. Segurança",
      paragraphs: [
        "Adotamos medidas técnicas e organizacionais razoáveis para proteger informações contra acesso não autorizado, alteração, perda, uso indevido ou divulgação indevida.",
        "Apesar dos esforços de segurança, nenhum sistema online é totalmente imune a falhas, ataques ou interceptações. Por isso, recomendamos que o usuário também proteja suas contas, tokens, e-mails e acessos."
      ]
    },
    {
      title: "8. Retenção de dados",
      paragraphs: [
        "Podemos manter informações pelo tempo necessário para cumprir finalidades operacionais, suporte, prevenção de fraude, obrigações legais, registros de compra, auditoria, segurança e defesa de direitos.",
        "Quando os dados não forem mais necessários, poderemos removê-los, anonimizá-los ou mantê-los apenas quando exigido por lei ou por interesse legítimo."
      ]
    },
    {
      title: "9. Direitos do usuário",
      paragraphs: [
        "Dependendo da legislação aplicável, você poderá solicitar acesso, correção, atualização ou exclusão de determinadas informações pessoais mantidas pela The Wanted Sole Studio.",
        "Alguns dados podem precisar ser mantidos por razões legais, fiscais, antifraude, segurança, comprovação de compra ou cumprimento dos Termos de Uso."
      ]
    },
    {
      title: "10. Menores de idade",
      paragraphs: [
        "Nossos produtos e serviços não são direcionados a crianças. Não coletamos intencionalmente informações de menores de idade sem consentimento apropriado do responsável legal.",
        "Se identificarmos coleta inadequada de dados de menor, poderemos remover as informações assim que razoavelmente possível."
      ]
    },
    {
      title: "11. Links e plataformas terceiras",
      paragraphs: [
        "Nosso site pode conter links ou integrações com plataformas de terceiros, como Tebex, Discord, GitHub, YouTube, Cloudflare e páginas externas.",
        "A The Wanted Sole Studio não controla as políticas de privacidade dessas plataformas. Recomendamos que você leia as políticas de cada serviço antes de fornecer informações."
      ]
    },
    {
      title: "12. Alterações nesta política",
      paragraphs: [
        "Podemos atualizar esta Política de Privacidade periodicamente para refletir mudanças no site, produtos, integrações, obrigações legais ou práticas de segurança.",
        "A versão mais recente será publicada nesta página. O uso contínuo do site após alterações significa que você concorda com a política atualizada."
      ]
    },
    {
      title: "13. Contato",
      paragraphs: ["Em caso de dúvidas sobre esta Política de Privacidade ou sobre o tratamento de informações, entre em contato pelos canais oficiais da The Wanted Sole Studio."],
      contacts: [
        { label: "Discord", href: "https://discord.gg/qE29trG84u" },
        { label: "Site", href: "https://store-test.thewantedsolestudio.workers.dev/" }
      ]
    }
  ];

  const privacyEn: any[] = [
    {
      title: "1. Introduction",
      paragraphs: [
        "Your privacy is important to The Wanted Sole Studio. This Privacy Policy explains how we collect, use, store, protect, and share information when you access our website, purchase digital products, use Tebex-related features, contact us through Discord, or use our services.",
        "By using our website, you agree to this Privacy Policy. If you do not agree, we recommend that you do not use the website or make purchases."
      ]
    },
    {
      title: "2. Information we may collect",
      paragraphs: [
        "We may collect information voluntarily provided by the user, such as name, email address, Discord username/ID, Tebex account identifier, order history, support messages, and information required to deliver digital products.",
        "We may also automatically collect technical information such as IP address, browser, operating system, visited pages, access date and time, language, selected currency, cookies, and website usage data."
      ]
    },
    {
      title: "3. Payment data",
      paragraphs: [
        "The Wanted Sole Studio does not store complete card details, banking data, or sensitive financial information. Payments are processed by third-party platforms, such as Tebex or other providers shown at checkout.",
        "We may only receive information required to identify and confirm orders, such as transaction ID, payment status, purchased product, amount, currency, purchase date, and basic order-related data."
      ],
      highlight: "We will never ask you to send complete card details through Discord, support tickets, or private messages."
    },
    {
      title: "4. How we use your information",
      paragraphs: ["We may use collected information to:"],
      list: [
        "Process orders, release digital products, and validate purchases;",
        "Display account, basket, checkout, and purchase history information;",
        "Provide technical support, answer questions, and resolve issues;",
        "Prevent fraud, improper chargebacks, support abuse, or license violations;",
        "Improve the website, products, documentation, and user experience;",
        "Send important notices related to purchases, support, updates, or security."
      ]
    },
    {
      title: "5. Sharing of information",
      paragraphs: [
        "We may share information with services required to operate the website and deliver products, such as Tebex, Cloudflare, Discord, hosting providers, analytics tools, support systems, and payment providers.",
        "We may also disclose information when necessary to comply with legal obligations, protect our rights, investigate Terms of Use violations, prevent fraud, or respond to legitimate requests from competent authorities."
      ]
    },
    {
      title: "6. Cookies and similar technologies",
      paragraphs: [
        "We may use cookies, browser local storage, and similar technologies to maintain user preferences such as language, currency, session, basket, login, browsing experience, and website features.",
        "You can configure your browser to block cookies, but some parts of the website, checkout, login, or basket may not work correctly."
      ]
    },
    {
      title: "7. Security",
      paragraphs: [
        "We adopt reasonable technical and organizational measures to protect information against unauthorized access, alteration, loss, misuse, or improper disclosure.",
        "Despite security efforts, no online system is completely immune to failures, attacks, or interception. We also recommend that users protect their accounts, tokens, emails, and access credentials."
      ]
    },
    {
      title: "8. Data retention",
      paragraphs: [
        "We may retain information for as long as necessary to fulfill operational purposes, support, fraud prevention, legal obligations, purchase records, auditing, security, and defense of rights.",
        "When data is no longer necessary, we may remove it, anonymize it, or retain it only when required by law or legitimate interest."
      ]
    },
    {
      title: "9. User rights",
      paragraphs: [
        "Depending on applicable law, you may request access, correction, update, or deletion of certain personal information held by The Wanted Sole Studio.",
        "Some data may need to be retained for legal, tax, anti-fraud, security, proof of purchase, or Terms of Use compliance purposes."
      ]
    },
    {
      title: "10. Minors",
      paragraphs: [
        "Our products and services are not directed to children. We do not knowingly collect information from minors without appropriate consent from a legal guardian.",
        "If we identify improper collection of a minor's data, we may remove the information as soon as reasonably possible."
      ]
    },
    {
      title: "11. Third-party links and platforms",
      paragraphs: [
        "Our website may contain links or integrations with third-party platforms, such as Tebex, Discord, GitHub, YouTube, Cloudflare, and external pages.",
        "The Wanted Sole Studio does not control the privacy policies of these platforms. We recommend that you read each service's policy before providing information."
      ]
    },
    {
      title: "12. Changes to this policy",
      paragraphs: [
        "We may update this Privacy Policy periodically to reflect changes to the website, products, integrations, legal obligations, or security practices.",
        "The most recent version will be published on this page. Continued use of the website after changes means that you agree to the updated policy."
      ]
    },
    {
      title: "13. Contact",
      paragraphs: ["If you have questions about this Privacy Policy or how information is handled, contact The Wanted Sole Studio through the official channels."],
      contacts: [
        { label: "Discord", href: "https://discord.gg/qE29trG84u" },
        { label: "Website", href: "https://store-test.thewantedsolestudio.workers.dev/" }
      ]
    }
  ];

  const isPrivacy = type === "privacy";
  const sections = isPrivacy
    ? (isEnglish ? privacyEn : privacyPt)
    : (isEnglish ? termsEn : termsPt);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07080c] px-6 py-16 lg:py-20 text-[#f4f4f5]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[-14%] top-[-12%] h-80 w-80 rounded-full bg-[#d6a84f]/15 blur-3xl" />
        <div className="absolute right-[-10%] bottom-[-10%] h-96 w-96 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        <header className="mb-10 text-center">
          <div className="mb-5 inline-flex items-center rounded-full border border-[#d6a84f]/35 bg-[#d6a84f]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#d6a84f]">
            The Wanted Sole Studio
          </div>
          <h1 className="text-4xl font-bold tracking-tight lg:text-6xl" style={{ fontFamily: "'Raleway', sans-serif" }}>
            {isPrivacy
              ? (isEnglish ? "Privacy Policy" : "Política de Privacidade")
              : (isEnglish ? "Terms of Use" : "Termos de Uso")}
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-zinc-400 lg:text-base">
            {isPrivacy
              ? (isEnglish
                ? "Learn how The Wanted Sole Studio handles information related to browsing, accounts, purchases, support, Tebex integrations, and digital products."
                : "Entenda como a The Wanted Sole Studio trata informações relacionadas à navegação, contas, compras, suporte, integrações Tebex e produtos digitais.")
              : (isEnglish
                ? "Read the conditions for use, purchase, licensing, support, and access to digital products provided by The Wanted Sole Studio."
                : "Leia atentamente as condições de uso, compra, licença, suporte e acesso aos produtos digitais disponibilizados pela The Wanted Sole Studio.")}
          </p>
          <div className="mt-6 inline-flex rounded-full border border-[#d6a84f]/25 bg-[#d6a84f]/10 px-4 py-2 text-xs font-semibold text-[#d6a84f]">
            {isEnglish ? "Language: English" : "Idioma: Português"}
          </div>
        </header>

        <section className="rounded-[30px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:p-8">
          <div className="space-y-5">
            {sections.map((section) => (
              <article key={section.title} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 lg:p-6">
                <h2 className="mb-3 text-lg font-bold text-[#d6a84f] lg:text-xl" style={{ fontFamily: "'Raleway', sans-serif" }}>
                  {section.title}
                </h2>

                <div className="space-y-3">
                  {section.paragraphs.map((paragraph: string) => (
                    <p key={paragraph} className="text-sm leading-7 text-zinc-300">
                      {paragraph}
                    </p>
                  ))}

                  {section.list && (
                    <ul className="grid gap-2 pt-1">
                      {section.list.map((item: string) => (
                        <li key={item} className="flex gap-3 text-sm leading-6 text-zinc-300">
                          <span className="mt-0.5 text-[#d6a84f]">✦</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.highlight && (
                    <div className="rounded-2xl border border-[#d6a84f]/25 bg-[#d6a84f]/10 px-4 py-3 text-sm leading-6 text-[#f5e7c6]">
                      {section.highlight}
                    </div>
                  )}

                  {section.danger && (
                    <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-200">
                      {section.danger}
                    </div>
                  )}

                  {section.contacts && (
                    <div className="grid gap-2 pt-2">
                      {section.contacts.map((contact: { label: string; href: string }) => (
                        <p key={contact.href} className="text-sm text-zinc-300">
                          <strong>{contact.label}:</strong>{" "}
                          <a href={contact.href} target="_blank" rel="noopener noreferrer" className="font-bold text-[#d6a84f] hover:underline">
                            {contact.href}
                          </a>
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <p className="mt-8 text-center text-xs text-zinc-500">
          © 2026 The Wanted Sole Studio. {isEnglish ? "All rights reserved." : "Todos os direitos reservados."}
        </p>
      </div>
    </main>
  );
}

function TermsPage({ language }: { language: SiteLanguage }) {
  return <LegalPage language={language} type="terms" />;
}

function PrivacyPolicyPage({ language }: { language: SiteLanguage }) {
  return <LegalPage language={language} type="privacy" />;
}



function AboutPage({ language }: { language: SiteLanguage }) {
  const isEnglish = language === "en_US";

  const sections = isEnglish ? [
    {
      title: "1. Who we are",
      paragraphs: [
        "The Wanted Sole Studio is a brand focused on visual creation, digital customization, and system development with its own identity. Our goal is to create tools, scripts, and experiences that combine design, organization, and technology for servers, creators, and digital projects.",
        "Founded by Vitor Alves, also known as Valvesitor, the brand represents a clear vision: delivering products with personality, professional visuals, and genuinely useful features."
      ]
    },
    {
      title: "2. Our proposal",
      paragraphs: [
        "Our proposal is to develop digital products that are not only functional, but also visually remarkable, organized, and easy to use.",
        "Each project is designed to help servers, stores, and creators present their products in a more professional, modern, and reliable way."
      ]
    },
    {
      title: "3. What we do",
      paragraphs: [
        "We develop digital products mainly focused on RedM, including scripts, custom peds, visual systems, panels, interfaces, previews, organization tools, and personalized resources."
      ],
      list: [
        "Scripts and systems for RedM servers;",
        "Custom peds and personalized visual resources;",
        "Panels, interfaces, and organization tools;",
        "Documentation, previews, and product presentation pages;",
        "Digital solutions focused on visual identity and user experience."
      ]
    },
    {
      title: "4. Identity",
      paragraphs: [
        "We believe every project needs a strong identity. That is why our products are created with attention to detail, maintaining a unique appearance and a visual experience aligned with the brand's proposal."
      ],
      highlight: "Our focus is to create tools that make your server, store, or project stand out."
    },
    {
      title: "5. Style",
      paragraphs: [
        "Each interface, panel, and visual resource is developed with a focus on a modern, elegant, and organized presentation. We aim to combine visual beauty with practicality, creating products that are pleasant for both administrators and users."
      ]
    },
    {
      title: "6. Technology",
      paragraphs: [
        "We work to deliver functional, practical systems designed to make life easier for those who create, sell, or manage digital projects.",
        "Our goal is to turn complex processes into simpler, more organized, and more efficient tools."
      ]
    },
    {
      title: "7. Our vision",
      paragraphs: [
        "We believe a good product should not only be functional. It also needs clarity, identity, visual polish, and a pleasant user experience.",
        "That is why every The Wanted Sole Studio project is treated like a forge: every detail is shaped, adjusted, and refined until it becomes something unique."
      ]
    },
    {
      title: "8. Our commitment",
      paragraphs: [
        "Our commitment is to deliver digital products with quality, organization, and personality. We seek to build solutions that help our clients value their projects and offer a more professional experience to their audience.",
        "The Wanted Sole Studio is always evolving, creating new tools and improving its products to follow the needs of the community."
      ]
    },
    {
      title: "9. Our essence",
      highlight: "Where style, identity, and technology are forged.",
      paragraphs: [
        "This is the essence of The Wanted Sole Studio: creating digital tools with personality, organization, and visual impact."
      ]
    },
    {
      title: "10. Contact",
      paragraphs: [
        "Want to know our products, ask questions, or request support? Contact us through our official channels."
      ],
      contacts: [
        { label: "Discord", href: "https://discord.gg/qE29trG84u" },
        { label: "Website", href: "https://store-test.thewantedsolestudio.workers.dev/" }
      ]
    }
  ] : [
    {
      title: "1. Quem somos",
      paragraphs: [
        "A The Wanted Sole Studio é uma marca focada em criação visual, customização digital e desenvolvimento de sistemas com identidade própria. Nosso objetivo é criar ferramentas, scripts e experiências que unem design, organização e tecnologia para servidores, criadores e projetos digitais.",
        "Fundada por Vitor Alves, também conhecido como Valvesitor, a marca representa uma visão clara: entregar produtos com personalidade, visual profissional e funcionalidades realmente úteis."
      ]
    },
    {
      title: "2. Nossa proposta",
      paragraphs: [
        "Nossa proposta é desenvolver produtos digitais que não sejam apenas funcionais, mas também visualmente marcantes, organizados e fáceis de utilizar.",
        "Cada projeto é pensado para ajudar servidores, lojas e criadores a apresentarem seus produtos de forma mais profissional, moderna e confiável."
      ]
    },
    {
      title: "3. O que fazemos",
      paragraphs: [
        "Desenvolvemos produtos digitais voltados principalmente para RedM, incluindo scripts, custom peds, sistemas visuais, painéis, interfaces, previews, ferramentas de organização e recursos personalizados."
      ],
      list: [
        "Scripts e sistemas para servidores RedM;",
        "Custom peds e recursos visuais personalizados;",
        "Painéis, interfaces e ferramentas de organização;",
        "Documentações, previews e páginas para apresentação de produtos;",
        "Soluções digitais com foco em identidade visual e experiência do usuário."
      ]
    },
    {
      title: "4. Identidade",
      paragraphs: [
        "Acreditamos que cada projeto precisa ter uma identidade forte. Por isso, nossos produtos são criados com atenção aos detalhes, mantendo uma aparência própria e uma experiência visual que combina com a proposta da marca."
      ],
      highlight: "Nosso foco é criar ferramentas que façam seu servidor, sua loja ou seu projeto se destacar."
    },
    {
      title: "5. Estilo",
      paragraphs: [
        "Cada interface, painel e recurso visual é desenvolvido com foco em uma apresentação moderna, elegante e organizada. Buscamos unir beleza visual com praticidade, criando produtos que sejam agradáveis tanto para quem administra quanto para quem utiliza."
      ]
    },
    {
      title: "6. Tecnologia",
      paragraphs: [
        "Trabalhamos para entregar sistemas funcionais, práticos e preparados para facilitar a rotina de quem cria, vende ou administra projetos digitais.",
        "Nosso objetivo é transformar processos complexos em ferramentas mais simples, organizadas e eficientes."
      ]
    },
    {
      title: "7. Nossa visão",
      paragraphs: [
        "Acreditamos que um bom produto não deve ser apenas funcional. Ele também precisa ter clareza, identidade, acabamento visual e uma experiência agradável para o usuário.",
        "Por isso, cada projeto da The Wanted Sole Studio é tratado como uma forja: cada detalhe é moldado, ajustado e refinado até se tornar algo único."
      ]
    },
    {
      title: "8. Nosso compromisso",
      paragraphs: [
        "Nosso compromisso é entregar produtos digitais com qualidade, organização e personalidade. Buscamos construir soluções que ajudem nossos clientes a valorizar seus projetos e oferecer uma experiência mais profissional ao público.",
        "A The Wanted Sole Studio está sempre evoluindo, criando novas ferramentas e melhorando seus produtos para acompanhar as necessidades da comunidade."
      ]
    },
    {
      title: "9. Nossa essência",
      highlight: "Onde estilo, identidade e tecnologia são forjados.",
      paragraphs: [
        "Essa é a essência da The Wanted Sole Studio: criar ferramentas digitais com personalidade, organização e impacto visual."
      ]
    },
    {
      title: "10. Contato",
      paragraphs: [
        "Quer conhecer nossos produtos, tirar dúvidas ou solicitar suporte? Entre em contato pelos nossos canais oficiais."
      ],
      contacts: [
        { label: "Discord", href: "https://discord.gg/qE29trG84u" },
        { label: "Site", href: "https://store-test.thewantedsolestudio.workers.dev/" }
      ]
    }
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07080c] px-6 py-16 lg:py-20 text-[#f4f4f5]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[-14%] top-[-12%] h-80 w-80 rounded-full bg-[#d6a84f]/15 blur-3xl" />
        <div className="absolute right-[-10%] bottom-[-10%] h-96 w-96 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        <header className="mb-10 text-center">
          <div className="mb-5 inline-flex items-center rounded-full border border-[#d6a84f]/35 bg-[#d6a84f]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#d6a84f]">
            The Wanted Sole Studio
          </div>
          <h1 className="text-4xl font-bold tracking-tight lg:text-6xl" style={{ fontFamily: "'Raleway', sans-serif" }}>
            {isEnglish ? "About Us" : "Sobre Nós"}
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-zinc-400 lg:text-base">
            {isEnglish
              ? "Discover the essence of The Wanted Sole Studio: a brand created to transform ideas into digital experiences with identity, style, and technology."
              : "Conheça a essência da The Wanted Sole Studio: uma marca criada para transformar ideias em experiências digitais com identidade, estilo e tecnologia."}
          </p>
          <div className="mt-6 inline-flex rounded-full border border-[#d6a84f]/25 bg-[#d6a84f]/10 px-4 py-2 text-xs font-semibold text-[#d6a84f]">
            {isEnglish ? "Language: English" : "Idioma: Português"}
          </div>
        </header>

        <section className="rounded-[30px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:p-8">
          <div className="space-y-5">
            {sections.map((section) => (
              <article key={section.title} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 lg:p-6">
                <h2 className="mb-3 text-lg font-bold text-[#d6a84f] lg:text-xl" style={{ fontFamily: "'Raleway', sans-serif" }}>
                  {section.title}
                </h2>

                <div className="space-y-3">
                  {section.paragraphs?.map((paragraph: string) => (
                    <p key={paragraph} className="text-sm leading-7 text-zinc-300">
                      {paragraph}
                    </p>
                  ))}

                  {section.list && (
                    <ul className="grid gap-2 pt-1">
                      {section.list.map((item: string) => (
                        <li key={item} className="flex gap-3 text-sm leading-6 text-zinc-300">
                          <span className="mt-0.5 text-[#d6a84f]">✦</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.highlight && (
                    <div className="rounded-2xl border border-[#d6a84f]/25 bg-[#d6a84f]/10 px-4 py-3 text-sm leading-6 text-[#f5e7c6]">
                      {section.highlight}
                    </div>
                  )}

                  {section.contacts && (
                    <div className="grid gap-2 pt-2">
                      {section.contacts.map((contact: { label: string; href: string }) => (
                        <p key={contact.href} className="text-sm text-zinc-300">
                          <strong>{contact.label}:</strong>{" "}
                          <a href={contact.href} target="_blank" rel="noopener noreferrer" className="font-bold text-[#d6a84f] hover:underline">
                            {contact.href}
                          </a>
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <p className="mt-8 text-center text-xs text-zinc-500">
          © 2026 The Wanted Sole Studio. {isEnglish ? "All rights reserved." : "Todos os direitos reservados."}
        </p>
      </div>
    </main>
  );
}



const DOCS_FALLBACK_PAGES: DocsPageRecord[] = [{"id": "overview", "productId": "tws-identity-forge", "category": "Come Ando", "title": "TWS Identity Forge", "titleEn": "TWS Identity Forge", "slug": "overview", "orderIndex": 10, "contentPt": "# TWS Identity Forge\n\nO **TWS Identity Forge** é um sistema premium para RedM focado em criação, edição e organização de identidade visual, personagens, outfits e recursos MetaPed.\n\nEle foi feito para clientes que precisam montar, testar, salvar e reaplicar visuais com uma interface moderna, organizada e prática.\n\n## O que você consegue fazer\n\n- Abrir um Studio de edição dentro do jogo.\n- Visualizar e testar componentes MetaPed.\n- Trabalhar com roupas, acessórios, albedos, normals, materials e paletas.\n- Organizar projetos.\n- Salvar outfits em slots.\n- Usar favoritos.\n- Ajustar câmera, luz, preview e visualização.\n- Exportar ou importar dados quando disponível.\n- Usar idiomas configurados no resource.\n\n## Público recomendado\n\nEste guia é para o **cliente final**: dono de servidor, administrador, equipe de roupas/peds ou pessoa responsável por configurar e utilizar o produto no servidor.\n\nAqui não ficam instruções internas de venda, geração de licença, Cloudflare ou gerenciamento comercial.", "contentEn": "# TWS Identity Forge\n\n**TWS Identity Forge** is a premium RedM system focused on creating, editing, and organizing visual identity, characters, outfits, and MetaPed resources.\n\nIt was built for customers who need to build, test, save, and reapply looks through a modern, organized, and practical interface.\n\n## What you can do\n\n- Open an in-game editing Studio.\n- Preview and test MetaPed components.\n- Work with clothes, accessories, albedos, normals, materials, and palettes.\n- Organize projects.\n- Save outfits into slots.\n- Use favorites.\n- Adjust camera, lighting, preview, and visualization.\n- Export or import data when available.\n- Use configured resource languages.\n\n## Recommended audience\n\nThis guide is for the **end customer**: server owner, administrator, clothing/ped staff, or the person responsible for configuring and using the product on the server.\n\nIt does not include internal sales, license generation, Cloudflare, or commercial management instructions.", "visible": true}, {"id": "requirements", "productId": "tws-identity-forge", "category": "Come Ando", "title": "Requisitos", "titleEn": "Requirements", "slug": "requirements", "orderIndex": 20, "contentPt": "# Requisitos\n\nAntes de instalar, confira se o servidor atende aos requisitos básicos.\n\n## Servidor\n\n- Servidor **RedM** atualizado.\n- Permissão para adicionar resources.\n- Acesso ao `server.cfg`.\n- Acesso à pasta `resources`.\n- Framework/ambiente compatível com MetaPed.\n\n## Resource MetaPed\n\nO TWS Identity Forge precisa saber qual resource aplica outfits/MetaPed no seu servidor.\n\nNo arquivo `shared/config.lua`, configure:\n\n```lua\nConfig.MetapedResource = 'MetaPedAssets'\n```\n\nSe você usa outro resource, troque pelo nome correto.\n\n## Licença\n\nSe sua versão usa validação de licença, você precisa das informações fornecidas pela The Wanted Sole Studio:\n\n```cfg\nsetr tws_license_enabled \"1\"\nset tws_license_validate_url \"URL_FORNECIDA\"\nset tws_license_key \"SUA_CHAVE\"\nset tws_license_owner_steam \"steam:1100001xxxxxxxx\"\nset tws_license_hwid \"ID-UNICO-DO-SERVIDOR\"\n```\n\nSem a licença correta, o Studio pode não abrir.", "contentEn": "# Requirements\n\nBefore installing, make sure your server meets the basic requirements.\n\n## Server\n\n- Updated **RedM** server.\n- Permission to add resources.\n- Access to `server.cfg`.\n- Access to the `resources` folder.\n- MetaPed-compatible framework/environment.\n\n## MetaPed resource\n\nTWS Identity Forge must know which resource applies outfits/MetaPed on your server.\n\nIn `shared/config.lua`, configure:\n\n```lua\nConfig.MetapedResource = 'MetaPedAssets'\n```\n\nIf you use another resource, replace it with the correct name.\n\n## License\n\nIf your version uses license validation, you need the information provided by The Wanted Sole Studio:\n\n```cfg\nsetr tws_license_enabled \"1\"\nset tws_license_validate_url \"PROVIDED_URL\"\nset tws_license_key \"YOUR_KEY\"\nset tws_license_owner_steam \"steam:1100001xxxxxxxx\"\nset tws_license_hwid \"UNIQUE_SERVER_ID\"\n```\n\nWithout a valid license, the Studio may not open.", "visible": true}, {"id": "installation", "productId": "tws-identity-forge", "category": "Instala O", "title": "Instalação", "titleEn": "Installation", "slug": "installation", "orderIndex": 30, "contentPt": "# Instalação\n\n## 1. Adicione o resource\n\nColoque a pasta do resource dentro da pasta de resources do seu servidor.\n\nExemplo:\n\n```txt\nresources/[local]/TWS_Identity_Forge\n```\n\n## 2. Garanta o nome correto\n\nO nome da pasta precisa ser o mesmo usado no `server.cfg`.\n\nSe a pasta se chama:\n\n```txt\nTWS_Identity_Forge\n```\n\nentão no `server.cfg` use:\n\n```cfg\nensure TWS_Identity_Forge\n```\n\n## 3. Configure a licença\n\nSe a versão recebida exige licença, adicione as linhas fornecidas pela The Wanted Sole Studio no `server.cfg`.\n\n## 4. Configure o MetaPed Resource\n\nAbra:\n\n```txt\nshared/config.lua\n```\n\ne ajuste:\n\n```lua\nConfig.MetapedResource = 'MetaPedAssets'\n```\n\n## 5. Reinicie o servidor\n\nDepois de instalar e configurar, reinicie o servidor ou dê ensure no resource.\n\n```cfg\nensure TWS_Identity_Forge\n```", "contentEn": "# Installation\n\n## 1. Add the resource\n\nPlace the resource folder inside your server resources folder.\n\nExample:\n\n```txt\nresources/[local]/TWS_Identity_Forge\n```\n\n## 2. Use the correct name\n\nThe folder name must match the name used in `server.cfg`.\n\nIf the folder is called:\n\n```txt\nTWS_Identity_Forge\n```\n\nthen use this in `server.cfg`:\n\n```cfg\nensure TWS_Identity_Forge\n```\n\n## 3. Configure the license\n\nIf your version requires a license, add the lines provided by The Wanted Sole Studio to `server.cfg`.\n\n## 4. Configure the MetaPed resource\n\nOpen:\n\n```txt\nshared/config.lua\n```\n\nand adjust:\n\n```lua\nConfig.MetapedResource = 'MetaPedAssets'\n```\n\n## 5. Restart the server\n\nAfter installing and configuring, restart the server or ensure the resource.\n\n```cfg\nensure TWS_Identity_Forge\n```", "visible": true}, {"id": "configuration", "productId": "tws-identity-forge", "category": "Configura O", "title": "Configuração básica", "titleEn": "Basic configuration", "slug": "configuration", "orderIndex": 40, "contentPt": "# Configuração básica\n\nAs configurações principais ficam em:\n\n```txt\nshared/config.lua\n```\n\n## Idioma\n\nIdiomas disponíveis:\n\n```lua\nConfig.Locale = 'pt-br'\n```\n\nOpções comuns:\n\n```txt\npt-br\nen-us\nes-es\n```\n\n## Tecla para abrir\n\nA tecla padrão do Studio é **J**.\n\n```lua\nConfig.OpenKey = 0xF3830D8E\n```\n\n## Limite de XML\n\nDefine o tamanho máximo aceito para XML.\n\n```lua\nConfig.MaxXml = 80000\n```\n\n## Slots de outfit\n\nDefine quantos slots de outfit cada projeto pode usar.\n\n```lua\nConfig.OutfitSlots = 10\n```\n\n## Resource MetaPed\n\nDefine qual resource será usado para aplicar outfits no servidor.\n\n```lua\nConfig.MetapedResource = 'MetaPedAssets'\n```\n\n## Debug\n\nUse somente para testes.\n\n```lua\nConfig.Debug = false\n```", "contentEn": "# Basic configuration\n\nThe main settings are located in:\n\n```txt\nshared/config.lua\n```\n\n## Language\n\nAvailable languages:\n\n```lua\nConfig.Locale = 'pt-br'\n```\n\nCommon options:\n\n```txt\npt-br\nen-us\nes-es\n```\n\n## Open key\n\nThe default Studio key is **J**.\n\n```lua\nConfig.OpenKey = 0xF3830D8E\n```\n\n## XML limit\n\nDefines the maximum accepted XML size.\n\n```lua\nConfig.MaxXml = 80000\n```\n\n## Outfit slots\n\nDefines how many outfit slots each project can use.\n\n```lua\nConfig.OutfitSlots = 10\n```\n\n## MetaPed resource\n\nDefines which resource will be used to apply outfits on the server.\n\n```lua\nConfig.MetapedResource = 'MetaPedAssets'\n```\n\n## Debug\n\nUse only for testing.\n\n```lua\nConfig.Debug = false\n```", "visible": true}, {"id": "license", "productId": "tws-identity-forge", "category": "Configura O", "title": "Licença no servidor", "titleEn": "Server license", "slug": "license", "orderIndex": 50, "contentPt": "# Licença no servidor\n\nAlgumas versões do TWS Identity Forge usam validação remota de licença.\n\nA The Wanted Sole Studio fornece os dados que devem ser adicionados ao `server.cfg`.\n\n## Exemplo\n\n```cfg\nsetr tws_license_enabled \"1\"\nset tws_license_validate_url \"https://SEU-ENDPOINT.workers.dev/\"\nset tws_license_key \"CHAVE-QUE-VOCE-RECEBEU\"\nset tws_license_owner_steam \"steam:1100001xxxxxxxx\"\nset tws_license_hwid \"ID-UNICO-DO-SERVIDOR\"\n```\n\n## Explicação\n\n- `tws_license_enabled`: ativa a validação.\n- `tws_license_validate_url`: URL de validação fornecida.\n- `tws_license_key`: chave recebida após a compra.\n- `tws_license_owner_steam`: Steam do dono do servidor.\n- `tws_license_hwid`: identificador único do servidor.\n\n## Importante\n\nSe os dados estiverem errados ou ausentes, o resource pode ser bloqueado e o Studio não abrirá.\n\nNão compartilhe sua chave de licença com terceiros.", "contentEn": "# Server license\n\nSome versions of TWS Identity Forge use remote license validation.\n\nThe Wanted Sole Studio provides the data that must be added to `server.cfg`.\n\n## Example\n\n```cfg\nsetr tws_license_enabled \"1\"\nset tws_license_validate_url \"https://YOUR-ENDPOINT.workers.dev/\"\nset tws_license_key \"YOUR_LICENSE_KEY\"\nset tws_license_owner_steam \"steam:1100001xxxxxxxx\"\nset tws_license_hwid \"UNIQUE_SERVER_ID\"\n```\n\n## Explanation\n\n- `tws_license_enabled`: enables validation.\n- `tws_license_validate_url`: provided validation URL.\n- `tws_license_key`: key received after purchase.\n- `tws_license_owner_steam`: server owner's Steam identifier.\n- `tws_license_hwid`: unique server identifier.\n\n## Important\n\nIf the data is wrong or missing, the resource may be blocked and the Studio may not open.\n\nDo not share your license key with third parties.", "visible": true}, {"id": "opening-studio", "productId": "tws-identity-forge", "category": "Uso do Studio", "title": "Abrindo o Studio", "titleEn": "Opening the Studio", "slug": "opening-studio", "orderIndex": 60, "contentPt": "# Abrindo o Studio\n\nA tecla padrão para abrir o TWS Identity Forge é:\n\n```txt\nJ\n```\n\nEla é definida em:\n\n```lua\nConfig.OpenKey = 0xF3830D8E\n```\n\n## Se não abrir\n\nVerifique:\n\n- O resource está iniciado no `server.cfg`.\n- A licença está correta.\n- O resource MetaPed está configurado.\n- O jogador tem permissão caso o servidor use permissões.\n- Não existem erros no console do servidor ou F8.\n- O idioma configurado existe na pasta `locale`.\n\n## Boas práticas\n\n- Teste em um ambiente seguro antes de usar em produção.\n- Evite usar com outros menus de roupa abertos ao mesmo tempo.\n- Faça backup de arquivos antes de alterar configurações.", "contentEn": "# Opening the Studio\n\nThe default key to open TWS Identity Forge is:\n\n```txt\nJ\n```\n\nIt is defined in:\n\n```lua\nConfig.OpenKey = 0xF3830D8E\n```\n\n## If it does not open\n\nCheck:\n\n- The resource is started in `server.cfg`.\n- The license is correct.\n- The MetaPed resource is configured.\n- The player has permission if your server uses permissions.\n- There are no errors in the server console or F8.\n- The configured language exists in the `locale` folder.\n\n## Best practices\n\n- Test in a safe environment before using in production.\n- Avoid using it while other clothing menus are open.\n- Backup files before changing configurations.", "visible": true}, {"id": "interface", "productId": "tws-identity-forge", "category": "Uso do Studio", "title": "Interface e painéis", "titleEn": "Interface and panels", "slug": "interface", "orderIndex": 70, "contentPt": "# Interface e painéis\n\nO Studio é dividido em áreas para facilitar a criação e organização de personagens.\n\n## Painel principal\n\nÁrea onde você acessa categorias, itens, busca e ações principais.\n\n## Preview\n\nÁrea visual onde o ped/personagem é exibido em tempo real.\n\n## Projetos\n\nUse projetos para separar criações diferentes, testes ou outfits por tema.\n\n## Favoritos\n\nMarque itens importantes para acessar rapidamente depois.\n\n## Itens aplicados\n\nMostra componentes aplicados no personagem atual.\n\n## Ferramentas extras\n\nDependendo da versão, podem existir opções para iluminação, câmera, XML, filtros, presets e exportações.", "contentEn": "# Interface and panels\n\nThe Studio is divided into areas to make character creation and organization easier.\n\n## Main panel\n\nArea where you access categories, items, search, and main actions.\n\n## Preview\n\nVisual area where the ped/character is displayed in real time.\n\n## Projects\n\nUse projects to separate different creations, tests, or themed outfits.\n\n## Favorites\n\nMark important items so you can access them quickly later.\n\n## Applied items\n\nShows components currently applied to the character.\n\n## Extra tools\n\nDepending on the version, there may be options for lighting, camera, XML, filters, presets, and exports.", "visible": true}, {"id": "projects-outfits", "productId": "tws-identity-forge", "category": "Uso do Studio", "title": "Projetos e outfits", "titleEn": "Projects and outfits", "slug": "projects-outfits", "orderIndex": 80, "contentPt": "# Projetos e outfits\n\nProjetos ajudam a organizar criações e manter diferentes versões de personagens.\n\n## Para que servem\n\n- Separar personagens diferentes.\n- Criar variações de roupas.\n- Testar combinações sem perder referência.\n- Organizar pacotes ou coleções.\n\n## Slots de outfit\n\nO número de slots é definido em:\n\n```lua\nConfig.OutfitSlots = 10\n```\n\nVocê pode ajustar conforme a necessidade do servidor.\n\n## Dica\n\nUse nomes claros nos projetos para facilitar a organização, por exemplo:\n\n```txt\nSheriff - Outfit formal\nCivilian - Winter outfit\nGang member - Variant 01\n```", "contentEn": "# Projects and outfits\n\nProjects help organize creations and keep different character versions.\n\n## What they are for\n\n- Separate different characters.\n- Create clothing variations.\n- Test combinations without losing reference.\n- Organize packs or collections.\n\n## Outfit slots\n\nThe number of slots is defined in:\n\n```lua\nConfig.OutfitSlots = 10\n```\n\nYou can adjust it according to your server needs.\n\n## Tip\n\nUse clear project names to keep things organized, for example:\n\n```txt\nSheriff - Formal outfit\nCivilian - Winter outfit\nGang member - Variant 01\n```", "visible": true}, {"id": "components", "productId": "tws-identity-forge", "category": "Uso do Studio", "title": "Componentes, paletas e tint", "titleEn": "Components, palettes, and tint", "slug": "components", "orderIndex": 90, "contentPt": "# Componentes, paletas e tint\n\nO TWS Identity Forge trabalha com recursos MetaPed e componentes visuais.\n\n## Componentes\n\nComponentes representam partes do visual, como cabeça, cabelo, corpo, acessórios, roupas e itens relacionados.\n\n## Paletas\n\nPaletas são usadas para trabalhar variações de cor/tint.\n\nExemplos de paletas conhecidas:\n\n```txt\nmetaped_tint_skin\nmetaped_tint_hair\nmetaped_tint_cloth\nmetaped_tint_leather\nmetaped_tint_hat\nmetaped_tint_makeup\n```\n\n## Albedo, Normal e Material\n\nDependendo do componente, você pode trabalhar com variações como:\n\n- Albedo\n- Normal\n- Material\n- Palette\n- Tint\n\n## Dica\n\nTeste alterações em preview antes de salvar ou aplicar em produção.", "contentEn": "# Components, palettes, and tint\n\nTWS Identity Forge works with MetaPed resources and visual components.\n\n## Components\n\nComponents represent visual parts such as head, hair, body, accessories, clothes, and related items.\n\n## Palettes\n\nPalettes are used to work with color/tint variations.\n\nExamples of known palettes:\n\n```txt\nmetaped_tint_skin\nmetaped_tint_hair\nmetaped_tint_cloth\nmetaped_tint_leather\nmetaped_tint_hat\nmetaped_tint_makeup\n```\n\n## Albedo, Normal, and Material\n\nDepending on the component, you can work with variations such as:\n\n- Albedo\n- Normal\n- Material\n- Palette\n- Tint\n\n## Tip\n\nTest changes in preview before saving or applying them in production.", "visible": true}, {"id": "camera-lighting", "productId": "tws-identity-forge", "category": "Ferramentas", "title": "Câmera e iluminação", "titleEn": "Camera and lighting", "slug": "camera-lighting", "orderIndex": 100, "contentPt": "# Câmera e iluminação\n\nA câmera e a iluminação ajudam a analisar detalhes do personagem com mais precisão.\n\n## Câmera\n\nUse os controles disponíveis para aproximar, girar, mover e observar o ped de diferentes ângulos.\n\n## Iluminação\n\nAs opções de iluminação ajudam a visualizar cores, texturas e detalhes que podem mudar conforme o ambiente.\n\n## Boas práticas\n\n- Veja o outfit em diferentes ângulos.\n- Teste cores com iluminação neutra.\n- Verifique chapéus, cabelo, acessórios e partes pequenas com zoom.\n- Faça prints ou vídeos para revisão se necessário.", "contentEn": "# Camera and lighting\n\nCamera and lighting tools help analyze character details more accurately.\n\n## Camera\n\nUse the available controls to zoom, rotate, move, and inspect the ped from different angles.\n\n## Lighting\n\nLighting options help preview colors, textures, and details that may change depending on the environment.\n\n## Best practices\n\n- View the outfit from different angles.\n- Test colors under neutral lighting.\n- Check hats, hair, accessories, and small parts with zoom.\n- Take screenshots or videos for review when needed.", "visible": true}, {"id": "xml-import-export", "productId": "tws-identity-forge", "category": "Ferramentas", "title": "XML, importação e exportação", "titleEn": "XML, import and export", "slug": "xml-import-export", "orderIndex": 110, "contentPt": "# XML, importação e exportação\n\nAlgumas versões do TWS Identity Forge permitem trabalhar com XML e dados de outfit.\n\n## Limite de XML\n\nO tamanho máximo é definido em:\n\n```lua\nConfig.MaxXml = 80000\n```\n\n## Uso recomendado\n\n- Use XML para guardar ou testar estruturas.\n- Revise o conteúdo antes de aplicar.\n- Não importe arquivos desconhecidos sem verificar.\n- Faça backup dos dados importantes.\n\n## Erros comuns\n\nSe o XML não carregar:\n\n- Verifique se o arquivo não ultrapassa o limite.\n- Confirme se o conteúdo está completo.\n- Confira erros no console/F8.\n- Teste com um XML menor para validar.", "contentEn": "# XML, import and export\n\nSome versions of TWS Identity Forge allow working with XML and outfit data.\n\n## XML limit\n\nThe maximum size is defined in:\n\n```lua\nConfig.MaxXml = 80000\n```\n\n## Recommended use\n\n- Use XML to store or test structures.\n- Review the content before applying it.\n- Do not import unknown files without checking them.\n- Backup important data.\n\n## Common errors\n\nIf XML does not load:\n\n- Check that the file does not exceed the limit.\n- Confirm the content is complete.\n- Check console/F8 errors.\n- Test with a smaller XML to validate.", "visible": true}, {"id": "troubleshooting", "productId": "tws-identity-forge", "category": "Suporte", "title": "Problemas comuns", "titleEn": "Troubleshooting", "slug": "troubleshooting", "orderIndex": 120, "contentPt": "# Problemas comuns\n\n## O Studio não abre\n\nVerifique:\n\n- Resource iniciado com `ensure`.\n- Tecla correta.\n- Licença correta.\n- `Config.MetapedResource` configurado.\n- Console do servidor sem erros.\n- F8 sem erros importantes.\n\n## Roupa não aplica\n\nVerifique:\n\n- Resource MetaPed correto.\n- Dependências ativas.\n- Componentes compatíveis com o ped usado.\n- Se outro script não está sobrescrevendo o visual.\n\n## Idioma não muda\n\nConfira:\n\n```lua\nConfig.Locale = 'pt-br'\n```\n\ne se o arquivo correspondente existe em:\n\n```txt\nlocale/\n```\n\n## Erros visuais\n\nTente:\n\n- Limpar cache quando necessário.\n- Reiniciar resource.\n- Testar outro ped.\n- Verificar se o item é compatível com o modelo usado.", "contentEn": "# Troubleshooting\n\n## The Studio does not open\n\nCheck:\n\n- Resource started with `ensure`.\n- Correct key.\n- Correct license.\n- `Config.MetapedResource` configured.\n- Server console without errors.\n- F8 without major errors.\n\n## Clothing does not apply\n\nCheck:\n\n- Correct MetaPed resource.\n- Active dependencies.\n- Components compatible with the selected ped.\n- Whether another script is overriding the appearance.\n\n## Language does not change\n\nCheck:\n\n```lua\nConfig.Locale = 'pt-br'\n```\n\nand whether the corresponding file exists in:\n\n```txt\nlocale/\n```\n\n## Visual issues\n\nTry:\n\n- Clearing cache when needed.\n- Restarting the resource.\n- Testing another ped.\n- Checking whether the item is compatible with the model used.", "visible": true}, {"id": "faq", "productId": "tws-identity-forge", "category": "Suporte", "title": "FAQ", "titleEn": "FAQ", "slug": "faq", "orderIndex": 130, "contentPt": "# FAQ\n\n## Posso revender o produto?\n\nNão. A licença é de uso pessoal/servidor conforme os termos da The Wanted Sole Studio.\n\n## Posso editar o config?\n\nSim. O arquivo `shared/config.lua` existe para configuração do cliente.\n\n## Posso compartilhar minha licença?\n\nNão. A licença é vinculada ao comprador/servidor conforme as regras de uso.\n\n## A primeira instalação precisa de suporte?\n\nNem sempre. Siga esta documentação. Se houver erro, envie prints, vídeos e logs no suporte oficial.\n\n## Posso usar com qualquer ped?\n\nDepende da compatibilidade do ped e dos componentes MetaPed usados.\n\n## Onde peço suporte?\n\nUse os canais oficiais da The Wanted Sole Studio, principalmente Discord.", "contentEn": "# FAQ\n\n## Can I resell the product?\n\nNo. The license is for personal/server use according to The Wanted Sole Studio terms.\n\n## Can I edit the config?\n\nYes. The `shared/config.lua` file exists for customer configuration.\n\n## Can I share my license?\n\nNo. The license is linked to the buyer/server according to usage rules.\n\n## Do I need support for the first installation?\n\nNot always. Follow this documentation. If there is an error, send screenshots, videos, and logs through official support.\n\n## Can I use it with any ped?\n\nIt depends on the ped compatibility and the MetaPed components used.\n\n## Where do I request support?\n\nUse The Wanted Sole Studio official channels, mainly Discord.", "visible": true}, {"id": "changelog", "productId": "tws-identity-forge", "category": "Refer Ncia", "title": "Versão e changelog", "titleEn": "Version and changelog", "slug": "changelog", "orderIndex": 140, "contentPt": "# Versão e changelog\n\nA versão atual do resource é definida no `fxmanifest.lua`.\n\n```lua\nversion '2.0.7'\n```\n\n## Recomendação\n\nSempre verifique a versão antes de abrir ticket de suporte.\n\nAo pedir suporte, informe:\n\n- Versão do produto.\n- Nome do resource.\n- Prints ou vídeo do problema.\n- Logs do console do servidor.\n- Logs do F8, se existir.\n- Alterações feitas no `shared/config.lua`.\n\n## Atualizações\n\nAtualizações podem incluir correções, melhorias visuais, novas funções ou ajustes de compatibilidade.", "contentEn": "# Version and changelog\n\nThe current resource version is defined in `fxmanifest.lua`.\n\n```lua\nversion '2.0.7'\n```\n\n## Recommendation\n\nAlways check the version before opening a support ticket.\n\nWhen requesting support, include:\n\n- Product version.\n- Resource name.\n- Screenshots or video of the issue.\n- Server console logs.\n- F8 logs, if available.\n- Changes made to `shared/config.lua`.\n\n## Updates\n\nUpdates may include fixes, visual improvements, new features, or compatibility adjustments.", "visible": true}];

function normalizeDocsPage(item: any): DocsPageRecord {
  return {
    id: item.id ?? item.slug ?? crypto.randomUUID(),
    productId: item.productId ?? item.product_id ?? "tws-identity-forge",
    category: item.category ?? "Geral",
    title: item.title ?? "Sem título",
    titleEn: item.titleEn ?? item.title_en ?? item.title ?? "",
    slug: item.slug ?? item.id ?? "",
    orderIndex: Number(item.orderIndex ?? item.order_index ?? 999),
    contentPt: item.contentPt ?? item.content_pt ?? "",
    contentEn: item.contentEn ?? item.content_en ?? "",
    visible: item.visible !== false && item.visible !== 0,
    updatedAt: item.updatedAt ?? item.updated_at
  };
}

async function fetchDocsPages(includeHidden = false, token = "") {
  const endpoint = includeHidden ? "/api/admin/docs" : "/api/docs";
  const response = await fetch(apiUrl(endpoint), {
    headers: token ? { "Authorization": `Bearer ${token}` } : undefined
  });

  if (!response.ok) {
    if (!includeHidden) return DOCS_FALLBACK_PAGES;
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error ?? "Não foi possível carregar a documentação.");
  }

  const payload = await response.json();
  const rows = Array.isArray(payload) ? payload : payload.pages ?? [];
  const normalized = rows.map(normalizeDocsPage).sort((a: DocsPageRecord, b: DocsPageRecord) => a.orderIndex - b.orderIndex);
  return normalized.length ? normalized : DOCS_FALLBACK_PAGES;
}

async function saveAdminDocsPage(token: string, page: DocsPageRecord) {
  const response = await fetch(apiUrl("/api/admin/docs"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(page)
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error ?? "Não foi possível salvar a página.");
  }

  const payload = await response.json();
  return normalizeDocsPage(payload.page ?? page);
}

async function deleteAdminDocsPage(token: string, id: string) {
  const response = await fetch(apiUrl(`/api/admin/docs/${encodeURIComponent(id)}`), {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error ?? "Não foi possível apagar a página.");
  }
}

function emptyDocsPage(productId = "tws-identity-forge"): DocsPageRecord {
  return {
    id: `new-${Date.now()}`,
    productId,
    category: "Nova Categoria",
    title: "Nova página",
    titleEn: "New page",
    slug: `nova-pagina-${Date.now()}`,
    orderIndex: 999,
    contentPt: "# Nova página\n\nEscreva o conteúdo aqui.",
    contentEn: "# New page\n\nWrite the content here.",
    visible: true
  };
}

function escapeDocsHtml(value: string) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function inlineDocsMarkdown(value: string) {
  return escapeDocsHtml(value)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function docsMarkdownToHtml(markdown: string) {
  const lines = String(markdown ?? "").split("\n");
  let html = "";
  let codeLines: string[] = [];
  let inCode = false;
  let inList = false;

  const closeList = () => {
    if (inList) {
      html += "</ul>";
      inList = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.trim().startsWith("```")) {
      if (inCode) {
        html += `<pre><code>${escapeDocsHtml(codeLines.join("\n"))}</code></pre>`;
        codeLines = [];
        inCode = false;
      } else {
        closeList();
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      codeLines.push(rawLine);
      continue;
    }

    if (!line.trim()) {
      closeList();
      continue;
    }

    if (line.startsWith("# ")) {
      closeList();
      html += `<h1>${escapeDocsHtml(line.slice(2))}</h1>`;
      continue;
    }

    if (line.startsWith("## ")) {
      closeList();
      html += `<h2>${escapeDocsHtml(line.slice(3))}</h2>`;
      continue;
    }

    if (line.startsWith("### ")) {
      closeList();
      html += `<h3>${escapeDocsHtml(line.slice(4))}</h3>`;
      continue;
    }

    if (line.startsWith("- ")) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      html += `<li>${inlineDocsMarkdown(line.slice(2))}</li>`;
      continue;
    }

    closeList();
    html += `<p>${inlineDocsMarkdown(line)}</p>`;
  }

  closeList();

  if (inCode) {
    html += `<pre><code>${escapeDocsHtml(codeLines.join("\n"))}</code></pre>`;
  }

  return html;
}


function normalizeDocsCategoryName(category: string) {
  const value = String(category ?? "").trim().toLowerCase();

  if (["comeando", "come ando", "comecando", "começando", "getting started"].includes(value)) return "Começando";
  if (["instalao", "instala o", "instalacao", "instalação", "installation"].includes(value)) return "Instalação";
  if (["configurao", "configura o", "configuracao", "configuração", "configuration"].includes(value)) return "Configuração";
  if (["uso do studio", "studio usage"].includes(value)) return "Uso do Studio";
  if (["ferramentas", "tools"].includes(value)) return "Ferramentas";
  if (["suporte", "support"].includes(value)) return "Suporte";
  if (["referncia", "referencia", "referência", "reference"].includes(value)) return "Referência";

  return category || "Geral";
}

function translateDocsCategory(category: string, isEnglish: boolean) {
  const normalized = normalizeDocsCategoryName(category);

  if (!isEnglish) return normalized;

  const map: Record<string, string> = {
    "Começando": "Getting started",
    "Instalação": "Installation",
    "Configuração": "Configuration",
    "Uso do Studio": "Studio usage",
    "Ferramentas": "Tools",
    "Suporte": "Support",
    "Referência": "Reference",
    "Geral": "General"
  };

  return map[normalized] ?? normalized;
}

function getDocsTitle(page: DocsPageRecord, isEnglish: boolean) {
  return isEnglish ? (page.titleEn || page.title) : page.title;
}

function getDocsContent(page: DocsPageRecord, isEnglish: boolean) {
  return isEnglish ? (page.contentEn || page.contentPt) : page.contentPt;
}


function DocsContent({ content }: { content: string }) {
  return (
    <div
      className="docs-markdown"
      dangerouslySetInnerHTML={{ __html: docsMarkdownToHtml(content) }}
    />
  );
}


function getDocsProductId(page: DocsPageRecord) {
  return page.productId || "tws-identity-forge";
}

function getDocsProductLabel(productId: string) {
  const product = PRODUCTS.find((item) => item.id === productId || slugifyClient(item.name) === productId);
  return product?.name ?? productId
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getDocsProductOptions(pages: DocsPageRecord[]) {
  const ids = new Set<string>();

  PRODUCTS.forEach((product) => ids.add(product.id));
  pages.forEach((page) => ids.add(getDocsProductId(page)));

  return Array.from(ids).map((id) => ({
    id,
    label: getDocsProductLabel(id),
    count: pages.filter((page) => getDocsProductId(page) === id).length
  }));
}

function DocsPage({ language }: { language: SiteLanguage }) {
  const [pages, setPages] = useState<DocsPageRecord[]>(DOCS_FALLBACK_PAGES);
  const [selectedProductId, setSelectedProductId] = useState(() => {
    const param = new URLSearchParams(window.location.search).get("product");
    return param || getDocsProductId(DOCS_FALLBACK_PAGES[0] ?? emptyDocsPage());
  });
  const [selectedId, setSelectedId] = useState(DOCS_FALLBACK_PAGES[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const isEnglish = language === "en_US";

  useEffect(() => {
    let mounted = true;
    fetchDocsPages(false)
      .then((rows) => {
        if (!mounted) return;
        setPages(rows);
        const param = new URLSearchParams(window.location.search).get("product");
        const initialProduct = param || getDocsProductId(rows[0] ?? emptyDocsPage());
        setSelectedProductId((current) => current || initialProduct);
        setSelectedId((current) => current || rows.find((page) => getDocsProductId(page) === initialProduct)?.id || rows[0]?.id || "");
      })
      .catch((error) => console.error(error))
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, []);

  const productOptions = getDocsProductOptions(pages);
  const selectedProductPages = pages.filter((page) => getDocsProductId(page) === selectedProductId);

  useEffect(() => {
    if (selectedProductPages.length > 0 && !selectedProductPages.some((page) => page.id === selectedId)) {
      setSelectedId(selectedProductPages[0].id);
    }
  }, [selectedProductId, pages.length]);

  const filteredPages = selectedProductPages.filter((page) => {
    const title = getDocsTitle(page, isEnglish);
    const content = getDocsContent(page, isEnglish);
    const category = translateDocsCategory(page.category, isEnglish);
    const haystack = `${title} ${category} ${content}`.toLowerCase();
    return !query.trim() || haystack.includes(query.trim().toLowerCase());
  });

  const selected = filteredPages.find((page) => page.id === selectedId) ?? filteredPages[0] ?? selectedProductPages[0];
  const grouped = filteredPages.reduce<Record<string, DocsPageRecord[]>>((acc, page) => {
    const category = translateDocsCategory(page.category, isEnglish);
    if (!acc[category]) acc[category] = [];
    acc[category].push(page);
    return acc;
  }, {});

  const selectedContent = selected ? getDocsContent(selected, isEnglish) : "";
  const selectedTitle = selected ? getDocsTitle(selected, isEnglish) : "";
  const selectedProductName = getDocsProductLabel(selectedProductId);

  function handleProductChange(productId: string) {
    setSelectedProductId(productId);
    const productFirstPage = pages.find((page) => getDocsProductId(page) === productId);
    setSelectedId(productFirstPage?.id ?? "");
    const url = new URL(window.location.href);
    url.searchParams.set("product", productId);
    window.history.replaceState(null, "", url.toString());
  }

  return (
    <main className="h-[calc(100vh-4rem)] overflow-hidden bg-background px-4 py-4 lg:px-6 lg:py-5">
      <style>{`
        .docs-markdown h1 { font-size: clamp(1.9rem, 3.2vw, 3.05rem); line-height: .98; letter-spacing: -.055em; margin: 0 0 1.15rem; color: hsl(var(--foreground)); }
        .docs-markdown h2 { margin-top: 1.7rem; padding-top: 1.25rem; border-top: 1px solid hsl(var(--border)); color: hsl(var(--primary)); font-size: 1.2rem; font-weight: 800; }
        .docs-markdown h3 { margin-top: 1.3rem; color: hsl(var(--foreground)); font-size: 1rem; font-weight: 800; }
        .docs-markdown p { margin: .65rem 0; color: hsl(var(--muted-foreground)); line-height: 1.7; font-size: .94rem; }
        .docs-markdown ul { list-style: none; padding: 0; display: grid; gap: .45rem; margin: .85rem 0; }
        .docs-markdown li { position: relative; padding-left: 1.35rem; color: hsl(var(--muted-foreground)); font-size: .94rem; line-height: 1.65; }
        .docs-markdown li::before { content: "✦"; position: absolute; left: 0; color: hsl(var(--primary)); }
        .docs-markdown pre { overflow: auto; border-radius: .9rem; background: #15120f; color: #f6ecd8; padding: .9rem; border: 1px solid rgba(255,255,255,.08); font-size: .86rem; }
        .docs-markdown code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: .9em; }
        .docs-markdown p code, .docs-markdown li code { background: hsl(var(--primary) / .12); color: hsl(var(--primary)); border-radius: .45rem; padding: .12rem .35rem; }
        .docs-scroll-area::-webkit-scrollbar { width: 8px; height: 8px; }
        .docs-scroll-area::-webkit-scrollbar-thumb { background: hsl(var(--primary) / .35); border-radius: 999px; }
        .docs-scroll-area::-webkit-scrollbar-track { background: transparent; }
      `}</style>

      <div className="mx-auto flex h-full max-w-[1500px] flex-col gap-4 overflow-hidden">
        <section className="shrink-0 rounded-[26px] border border-border bg-card px-6 py-5 lg:px-8 lg:py-6 shadow-[0_16px_55px_rgba(32,32,32,0.07)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <SectionTag>{isEnglish ? "Documentation" : "Documentação"}</SectionTag>
              <h1 className="mt-4 text-3xl lg:text-5xl font-bold tracking-tight text-foreground/95" style={{ fontFamily: "'Raleway', sans-serif" }}>
                {selectedProductName}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                {isEnglish
                  ? "Customer documentation separated by product."
                  : "Documentação para cliente separada por produto."}
              </p>
            </div>

            <label className="w-full max-w-sm space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {isEnglish ? "Product documentation" : "Documentação do produto"}
              </span>
              <select
                value={selectedProductId}
                onChange={(e) => handleProductChange(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary/40"
              >
                {productOptions.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.label} {product.count ? `(${product.count})` : ""}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="flex min-h-0 flex-col rounded-[24px] border border-border bg-card p-4 shadow-[0_14px_42px_rgba(32,32,32,0.06)]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isEnglish ? "Search this product..." : "Buscar neste produto..."}
              className="mb-3 h-10 w-full shrink-0 rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary/40"
            />

            {loading && <p className="px-2 py-2 text-xs text-muted-foreground">{isEnglish ? "Loading..." : "Carregando..."}</p>}

            <nav className="docs-scroll-area min-h-0 flex-1 overflow-y-auto pr-1">
              {Object.keys(grouped).length === 0 && (
                <p className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                  {isEnglish ? "No documentation pages for this product yet." : "Ainda não existem páginas para este produto."}
                </p>
              )}

              {Object.entries(grouped).map(([category, rows]) => (
                <div key={category} className="mb-4">
                  <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{category}</p>
                  <div className="space-y-1">
                    {rows.map((page) => {
                      const title = getDocsTitle(page, isEnglish);
                      const active = selected?.id === page.id;
                      return (
                        <button
                          key={page.id}
                          onClick={() => setSelectedId(page.id)}
                          className={`w-full rounded-xl px-3 py-2 text-left text-[13px] font-semibold transition-all ${active ? "bg-primary/10 text-primary border border-primary/20" : "text-foreground/65 hover:bg-primary/5 hover:text-foreground border border-transparent"}`}
                        >
                          {title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </aside>

          <article className="docs-scroll-area min-h-0 overflow-y-auto rounded-[26px] border border-border bg-card p-5 lg:p-8 shadow-[0_16px_55px_rgba(32,32,32,0.07)]">
            {selected ? (
              <>
                <div className="mb-5 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                    {translateDocsCategory(selected.category, isEnglish)}
                  </span>
                  <span className="text-xs text-muted-foreground">{selectedTitle}</span>
                </div>
                <DocsContent content={selectedContent} />
              </>
            ) : (
              <p className="text-muted-foreground">{isEnglish ? "No page found." : "Nenhuma página encontrada."}</p>
            )}
          </article>
        </div>
      </div>
    </main>
  );
}

function DocsAdminPage() {
  const [token, setToken] = useState(() => getAdminToken());
  const [tokenInput, setTokenInput] = useState("");
  const [pages, setPages] = useState<DocsPageRecord[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("tws-identity-forge");
  const [selected, setSelected] = useState<DocsPageRecord>(() => emptyDocsPage("tws-identity-forge"));
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [pageSearch, setPageSearch] = useState("");
  const [editorLanguage, setEditorLanguage] = useState<"pt" | "en">("pt");
  const [docsViewMode, setDocsViewMode] = useState<"editor" | "preview">("editor");

  const isLogged = !!token;
  const productOptions = getDocsProductOptions(pages);
  const selectedProductPages = pages.filter((page) => getDocsProductId(page) === selectedProductId);
  const filteredProductPages = selectedProductPages.filter((page) => {
    const haystack = [
      page.title,
      page.titleEn,
      page.category,
      page.slug,
      page.contentPt,
      page.contentEn
    ].join(" ").toLowerCase();

    return !pageSearch.trim() || haystack.includes(pageSearch.trim().toLowerCase());
  });

  const pagesByCategory = filteredProductPages.reduce<Record<string, DocsPageRecord[]>>((acc, page) => {
    const category = page.category || "Sem categoria";
    if (!acc[category]) acc[category] = [];
    acc[category].push(page);
    return acc;
  }, {});

  const visibleCount = selectedProductPages.filter((page) => page.visible).length;
  const hiddenCount = Math.max(selectedProductPages.length - visibleCount, 0);
  const activeContent = editorLanguage === "pt" ? selected.contentPt : selected.contentEn ?? "";
  const activeTitle = editorLanguage === "pt" ? selected.title : selected.titleEn || selected.title;

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setMessage(null);
    try {
      const rows = await fetchDocsPages(true, token);
      setPages(rows);
      const firstProduct = selectedProductId || getDocsProductId(rows[0] ?? emptyDocsPage());
      const firstPageForProduct = rows.find((page) => getDocsProductId(page) === firstProduct);
      if (rows.length > 0 && selected.id.startsWith("new-") && firstPageForProduct) setSelected(firstPageForProduct);
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Erro ao carregar documentação.");
    } finally {
      setLoading(false);
    }
  }, [token, selectedProductId]);

  useEffect(() => {
    load();
  }, [load]);

  function handleLogin() {
    storeAdminToken(tokenInput);
    setToken(tokenInput.trim());
    setTokenInput("");
  }

  function handleSelectProduct(productId: string) {
    setSelectedProductId(productId);
    const firstPage = pages.find((page) => getDocsProductId(page) === productId);
    setSelected(firstPage ?? emptyDocsPage(productId));
    setPageSearch("");
  }

  function handleNewPage(productId = selectedProductId) {
    const next = emptyDocsPage(productId);
    setSelectedProductId(productId);
    setSelected(next);
    setEditorLanguage("pt");
    setDocsViewMode("editor");
  }

  function updateSelectedContent(value: string) {
    if (editorLanguage === "pt") {
      setSelected({ ...selected, contentPt: value });
      return;
    }

    setSelected({ ...selected, contentEn: value });
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const pageToSave = { ...selected, productId: selected.productId || selectedProductId };
      const saved = await saveAdminDocsPage(token, pageToSave);
      setSelected(saved);
      setSelectedProductId(getDocsProductId(saved));
      setMessage("Página salva com sucesso.");
      await load();
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Erro ao salvar página.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!selected.id || selected.id.startsWith("new-")) return;
    if (!window.confirm("Apagar esta página da documentação?")) return;

    setSaving(true);
    setMessage(null);
    try {
      await deleteAdminDocsPage(token, selected.id);
      setSelected(emptyDocsPage(selectedProductId));
      setMessage("Página apagada.");
      await load();
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Erro ao apagar página.");
    } finally {
      setSaving(false);
    }
  }

  const fieldClass = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-primary/10";
  const labelClass = "text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground";
  const panelClass = "rounded-[22px] border border-border bg-card shadow-[0_14px_42px_rgba(32,32,32,0.05)]";

  if (!isLogged) {
    return (
      <main className="min-h-screen bg-background px-6 py-16">
        <div className="mx-auto max-w-xl rounded-[30px] border border-border bg-card p-7 shadow-[0_22px_80px_rgba(32,32,32,0.08)]">
          <SectionTag>Admin Docs</SectionTag>
          <h1 className="mt-4 text-3xl font-bold text-foreground/95">Editor da documentação</h1>
          <p className="mt-2 text-sm text-muted-foreground">Use o mesmo token admin da loja.</p>
          <div className="mt-6 space-y-3">
            <input
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="ADMIN_ACCESS_TOKEN"
              className={fieldClass}
            />
            <button onClick={handleLogin} className="w-full rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
              Entrar
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-transparent p-0">
      <div className="grid h-[calc(100vh-175px)] grid-cols-1 overflow-hidden rounded-[24px] border border-border bg-background shadow-[0_18px_55px_rgba(32,32,32,0.06)] xl:grid-cols-[240px_300px_minmax(0,1fr)]">
        {/* GitBook-style left rail */}
        <aside className="border-b border-border bg-card/80 p-3 xl:border-b-0 xl:border-r">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BookOpen size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground/90">Docs Studio</p>
              <p className="text-[11px] text-muted-foreground">GitBook style</p>
            </div>
          </div>

          <div className="mb-3">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Spaces</p>
            <div className="space-y-1.5">
              {productOptions.map((product) => {
                const active = selectedProductId === product.id;

                return (
                  <button
                    key={product.id}
                    onClick={() => handleSelectProduct(product.id)}
                    className={`group flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left transition-all ${
                      active
                        ? "border-primary/30 bg-primary/10 text-primary"
                        : "border-transparent text-foreground/65 hover:border-border hover:bg-background hover:text-foreground"
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{product.label}</span>
                      <span className="block truncate text-[10px] text-muted-foreground">{product.count} páginas</span>
                    </span>
                    <ChevronRight size={14} className={active ? "opacity-100" : "opacity-0 group-hover:opacity-60"} />
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => {
              const customId = window.prompt("Digite o ID do novo produto. Ex: tws-camera-kit");
              if (!customId) return;
              handleNewPage(slugifyClient(customId));
            }}
            className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary/35 bg-primary/5 px-3 py-2 text-[11px] font-bold text-primary transition-all hover:bg-primary/10"
          >
            <Plus size={14} />
            Novo space
          </button>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-border bg-background px-3 py-2">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Visíveis</p>
              <p className="text-lg font-bold text-primary">{visibleCount}</p>
            </div>
            <div className="rounded-xl border border-border bg-background px-3 py-2">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Ocultas</p>
              <p className="text-lg font-bold text-foreground/70">{hiddenCount}</p>
            </div>
          </div>
        </aside>

        {/* Page tree */}
        <aside className="flex min-h-0 flex-col border-b border-border bg-card/45 p-3 xl:border-b-0 xl:border-r">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-bold text-foreground/90">Páginas</p>
              <p className="text-[11px] text-muted-foreground">{getDocsProductLabel(selectedProductId)}</p>
            </div>
            <button
              onClick={() => handleNewPage()}
              className="inline-flex h-8 items-center gap-1 rounded-lg bg-primary px-2.5 text-[11px] font-bold text-primary-foreground hover:brightness-105"
            >
              <Plus size={13} />
              Nova
            </button>
          </div>

          <div className="relative mb-3">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={pageSearch}
              onChange={(e) => setPageSearch(e.target.value)}
              placeholder="Buscar páginas..."
              className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary/40"
            />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            {loading && <p className="rounded-xl border border-border bg-background p-3 text-xs text-muted-foreground">Carregando...</p>}

            {selectedProductPages.length === 0 && !loading && (
              <div className="rounded-2xl border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
                Este produto ainda não tem páginas.
              </div>
            )}

            {Object.entries(pagesByCategory).map(([category, rows]) => (
              <div key={category} className="mb-4">
                <p className="mb-2 flex items-center gap-2 px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  <ChevronDown size={12} />
                  {category}
                </p>
                <div className="space-y-1">
                  {rows.map((page) => {
                    const active = selected.id === page.id;
                    return (
                      <button
                        key={page.id}
                        onClick={() => {
                          setSelected(page);
                          setDocsViewMode("editor");
                        }}
                        className={`group flex w-full items-start gap-2 rounded-xl border px-3 py-2.5 text-left transition-all ${
                          active
                            ? "border-primary/30 bg-primary/10 text-primary"
                            : "border-transparent text-foreground/70 hover:border-border hover:bg-background"
                        }`}
                      >
                        <BookOpen size={14} className="mt-0.5 shrink-0" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold">{page.title}</span>
                          <span className="mt-0.5 block truncate text-[10px] text-muted-foreground">
                            /{page.slug} · {page.visible ? "Publicado" : "Oculto"}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Editor and preview */}
        <section className="flex min-h-0 flex-col bg-background">
          <div className="border-b border-border bg-card px-3 py-2 lg:px-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/75">Editor GitBook</p>
                <h2 className="mt-0.5 truncate text-lg font-bold text-foreground/95" style={{ fontFamily: "'Raleway', sans-serif" }}>
                  {activeTitle || "Nova página"}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setDocsViewMode((current) => current === "preview" ? "editor" : "preview")}
                  className={`inline-flex h-9 items-center gap-2 rounded-xl border px-3 text-xs font-bold transition-all ${
                    docsViewMode === "preview"
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-border text-foreground/70 hover:bg-primary/5"
                  }`}
                >
                  {docsViewMode === "preview" ? "Voltar editor" : "Ver preview"}
                </button>
                <a
                  href={`/docs?product=${selectedProductId}`}
                  className="inline-flex h-9 items-center gap-2 rounded-xl border border-border px-3 text-xs font-bold text-foreground/70 hover:bg-primary/5"
                >
                  <ExternalLink size={13} />
                  Abrir docs
                </a>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex h-9 items-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground hover:brightness-105 disabled:opacity-60"
                >
                  <Check size={14} />
                  {saving ? "Salvando..." : "Publicar"}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={saving || selected.id.startsWith("new-")}
                  className="inline-flex h-9 items-center rounded-xl border border-red-500/25 px-3 text-xs font-bold text-red-500 hover:bg-red-500/5 disabled:opacity-40"
                >
                  Apagar
                </button>
              </div>
            </div>

            {message && (
              <div className="mt-3 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary">
                {message}
              </div>
            )}
          </div>

          <div className="min-h-0 flex-1 overflow-hidden">
            {docsViewMode === "editor" ? (
              <div className="min-h-0 overflow-y-auto p-3 lg:p-4">
                <div className="mb-3 grid grid-cols-1 gap-2 lg:grid-cols-12">
                  <label className={`${panelClass} block p-2.5 lg:col-span-4`}>
                    <span className={labelClass}>Produto ID</span>
                    <input
                      value={selected.productId ?? selectedProductId}
                      onChange={(e) => {
                        const productId = slugifyClient(e.target.value);
                        setSelectedProductId(productId);
                        setSelected({ ...selected, productId });
                      }}
                      placeholder="tws-identity-forge"
                      className="mt-1 w-full bg-transparent text-sm font-semibold outline-none text-foreground/85"
                    />
                  </label>

                  <label className={`${panelClass} block p-2.5 lg:col-span-3`}>
                    <span className={labelClass}>Slug</span>
                    <input
                      value={selected.slug}
                      onChange={(e) => setSelected({ ...selected, slug: e.target.value })}
                      className="mt-1 w-full bg-transparent text-sm outline-none text-foreground/85"
                    />
                  </label>

                  <label className={`${panelClass} block p-2.5 lg:col-span-3`}>
                    <span className={labelClass}>Categoria</span>
                    <input
                      value={selected.category}
                      onChange={(e) => setSelected({ ...selected, category: e.target.value })}
                      className="mt-1 w-full bg-transparent text-sm outline-none text-foreground/85"
                    />
                  </label>

                  <div className="grid grid-cols-2 gap-3 lg:col-span-2">
                    <label className={`${panelClass} block p-2.5`}>
                      <span className={labelClass}>Ordem</span>
                      <input
                        type="number"
                        value={selected.orderIndex}
                        onChange={(e) => setSelected({ ...selected, orderIndex: Number(e.target.value) })}
                        className="mt-1 w-full bg-transparent text-sm outline-none text-foreground/85"
                      />
                    </label>
                    <label className={`${panelClass} block p-2.5`}>
                      <span className={labelClass}>Status</span>
                      <select
                        value={selected.visible ? "1" : "0"}
                        onChange={(e) => setSelected({ ...selected, visible: e.target.value === "1" })}
                        className="mt-1 w-full bg-transparent text-sm outline-none text-foreground/85"
                      >
                        <option value="1">Publicado</option>
                        <option value="0">Oculto</option>
                      </select>
                    </label>
                  </div>
                </div>

                <div className={`${panelClass} overflow-hidden`}>
                  <div className="flex flex-col gap-2 border-b border-border bg-card px-4 py-2.5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-sm font-bold text-foreground/90">Conteúdo da página</p>
                      <p className="text-[11px] text-muted-foreground">Edite em Markdown. Clique em “Ver preview” para visualizar como ficou.</p>
                    </div>

                    <div className="flex rounded-xl border border-border bg-background p-1">
                      <button
                        onClick={() => setEditorLanguage("pt")}
                        className={`h-8 rounded-lg px-3 text-xs font-bold transition-all ${editorLanguage === "pt" ? "bg-primary text-primary-foreground" : "text-foreground/60 hover:text-foreground"}`}
                      >
                        PT-BR
                      </button>
                      <button
                        onClick={() => setEditorLanguage("en")}
                        className={`h-8 rounded-lg px-3 text-xs font-bold transition-all ${editorLanguage === "en" ? "bg-primary text-primary-foreground" : "text-foreground/60 hover:text-foreground"}`}
                      >
                        EN-US
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-0 border-b border-border lg:grid-cols-2">
                    <label className="border-b border-border p-3 lg:border-b-0 lg:border-r">
                      <span className={labelClass}>{editorLanguage === "pt" ? "Título PT" : "Título EN"}</span>
                      <input
                        value={editorLanguage === "pt" ? selected.title : selected.titleEn ?? ""}
                        onChange={(e) => {
                          if (editorLanguage === "pt") {
                            setSelected({ ...selected, title: e.target.value });
                          } else {
                            setSelected({ ...selected, titleEn: e.target.value });
                          }
                        }}
                        placeholder={editorLanguage === "pt" ? "Título da página" : "Page title"}
                        className="mt-2 w-full bg-transparent text-xl font-bold outline-none text-foreground/95"
                      />
                    </label>
                    <div className="p-3">
                      <span className={labelClass}>Caminho público</span>
                      <p className="mt-2 truncate rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-muted-foreground">
                        /docs?product={selected.productId || selectedProductId} · /{selected.slug || "slug"}
                      </p>
                    </div>
                  </div>

                  <textarea
                    value={activeContent}
                    onChange={(e) => updateSelectedContent(e.target.value)}
                    rows={16}
                    spellCheck={false}
                    className="h-[calc(100vh-560px)] min-h-[260px] w-full resize-none border-0 border-t border-border bg-[#fffdf8] p-5 font-mono text-[13px] leading-6 text-foreground outline-none"
                    placeholder="# Título&#10;&#10;Escreva a documentação aqui..."
                  />
                </div>
              </div>
            ) : (
              <div className="min-h-0 overflow-y-auto bg-card/40 p-4 lg:p-6">
                <div className="mx-auto max-w-5xl rounded-[26px] border border-border bg-background p-6 lg:p-9 shadow-[0_18px_55px_rgba(32,32,32,0.06)]">
                  <div className="mb-6 flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                        Preview · {editorLanguage === "pt" ? "PT-BR" : "EN-US"}
                      </span>
                      <h1 className="mt-4 text-3xl font-bold text-foreground/95 lg:text-5xl" style={{ fontFamily: "'Raleway', sans-serif" }}>
                        {activeTitle || "Nova página"}
                      </h1>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {selected.category || "Categoria"} · /{selected.slug || "slug"}
                      </p>
                    </div>

                    <button
                      onClick={() => setDocsViewMode("editor")}
                      className="inline-flex h-10 items-center justify-center rounded-xl border border-primary/25 px-4 text-sm font-bold text-primary hover:bg-primary/5"
                    >
                      Voltar para editar
                    </button>
                  </div>

                  <DocsContent content={activeContent || "# Preview\n\nComece a escrever para visualizar."} />
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}


function Footer({ onNavigate }: { onNavigate: (id: string) => void }) {
  const companyLinks = [
    { label: "About", href: "/about" },
    { label: "Terms of use", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ];

  const quickLinks = [
    { label: "Início", action: () => onNavigate("hero") },
    { label: "Scripts", action: () => onNavigate("products") },
    { label: "Documentação", href: "/docs" },
    { label: "Discord", href: "https://discord.gg/qE29trG84u" },
  ];

  const tebexLinks = [
    { label: "Impressum", href: "https://checkout.tebex.io/impressum" },
    { label: "Terms & Conditions", href: "https://checkout.tebex.io/terms" },
    { label: "Privacy Policy", href: "https://checkout.tebex.io/privacy" },
  ];

  const renderLink = (link: { label: string; href?: string; action?: () => void }, className = "") =>
    link.href ? (
      <a
        key={link.label}
        href={link.href}
        target={link.href.startsWith("/") ? undefined : "_blank"}
        rel={link.href.startsWith("/") ? undefined : "noopener noreferrer"}
        className={className}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {link.label}
      </a>
    ) : (
      <button
        key={link.label}
        onClick={link.action}
        className={className}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {link.label}
      </button>
    );

  return (
    <footer className="border-t border-border py-14 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.4fr)_0.8fr_0.8fr_0.8fr] gap-10 items-start">
          <div className="max-w-xs">
            <div className="mb-3">
              <span
                className="text-lg font-bold tracking-[0.2em] uppercase block"
                style={{ fontFamily: "'Cinzel', serif", color: "#b89458" }}
              >
                The Wanted
              </span>
              <span
                className="text-xs tracking-[0.35em] uppercase text-foreground/40"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Sole Studio
              </span>
            </div>
            <p
              className="text-xs text-muted-foreground leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Scripts exclusivos, custom peds e sistemas premium para servidores RedM.
              Qualidade, originalidade e identidade própria.
            </p>
          </div>

          <div>
            <p className="text-sm uppercase tracking-wide text-muted-foreground mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Company
            </p>
            <nav className="flex flex-col items-start gap-2">
              {companyLinks.map((link) => renderLink(link, "text-sm font-semibold text-foreground/85 hover:text-primary transition-colors text-left"))}
            </nav>
          </div>

          <div>
            <p className="text-sm uppercase tracking-wide text-muted-foreground mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Links
            </p>
            <nav className="flex flex-col items-start gap-2">
              {quickLinks.map((link) => renderLink(link, "text-sm text-muted-foreground hover:text-foreground/90 transition-colors text-left"))}
            </nav>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Tebex
            </p>
            <nav className="flex flex-col items-start gap-2">
              {tebexLinks.map((link) => renderLink(link, "text-sm font-semibold text-foreground/85 hover:text-primary transition-colors text-left"))}
            </nav>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground/60" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            © 2026 The Wanted Sole Studio — Todos os direitos reservados.
          </p>
          <p className="text-xs text-muted-foreground/40" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            RedM · Scripts &amp; Custom Peds
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────




function emptyAdminProduct(): Product {
  return {
    id: `new-${Date.now()}`,
    name: "",
    nameEn: "",
    category: "Scripts",
    description: "",
    descriptionEn: "",
    fullDescription: "",
    fullDescriptionEn: "",
    price: 0,
    priceCurrency: PRODUCT_BASE_CURRENCY,
    priceSource: "fallback",
    status: "novo",
    tebexUrl: "",
    packageId: "",
    docsUrl: "https://docs.thewantedsolestudio.workers.dev",
    features: [],
    featuresEn: [],
    requirements: [],
    requirementsEn: [],
    media: [],
    gradientFrom: "#ece5d8",
    gradientTo: "#fffdf8",
    iconName: "Package",
    visible: true,
    featured: false
  };
}

function ProductAdminForm({
  product,
  onChange,
  onSave,
  saving
}: {
  product: Product;
  onChange: (product: Product) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const [previewFailed, setPreviewFailed] = useState(false);
  const featuresText = product.features.join("\n");
  const featuresEnText = (product.featuresEn ?? []).join("\n");
  const requirementsText = product.requirements.join("\n");
  const requirementsEnText = (product.requirementsEn ?? []).join("\n");
  const mediaText = (product.media ?? []).map((item) => item.src).join("\n");
  const Icon = ICON_MAP[product.iconName] ?? Package;
  const status = STATUS_CONFIG[product.status];
  const iconPreview = getProductThumbnail(product);
  const galleryCount = Math.max((product.media?.length ?? 0) - 1, 0);

  const update = (patch: Partial<Product>) => onChange({ ...product, ...patch });

  const field = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-primary/10";
  const textarea = `${field} resize-y`;
  const lbl = "block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2";

  function SectionHeader({ number, title, subtitle }: { number: string; title: string; subtitle: string }) {
    return (
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {number}
        </span>
        <div>
          <h3 className="text-base font-bold text-foreground/90" style={{ fontFamily: "'Raleway', sans-serif" }}>{title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-[22px] border border-border bg-card px-5 py-4 shadow-[0_8px_28px_rgba(32,32,32,0.05)]">
        <div>
          <SectionTag>Editor de produto</SectionTag>
          <h2 className="mt-2 text-xl font-bold text-foreground/95" style={{ fontFamily: "'Raleway', sans-serif" }}>
            {product.id.startsWith("new-") ? "Novo produto" : product.name || "Editar produto"}
          </h2>
        </div>
        <button
          onClick={onSave}
          disabled={saving}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground hover:brightness-105 disabled:opacity-60 shrink-0"
        >
          {saving ? "Salvando..." : "Salvar e publicar"}
        </button>
      </div>

      {/* ── Main two-column layout ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px] gap-5 items-start">

        {/* ── Left: all form sections stacked ── */}
        <div className="space-y-5">

          {/* 01 — Identificação */}
          <div className="rounded-[22px] border border-border bg-card p-5 lg:p-6 shadow-[0_8px_28px_rgba(32,32,32,0.04)]">
            <SectionHeader number="01" title="Identificação" subtitle="Nome, categoria, etiqueta e ícone" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="md:col-span-2">
                <span className={lbl}>Nome do produto</span>
                <input value={product.name} onChange={(e) => update({ name: e.target.value })} className={field} placeholder="Ex: TWS Identity Forge" />
              </label>
              <label>
                <span className={lbl}>Nome em inglês</span>
                <input value={product.nameEn ?? ""} onChange={(e) => update({ nameEn: e.target.value })} className={field} placeholder="Product name EN" />
              </label>
              <label>
                <span className={lbl}>Categoria</span>
                <select value={product.category} onChange={(e) => update({ category: e.target.value as Product["category"] })} className={field}>
                  {CATEGORIES.filter((item) => item !== "Todos").map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label>
                <span className={lbl}>Etiqueta</span>
                <select value={product.status} onChange={(e) => update({ status: e.target.value as ProductStatus })} className={field}>
                  <option value="novo">Novo</option>
                  <option value="popular">Popular</option>
                  <option value="atualizado">Atualizado</option>
                  <option value="em-breve">Em breve</option>
                </select>
              </label>
              <label>
                <span className={lbl}>Ícone fallback</span>
                <input value={product.iconName ?? ""} onChange={(e) => update({ iconName: e.target.value })} placeholder="Package, Crown, Star..." className={field} />
              </label>
              <label className="md:col-span-2">
                <span className={lbl}>URL Documentação</span>
                <input value={product.docsUrl ?? ""} onChange={(e) => update({ docsUrl: e.target.value })} placeholder="https://docs..." className={field} />
              </label>
            </div>
          </div>

          {/* 02 — Tebex */}
          <div className="rounded-[22px] border border-border bg-card p-5 lg:p-6 shadow-[0_8px_28px_rgba(32,32,32,0.04)]">
            <SectionHeader number="02" title="Tebex" subtitle="Package ID, preço fallback e URL" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label>
                <span className={lbl}>Package ID Tebex</span>
                <input value={product.packageId ?? ""} onChange={(e) => update({ packageId: e.target.value })} placeholder="7457637" className={field} />
              </label>
              <label>
                <span className={lbl}>Preço fallback</span>
                <input type="number" step="0.01" value={product.price} onChange={(e) => update({ price: Number(e.target.value), priceSource: "fallback" })} className={field} />
              </label>
              <label>
                <span className={lbl}>URL Tebex</span>
                <input value={product.tebexUrl} onChange={(e) => update({ tebexUrl: e.target.value })} placeholder="https://.../package/..." className={field} />
              </label>
            </div>
            <p className="mt-4 rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 text-xs text-muted-foreground leading-5">
              Com o Package ID correto, o preço é puxado direto da Tebex. O fallback só entra se a Tebex não retornar valor.
            </p>
          </div>

          {/* 03 — Conteúdo PT + EN lado a lado */}
          <div className="rounded-[22px] border border-border bg-card p-5 lg:p-6 shadow-[0_8px_28px_rgba(32,32,32,0.04)]">
            <SectionHeader number="03" title="Conteúdo" subtitle="Descrições, recursos e requisitos em Português e Inglês" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4">

              {/* PT column */}
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 border-b border-border pb-2">🇧🇷 Português</p>
                <label>
                  <span className={lbl}>Descrição curta</span>
                  <input value={product.description} onChange={(e) => update({ description: e.target.value })} className={field} />
                </label>
                <label>
                  <span className={lbl}>Descrição completa</span>
                  <textarea value={product.fullDescription} onChange={(e) => update({ fullDescription: e.target.value })} rows={6} className={textarea} />
                </label>
                <label>
                  <span className={lbl}>Recursos — um por linha</span>
                  <textarea value={featuresText} onChange={(e) => update({ features: e.target.value.split("\n").map((l) => l.trim()).filter(Boolean) })} rows={7} className={textarea} />
                </label>
                <label>
                  <span className={lbl}>Requisitos — um por linha</span>
                  <textarea value={requirementsText} onChange={(e) => update({ requirements: e.target.value.split("\n").map((l) => l.trim()).filter(Boolean) })} rows={5} className={textarea} />
                </label>
              </div>

              {/* EN column */}
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 border-b border-border pb-2">🇺🇸 English</p>
                <label>
                  <span className={lbl}>Short description</span>
                  <input value={product.descriptionEn ?? ""} onChange={(e) => update({ descriptionEn: e.target.value })} className={field} />
                </label>
                <label>
                  <span className={lbl}>Full description</span>
                  <textarea value={product.fullDescriptionEn ?? ""} onChange={(e) => update({ fullDescriptionEn: e.target.value })} rows={6} className={textarea} />
                </label>
                <label>
                  <span className={lbl}>Features — one per line</span>
                  <textarea value={featuresEnText} onChange={(e) => update({ featuresEn: e.target.value.split("\n").map((l) => l.trim()).filter(Boolean) })} rows={7} className={textarea} />
                </label>
                <label>
                  <span className={lbl}>Requirements — one per line</span>
                  <textarea value={requirementsEnText} onChange={(e) => update({ requirementsEn: e.target.value.split("\n").map((l) => l.trim()).filter(Boolean) })} rows={5} className={textarea} />
                </label>
              </div>
            </div>
          </div>

          {/* 04 — Mídia */}
          <div className="rounded-[22px] border border-border bg-card p-5 lg:p-6 shadow-[0_8px_28px_rgba(32,32,32,0.04)]">
            <SectionHeader number="04" title="Mídia" subtitle="Imagem do card (linha 1) e galeria (linhas seguintes)" />
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_220px] gap-5">
              <label>
                <span className={lbl}>URLs — uma por linha</span>
                <textarea
                  value={mediaText}
                  onChange={(e) => update({
                    media: e.target.value.split("\n").map((line) => line.trim()).filter(Boolean).map((src) => ({
                      type: isYouTubeUrl(src) ? "youtube" : src.match(/\.(mp4|webm|mov)$/i) ? "video" : "image",
                      src,
                      alt: product.name || "Preview do produto"
                    }))
                  })}
                  rows={10}
                  className={textarea}
                  placeholder={"https://cdn.../thumb.png\nhttps://youtube.com/watch?v=...\nhttps://cdn.../screenshot2.png"}
                />
              </label>
              <div className="space-y-3">
                <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4">
                  <p className="text-xs font-semibold text-foreground/80 mb-2">Como usar</p>
                  <ul className="space-y-1.5 text-xs leading-5 text-muted-foreground">
                    <li>• Linha 1 → imagem do card</li>
                    <li>• Linha 2+ → galeria</li>
                    <li>• YouTube → player embutido</li>
                    <li>• .mp4 / .webm / .mov → vídeo</li>
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-border bg-background p-3 text-center">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">URLs</p>
                    <p className="mt-1 text-xl font-bold text-primary">{product.media?.length ?? 0}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-background p-3 text-center">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Galeria</p>
                    <p className="mt-1 text-xl font-bold text-primary">{galleryCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── Right: preview + publish ── */}
        <aside className="xl:sticky xl:top-6 space-y-4">

          {/* Preview card */}
          <div className="rounded-[22px] border border-border bg-card p-4 shadow-[0_8px_28px_rgba(32,32,32,0.06)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary/60 mb-3">Preview</p>
            <div className="overflow-hidden rounded-2xl border border-border bg-background">
              <div
                className="relative h-32 flex items-center justify-center overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${product.gradientFrom}, ${product.gradientTo})` }}
              >
                {iconPreview && !previewFailed ? (
                  <img src={iconPreview} alt={product.name} onError={() => setPreviewFailed(true)} className="h-full w-full object-cover" />
                ) : (
                  <div className="rounded-xl border border-primary/25 bg-primary/10 p-4">
                    <Icon size={24} className="text-primary" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-1.5">
                  <span className={`px-2 py-0.5 rounded-sm text-[10px] font-semibold tracking-wider uppercase ${status.cls}`}>{status.label}</span>
                  <span className="px-2 py-0.5 rounded-sm text-[10px] tracking-wider uppercase border border-border text-muted-foreground">{product.category}</span>
                </div>
                <p className="mt-2.5 font-bold text-foreground/90 text-sm">{product.name || "Nome do produto"}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{product.description || "Descrição curta."}</p>
                <p className="mt-2.5 text-base font-bold text-primary" style={{ fontFamily: "'Cinzel', serif" }}>
                  {formatProductPrice(product.price, PRODUCT_BASE_CURRENCY, product.priceCurrency)}
                </p>
              </div>
            </div>
          </div>

          {/* Publish settings */}
          <div className="rounded-[22px] border border-border bg-card p-4 shadow-[0_8px_28px_rgba(32,32,32,0.06)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary/60 mb-3">Publicação</p>
            <div className="space-y-2">
              <label className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/70 px-4 py-3 cursor-pointer hover:border-primary/20 transition-colors">
                <span>
                  <strong className="block text-sm text-foreground/90">Visível</strong>
                  <span className="text-xs text-muted-foreground">Aparece na vitrine</span>
                </span>
                <input type="checkbox" checked={product.visible !== false} onChange={(e) => update({ visible: e.target.checked })} className="h-4 w-4 accent-primary" />
              </label>
              <label className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/70 px-4 py-3 cursor-pointer hover:border-primary/20 transition-colors">
                <span>
                  <strong className="block text-sm text-foreground/90">Destaque</strong>
                  <span className="text-xs text-muted-foreground">Prioriza na listagem</span>
                </span>
                <input type="checkbox" checked={product.featured === true} onChange={(e) => update({ featured: e.target.checked })} className="h-4 w-4 accent-primary" />
              </label>
            </div>
            <button
              onClick={onSave}
              disabled={saving}
              className="mt-4 w-full rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:brightness-105 disabled:opacity-60 transition-all"
            >
              {saving ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>

        </aside>
      </div>
    </div>
  );
}



function emptyCreatorCode(): CreatorCode {
  return {
    id: `new-${Date.now()}`,
    label: "",
    originalCode: "",
    visible: true
  };
}

function CreatorCodeAdminPanel({ token }: { token: string }) {
  const [codes, setCodes] = useState<CreatorCode[]>([]);
  const [selected, setSelected] = useState<CreatorCode>(() => emptyCreatorCode());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadCodes = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      setMessage(null);
      const rows = await fetchAdminCreatorCodes(token);
      setCodes(rows);
      if (rows.length > 0 && selected.id.startsWith("new-")) {
        setSelected(rows[0]);
      }
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Nao foi possivel carregar creator codes.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadCodes();
  }, [loadCodes]);

  async function handleSaveCreatorCode() {
    if (!selected.label.trim() || !selected.originalCode.trim()) {
      setMessage("Preencha o nome público e o cupom/gift card original da Tebex.");
      return;
    }

    try {
      setSaving(true);
      setMessage(null);
      const saved = await saveAdminCreatorCode(token, selected);
      setSelected(saved);
      await loadCodes();
      setMessage("Coupon/Gift Card salvo com sucesso.");
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Nao foi possivel salvar creator code.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteCreatorCode(id: string) {
    if (!window.confirm("Apagar este coupon/gift card definitivamente?")) return;
    try {
      setSaving(true);
      await deleteAdminCreatorCode(token, id);
      setSelected(emptyCreatorCode());
      await loadCodes();
      setMessage("Coupon/Gift Card removido.");
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Nao foi possivel remover creator code.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-[28px] border border-border bg-card p-6 lg:p-8 shadow-[0_22px_80px_rgba(32,32,32,0.08)]">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 mb-6">
        <div>
          <SectionTag>Coupon/Gift Card</SectionTag>
          <h2 className="mt-3 text-2xl font-bold text-foreground/95" style={{ fontFamily: "'Raleway', sans-serif" }}>
            Coupons / Gift Cards
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Cadastre o cupom ou gift card criado na Tebex e escolha o nome que o cliente verá no checkout.
          </p>
        </div>
        <button onClick={() => setSelected(emptyCreatorCode())} className="rounded-full border border-primary/30 px-4 h-10 text-sm font-semibold text-primary">
          Novo coupon/gift card
        </button>
      </div>

      {message && (
        <div className="mb-5 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Cadastrados</p>
            {loading && <span className="text-xs text-muted-foreground">Carregando...</span>}
          </div>
          {loading ? (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          ) : codes.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-5 text-sm text-muted-foreground text-center">Nenhum cupom ainda.</p>
          ) : codes.map((code) => (
            <button
              key={code.id}
              onClick={() => setSelected(code)}
              className={`w-full rounded-2xl border p-4 text-left transition-all ${
                selected.id === code.id ? "border-primary/50 bg-primary/10 shadow-[0_4px_16px_rgba(201,168,76,0.10)]" : "border-border hover:border-primary/25 hover:bg-primary/5"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground/90">{code.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground font-mono">{code.originalCode}</p>
                </div>
                <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${code.visible ? "bg-emerald-400" : "bg-red-400"}`} />
              </div>
              <button
                onClick={(event) => { event.stopPropagation(); handleDeleteCreatorCode(code.id); }}
                className="mt-2.5 text-xs text-red-500/60 hover:text-red-500 hover:underline transition-colors"
              >
                Remover
              </button>
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-background/70 p-6">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-4">
            {selected.id.startsWith("new-") ? "Novo cupom / gift card" : "Editar cupom"}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <label>
              <span className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Nome público</span>
              <input
                value={selected.label}
                onChange={(e) => setSelected({ ...selected, label: e.target.value })}
                placeholder="Ex: Parceiro Oficial"
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-colors"
              />
            </label>
            <label>
              <span className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Código original Tebex</span>
              <input
                value={selected.originalCode}
                onChange={(e) => setSelected({ ...selected, originalCode: e.target.value })}
                placeholder="Ex: TWSCREATOR"
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm font-mono outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-colors"
              />
            </label>
            <label className="md:col-span-2 flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 cursor-pointer hover:border-primary/20 transition-colors">
              <input
                type="checkbox"
                checked={selected.visible}
                onChange={(e) => setSelected({ ...selected, visible: e.target.checked })}
                className="h-4 w-4 accent-primary"
              />
              <span>
                <strong className="block text-sm text-foreground/90">Visível para clientes</strong>
                <span className="text-xs text-muted-foreground">Aparece no checkout para o cliente usar</span>
              </span>
            </label>
          </div>

          <button
            onClick={handleSaveCreatorCode}
            disabled={saving}
            className="mt-5 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:brightness-105 disabled:opacity-60 transition-all"
          >
            {saving ? "Salvando..." : "Salvar cupom / gift card"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminPage({ currency, onCurrencyChange }: { currency: CurrencyCode; onCurrencyChange: (currency: CurrencyCode) => void }) {
  const [token, setToken] = useState(() => getAdminToken());
  const [tokenInput, setTokenInput] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product>(() => emptyAdminProduct());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [activeAdminSection, setActiveAdminSection] = useState<"products" | "docs" | "coupons">("products");

  const isLogged = !!token;

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setMessage(null);
    try {
      const rows = await fetchAdminProducts(token);
      setProducts(rows);
      if (rows.length > 0 && selected.id.startsWith("new-")) {
        setSelected(rows[0]);
      }
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Erro ao carregar painel admin.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  function handleAdminLogin() {
    clearTebexSession();
    storeAdminToken(tokenInput);
    setToken(tokenInput.trim());
    setTokenInput("");
  }

  function handleLogout() {
    storeAdminToken("");
    setToken("");
    setProducts([]);
    setSelected(emptyAdminProduct());
    window.location.href = "/login";
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const saved = await saveAdminProduct(token, selected);
      setSelected(saved);
      await load();
      setMessage("Produto salvo e publicado com sucesso.");
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Nao foi possivel salvar.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(productId: string) {
    if (!window.confirm("Apagar este produto da vitrine?")) return;
    setSaving(true);
    try {
      await deleteAdminProduct(token, productId);
      setSelected(emptyAdminProduct());
      await load();
      setMessage("Produto apagado definitivamente.");
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Nao foi possivel remover.");
    } finally {
      setSaving(false);
    }
  }

  if (!isLogged) {
    return (
      <div className="min-h-screen bg-[#f7f5f0] flex items-center justify-center px-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="max-w-md w-full rounded-[28px] border border-border bg-card p-8 shadow-[0_22px_80px_rgba(32,32,32,0.08)]">
          <SectionTag>Admin</SectionTag>
          <h1 className="mt-4 text-3xl font-bold text-foreground/95" style={{ fontFamily: "'Raleway', sans-serif" }}>
            Painel administrativo
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Entre com o token de administrador configurado no Worker para publicar e editar produtos.
          </p>
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="Admin token"
            className="mt-6 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary/40"
          />
          <button onClick={handleAdminLogin} className="mt-4 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">
            Entrar no Admin
          </button>
          <a href="/" className="mt-4 block text-center text-sm text-primary">Voltar para o site</a>
        </div>
      </div>
    );
  }

  const adminNavItems = [
    { id: "products" as const, label: "Produtos", description: "Editor de produto", icon: Package },
    { id: "docs" as const, label: "Documentação", description: "Editor de docs", icon: BookOpen },
    { id: "coupons" as const, label: "Cupons", description: "Coupon / Gift Card", icon: Crown },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f7f5f0] text-foreground flex" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Sidebar ── */}
      <nav className="hidden lg:flex flex-col w-60 xl:w-64 shrink-0 border-r border-border bg-card/90 px-4 py-7 gap-1 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <a href="/" className="flex flex-col items-start mb-7 px-2 transition-opacity hover:opacity-75">
          <span className="text-sm font-bold tracking-[0.2em] uppercase" style={{ fontFamily: "'Cinzel', serif", color: "#b89458" }}>
            The Wanted
          </span>
          <span className="text-[10px] tracking-[0.35em] uppercase text-foreground/40 mt-0.5">Admin Studio</span>
        </a>

        <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground/60">Seções</p>

        {adminNavItems.map((section) => {
          const Icon = section.icon;
          const active = activeAdminSection === section.id;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveAdminSection(section.id)}
              className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all ${
                active
                  ? "bg-primary/10 text-primary shadow-[inset_0_0_0_1px_rgba(201,168,76,0.25)]"
                  : "text-foreground/65 hover:bg-primary/5 hover:text-foreground/90"
              }`}
            >
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors ${active ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}>
                <Icon size={15} />
              </span>
              <span>
                <strong className={`block text-sm font-semibold ${active ? "text-primary" : "text-foreground/80"}`}>{section.label}</strong>
                <span className="mt-0.5 block text-[11px] text-muted-foreground">{section.description}</span>
              </span>
            </button>
          );
        })}

        <div className="mt-auto pt-5 border-t border-border space-y-2">
          <div className="rounded-2xl border border-border bg-background/60 px-3 py-3">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Moeda</p>
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
              className="mt-1 w-full bg-transparent text-sm font-semibold text-foreground/80 outline-none"
            >
              {CURRENCIES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-semibold text-foreground/40 transition-all hover:bg-red-50 hover:text-red-500"
          >
            <LogOut size={14} />
            Sair do painel
          </button>
        </div>
      </nav>

      {/* ── Main content ── */}
      <main className="flex-1 min-w-0 overflow-hidden px-3 py-3 lg:px-6 lg:py-4">

        {/* Mobile section tabs */}
        <div className="lg:hidden mb-5 flex gap-2 overflow-x-auto pb-1">
          {adminNavItems.map((section) => {
            const Icon = section.icon;
            const active = activeAdminSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveAdminSection(section.id)}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                  active ? "border-primary/30 bg-primary/10 text-primary" : "border-border bg-card text-foreground/60"
                }`}
              >
                <Icon size={13} />
                {section.label}
              </button>
            );
          })}
        </div>

        {/* Page header */}
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <SectionTag>Admin Dashboard</SectionTag>
            <h1 className="mt-2 text-xl lg:text-2xl font-bold text-foreground/95" style={{ fontFamily: "'Raleway', sans-serif" }}>
              {activeAdminSection === "products" && "Produtos"}
              {activeAdminSection === "docs" && "Documentação"}
              {activeAdminSection === "coupons" && "Cupom / Gift Card"}
            </h1>
            <p className="mt-1 text-xs text-muted-foreground max-w-xl">
              {activeAdminSection === "products" && "Cadastre, edite e publique os produtos da vitrine."}
              {activeAdminSection === "docs" && "Crie e edite páginas de documentação separadas por produto."}
              {activeAdminSection === "coupons" && "Cadastre o nome público e o código original da Tebex para cupons e gift cards."}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {activeAdminSection === "products" && (
              <button
                onClick={() => {
                  setSelected(emptyAdminProduct());
                  setMessage("Novo produto pronto para cadastro.");
                }}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:brightness-105"
              >
                <Plus size={15} />
                Novo produto
              </button>
            )}
            {activeAdminSection === "docs" && (
              <a
                href="/docs"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-primary/25 px-5 text-sm font-semibold text-primary hover:bg-primary/5"
              >
                <BookOpen size={15} />
                Ver docs
              </a>
            )}
            {/* Mobile logout */}
            <button
              onClick={handleLogout}
              className="lg:hidden inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-semibold text-foreground/50 hover:text-red-500"
            >
              <LogOut size={13} />
              Sair
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-2 text-xs text-primary">
            {message}
          </div>
        )}

        {/* ── Products section ── */}
        {activeAdminSection === "products" && (
          <div className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-5 lg:gap-6 items-start">
            <aside className="rounded-[22px] border border-border bg-card p-5 shadow-[0_14px_42px_rgba(32,32,32,0.06)] xl:sticky xl:top-6">
              <div className="flex items-center justify-between gap-3 mb-5">
                <div>
                  <h2 className="font-bold text-foreground/90">Lista de produtos</h2>
                  {loading && <span className="text-xs text-muted-foreground mt-0.5 block">Carregando...</span>}
                </div>
                <button
                  onClick={() => {
                    setSelected(emptyAdminProduct());
                    setMessage("Novo produto pronto para cadastro.");
                  }}
                  className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full border border-primary/30 px-3 text-xs font-semibold text-primary hover:bg-primary/5"
                >
                  <Plus size={13} />
                  Novo
                </button>
              </div>

              <div className="mb-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-primary/15 bg-primary/5 p-3.5">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Total</p>
                  <p className="mt-1 text-xl font-bold text-primary">{products.length}</p>
                </div>
                <div className="rounded-2xl border border-border bg-background/60 p-3.5">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Selecionado</p>
                  <p className="mt-1 truncate text-sm font-semibold text-foreground/80">{selected.name || "Novo"}</p>
                </div>
              </div>

              <div className="space-y-2 max-h-[calc(100vh-420px)] overflow-y-auto pr-1">
                {products.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-border p-5 text-sm text-muted-foreground text-center">
                    Nenhum produto ainda.<br />
                    <span className="text-xs">Clique em "Novo" para começar.</span>
                  </p>
                ) : products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => setSelected(product)}
                    className={`w-full text-left rounded-2xl border p-3.5 transition-all ${
                      selected.id === product.id ? "border-primary/50 bg-primary/10 shadow-[0_4px_16px_rgba(201,168,76,0.10)]" : "border-border hover:border-primary/25 hover:bg-primary/5"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground/90">{product.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{product.category} · {product.status}</p>
                      </div>
                      <span className={`h-2 w-2 mt-1.5 shrink-0 rounded-full ${product.visible === false ? "bg-red-400" : "bg-emerald-400"}`} />
                    </div>
                    <p className="mt-2 text-sm text-primary font-semibold">{formatProductPrice(product.price, currency, product.priceCurrency)}</p>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDelete(product.id);
                      }}
                      className="mt-2.5 text-xs text-red-500/70 hover:text-red-500 hover:underline transition-colors"
                    >
                      Apagar produto
                    </button>
                  </button>
                ))}
              </div>
            </aside>

            <div>
              <ProductAdminForm
                product={selected}
                onChange={setSelected}
                onSave={handleSave}
                saving={saving}
              />
            </div>
          </div>
        )}

        {activeAdminSection === "docs" && (
          <div className="rounded-[22px] border border-border bg-card/40 p-0 shadow-[0_14px_42px_rgba(32,32,32,0.04)]">
            <DocsAdminPage />
          </div>
        )}

        {activeAdminSection === "coupons" && (
          <CreatorCodeAdminPanel token={token} />
        )}
      </main>
    </div>
  );
}



function LoginPage({ currency, onCurrencyChange }: { currency: CurrencyCode; onCurrencyChange: (currency: CurrencyCode) => void }) {
  const [adminToken, setAdminToken] = useState("");

  function handleAdminLogin() {
    clearTebexSession();
    storeAdminToken(adminToken);
    window.location.href = "/admin";
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="hidden">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <a href="/" className="flex flex-col items-start transition-opacity hover:opacity-85">
            <span className="text-base font-bold tracking-[0.2em] uppercase" style={{ fontFamily: "'Cinzel', serif", color: "#b89458" }}>
              The Wanted
            </span>
            <span className="text-[10px] tracking-[0.35em] uppercase text-foreground/50 -mt-0.5">Sole Studio</span>
          </a>
          <div className="flex items-center gap-3">
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
              className="h-10 rounded-full border border-primary/20 bg-card px-4 text-xs font-semibold text-foreground/75 outline-none"
            >
              {CURRENCIES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <a href="/checkout" className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground">
              <ShoppingCart size={14} />
              Carrinho
            </a>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <SectionTag>Login</SectionTag>
          <h1 className="mt-5 text-4xl lg:text-5xl font-bold text-foreground/95" style={{ fontFamily: "'Raleway', sans-serif" }}>
            Acesse sua área
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Entre como cliente para acessar sua cesta e pedidos, ou como administrador para gerenciar os produtos da loja.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-[28px] border border-primary/20 bg-card p-8 shadow-[0_22px_80px_rgba(32,32,32,0.08)]">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
              <User size={22} />
            </div>
            <h2 className="text-2xl font-bold text-foreground/95 mb-3" style={{ fontFamily: "'Raleway', sans-serif" }}>
              Cliente / CFX
            </h2>
            <p className="text-sm text-muted-foreground leading-7 mb-6">
              Acesse sua conta para ver cesta, checkout, pedidos comprados e suporte. O login usa a autorização da Tebex.
            </p>
            <button
              onClick={() => {
                if (getAdminToken()) {
                  window.alert("Você está logado como admin. Saia do admin antes de acessar a conta de cliente.");
                  window.location.href = "/admin";
                  return;
                }
                startTebexLogin("/account");
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              <LogIn size={16} />
              Entrar como cliente
            </button>
          </div>

          <div className="rounded-[28px] border border-border bg-card p-8 shadow-[0_22px_80px_rgba(32,32,32,0.08)]">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
              <Shield size={22} />
            </div>
            <h2 className="text-2xl font-bold text-foreground/95 mb-3" style={{ fontFamily: "'Raleway', sans-serif" }}>
              Administrador
            </h2>
            <p className="text-sm text-muted-foreground leading-7 mb-6">
              Entre no painel admin para cadastrar, editar, publicar e ocultar produtos da loja.
            </p>
            <input
              type="password"
              value={adminToken}
              onChange={(e) => setAdminToken(e.target.value)}
              placeholder="Token admin"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary/40 mb-3"
            />
            <button
              onClick={handleAdminLogin}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-primary/25 px-5 py-3 text-sm font-semibold text-primary hover:bg-primary/5"
            >
              <Shield size={16} />
              Entrar como admin
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function CheckoutPage({ currency, onCurrencyChange }: { currency: CurrencyCode; onCurrencyChange: (currency: CurrencyCode) => void }) {
  const [basket, setBasket] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [removingItem, setRemovingItem] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [creatorCodeMessage, setCreatorCodeMessage] = useState<string | null>(null);
  const [applyingCreatorCode, setApplyingCreatorCode] = useState(false);
  const [removingCouponCode, setRemovingCouponCode] = useState(false);

  const basketIdent = basket?.ident ?? getStoredTebexBasket();
  const rows = getBasketItems(basket);
  const basketCurrency = (basket?.currency?.iso_4217 ?? basket?.currency ?? currency) as CurrencyCode;
  const basketTotal = getBasketTotal(basket);

  const loadBasket = useCallback(async () => {
    try {
      setLoading(true);
      const ident = getStoredTebexBasket();
      if (!ident) {
        setBasket(null);
        return;
      }
      setBasket(await fetchTebexBasket(ident));
    } catch (error) {
      console.error(error);
      setBasket(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBasket();
  }, [loadBasket]);

  async function handleRemoveCartItem(row: any) {
    if (!basketIdent) return;
    const packageId = getBasketRowPackageId(row);
    if (!packageId) return;

    try {
      setRemovingItem(packageId);
      const updatedBasket = await removePackageFromTebexBasket(basketIdent, packageId);
      setBasket(updatedBasket);
    } catch (error) {
      console.error(error);
      window.alert(error instanceof Error ? error.message : "Nao foi possivel remover o item.");
      await loadBasket();
    } finally {
      setRemovingItem(null);
    }
  }

  async function handleApplyCreatorCode() {
    if (!basketIdent) {
      setCreatorCodeMessage("Faça login ou adicione um produto antes de aplicar o coupon/gift card.");
      return;
    }

    const typedCode = couponCode.trim();
    if (!typedCode) {
      setCreatorCodeMessage("Digite um coupon/gift card válido.");
      return;
    }

    try {
      setApplyingCreatorCode(true);

      const adminCodes = await fetchCreatorCodes().catch(() => []);
      const normalizedTypedCode = typedCode.toLowerCase();
      const matchedCode = adminCodes.find((code) =>
        code.label.toLowerCase() === normalizedTypedCode ||
        code.originalCode.toLowerCase() === normalizedTypedCode
      );

      const tebexCode = matchedCode?.originalCode ?? typedCode;
      const displayCode = matchedCode?.label ?? typedCode;

      const updated = await applyCreatorCodeToBasket(basketIdent, tebexCode);
      setBasket(updated);
      setCreatorCodeMessage(`Coupon/Gift Card aplicado: ${displayCode}`);
      setCouponCode("");
    } catch (error) {
      console.error(error);
      setCreatorCodeMessage(error instanceof Error ? error.message : "Nao foi possivel aplicar o coupon/gift card.");
    } finally {
      setApplyingCreatorCode(false);
    }
  }

  async function handleRemoveCreatorCode() {
    if (!basketIdent) {
      setCreatorCodeMessage("Faça login ou adicione um produto antes de remover o coupon/gift card.");
      return;
    }

    try {
      setRemovingCouponCode(true);

      const typedCode = couponCode.trim();
      const adminCodes = typedCode ? await fetchCreatorCodes().catch(() => []) : [];
      const normalizedTypedCode = typedCode.toLowerCase();
      const matchedCode = typedCode ? adminCodes.find((code) =>
        code.label.toLowerCase() === normalizedTypedCode ||
        code.originalCode.toLowerCase() === normalizedTypedCode
      ) : null;

      const tebexCode = matchedCode?.originalCode ?? typedCode;
      const updated = await removeCreatorCodeFromBasket(basketIdent, tebexCode);
      setBasket(updated);
      setCreatorCodeMessage("Coupon/Gift Card removido da cesta. Se o checkout da Tebex estiver aberto, feche e abra novamente para atualizar o valor.");
      setCouponCode("");
    } catch (error) {
      console.error(error);
      setCreatorCodeMessage(error instanceof Error ? error.message : "Nao foi possivel remover o coupon/gift card.");
    } finally {
      setRemovingCouponCode(false);
    }
  }

  async function handleCheckout() {
    if (!basketIdent || rows.length === 0) return;
    try {
      setBusy(true);
      await launchTebexCheckoutFromBasket(basketIdent);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="hidden">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <a href="/" className="flex flex-col items-start transition-opacity hover:opacity-85">
            <span className="text-base font-bold tracking-[0.2em] uppercase" style={{ fontFamily: "'Cinzel', serif", color: "#b89458" }}>
              The Wanted
            </span>
            <span className="text-[10px] tracking-[0.35em] uppercase text-foreground/50 -mt-0.5">Sole Studio</span>
          </a>
          <div className="flex items-center gap-3">
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
              className="h-10 rounded-full border border-primary/20 bg-card px-4 text-xs font-semibold text-foreground/75 outline-none"
            >
              {CURRENCIES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <a href="/account" className="hidden sm:inline-flex h-10 items-center rounded-full border border-primary/20 px-4 text-xs font-semibold text-primary">
              Account
            </a>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-14">
        <div className="text-center mb-10">
          <SectionTag>Checkout</SectionTag>
          <h1 className="mt-5 text-4xl lg:text-5xl font-bold text-foreground/95" style={{ fontFamily: "'Raleway', sans-serif" }}>
            Sua Cesta
          </h1>
          <p className="mt-3 text-xl font-bold text-primary">
            Total: {formatCurrencyValue(basketTotal, basketCurrency)}
          </p>
        </div>

        <div className="rounded-[28px] border border-border bg-card shadow-[0_22px_80px_rgba(32,32,32,0.08)] overflow-hidden">
          <div className="grid grid-cols-[1fr_160px_140px] bg-gradient-to-r from-[#c7a56a] to-[#b89458] text-primary-foreground text-sm font-semibold">
            <div className="px-5 py-4">Nome</div>
            <div className="px-5 py-4 border-l border-white/20">Preço</div>
            <div className="px-5 py-4 border-l border-white/20">Ação</div>
          </div>

          {loading ? (
            <div className="px-5 py-8 text-center text-muted-foreground">Carregando cesta...</div>
          ) : rows.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-muted-foreground mb-5">Sua cesta está vazia.</p>
              <a href="/#products" className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
                Ver produtos
              </a>
            </div>
          ) : rows.map((row: any, index: number) => {
            const packageId = getBasketRowPackageId(row);
            const rowKey = packageId || String(index);
            return (
              <div key={rowKey} className="grid grid-cols-[1fr_160px_140px] text-sm text-foreground/75 border-t border-border first:border-t-0">
                <div className="px-5 py-4 border-r border-border">{getBasketRowName(row)}</div>
                <div className="px-5 py-4 border-r border-border">{formatCurrencyValue(getBasketRowPrice(row, basket), basketCurrency)}</div>
                <div className="px-5 py-3">
                  <button
                    type="button"
                    onClick={() => handleRemoveCartItem(row)}
                    disabled={removingItem === packageId}
                    className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-500 transition-all hover:bg-red-500/5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <X size={12} />
                    {removingItem === packageId ? "Removendo..." : "Remover"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-[28px] border border-border bg-card p-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Coupon/Gift Card</p>
              <h2 className="text-xl font-bold text-foreground/90" style={{ fontFamily: "'Raleway', sans-serif" }}>
                Aplicar coupon/gift card
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Digite o nome público ou o código original. Se existir no admin, o site aplica automaticamente o código original da Tebex.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 lg:min-w-[560px]">
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleApplyCreatorCode();
                }}
                placeholder="Digite seu coupon/gift card"
                className="h-11 flex-1 rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary/40"
              />
              <button
                onClick={handleApplyCreatorCode}
                disabled={!couponCode.trim() || applyingCreatorCode || removingCouponCode}
                className="h-11 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                {applyingCreatorCode ? "Aplicando..." : "Aplicar"}
              </button>
              <button
                onClick={handleRemoveCreatorCode}
                disabled={!basketIdent || applyingCreatorCode || removingCouponCode}
                className="h-11 rounded-xl border border-red-500/25 px-5 text-sm font-semibold text-red-500 transition-all hover:bg-red-500/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {removingCouponCode ? "Removendo..." : "Remover"}
              </button>
            </div>
          </div>
          {creatorCodeMessage && (
            <p className="mt-4 rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-primary">
              {creatorCodeMessage}
            </p>
          )}
        </div>

        <div className="mt-8 rounded-[28px] border border-border bg-card p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Total</p>
            <p className="text-3xl font-bold text-primary" style={{ fontFamily: "'Cinzel', serif" }}>
              {formatCurrencyValue(basketTotal, basketCurrency)}
            </p>
          </div>
          <button
            onClick={handleCheckout}
            disabled={!basketIdent || rows.length === 0 || busy}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={16} />
            {busy ? "Abrindo..." : rows.length === 0 ? "Checkout vazio" : "Finalizar compra"}
          </button>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <a href="https://discord.gg/qE29trG84u" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Support on Discord</a>
          <MessageCircle size={26} className="text-primary" />
          <a href="mailto:vito123bolado86@gmail.com" className="hover:text-primary">Contact us</a>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-5 text-xs text-muted-foreground">
          <span className="text-muted-foreground/70">Tebex</span>
          <a href="https://checkout.tebex.io/impressum" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground/80 hover:text-primary">Impressum</a>
          <a href="https://checkout.tebex.io/terms" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground/80 hover:text-primary">Terms & Conditions</a>
          <a href="https://checkout.tebex.io/privacy" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground/80 hover:text-primary">Privacy Policy</a>
        </div>
      </main>
    </div>
  );
}

function AccountPage({ currency, onCurrencyChange }: { currency: CurrencyCode; onCurrencyChange: (currency: CurrencyCode) => void }) {
  const [basket, setBasket] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [basketError, setBasketError] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [removingItem, setRemovingItem] = useState<string | null>(null);
  const [summary, setSummary] = useState<any | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const loadBasket = useCallback(async () => {
    try {
      setLoading(true);
      setBasketError(null);
      const basketIdent = getStoredTebexBasket();
      if (!basketIdent) {
        setBasket(null);
        return;
      }
      const payload = await fetchTebexBasket(basketIdent);
      setBasket(payload);
    } catch (error) {
      console.error(error);
      setBasketError(error instanceof Error ? error.message : "Nao foi possivel carregar a conta Tebex.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBasket();
  }, [loadBasket]);

  const rows = getBasketItems(basket);
  const basketIdent = basket?.ident ?? getStoredTebexBasket();
  const basketCurrency = (basket?.currency?.iso_4217 ?? basket?.currency ?? currency) as CurrencyCode;
  const basketTotal = getBasketTotal(basket);
  const username = getTebexAccountName(basket) || "Conta não conectada";
  const isLoggedIn = !!basketIdent && !!basket;

useEffect(() => {
  const usernameId = basket?.username_id ? String(basket.username_id) : null;
  const currentBasket = basket?.ident ?? getStoredTebexBasket();
  if (!currentBasket && !usernameId) return;

  let cancelled = false;
  setSummaryLoading(true);
  setSummaryError(null);

  fetchAccountSummary(currentBasket, usernameId)
    .then((payload) => {
      if (!cancelled) setSummary(payload);
    })
    .catch((error) => {
      console.error(error);
      if (!cancelled) setSummaryError(error instanceof Error ? error.message : "Nao foi possivel carregar pedidos.");
    })
    .finally(() => {
      if (!cancelled) setSummaryLoading(false);
    });

  return () => {
    cancelled = true;
  };
}, [basket?.ident, basket?.username_id]);

const orders = summary?.orders ?? [];


  async function handleLogin() {
    setBusy("login");
    try {
      await startTebexLogin();
    } finally {
      setBusy(null);
    }
  }

  async function handleCheckout() {
    try {
      setBusy("checkout");
      if (!basketIdent) {
        await handleLogin();
        return;
      }
      await launchTebexCheckoutFromBasket(basketIdent);
    } catch (error) {
      console.error(error);
      window.alert(error instanceof Error ? error.message : "Nao foi possivel abrir o checkout.");
    } finally {
      setBusy(null);
    }
  }

  async function handleApplyCoupon() {
    if (!basketIdent || !couponCode.trim()) return;
    try {
      setBusy("coupon");
      const updated = await applyCouponToTebexBasket(basketIdent, couponCode.trim());
      setBasket(updated);
      setCouponCode("");
    } catch (error) {
      console.error(error);
      window.alert(error instanceof Error ? error.message : "Nao foi possivel aplicar o cupom.");
    } finally {
      setBusy(null);
    }
  }

  async function handleRemoveCartItem(row: any) {
    if (!basketIdent) return;

    const packageId = getBasketRowPackageId(row);

    if (!packageId) {
      window.alert("Nao foi possivel identificar o package_id deste item.");
      return;
    }

    try {
      setRemovingItem(packageId);
      const updatedBasket = await removePackageFromTebexBasket(basketIdent, packageId);
      setBasket(updatedBasket);
    } catch (error) {
      console.error(error);
      window.alert(error instanceof Error ? error.message : "Nao foi possivel remover o item.");
      await loadBasket();
    } finally {
      setRemovingItem(null);
    }
  }

  function handleLogout() {
    clearTebexSession();
    setBasket(null);
    setSummary(null);
    setSummaryError(null);
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="hidden">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <a href="/" className="flex flex-col items-start transition-opacity hover:opacity-85">
            <span className="text-base font-bold tracking-[0.2em] uppercase" style={{ fontFamily: "'Cinzel', serif", color: "#b89458" }}>
              The Wanted
            </span>
            <span className="text-[10px] tracking-[0.35em] uppercase text-foreground/50 -mt-0.5">Sole Studio</span>
          </a>

          <nav className="hidden lg:flex items-center gap-6 text-sm text-foreground/70">
            <a href="/" className="hover:text-primary transition-colors">Início</a>
            <a href="/#products" className="hover:text-primary transition-colors">Scripts</a>
            <a href="https://docs.thewantedsolestudio.workers.dev" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Docs</a>
          </nav>

          <div className="flex items-center gap-3">
            {isLoggedIn && (
              <div className="hidden md:inline-flex h-10 items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 text-xs font-semibold text-primary">
                <User size={14} />
                <span className="max-w-[140px] truncate">{username}</span>
              </div>
            )}
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
              className="h-10 rounded-full border border-primary/20 bg-card px-4 text-xs font-semibold text-foreground/75 outline-none"
            >
              {CURRENCIES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <a href="/checkout" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 h-10 text-primary-foreground text-sm font-semibold">
              <ShoppingCart size={15} />
              {formatCurrencyValue(basketTotal, basketCurrency)}
            </a>
            {isLoggedIn && (
              <button onClick={handleLogout} className="inline-flex h-10 items-center gap-2 rounded-full border border-red-500/20 px-4 text-xs font-semibold text-red-500 hover:bg-red-500/5">
                <LogOut size={14} />
                Sair
              </button>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 xl:grid-cols-[250px_minmax(0,1fr)] gap-8">
          <aside className="rounded-2xl border border-border bg-card p-4 shadow-[0_18px_50px_rgba(32,32,32,0.06)]">
            <div className="flex items-center gap-3 px-2 py-3 border-b border-border">
              <div className="h-10 w-10 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold">{username.charAt(0).toUpperCase() || "U"}</div>
              <div>
                <div className="font-semibold text-foreground/90">{username}</div>
                <div className="text-xs text-muted-foreground">{isLoggedIn ? "Conta Tebex conectada" : "Conta / Tebex"}</div>
              </div>
            </div>

            <div className="py-4 space-y-2">
              <button className="w-full flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">
                <Package size={16} />
                Scripts
              </button>
            </div>

            <div className="space-y-3 pt-2">
              <button onClick={handleLogin} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">
                <LogIn size={16} />
                {busy === "login" ? "Conectando..." : isLoggedIn ? "Reconectar Tebex" : "Login com Tebex"}
              </button>
              <button onClick={loadBasket} className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground/70">
                <ArrowRight size={16} />
                Atualizar
              </button>
              {isLoggedIn && (
                <button onClick={handleLogout} className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-500/5">
                  <LogOut size={16} />
                  Sair da conta
                </button>
              )}
            </div>
          </aside>

          <section className="relative overflow-hidden rounded-[28px] border border-border bg-card shadow-[0_22px_80px_rgba(32,32,32,0.08)]">
            <div
              className="absolute inset-y-0 right-0 w-[34%] bg-contain bg-right-bottom bg-no-repeat opacity-[0.62] pointer-events-none"
              style={{ backgroundImage: "url('/discord-bg.png')" }}
            />
            <div
              className="absolute inset-y-0 right-0 w-[40%] pointer-events-none"
              style={{ background: "linear-gradient(90deg, rgba(247,245,240,0) 0%, rgba(247,245,240,0.3) 25%, rgba(247,245,240,0.9) 100%)" }}
            />

            <div className="relative z-10 p-8 lg:p-10">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 mb-8">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-semibold tracking-widest uppercase text-primary/80 mb-4">
                    Account
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-foreground/95 mb-2" style={{ fontFamily: "'Raleway', sans-serif" }}>
                    Área do Cliente
                  </h1>
                  <p className="text-sm lg:text-base text-muted-foreground max-w-2xl">
                    Gerencie sua cesta, acompanhe suas compras e finalize seus pedidos com segurança pela Tebex.
                  </p>
                </div>


              </div>

              <div className="mb-8">
                <div className="rounded-2xl border border-primary/15 bg-primary/5 p-6">
                  <div className="flex items-center gap-3 text-foreground/85 font-semibold mb-3">
                    <Github size={18} className="text-primary" />
                    Status da integração Tebex
                  </div>
                  {loading ? (
                    <p className="text-muted-foreground">Carregando basket...</p>
                  ) : basketError ? (
                    <p className="text-red-500">{basketError}</p>
                  ) : basket ? (
                    <div className="space-y-2 text-sm text-foreground/75">
                      <p>Basket ID: <span className="font-semibold text-foreground">{basket.ident}</span></p>
                      <p>Conta: <span className="font-semibold text-foreground">{username}</span></p>
                      <p>Total atual: <span className="font-semibold text-foreground">{formatCurrencyValue(basketTotal, basketCurrency)}</span></p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Nenhuma sessão Tebex encontrada ainda. Faça o login para criar e vincular o basket.</p>
                  )}
                </div>
              </div>


<div className="mb-8 rounded-2xl border border-border bg-background/70 p-6">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
    <div>
      <h2 className="text-2xl font-bold text-foreground/92" style={{ fontFamily: "'Raleway', sans-serif" }}>
        Histórico de compras
      </h2>
      <p className="text-sm text-muted-foreground">
        Pedidos reais chegam aqui pelo webhook da Tebex no Worker.
      </p>
    </div>
    {summaryLoading && <span className="text-xs text-muted-foreground">Sincronizando...</span>}
  </div>

  {summaryError ? (
    <p className="text-sm text-red-500">{summaryError}</p>
  ) : orders.length > 0 ? (
    <div className="space-y-3">
      {orders.map((order: any, index: number) => (
        <div key={index} className="rounded-xl border border-border bg-card p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="font-semibold text-foreground/90">{order.transactionId ?? order.transId ?? order.id ?? "Pedido Tebex"}</p>
              <p className="text-xs text-muted-foreground">{order.status ?? "completed"} · {order.createdAt ?? order.created_at ?? "sem data"}</p>
            </div>
            <p className="font-bold text-primary">{formatCurrencyValue(Number(order.total ?? 0), order.currency ?? basketCurrency)}</p>
          </div>
          {Array.isArray(order.items) && order.items.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {order.items.map((item: any, itemIndex: number) => (
                <span key={itemIndex} className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-primary">
                  {item.productName ?? item.name ?? "Produto"}{item.quantity ? ` ×${item.quantity}` : ""}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  ) : (
    <p className="text-sm text-muted-foreground">
      Nenhuma compra sincronizada ainda. Depois que a Tebex enviar o webhook de pagamento concluído, o pedido aparece aqui.
    </p>
  )}
</div>

              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-2xl font-bold text-foreground/92" style={{ fontFamily: "'Raleway', sans-serif" }}>
                  Itens no carrinho / conta
                </h2>
                <div className="hidden md:flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                  <Shield size={14} className="text-primary" />
                  Headless API + Tebex.js
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-border">
                <div className="grid grid-cols-[130px_1fr_140px_130px] bg-gradient-to-r from-[#c7a56a] to-[#b89458] text-primary-foreground text-sm font-semibold">
                  <div className="px-5 py-4">Tipo</div>
                  <div className="px-5 py-4 border-l border-white/20">Nome</div>
                  <div className="px-5 py-4 border-l border-white/20">Preço</div>
                  <div className="px-5 py-4 border-l border-white/20">Ação</div>
                </div>
                <div className="bg-card">
                  {rows.length === 0 ? (
                    <div className="grid grid-cols-[130px_1fr_140px_130px] text-sm text-foreground/70">
                      <div className="px-5 py-5 border-r border-border">—</div>
                      <div className="px-5 py-5 border-r border-border">Nenhum item adicionado ainda.</div>
                      <div className="px-5 py-5 border-r border-border">{formatCurrencyValue(0, basketCurrency)}</div>
                      <div className="px-5 py-5">—</div>
                    </div>
                  ) : rows.map((row: any, index: number) => {
                    const packageId = getBasketRowPackageId(row);
                    const rowKey = packageId || String(index);
                    return (
                      <div key={rowKey} className="grid grid-cols-[130px_1fr_140px_130px] text-sm text-foreground/75 border-t border-border first:border-t-0">
                        <div className="px-5 py-4 border-r border-border">{row?.type ?? "package"}</div>
                        <div className="px-5 py-4 border-r border-border">{getBasketRowName(row)}</div>
                        <div className="px-5 py-4 border-r border-border">{formatCurrencyValue(getBasketRowPrice(row, basket), basketCurrency)}</div>
                        <div className="px-5 py-3">
                          <button
                            type="button"
                            onClick={() => handleRemoveCartItem(row)}
                            disabled={removingItem === packageId}
                            className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-500 transition-all hover:bg-red-500/5 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <X size={12} />
                            {removingItem === packageId ? "Removendo..." : "Remover"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-border bg-background/70 p-5">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Moeda</p>
                  <p className="text-2xl font-bold text-foreground">{basketCurrency}</p>
                </div>
                <div className="rounded-2xl border border-border bg-background/70 p-5">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Subtotal</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrencyValue(basketTotal, basketCurrency)}</p>
                </div>
                <div className="rounded-2xl border border-border bg-background/70 p-5">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Checkout</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrencyValue(basketTotal, basketCurrency)}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeSection, setActiveSection] = useState("hero");
  const [language, setLanguage] = useState<SiteLanguage>(() => getStoredSiteLanguage());
  const [currency, setCurrency] = useState<CurrencyCode>(() => getStoredCurrency());
  const [pathname, setPathname] = useState(() => window.location.pathname);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    storeSiteLanguage(language);
    document.documentElement.lang = language === "pt_BR" ? "pt-BR" : "en";
  }, [language]);

  useEffect(() => {
    const applyTranslation = () => translateStaticText(language);
    applyTranslation();

    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(applyTranslation);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return () => observer.disconnect();
  }, [language, pathname, selectedProduct, activeSection]);

  useEffect(() => {
    storeCurrency(currency);
  }, [currency]);

  useEffect(() => {
    if (pathname !== "/") return;

    const handleHashScroll = () => {
      const id = window.location.hash.replace("#", "");
      if (!id) return;

      window.requestAnimationFrame(() => {
        window.setTimeout(() => scrollTo(id), 80);
      });
    };

    handleHashScroll();
    window.addEventListener("hashchange", handleHashScroll);

    return () => window.removeEventListener("hashchange", handleHashScroll);
  }, [pathname, productsLoading, scrollTo]);

  useEffect(() => {
    let cancelled = false;
    setProductsLoading(true);
    setProductsError(null);

    fetchPublicProducts()
      .then((rows) => {
        if (!cancelled) setProducts(rows);
      })
      .catch((error) => {
        console.error(error);
        if (!cancelled) {
          setProductsError(error instanceof Error ? error.message : "Nao foi possivel carregar produtos da API.");
          setProducts(PRODUCTS);
        }
      })
      .finally(() => {
        if (!cancelled) setProductsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const sections = ["hero", "why", "products", "faq"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const basketIdent = params.get("tebexBasket");
    const packageId = params.get("tebexPackage");

    if (!basketIdent) return;
    storeTebexBasket(basketIdent);

    const cleanUrl = new URL(window.location.href);
    cleanUrl.searchParams.delete("tebexBasket");
    cleanUrl.searchParams.delete("tebexPackage");
    window.history.replaceState({}, "", cleanUrl.toString());
    setPathname(window.location.pathname);

    if (!packageId) return;

    launchTebexCheckoutFromBasket(basketIdent, packageId).catch((error) => {
      console.error(error);
      window.alert(error instanceof Error ? error.message : "Nao foi possivel abrir o checkout da Tebex.");
    });
  }, []);

  const navigateFromPage = (section: string) => {
    if (section === "hero") {
      window.location.href = "/";
      return;
    }

    window.location.href = `/#${section}`;
  };

  const renderPageWithNavbar = (content: React.ReactNode) => (
    <div
      className="min-h-screen bg-background text-foreground antialiased"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Navbar
        onNavigate={navigateFromPage}
        activeSection={activeSection}
        onLogin={() => { window.location.href = "/login"; }}
        onCart={() => { window.location.href = "/checkout"; }}
        language={language}
        onLanguageChange={setLanguage}
        currency={currency}
        onCurrencyChange={setCurrency}
      />
      <div className="pt-16">
        {content}
      </div>
    </div>
  );

  if (pathname === "/terms" || pathname === "/terms-of-use") {
    return renderPageWithNavbar(<TermsPage language={language} />);
  }

  if (pathname === "/privacy-policy" || pathname === "/privacy") {
    return renderPageWithNavbar(<PrivacyPolicyPage language={language} />);
  }

  if (pathname === "/about" || pathname === "/about-us") {
    return renderPageWithNavbar(<AboutPage language={language} />);
  }

  if (pathname === "/docs" || pathname === "/documentation") {
    return renderPageWithNavbar(<DocsPage language={language} />);
  }

  if (pathname === "/admin/docs") {
    return renderPageWithNavbar(<DocsAdminPage />);
  }

  const productRouteMatch = pathname.match(/^\/(script|scripts|custom-peds|systems|outfit-creator|add-ons)\/(.+)$/);
  if (productRouteMatch) {
    const requestedSlug = decodeURIComponent(productRouteMatch[2] ?? "");
    const matchedProduct = products.find((product) =>
      slugifyClient(product.name) === slugifyClient(requestedSlug) ||
      product.id === requestedSlug ||
      product.name.toLowerCase() === requestedSlug.toLowerCase()
    );

    if (productsLoading) {
      return renderPageWithNavbar(
        <main className="max-w-7xl mx-auto px-6 py-20 text-center text-muted-foreground">
          Carregando produto...
        </main>
      );
    }

    if (!matchedProduct) {
      return renderPageWithNavbar(
        <main className="max-w-7xl mx-auto px-6 py-20 text-center">
          <SectionTag>Produto</SectionTag>
          <h1 className="mt-5 text-3xl font-bold text-foreground/90">Produto não encontrado</h1>
          <a href="/#products" className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
            Ver produtos
          </a>
        </main>
      );
    }

    return renderPageWithNavbar(<ProductPage product={matchedProduct} currency={currency} language={language} />);
  }

  if (pathname === "/login") {
    return renderPageWithNavbar(<LoginPage currency={currency} onCurrencyChange={setCurrency} />);
  }

  if (pathname === "/checkout") {
    return renderPageWithNavbar(<CheckoutPage currency={currency} onCurrencyChange={setCurrency} />);
  }

  if (pathname === "/account") {
    if (getAdminToken()) {
      window.location.href = "/admin";
      return null;
    }
    return renderPageWithNavbar(<AccountPage currency={currency} onCurrencyChange={setCurrency} />);
  }

  if (pathname === "/admin") {
    return renderPageWithNavbar(<AdminPage currency={currency} onCurrencyChange={setCurrency} />);
  }

  return (
    <div
      className="min-h-screen bg-background text-foreground antialiased"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.2); border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(201,168,76,0.4); }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <Navbar
        onNavigate={scrollTo}
        activeSection={activeSection}
        onLogin={() => { window.location.href = "/login"; }}
        onCart={() => { window.location.href = "/checkout"; }}
        language={language}
        onLanguageChange={setLanguage}
        currency={currency}
        onCurrencyChange={setCurrency}
      />
      <HeroSection onNavigate={scrollTo} />
      <WhySection language={language} />

      {/* Thin gold divider */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <ProductsSection
        products={products}
        loading={productsLoading}
        error={productsError}
        currency={currency}
        language={language}
        onSelectProduct={setSelectedProduct}
      />

      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <DiscordSection />
      <FAQSection />
      <Footer onNavigate={scrollTo} />

      {/* Product Detail Panel */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          currency={currency}
          language={language}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
