import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

const SECTIONS = [
  {
    title: '1. Information We Collect',
    content: 'We collect information you provide directly: name, email address, and password when you register. We also collect conversation data, usage patterns, and payment information processed securely through Stripe.',
  },
  {
    title: '2. How We Use Your Information',
    content: 'We use your information to provide and improve the service, personalize your companion experience, process payments, send service-related communications, and ensure platform security.',
  },
  {
    title: '3. Conversation Data',
    content: 'Your conversations are stored to provide continuity and memory features. Conversation data may be reviewed by human agents to improve service quality. We do not sell conversation data to third parties.',
  },
  {
    title: '4. Memory System',
    content: 'With your use of the platform, we extract and store certain facts you share (such as your name, interests, and mood) to personalize your companion experience. You may request deletion of this data at any time.',
  },
  {
    title: '5. Data Sharing',
    content: 'We do not sell your personal data. We share data only with service providers necessary to operate the platform (Supabase for database, OpenAI for AI responses, Stripe for payments).',
  },
  {
    title: '6. Data Security',
    content: 'We implement industry-standard security measures including encrypted connections, hashed passwords, and secure token authentication to protect your data.',
  },
  {
    title: '7. Cookies',
    content: 'We use essential cookies and local storage to maintain your session and preferences. We do not use tracking or advertising cookies.',
  },
  {
    title: '8. Your Rights',
    content: 'You have the right to access, correct, or delete your personal data at any time. You may request account deletion by contacting support@myigirlfriend.com',
  },
  {
    title: '9. Children\'s Privacy',
    content: 'Our service is not directed to children under 18. We do not knowingly collect data from minors.',
  },
  {
    title: '10. Changes to Privacy Policy',
    content: 'We may update this policy periodically. We will notify users of significant changes via email or in-app notification.',
  },
  {
    title: '11. Contact Us',
    content: 'For privacy-related questions or data requests, contact us at privacy@myigirlfriend.com',
  },
]

export default function PrivacyPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-brand-dark pb-12">
      {/* Header */}
      <div className="sticky top-0 bg-brand-dark/90 backdrop-blur-md border-b border-brand-border px-4 py-3 flex items-center gap-3 z-10">
        <button onClick={() => navigate(-1)} className="text-brand-muted hover:text-white transition-colors">
          <ChevronLeft size={22} />
        </button>
        <h1 className="font-extrabold text-white text-lg">Privacy Policy</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-8">
        {/* Intro */}
        <div className="mb-8">
          <div className="gradient-text font-extrabold text-2xl mb-2">Privacy Policy</div>
          <p className="text-brand-muted text-sm">Last updated: May 2026</p>
          <p className="text-brand-muted text-sm mt-3 leading-relaxed">
            Your privacy matters. Here's exactly how we handle your data.
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