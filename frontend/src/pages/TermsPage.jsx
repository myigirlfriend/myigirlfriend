import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    content: 'By accessing or using myigirlfriend, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.',
  },
  {
    title: '2. Description of Service',
    content: 'myigirlfriend provides an AI-powered companion chat experience. Conversations may be handled by automated systems or human agents. The platform is for entertainment and companionship purposes only.',
  },
  {
    title: '3. Age Requirement',
    content: 'You must be at least 18 years old to use this service. By registering, you confirm that you are 18 or older.',
  },
  {
    title: '4. User Accounts',
    content: 'You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.',
  },
  {
    title: '5. Subscriptions & Payments',
    content: 'Paid plans are billed on a recurring basis. Basic plan is billed every 7 days. Premium plan is billed monthly. You may cancel at any time. No refunds are provided for partial billing periods.',
  },
  {
    title: '6. Acceptable Use',
    content: 'You agree not to use the platform for any unlawful purpose, to harass or abuse others, to attempt to gain unauthorized access to systems, or to transmit harmful or offensive content.',
  },
  {
    title: '7. Intellectual Property',
    content: 'All content, features, and functionality of myigirlfriend are owned by us and protected by applicable intellectual property laws.',
  },
  {
    title: '8. Disclaimer',
    content: 'The service is provided "as is" without warranties of any kind. Companions are AI-powered and for entertainment only. We are not responsible for any decisions made based on conversations.',
  },
  {
    title: '9. Limitation of Liability',
    content: 'We shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service.',
  },
  {
    title: '10. Changes to Terms',
    content: 'We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.',
  },
  {
    title: '11. Contact',
    content: 'For questions about these terms, contact us at support@myigirlfriend.com',
  },
]

export default function TermsPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-brand-dark pb-12">
      {/* Header */}
      <div className="sticky top-0 bg-brand-dark/90 backdrop-blur-md border-b border-brand-border px-4 py-3 flex items-center gap-3 z-10">
        <button onClick={() => navigate(-1)} className="text-brand-muted hover:text-white transition-colors">
          <ChevronLeft size={22} />
        </button>
        <h1 className="font-extrabold text-white text-lg">Terms of Service</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-8">
        {/* Intro */}
        <div className="mb-8">
          <div className="gradient-text font-extrabold text-2xl mb-2">Terms of Service</div>
          <p className="text-brand-muted text-sm">Last updated: May 2026</p>
          <p className="text-brand-muted text-sm mt-3 leading-relaxed">
            Please read these terms carefully before using myigirlfriend.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {SECTIONS.map((s, i) => (
            <div key={i} className="border-b border-brand-border pb-6 last:border-0">
              <h2 className="text-white font-bold text-sm mb-2">{s.title}</h2>
              <p className="text-brand-muted text-sm leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}