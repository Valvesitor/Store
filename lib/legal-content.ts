export type LegalSection = {
  title: string
  paragraphs?: string[]
  list?: string[]
  highlight?: string
  warning?: string
  contacts?: Array<{ label: string; href: string }>
}

export const studioLinks = {
  about: "/about",
  terms: "/terms",
  privacy: "/privacy-policy",
  docs: "/docs",
}

export const tebexLegalLinks = {
  impressum: "https://checkout.tebex.io/impressum",
  terms: "https://checkout.tebex.io/terms",
  privacy: "https://checkout.tebex.io/privacy",
}

export const aboutSections: LegalSection[] = [
  {
    title: "1. Quem somos",
    paragraphs: [
      "A The Wanted Sole Studio e uma marca focada em criacao visual, customizacao digital e desenvolvimento de sistemas com identidade propria.",
      "Fundada por Vitor Alves, tambem conhecido como Valvesitor, a marca representa uma visao clara: entregar produtos com personalidade, visual profissional e funcionalidades realmente uteis.",
    ],
  },
  {
    title: "2. Nossa proposta",
    paragraphs: [
      "Nossa proposta e desenvolver produtos digitais que nao sejam apenas funcionais, mas tambem visualmente marcantes, organizados e faceis de utilizar.",
      "Cada projeto e pensado para ajudar servidores, lojas e criadores a apresentarem seus produtos de forma mais profissional, moderna e confiavel.",
    ],
  },
  {
    title: "3. O que fazemos",
    paragraphs: [
      "Desenvolvemos produtos digitais voltados principalmente para RedM, incluindo scripts, custom peds, sistemas visuais, paineis, interfaces, previews, ferramentas de organizacao e recursos personalizados.",
    ],
    list: [
      "Scripts e sistemas para servidores RedM;",
      "Custom peds e recursos visuais personalizados;",
      "Paineis, interfaces e ferramentas de organizacao;",
      "Documentacoes, previews e paginas para apresentacao de produtos;",
      "Solucoes digitais com foco em identidade visual e experiencia do usuario.",
    ],
  },
  {
    title: "4. Identidade",
    paragraphs: [
      "Acreditamos que cada projeto precisa ter uma identidade forte. Por isso, nossos produtos sao criados com atencao aos detalhes, mantendo uma aparencia propria e uma experiencia visual alinhada com a proposta da marca.",
    ],
    highlight:
      "Nosso foco e criar ferramentas que facam seu servidor, sua loja ou seu projeto se destacar.",
  },
  {
    title: "5. Estilo e tecnologia",
    paragraphs: [
      "Cada interface, painel e recurso visual e desenvolvido com foco em uma apresentacao moderna, elegante e organizada.",
      "Trabalhamos para transformar processos complexos em ferramentas mais simples, eficientes e preparadas para uso real.",
    ],
  },
  {
    title: "6. Nossa essencia",
    highlight: "Onde estilo, identidade e tecnologia sao forjados.",
    paragraphs: [
      "Essa e a essencia da The Wanted Sole Studio: criar ferramentas digitais com personalidade, organizacao e impacto visual.",
    ],
  },
  {
    title: "7. Contato",
    paragraphs: [
      "Quer conhecer nossos produtos, tirar duvidas ou solicitar suporte? Entre em contato pelos nossos canais oficiais.",
    ],
    contacts: [
      { label: "Discord", href: "https://discord.gg/qE29trG84u" },
      { label: "Website", href: "https://thewantedsolestudio.com" },
    ],
  },
]

export const termsSections: LegalSection[] = [
  {
    title: "1. Introducao",
    paragraphs: [
      "Bem-vindo a The Wanted Sole Studio. Estes Termos de Uso regulam o acesso e a utilizacao do nosso site, produtos digitais, scripts, custom peds, documentacoes, servicos e demais conteudos disponibilizados pela The Wanted Sole Studio.",
      "Ao acessar nosso site, realizar uma compra, baixar qualquer produto ou utilizar nossos servicos, voce declara que leu, entendeu e concorda com estes Termos.",
    ],
  },
  {
    title: "2. Sobre nossos produtos",
    paragraphs: [
      "A The Wanted Sole Studio trabalha com produtos digitais voltados principalmente para servidores RedM, incluindo scripts, sistemas, custom peds, interfaces, recursos visuais, documentacoes e arquivos relacionados.",
      "Todos os produtos sao digitais. Nao ha envio fisico. Apos a confirmacao do pagamento, o acesso podera ser liberado automaticamente pela plataforma de pagamento, painel do cliente, Discord, documentacao ou outro meio informado na pagina do produto.",
    ],
  },
  {
    title: "3. Conta, acesso e responsabilidade",
    paragraphs: [
      "Para acessar determinados produtos, recursos ou areas restritas, podera ser necessario utilizar uma conta, e-mail, Discord, Tebex ou outro metodo de identificacao.",
      "O usuario e responsavel por manter suas informacoes corretas, proteger seus acessos e garantir que terceiros nao utilizem sua conta sem autorizacao.",
    ],
  },
  {
    title: "4. Licenca de uso",
    paragraphs: [
      "Ao adquirir um produto da The Wanted Sole Studio, o usuario recebe uma licenca limitada, pessoal, revogavel, intransferivel e nao exclusiva para utilizar o produto conforme as condicoes descritas na pagina de venda, documentacao ou instrucoes fornecidas.",
    ],
    highlight:
      "A compra de um produto nao transfere propriedade intelectual, codigo-fonte, marca, design, conceito, estrutura ou qualquer direito autoral relacionado ao produto.",
  },
  {
    title: "5. Restricoes de uso",
    paragraphs: ["O usuario nao esta autorizado a:"],
    list: [
      "Revender, redistribuir, compartilhar, vazar ou doar qualquer produto adquirido;",
      "Publicar arquivos, codigos, links privados ou conteudos protegidos em grupos, foruns, Discords ou sites;",
      "Remover creditos, protecoes, licencas ou identificacoes dos produtos;",
      "Copiar, clonar ou reproduzir nossos sistemas, interfaces, layouts, nomes, marcas ou identidade visual;",
      "Realizar engenharia reversa, descompilacao ou tentativa de extracao indevida de codigo protegido;",
      "Compartilhar acesso de cliente, licenca ou arquivos com outras pessoas, servidores ou comunidades.",
    ],
    warning:
      "O descumprimento dessas regras podera resultar na suspensao do suporte, revogacao da licenca, bloqueio de acesso aos produtos e, quando necessario, medidas legais.",
  },
  {
    title: "6. Pagamentos e reembolsos",
    paragraphs: [
      "Os pagamentos podem ser processados por plataformas terceiras, como Tebex ou outros meios informados no momento da compra. A The Wanted Sole Studio nao armazena dados completos de cartao, dados bancarios ou informacoes financeiras sensiveis.",
      "Por se tratarem de produtos digitais, entregues ou disponibilizados apos a confirmacao da compra, nao oferecemos reembolso apos liberacao de acesso, download, envio dos arquivos ou ativacao da licenca.",
    ],
  },
  {
    title: "7. Suporte, atualizacoes e compatibilidade",
    paragraphs: [
      "O suporte cobre duvidas de instalacao, configuracao basica e problemas relacionados ao funcionamento original do produto.",
      "Nossos produtos sao desenvolvidos para funcionar conforme as informacoes descritas na pagina do produto e na documentacao oficial. O usuario e responsavel por verificar requisitos, dependencias, framework, versao do servidor e compatibilidade antes da compra.",
    ],
  },
  {
    title: "8. Plataformas terceiras",
    paragraphs: [
      "Nosso site e produtos podem utilizar ou direcionar para servicos de terceiros, como Tebex, Discord, GitHub, YouTube, Cloudflare, sistemas de pagamento ou documentacoes externas.",
      "A The Wanted Sole Studio nao se responsabiliza por politicas, funcionamento, disponibilidade, cobrancas ou decisoes tomadas por essas plataformas terceiras.",
    ],
  },
  {
    title: "9. Aceitacao dos termos",
    paragraphs: [
      "Ao continuar utilizando o site, comprar produtos ou acessar qualquer conteudo da The Wanted Sole Studio, voce confirma que leu, compreendeu e aceita integralmente estes Termos de Uso.",
    ],
  },
]

export const privacySections: LegalSection[] = [
  {
    title: "1. Introducao",
    paragraphs: [
      "A sua privacidade e importante para a The Wanted Sole Studio. Esta Politica de Privacidade explica como coletamos, usamos, armazenamos, protegemos e compartilhamos informacoes quando voce acessa nosso site, compra produtos digitais, utiliza recursos vinculados a Tebex, entra em contato pelo Discord ou usa nossos servicos.",
      "Ao utilizar nosso site, voce concorda com esta Politica de Privacidade.",
    ],
  },
  {
    title: "2. Informacoes que podemos coletar",
    paragraphs: [
      "Podemos coletar informacoes fornecidas voluntariamente pelo usuario, como nome, e-mail, usuario/ID do Discord, identificador de conta Tebex, historico de pedidos, mensagens enviadas ao suporte e informacoes necessarias para entrega de produtos digitais.",
      "Tambem podemos coletar informacoes tecnicas automaticamente, como endereco IP, navegador, sistema operacional, paginas acessadas, data e horario de acesso, idioma, moeda selecionada, cookies e dados de uso do site.",
    ],
  },
  {
    title: "3. Dados de pagamento",
    paragraphs: [
      "A The Wanted Sole Studio nao armazena dados completos de cartao, dados bancarios ou informacoes financeiras sensiveis. Pagamentos sao processados por plataformas terceiras, como Tebex ou outros provedores exibidos no checkout.",
      "Podemos receber apenas informacoes necessarias para identificar e confirmar pedidos, como ID da transacao, status do pagamento, produto comprado, valor, moeda, data da compra e dados basicos relacionados ao pedido.",
    ],
    highlight:
      "Nunca solicitaremos que voce envie dados completos de cartao por Discord, ticket ou mensagem privada.",
  },
  {
    title: "4. Como usamos suas informacoes",
    paragraphs: ["Podemos usar as informacoes coletadas para:"],
    list: [
      "Processar pedidos, liberar produtos digitais e validar compras;",
      "Exibir informacoes da sua conta, cesta, checkout e historico de compras;",
      "Prestar suporte tecnico, responder duvidas e resolver problemas;",
      "Prevenir fraudes, chargebacks indevidos, abuso de suporte ou violacao de licenca;",
      "Melhorar o site, os produtos, a documentacao e a experiencia do usuario;",
      "Enviar avisos importantes relacionados a compras, suporte, atualizacoes ou seguranca.",
    ],
  },
  {
    title: "5. Compartilhamento de informacoes",
    paragraphs: [
      "Podemos compartilhar informacoes com servicos necessarios para operacao do site e entrega dos produtos, como Tebex, Cloudflare, Discord, provedores de hospedagem, ferramentas de analise, sistemas de suporte e meios de pagamento.",
      "Tambem poderemos divulgar informacoes quando necessario para cumprir obrigacao legal, proteger nossos direitos, investigar violacoes dos Termos de Uso, prevenir fraude ou responder a solicitacoes legitimas de autoridades competentes.",
    ],
  },
  {
    title: "6. Cookies e seguranca",
    paragraphs: [
      "Podemos utilizar cookies, armazenamento local do navegador e tecnologias semelhantes para manter preferencias do usuario, como idioma, moeda, sessao, cesta, login, experiencia de navegacao e funcionalidades do site.",
      "Adotamos medidas tecnicas e organizacionais razoaveis para proteger informacoes contra acesso nao autorizado, alteracao, perda, uso indevido ou divulgacao indevida.",
    ],
  },
  {
    title: "7. Retencao e direitos do usuario",
    paragraphs: [
      "Podemos manter informacoes pelo tempo necessario para cumprir finalidades operacionais, suporte, prevencao de fraude, obrigacoes legais, registros de compra, auditoria, seguranca e defesa de direitos.",
      "Dependendo da legislacao aplicavel, voce podera solicitar acesso, correcao, atualizacao ou exclusao de determinadas informacoes pessoais mantidas pela The Wanted Sole Studio.",
    ],
  },
  {
    title: "8. Links e plataformas terceiras",
    paragraphs: [
      "Nosso site pode conter links ou integracoes com plataformas de terceiros, como Tebex, Discord, GitHub, YouTube, Cloudflare e paginas externas.",
      "A The Wanted Sole Studio nao controla as politicas de privacidade dessas plataformas. Recomendamos que voce leia as politicas de cada servico antes de fornecer informacoes.",
    ],
  },
  {
    title: "9. Contato",
    paragraphs: [
      "Em caso de duvidas sobre esta Politica de Privacidade ou sobre o tratamento de informacoes, entre em contato pelos canais oficiais da The Wanted Sole Studio.",
    ],
    contacts: [
      { label: "Discord", href: "https://discord.gg/qE29trG84u" },
      { label: "Website", href: "https://thewantedsolestudio.com" },
    ],
  },
]
