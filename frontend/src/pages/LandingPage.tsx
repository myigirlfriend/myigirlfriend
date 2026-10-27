import { useState } from 'react'
import ChatPreview from '@components/landing/ChatPreview'
import CompanionsSection from '@components/landing/CompanionsSection'
import FactStrip from '@components/landing/FactStrip'
import FaqSection from '@components/landing/FaqSection'
import FeaturesSection from '@components/landing/FeaturesSection'
import FinalCta from '@components/landing/FinalCta'
import HowItWorks from '@components/landing/HowItWorks'
import LandingHero from '@components/landing/LandingHero'
import LandingNav from '@components/landing/LandingNav'
import PricingSection from '@components/landing/PricingSection'
import SiteFooter from '@components/landing/SiteFooter'
import { usePublicPersonas } from '@hooks/usePublicPersonas'

export default function LandingPage() {
  // The companions switched on in the admin dashboard; however many there are
  const personas = usePublicPersonas()
  // One companion voices the sample chats for the whole visit
  const [featuredId] = useState(() => personas.find((p) => p.image)?.id)
  const featured = personas.find((p) => p.id === featuredId) ?? personas.find((p) => p.image) ?? personas[0]

  return (
    <div className="page overflow-x-clip">
      <LandingNav />
      <main>
        <LandingHero personas={personas} />
        <FactStrip />
        <HowItWorks />
        <CompanionsSection personas={personas} />
        <FeaturesSection persona={featured} personas={personas} />
        <ChatPreview persona={featured} />
        <PricingSection />
        <FaqSection />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  )
}
