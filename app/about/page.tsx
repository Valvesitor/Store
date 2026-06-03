import { LegalPage } from "@/components/legal-page"
import { aboutSections } from "@/lib/legal-content"

export default function AboutPage() {
  return (
    <LegalPage
      eyebrow="About"
      title="Sobre a The Wanted Sole Studio"
      description="Conheca a essencia do studio: uma marca criada para transformar ideias em experiencias digitais com identidade, estilo e tecnologia."
      sections={aboutSections}
    />
  )
}
