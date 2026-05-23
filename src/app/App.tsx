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
  "Imagens/vídeos, uma URL por linha": "Images/videos, one URL per line",
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


  const links = [
    { label: "Início", id: "hero" },
    { label: "Scripts", id: "products" },
    { label: "Custom Peds", id: "custom-peds" },
    { label: "Documentação", id: "docs", external: true, url: "https://docs.thewantedsolestudio.workers.dev" },
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
                target="_blank"
                rel="noopener noreferrer"
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
          {accountName ? (
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
          ) : adminLoggedIn ? (
            <div className="inline-flex h-9 items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2">
              <a
                href="/admin"
                className="inline-flex items-center gap-2 px-2 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
                title="Abrir painel admin"
              >
                <Shield size={14} />
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
                {accountName ? (
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
                ) : adminLoggedIn ? (
                  <div className="flex-1 flex gap-2">
                    <a
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full
                        border border-primary/20 bg-primary/5 text-sm font-semibold text-primary"
                    >
                      <Shield size={14} />
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
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
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
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-25"
          style={{
            background: "radial-gradient(ellipse at center top, rgba(201,168,76,0.14) 0%, transparent 70%)"
          }}
        />
        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48"
          style={{ background: "linear-gradient(to bottom, transparent, #f7f5f0)" }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
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
          className="text-lg text-foreground/55 max-w-2xl mx-auto mb-10 leading-relaxed"
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
          className="flex flex-wrap items-center justify-center gap-3 mb-14"
        >
          <GoldButton onClick={() => onNavigate("products")} className="px-7 py-3 text-base">
            Ver Produtos
            <ArrowRight size={15} />
          </GoldButton>
          <GhostButton href="https://discord.gg/qE29trG84u" external className="px-7 py-3 text-base">
            <MessageCircle size={15} />
            Acessar Discord
          </GhostButton>
          <GhostButton href="https://docs.thewantedsolestudio.workers.dev" external className="px-7 py-3 text-base">
            <BookOpen size={15} />
            Documentação
          </GhostButton>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-6"
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
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-foreground/25 hover:text-foreground/50 transition-colors"
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
    <section id="why" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <SectionTag>{language === "en_US" ? "Why choose us" : "Por que nos escolher"}</SectionTag>
          <h2
            className="mt-5 text-3xl lg:text-4xl font-bold text-foreground/90"
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
        <div className="relative z-10 p-4 rounded-sm border border-primary/20 bg-primary/10
          group-hover:border-primary/40 group-hover:bg-primary/15 transition-all duration-300">
          <Icon size={24} className="text-primary" />
        </div>
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
    <section id="products" className="py-28 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
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
  const Icon = ICON_MAP[product.iconName] ?? Package;
  const media = (product.media ?? []).map((item) => {
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

  return (
    <div
      className="relative flex h-[560px] flex-col overflow-hidden bg-background"
      style={{ background: `linear-gradient(135deg, ${product.gradientFrom}, ${product.gradientTo})` }}
    >
      <div className="relative min-h-0 flex-1 overflow-visible px-14 sm:px-16 lg:px-[72px]">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(201,168,76,0.12) 1px, transparent 0)",
            backgroundSize: "24px 24px"
          }}
        />

        <div className="relative z-10 flex h-full min-h-0 items-center justify-center p-4 lg:p-5">
          {hasActiveMedia && activeMedia.type === "image" && (
            <img
              src={activeMedia.src}
              alt={activeMedia.alt}
              onError={() => setFailedMedia((prev) => ({ ...prev, [activeMedia.src]: true }))}
              className="max-h-full max-w-full object-contain"
            />
          )}

          {hasActiveMedia && activeMedia.type === "video" && !activeIsYouTube && (
            <video
              src={activeMedia.src}
              poster={activeMedia.poster}
              controls
              playsInline
              onError={() => setFailedMedia((prev) => ({ ...prev, [activeMedia.src]: true }))}
              className="max-h-full max-w-full rounded-xl bg-black object-contain shadow-[0_18px_55px_rgba(32,32,32,0.14)]"
            />
          )}

          {hasActiveMedia && activeIsYouTube && (
            <div className="aspect-video w-full max-w-5xl overflow-hidden rounded-xl bg-black shadow-[0_18px_55px_rgba(32,32,32,0.14)]">
              <iframe
                src={activeYouTubeEmbedUrl}
                title={activeMedia.alt}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          )}

          {!hasActiveMedia && (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <div className="p-4 rounded-sm border border-primary/25 bg-primary/10">
                <Icon size={28} className="text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-primary/80">
                  Galeria do Produto
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Adicione imagens e vídeos no painel admin.
                </p>
              </div>
            </div>
          )}
        </div>

        {canNavigate && (
          <>
            <button
              type="button"
              onClick={() => goToMedia("prev")}
              className="absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-primary/25 bg-card/95 text-primary shadow-[0_10px_22px_rgba(32,32,32,0.10)] backdrop-blur-sm transition-all hover:bg-primary hover:text-primary-foreground sm:left-3 lg:left-4"
              aria-label="Imagem anterior"
            >
              <ChevronRight size={19} className="rotate-180" />
            </button>

            <button
              type="button"
              onClick={() => goToMedia("next")}
              className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-primary/25 bg-card/95 text-primary shadow-[0_10px_22px_rgba(32,32,32,0.10)] backdrop-blur-sm transition-all hover:bg-primary hover:text-primary-foreground sm:right-3 lg:right-4"
              aria-label="Próxima imagem"
            >
              <ChevronRight size={19} />
            </button>

            <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-primary/20 bg-card/90 px-3 py-1 text-[11px] font-semibold text-muted-foreground backdrop-blur-sm">
              <span>{activeIndex + 1}</span>
              <span>/</span>
              <span>{media.length}</span>
            </div>
          </>
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
              Galeria pronta para receber imagens e vídeos deste produto.
            </div>
          )}
        </div>
      </div>
    </div>
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

function Footer({ onNavigate }: { onNavigate: (id: string) => void }) {
  const companyLinks = [
    { label: "About", action: () => onNavigate("why") },
    { label: "Terms of use", action: () => onNavigate("faq") },
    { label: "Privacy Policy", href: "https://checkout.tebex.io/privacy" },
  ];

  const quickLinks = [
    { label: "Início", action: () => onNavigate("hero") },
    { label: "Scripts", action: () => onNavigate("products") },
    { label: "Documentação", href: "https://docs.thewantedsolestudio.workers.dev" },
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
        target="_blank"
        rel="noopener noreferrer"
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
  const featuresText = product.features.join("\n");
  const featuresEnText = (product.featuresEn ?? []).join("\n");
  const requirementsText = product.requirements.join("\n");
  const requirementsEnText = (product.requirementsEn ?? []).join("\n");
  const mediaText = (product.media ?? []).map((item) => item.src).join("\n");

  const update = (patch: Partial<Product>) => onChange({ ...product, ...patch });

  return (
    <div className="rounded-[28px] border border-border bg-card p-6 lg:p-8 shadow-[0_22px_80px_rgba(32,32,32,0.08)]">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <SectionTag>Admin</SectionTag>
          <h2 className="mt-3 text-2xl font-bold text-foreground/95" style={{ fontFamily: "'Raleway', sans-serif" }}>
            {product.id.startsWith("new-") ? "Publicar novo produto" : "Editar produto"}
          </h2>
        </div>
        <button
          onClick={onSave}
          disabled={saving}
          className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Salvar e publicar"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Nome</span>
          <input value={product.name} onChange={(e) => update({ name: e.target.value })} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary/40" />
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Categoria</span>
          <select value={product.category} onChange={(e) => update({ category: e.target.value as Product["category"] })} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary/40">
            {CATEGORIES.filter((item) => item !== "Todos").map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Preço fallback</span>
          <input type="number" step="0.01" value={product.price} onChange={(e) => update({ price: Number(e.target.value), priceSource: "fallback" })} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary/40" />
          <span className="block text-[11px] leading-5 text-muted-foreground">Opcional. Se o Package ID Tebex estiver correto, o site puxa o preço automaticamente da Tebex.</span>
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</span>
          <select value={product.status} onChange={(e) => update({ status: e.target.value as ProductStatus })} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary/40">
            <option value="novo">Novo</option>
            <option value="popular">Popular</option>
            <option value="atualizado">Atualizado</option>
            <option value="em-breve">Em breve</option>
          </select>
        </label>

        <label className="space-y-2 lg:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Descrição curta</span>
          <input value={product.description} onChange={(e) => update({ description: e.target.value })} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary/40" />
        </label>

        <label className="space-y-2 lg:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Descrição completa</span>
          <textarea value={product.fullDescription} onChange={(e) => update({ fullDescription: e.target.value })} rows={4} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary/40" />
        </label>

        <div className="lg:col-span-2 mt-2 rounded-2xl border border-primary/15 bg-primary/5 p-4">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary/80">Versão em Inglês</p>
            <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
              Quando o cliente selecionar EN, o site usa estes campos para o produto.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <label className="space-y-2 lg:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Name EN</span>
              <input value={product.nameEn ?? ""} onChange={(e) => update({ nameEn: e.target.value })} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary/40" />
            </label>

            <label className="space-y-2 lg:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Short Description EN</span>
              <input value={product.descriptionEn ?? ""} onChange={(e) => update({ descriptionEn: e.target.value })} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary/40" />
            </label>

            <label className="space-y-2 lg:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Full Description EN</span>
              <textarea value={product.fullDescriptionEn ?? ""} onChange={(e) => update({ fullDescriptionEn: e.target.value })} rows={4} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary/40" />
            </label>

            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Features EN, one per line</span>
              <textarea value={featuresEnText} onChange={(e) => update({ featuresEn: e.target.value.split("\\n").map((line) => line.trim()).filter(Boolean) })} rows={5} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary/40" />
            </label>

            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Requirements EN, one per line</span>
              <textarea value={requirementsEnText} onChange={(e) => update({ requirementsEn: e.target.value.split("\\n").map((line) => line.trim()).filter(Boolean) })} rows={5} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary/40" />
            </label>
          </div>
        </div>

        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Package ID Tebex</span>
          <input value={product.packageId ?? ""} onChange={(e) => update({ packageId: e.target.value })} placeholder="7457637" className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary/40" />
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">URL Tebex</span>
          <input value={product.tebexUrl} onChange={(e) => update({ tebexUrl: e.target.value })} placeholder="https://.../package/..." className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary/40" />
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Features, uma por linha</span>
          <textarea value={featuresText} onChange={(e) => update({ features: e.target.value.split("\n").map((line) => line.trim()).filter(Boolean) })} rows={5} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary/40" />
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Requisitos, um por linha</span>
          <textarea value={requirementsText} onChange={(e) => update({ requirements: e.target.value.split("\n").map((line) => line.trim()).filter(Boolean) })} rows={5} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary/40" />
        </label>

        <label className="space-y-2 lg:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Imagens/vídeos, uma URL por linha</span>
          <textarea
            value={mediaText}
            onChange={(e) => update({
              media: e.target.value.split("\n").map((line) => line.trim()).filter(Boolean).map((src) => ({
                type: isYouTubeUrl(src) ? "youtube" : src.match(/\.(mp4|webm|mov)$/i) ? "video" : "image",
                src,
                alt: product.name || "Preview do produto"
              }))
            })}
            rows={4}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary/40"
          />
        </label>

        <div className="lg:col-span-2 flex flex-wrap gap-4">
          <label className="inline-flex items-center gap-2 text-sm text-foreground/75">
            <input type="checkbox" checked={product.visible !== false} onChange={(e) => update({ visible: e.target.checked })} />
            Visível na loja
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-foreground/75">
            <input type="checkbox" checked={product.featured === true} onChange={(e) => update({ featured: e.target.checked })} />
            Destaque
          </label>
        </div>
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
    <div className="mt-8 rounded-[28px] border border-border bg-card p-6 lg:p-8 shadow-[0_22px_80px_rgba(32,32,32,0.08)]">
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

      <div className="grid grid-cols-1 xl:grid-cols-[300px_minmax(0,1fr)] gap-6">
        <div className="space-y-3">
          {loading ? (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          ) : codes.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum coupon/gift card configurado.</p>
          ) : codes.map((code) => (
            <button
              key={code.id}
              onClick={() => setSelected(code)}
              className={`w-full rounded-2xl border p-4 text-left transition-all ${
                selected.id === code.id ? "border-primary/50 bg-primary/10" : "border-border hover:border-primary/25"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground/90">{code.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Original: {code.originalCode}</p>
                </div>
                <span className={`mt-2 h-2 w-2 rounded-full ${code.visible ? "bg-emerald-400" : "bg-red-400"}`} />
              </div>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  handleDeleteCreatorCode(code.id);
                }}
                className="mt-3 text-xs text-red-500 hover:underline"
              >
                Remover
              </button>
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-background/70 p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Nome público</span>
              <input
                value={selected.label}
                onChange={(e) => setSelected({ ...selected, label: e.target.value })}
                placeholder="Ex: Parceiro Oficial"
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary/40"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cupom/Gift Card original da Tebex</span>
              <input
                value={selected.originalCode}
                onChange={(e) => setSelected({ ...selected, originalCode: e.target.value })}
                placeholder="Ex: TWSCREATOR"
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary/40"
              />
            </label>
            <label className="md:col-span-2 inline-flex items-center gap-2 text-sm text-foreground/75">
              <input
                type="checkbox"
                checked={selected.visible}
                onChange={(e) => setSelected({ ...selected, visible: e.target.checked })}
              />
              Visível para clientes no checkout
            </label>
          </div>

          <button
            onClick={handleSaveCreatorCode}
            disabled={saving}
            className="mt-5 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar coupon/gift card"}
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

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="hidden">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <a href="/" className="flex flex-col items-start transition-opacity hover:opacity-85">
            <span className="text-base font-bold tracking-[0.2em] uppercase" style={{ fontFamily: "'Cinzel', serif", color: "#b89458" }}>
              The Wanted
            </span>
            <span className="text-[10px] tracking-[0.35em] uppercase text-foreground/50 -mt-0.5">Admin Studio</span>
          </a>

          <div className="flex items-center gap-3">
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
              className="h-10 rounded-full border border-primary/20 bg-card px-4 text-xs font-semibold text-foreground/75 outline-none"
            >
              {CURRENCIES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <button onClick={() => setSelected(emptyAdminProduct())} className="rounded-full border border-primary/30 px-4 h-10 text-sm font-semibold text-primary">
              Novo produto
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex h-9 items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-3 text-xs font-semibold text-foreground/45 transition-all hover:bg-background/60 hover:text-red-500"
              title="Sair"
            >
              <LogOut size={12} />
              Sair
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
          <div>
            <SectionTag>Admin Dashboard</SectionTag>
            <h1 className="mt-4 text-4xl font-bold text-foreground/95" style={{ fontFamily: "'Raleway', sans-serif" }}>
              Publicação de produtos
            </h1>
            <p className="mt-3 text-muted-foreground max-w-2xl">
              Cadastre produtos uma vez no admin. Eles aparecem automaticamente na vitrine pública, na categoria escolhida e com o package ID da Tebex.
            </p>
            {message && (
              <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
                {message}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setSelected(emptyAdminProduct());
                setMessage("Novo produto pronto para cadastro.");
              }}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground hover:brightness-105"
            >
              <Plus size={15} />
              Novo produto
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex h-9 items-center gap-1 rounded-full px-3 text-xs font-semibold text-foreground/45 transition-all hover:bg-background/60 hover:text-red-500"
              title="Sair"
            >
              <LogOut size={12} />
              Sair
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[330px_minmax(0,1fr)] gap-8">
          <aside className="rounded-[28px] border border-border bg-card p-5 shadow-[0_22px_80px_rgba(32,32,32,0.08)]">
            <div className="flex items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="font-bold text-foreground/90">Produtos</h2>
                {loading && <span className="text-xs text-muted-foreground">Carregando...</span>}
              </div>
              <button
                onClick={() => {
                  setSelected(emptyAdminProduct());
                  setMessage("Novo produto pronto para cadastro.");
                }}
                className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full border border-primary/30 px-3 text-xs font-semibold text-primary hover:bg-primary/5"
                title="Adicionar produto novo"
              >
                <Plus size={13} />
                Novo
              </button>
            </div>

            <div className="space-y-3 max-h-[720px] overflow-y-auto pr-1">
              {products.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum produto salvo ainda.</p>
              ) : products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => setSelected(product)}
                  className={`w-full text-left rounded-2xl border p-4 transition-all ${
                    selected.id === product.id ? "border-primary/50 bg-primary/10" : "border-border hover:border-primary/25"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground/90">{product.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{product.category} · {product.status}</p>
                    </div>
                    <span className={`h-2 w-2 mt-2 rounded-full ${product.visible === false ? "bg-red-400" : "bg-emerald-400"}`} />
                  </div>
                  <p className="mt-2 text-sm text-primary font-semibold">{formatProductPrice(product.price, currency, product.priceCurrency)}</p>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDelete(product.id);
                    }}
                    className="mt-3 text-xs text-red-500 hover:underline"
                  >
                    Apagar
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
            <CreatorCodeAdminPanel token={token} />
          </div>
        </div>
      </main>
    </div>
  );
}



function LoginPage({ currency, onCurrencyChange }: { currency: CurrencyCode; onCurrencyChange: (currency: CurrencyCode) => void }) {
  const [adminToken, setAdminToken] = useState("");

  function handleAdminLogin() {
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
              onClick={() => startTebexLogin("/account")}
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
  const [creatorCodes, setCreatorCodes] = useState<CreatorCode[]>([]);
  const [selectedCreatorCode, setSelectedCreatorCode] = useState("");
  const [creatorCodeMessage, setCreatorCodeMessage] = useState<string | null>(null);
  const [applyingCreatorCode, setApplyingCreatorCode] = useState(false);

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

  useEffect(() => {
    fetchCreatorCodes()
      .then((codes) => {
        setCreatorCodes(codes);
        if (codes.length > 0) {
          setSelectedCreatorCode((current) => current || codes[0].id);
        }
      })
      .catch((error) => {
        console.error(error);
        setCreatorCodes([]);
      });
  }, []);

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

    const selected = creatorCodes.find((code) => code.id === selectedCreatorCode);
    if (!selected) {
      setCreatorCodeMessage("Selecione um coupon/gift card válido.");
      return;
    }

    try {
      setApplyingCreatorCode(true);
      const updated = await applyCreatorCodeToBasket(basketIdent, selected.originalCode);
      setBasket(updated);
      setCreatorCodeMessage(`Coupon/Gift Card aplicado: ${selected.label}`);
    } catch (error) {
      console.error(error);
      setCreatorCodeMessage(error instanceof Error ? error.message : "Nao foi possivel aplicar o coupon/gift card.");
    } finally {
      setApplyingCreatorCode(false);
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
                Selecione o nome público. O site aplica na Tebex o cupom/gift card original configurado no admin.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 lg:min-w-[420px]">
              <select
                value={selectedCreatorCode}
                onChange={(e) => setSelectedCreatorCode(e.target.value)}
                disabled={creatorCodes.length === 0}
                className="h-11 flex-1 rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary/40"
              >
                {creatorCodes.length === 0 ? (
                  <option value="">Nenhum coupon/gift card configurado</option>
                ) : creatorCodes.map((code) => (
                  <option key={code.id} value={code.id}>{code.label}</option>
                ))}
              </select>
              <button
                onClick={handleApplyCreatorCode}
                disabled={creatorCodes.length === 0 || applyingCreatorCode}
                className="h-11 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                {applyingCreatorCode ? "Aplicando..." : "Aplicar"}
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
