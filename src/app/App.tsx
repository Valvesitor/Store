import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, Menu, X, ExternalLink, BookOpen,
  MessageCircle, Star, Zap, Shield, Crown, ArrowRight,
  Package, Users, Palette, Code2, ChevronDown, Check,
  ChevronRight, Sparkles, LayoutGrid, Filter, LogIn, ShoppingCart,
  Play, Image as ImageIcon, Github
} from "lucide-react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = "Todos" | "Scripts" | "Custom Peds" | "Systems" | "Outfit / Creator" | "Add-ons" | "Free Resources";
type SortOrder = "recent" | "popular" | "price-asc" | "price-desc";
type ProductStatus = "novo" | "atualizado" | "popular" | "em-breve";
type SiteLanguage = "pt_BR" | "en_US";
type CurrencyCode = "EUR" | "USD" | "GBP" | "BRL";
type ProductMedia = {
  type: "image" | "video" | "youtube";
  src: string;
  poster?: string;
  alt: string;
};

interface Product {
  id: string;
  name: string;
  category: Exclude<Category, "Todos">;
  description: string;
  fullDescription: string;
  price: number;
  status: ProductStatus;
  tebexUrl: string;
  packageId?: string;
  docsUrl?: string;
  features: string[];
  requirements: string[];
  media?: ProductMedia[];
  gradientFrom: string;
  gradientTo: string;
  iconName: string;
  visible?: boolean;
  featured?: boolean;
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

function formatPrice(price: number, currency: CurrencyCode = "BRL") {
  if (price === 0) return "Grátis";
  return new Intl.NumberFormat(currency === "BRL" ? "pt-BR" : "en-US", {
    style: "currency",
    currency
  }).format(price);
}

function getStoredCurrency(): CurrencyCode {
  const value = window.localStorage.getItem(SITE_CURRENCY_KEY);
  return CURRENCIES.includes(value as CurrencyCode) ? (value as CurrencyCode) : "EUR";
}

function storeCurrency(currency: CurrencyCode) {
  window.localStorage.setItem(SITE_CURRENCY_KEY, currency);
}

function formatCurrencyValue(amount?: number, currency: CurrencyCode | string = "EUR") {
  if (typeof amount !== "number" || Number.isNaN(amount)) return "—";
  return new Intl.NumberFormat(currency === "BRL" ? "pt-BR" : "en-US", {
    style: "currency",
    currency
  }).format(amount);
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
const CURRENCIES: CurrencyCode[] = ["EUR", "USD", "GBP", "BRL"];
let tebexCheckoutLocale: SiteLanguage = "pt_BR";

function getStoredTebexBasket() {
  return window.localStorage.getItem(TEBEX_BASKET_KEY);
}

function storeTebexBasket(basketIdent: string) {
  window.localStorage.setItem(TEBEX_BASKET_KEY, basketIdent);
}

function getStoredSiteLanguage(): SiteLanguage {
  return window.localStorage.getItem(SITE_LANGUAGE_KEY) === "en_US" ? "en_US" : "pt_BR";
}

function storeSiteLanguage(language: SiteLanguage) {
  tebexCheckoutLocale = language;
  window.localStorage.setItem(SITE_LANGUAGE_KEY, language);
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

  const basketResponse = await fetch(`https://headless.tebex.io/api/accounts/${webstoreToken}/baskets`, {
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
  const packageResponse = await fetch(`https://headless.tebex.io/api/baskets/${basketIdent}/packages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      package_id: packageId,
      quantity: 1
    })
  });

  if (!packageResponse.ok) {
    throw new Error("Nao foi possivel adicionar o produto ao carrinho.");
  }

  const packagePayload = await packageResponse.json();
  return packagePayload?.data?.ident ?? packagePayload?.ident ?? basketIdent;
}

async function getTebexAuthUrl(basketIdent: string, packageId?: string) {
  const webstoreToken = getTebexWebstoreToken();
  const returnUrl = new URL(window.location.href);
  returnUrl.searchParams.set("tebexBasket", basketIdent);
  if (packageId) {
    returnUrl.searchParams.set("tebexPackage", packageId);
  }

  const authResponse = await fetch(
    `https://headless.tebex.io/api/accounts/${webstoreToken}/baskets/${basketIdent}/auth?returnUrl=${encodeURIComponent(returnUrl.toString())}`
  );

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
      const authUrl = await getTebexAuthUrl(basketIdent, product.packageId);
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

async function startTebexLogin() {
  try {
    const basketIdent = getStoredTebexBasket() ?? await createTebexBasket();
    storeTebexBasket(basketIdent);
    const authUrl = await getTebexAuthUrl(basketIdent);
    window.location.href = authUrl;
  } catch (error) {
    console.error(error);
    window.alert(error instanceof Error ? error.message : "Nao foi possivel iniciar o login da Tebex.");
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
  const response = await fetch(`https://headless.tebex.io/api/accounts/${webstoreToken}/baskets/${basketIdent}`);
  if (!response.ok) {
    throw new Error("Nao foi possivel carregar os dados do basket na Tebex.");
  }
  const payload = await response.json();
  return payload?.data ?? payload;
}

async function applyCouponToTebexBasket(basketIdent: string, couponCode: string) {
  const webstoreToken = getTebexWebstoreToken();

  const couponResponse = await fetch(`https://headless.tebex.io/api/accounts/${webstoreToken}/baskets/${basketIdent}/coupons`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ coupon_code: couponCode })
  });

  if (couponResponse.ok) {
    return fetchTebexBasket(basketIdent);
  }

  const couponError = await couponResponse.json().catch(() => null);

  const creatorResponse = await fetch(`https://headless.tebex.io/api/accounts/${webstoreToken}/baskets/${basketIdent}/creator-codes`, {
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


function getApiBaseUrl() {
  return (import.meta.env.VITE_ACCOUNT_API_BASE_URL ?? "").replace(/\/$/, "");
}

function apiUrl(path: string) {
  const base = getApiBaseUrl();
  return base ? `${base}${path}` : path;
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
}

function normalizeProductFromApi(item: any): Product {
  const media = Array.isArray(item.media)
    ? item.media
    : typeof item.media === "string" && item.media.trim()
      ? JSON.parse(item.media)
      : [];

  const features = Array.isArray(item.features)
    ? item.features
    : typeof item.features === "string" && item.features.trim()
      ? JSON.parse(item.features)
      : [];

  const requirements = Array.isArray(item.requirements)
    ? item.requirements
    : typeof item.requirements === "string" && item.requirements.trim()
      ? JSON.parse(item.requirements)
      : [];

  return {
    id: item.id ?? item.slug ?? crypto.randomUUID(),
    name: item.name ?? "Produto sem nome",
    category: item.category ?? "Scripts",
    description: item.description ?? "",
    fullDescription: item.fullDescription ?? item.full_description ?? item.description ?? "",
    price: Number(item.price ?? 0),
    status: item.status ?? "novo",
    tebexUrl: item.tebexUrl ?? item.tebex_url ?? "#",
    packageId: item.packageId ?? item.package_id ?? "",
    docsUrl: item.docsUrl ?? item.docs_url ?? "https://docs.thewantedsolestudio.workers.dev",
    features,
    requirements,
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

async function fetchPublicProducts() {
  const response = await fetch(apiUrl("/api/products"), { headers: { "Accept": "application/json" } });
  if (!response.ok) throw new Error("Nao foi possivel carregar os produtos.");
  const payload = await response.json();
  const rows = Array.isArray(payload) ? payload : payload.products ?? [];
  return rows.map(normalizeProductFromApi);
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
  return rows.map(normalizeProductFromApi);
}

async function saveAdminProduct(token: string, product: Product) {
  const editing = !!product.id && !product.id.startsWith("new-");
  const endpoint = editing ? `/api/admin/products/${encodeURIComponent(product.id)}` : "/api/admin/products";
  const productPayload = editing ? product : { ...product, id: undefined };

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

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

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
          <div className="inline-flex h-9 items-center rounded-full border border-primary/20 bg-background/40 p-0.5">
            {(["pt_BR", "en_US"] as SiteLanguage[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onLanguageChange(option)}
                className={`h-7 px-3 rounded-full text-[11px] font-semibold tracking-wide transition-all ${
                  language === option
                    ? "bg-primary text-primary-foreground shadow-[0_0_14px_rgba(201,168,76,0.22)]"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {option === "pt_BR" ? "PT" : "EN"}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onLogin}
            className="inline-flex h-9 items-center gap-2 px-3 rounded-full text-xs font-semibold
              text-foreground/60 hover:text-primary hover:bg-primary/5 transition-all"
          >
            <LogIn size={14} />
            Login
          </button>
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
                <div className="inline-grid grid-cols-2 rounded-full border border-primary/20 bg-background/40 p-0.5">
                  {(["pt_BR", "en_US"] as SiteLanguage[]).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => onLanguageChange(option)}
                      className={`h-8 px-4 rounded-full text-xs font-semibold transition-all ${
                        language === option
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      {option === "pt_BR" ? "PT" : "EN"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
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

function WhySection() {
  return (
    <section id="why" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <SectionTag>Por que nos escolher</SectionTag>
          <h2
            className="mt-5 text-3xl lg:text-4xl font-bold text-foreground/90"
            style={{ fontFamily: "'Raleway', sans-serif" }}
          >
            O Studio por trás do melhor
            <br />
            <span style={{ color: "#8b714b" }}>conteúdo para RedM</span>
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

function ProductCard({ product, onSelect }: { product: Product; onSelect: (p: Product) => void }) {
  const Icon = ICON_MAP[product.iconName] ?? Package;
  const status = STATUS_CONFIG[product.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="group relative flex flex-col rounded-sm border border-border bg-card
        hover:border-primary/30 hover:shadow-[0_0_32px_rgba(201,168,76,0.07)]
        transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={() => onSelect(product)}
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
          {product.name}
        </h3>

        {/* Description */}
        <p
          className="text-xs text-muted-foreground leading-relaxed flex-1"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {product.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
          <span
            className="text-base font-bold"
            style={{ color: product.price === 0 ? "#5d8a5d" : "#8b714b", fontFamily: "'Cinzel', serif" }}
          >
            {formatPrice(product.price)}
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
  onSelectProduct
}: {
  products: Product[];
  loading: boolean;
  error: string | null;
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
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
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
              <ProductCard key={product.id} product={product} onSelect={onSelectProduct} />
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

  return (
    <div
      className="h-full min-h-0 bg-background"
      style={{ background: `linear-gradient(135deg, ${product.gradientFrom}, ${product.gradientTo})` }}
    >
      <div className="relative h-[calc(100%-88px)] min-h-[360px] overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(201,168,76,0.12) 1px, transparent 0)",
            backgroundSize: "24px 24px"
          }}
        />
        {hasActiveMedia && activeMedia.type === "image" && (
          <img
            src={activeMedia.src}
            alt={activeMedia.alt}
            onError={() => setFailedMedia((prev) => ({ ...prev, [activeMedia.src]: true }))}
            className="relative z-10 h-full w-full object-contain"
          />
        )}
        {hasActiveMedia && activeMedia.type === "video" && !activeIsYouTube && (
          <video
            src={activeMedia.src}
            poster={activeMedia.poster}
            controls
            playsInline
            onError={() => setFailedMedia((prev) => ({ ...prev, [activeMedia.src]: true }))}
            className="relative z-10 h-full w-full object-contain bg-black"
          />
        )}
        {hasActiveMedia && activeIsYouTube && (
          <iframe
            src={activeYouTubeEmbedUrl}
            title={activeMedia.alt}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="relative z-10 h-full w-full bg-black"
          />
        )}
        {!hasActiveMedia && (
          <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4 text-center">
            <div className="p-5 rounded-sm border border-primary/25 bg-primary/10">
              <Icon size={34} className="text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-primary/80">
                Galeria do Produto
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Adicione imagens em public/products/{product.id}/
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="flex h-[88px] gap-3 overflow-x-auto border-t border-border px-6 py-4 scrollbar-none bg-card/90 backdrop-blur-sm">
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
              className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-sm border bg-card transition-all ${
                isActive ? "border-primary shadow-[0_0_18px_rgba(201,168,76,0.22)]" : "border-border hover:border-primary/40"
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
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ImageIcon size={14} />
            Galeria pronta para receber imagens e video deste produto.
          </div>
        )}
      </div>
    </div>
  );
}

function ProductDetail({ product, onClose }: { product: Product; onClose: () => void }) {
  const status = STATUS_CONFIG[product.status];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

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

        <div className="flex w-full flex-col overflow-y-auto bg-card lg:w-[560px] xl:w-[620px]">
          {/* Close */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-4
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

          <div className="lg:hidden">
            <ProductMediaGallery product={product} />
          </div>

          {/* Content */}
          <div className="flex-1 px-8 py-8 space-y-8">
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
              {product.name}
            </h2>
            <p
              className="max-w-3xl text-base text-muted-foreground leading-8"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {product.fullDescription}
            </p>
          </div>

          {/* Price + CTA */}
          <div className="flex flex-col gap-4 rounded-sm border border-primary/20 bg-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-[10px] tracking-widest uppercase text-muted-foreground mb-1"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Preço
              </div>
              <div
                className="text-2xl font-bold"
                style={{ color: product.price === 0 ? "#5d8a5d" : "#8b714b", fontFamily: "'Cinzel', serif" }}
              >
                {formatPrice(product.price)}
              </div>
            </div>
            <div className="flex gap-2">
              {product.docsUrl && (
                <GhostButton href={product.docsUrl} external>
                  <BookOpen size={13} />
                  Docs
                </GhostButton>
              )}
              <GoldButton onClick={() => launchTebexCheckout(product)}>
                {product.price === 0 ? "Download" : "Comprar"}
                <ArrowRight size={13} />
              </GoldButton>
            </div>
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
              {product.features.map((feat) => (
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
              {product.requirements.map((req) => (
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

          {/* Discord */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <GhostButton href="https://discord.gg/qE29trG84u" external className="flex-1 justify-center">
              <MessageCircle size={14} />
              Suporte via Discord
            </GhostButton>
            {product.docsUrl && (
              <GhostButton href={product.docsUrl} external className="flex-1 justify-center">
                <BookOpen size={14} />
                Ver Documentação
              </GhostButton>
            )}
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
  const links = [
    { label: "Início", action: () => onNavigate("hero") },
    { label: "Scripts", action: () => onNavigate("products") },
    { label: "Documentação", href: "https://docs.thewantedsolestudio.workers.dev" },
    { label: "Licença", action: () => onNavigate("faq") },
    { label: "Discord", href: "https://discord.gg/qE29trG84u" },
    { label: "Tebex", href: "#" },
  ];

  return (
    <footer className="border-t border-border py-14 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">
          {/* Brand */}
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

          {/* Links */}
          <nav className="flex flex-wrap gap-6 lg:gap-8">
            {links.map((link) =>
              link.href ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground/80 transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {link.label}
                </a>
              ) : (
                <button
                  key={link.label}
                  onClick={link.action}
                  className="text-sm text-muted-foreground hover:text-foreground/80 transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {link.label}
                </button>
              )
            )}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p
            className="text-xs text-muted-foreground/60"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            © 2026 The Wanted Sole Studio — Todos os direitos reservados.
          </p>
          <p
            className="text-xs text-muted-foreground/40"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
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
    category: "Scripts",
    description: "",
    fullDescription: "",
    price: 0,
    status: "novo",
    tebexUrl: "",
    packageId: "",
    docsUrl: "https://docs.thewantedsolestudio.workers.dev",
    features: [],
    requirements: [],
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
  const requirementsText = product.requirements.join("\n");
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
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Preço</span>
          <input type="number" step="0.01" value={product.price} onChange={(e) => update({ price: Number(e.target.value) })} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary/40" />
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
    if (!window.confirm("Ocultar/remover este produto da vitrine?")) return;
    setSaving(true);
    try {
      await deleteAdminProduct(token, productId);
      setSelected(emptyAdminProduct());
      await load();
      setMessage("Produto removido da vitrine.");
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
      <div className="sticky top-0 z-40 border-b border-border bg-background/92 backdrop-blur-md">
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
            <button onClick={handleLogout} className="rounded-full bg-primary px-4 h-10 text-sm font-semibold text-primary-foreground">
              Sair
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
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

        <div className="grid grid-cols-1 xl:grid-cols-[330px_minmax(0,1fr)] gap-8">
          <aside className="rounded-[28px] border border-border bg-card p-5 shadow-[0_22px_80px_rgba(32,32,32,0.08)]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-foreground/90">Produtos</h2>
              {loading && <span className="text-xs text-muted-foreground">Carregando...</span>}
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
                  <p className="mt-2 text-sm text-primary font-semibold">{formatCurrencyValue(product.price, currency)}</p>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDelete(product.id);
                    }}
                    className="mt-3 text-xs text-red-500 hover:underline"
                  >
                    Ocultar/remover
                  </button>
                </button>
              ))}
            </div>
          </aside>

          <ProductAdminForm
            product={selected}
            onChange={setSelected}
            onSave={handleSave}
            saving={saving}
          />
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

  const rows = basket?.rows ?? [];
  const basketIdent = basket?.ident ?? getStoredTebexBasket();
  const basketCurrency = (basket?.currency?.iso_4217 ?? basket?.currency ?? currency) as CurrencyCode;
  const basketTotal = basket?.total_price ?? basket?.price?.amount ?? basket?.price ?? 0;
  const username = basket?.username ?? basket?.username_id ?? "Conta não conectada";

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

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="sticky top-0 z-40 border-b border-border bg-background/92 backdrop-blur-md">
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
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
              className="h-10 rounded-full border border-primary/20 bg-card px-4 text-xs font-semibold text-foreground/75 outline-none"
            >
              {CURRENCIES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <button onClick={handleCheckout} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 h-10 text-primary-foreground text-sm font-semibold">
              <ShoppingCart size={15} />
              {formatCurrencyValue(basketTotal, basketCurrency)}
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 xl:grid-cols-[250px_minmax(0,1fr)] gap-8">
          <aside className="rounded-2xl border border-border bg-card p-4 shadow-[0_18px_50px_rgba(32,32,32,0.06)]">
            <div className="flex items-center gap-3 px-2 py-3 border-b border-border">
              <div className="h-10 w-10 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold">V</div>
              <div>
                <div className="font-semibold text-foreground/90">Valvesitor</div>
                <div className="text-xs text-muted-foreground">Conta / Tebex</div>
              </div>
            </div>

            <div className="py-4 space-y-2">
              <button className="w-full flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">
                <Package size={16} />
                Scripts
              </button>
              <button className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-foreground/65 hover:bg-muted transition-colors">
                <Code2 size={16} className="text-primary" />
                Creator Code
              </button>
            </div>

            <div className="space-y-3 pt-2">
              <button onClick={handleLogin} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">
                <LogIn size={16} />
                {busy === "login" ? "Conectando..." : "Login com Tebex"}
              </button>
              <button onClick={loadBasket} className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground/70">
                <ArrowRight size={16} />
                Atualizar
              </button>
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
                    Sua conta Tebex dentro do seu website
                  </h1>
                  <p className="text-sm lg:text-base text-muted-foreground max-w-2xl">
                    Inspirado na estrutura da Jumpon, mas com a identidade visual da The Wanted Sole Studio e fluxo ligado ao basket da Tebex.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button onClick={handleCheckout} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
                    <ShoppingCart size={16} />
                    {busy === "checkout" ? "Abrindo..." : "Checkout"}
                  </button>
                  <a href="https://docs.thewantedsolestudio.workers.dev" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-primary/20 px-5 py-3 text-sm font-semibold text-primary">
                    <BookOpen size={16} />
                    Docs
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 mb-8">
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

                <div className="rounded-2xl border border-border bg-background/70 p-6">
                  <p className="text-sm font-semibold text-foreground/85 mb-4">Cupom / creator code</p>
                  <div className="space-y-3">
                    <input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Digite seu cupom"
                      className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary/30"
                    />
                    <button onClick={handleApplyCoupon} className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">
                      {busy === "coupon" ? "Aplicando..." : "Aplicar cupom"}
                    </button>
                  </div>
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
                <div className="grid grid-cols-[180px_1fr_140px] bg-gradient-to-r from-[#c7a56a] to-[#b89458] text-primary-foreground text-sm font-semibold">
                  <div className="px-5 py-4">Tipo</div>
                  <div className="px-5 py-4 border-l border-white/20">Nome</div>
                  <div className="px-5 py-4 border-l border-white/20">Preço</div>
                </div>
                <div className="bg-card">
                  {rows.length === 0 ? (
                    <div className="grid grid-cols-[180px_1fr_140px] text-sm text-foreground/70">
                      <div className="px-5 py-5 border-r border-border">—</div>
                      <div className="px-5 py-5 border-r border-border">Nenhum item adicionado ainda.</div>
                      <div className="px-5 py-5">{formatCurrencyValue(0, basketCurrency)}</div>
                    </div>
                  ) : rows.map((row: any, index: number) => (
                    <div key={index} className="grid grid-cols-[180px_1fr_140px] text-sm text-foreground/75 border-t border-border first:border-t-0">
                      <div className="px-5 py-4 border-r border-border">{row?.type ?? "package"}</div>
                      <div className="px-5 py-4 border-r border-border">{row?.name ?? row?.package?.name ?? "Item Tebex"}</div>
                      <div className="px-5 py-4">{formatCurrencyValue(row?.total_price ?? row?.price ?? 0, basketCurrency)}</div>
                    </div>
                  ))}
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
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  useEffect(() => {
    storeSiteLanguage(language);
    document.documentElement.lang = language === "pt_BR" ? "pt-BR" : "en";
  }, [language]);

  useEffect(() => {
    storeCurrency(currency);
  }, [currency]);

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

  if (pathname === "/account") {
    return <AccountPage currency={currency} onCurrencyChange={setCurrency} />;
  }

  if (pathname === "/admin") {
    return <AdminPage currency={currency} onCurrencyChange={setCurrency} />;
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
        onLogin={() => { window.location.href = "/account"; }}
        onCart={openTebexCart}
        language={language}
        onLanguageChange={setLanguage}
        currency={currency}
        onCurrencyChange={setCurrency}
      />
      <HeroSection onNavigate={scrollTo} />
      <WhySection />

      {/* Thin gold divider */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <ProductsSection
        products={products}
        loading={productsLoading}
        error={productsError}
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
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
