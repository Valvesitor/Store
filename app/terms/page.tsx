import { LegalPage } from "@/components/legal-page"
import { termsSections } from "@/lib/legal-content"

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Termos de Uso"
      description="Condicoes de uso, compra, licenca, suporte e acesso aos produtos digitais disponibilizados pela The Wanted Sole Studio."
      sections={termsSections}
      showTebexLinks
    />
  )
}
