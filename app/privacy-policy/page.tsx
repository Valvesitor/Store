import { LegalPage } from "@/components/legal-page"
import { privacySections } from "@/lib/legal-content"

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Politica de Privacidade"
      description="Como a The Wanted Sole Studio trata informacoes relacionadas a navegacao, contas, compras, suporte, integracoes Tebex e produtos digitais."
      sections={privacySections}
      showTebexLinks
    />
  )
}
