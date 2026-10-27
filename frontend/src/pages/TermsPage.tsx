import LegalPage, { type LegalSection } from '@components/layout/LegalPage'

const SECTIONS: LegalSection[] = [
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
  return (
    <LegalPage
      title="Terms of Service"
      updated="May 2026"
      intro="Please read these terms carefully before using myigirlfriend."
      description="The terms for using myigirlfriend, the AI girlfriend chat app: accounts, the 18+ age requirement, subscriptions, cancellations and acceptable use."
      sections={SECTIONS}
    />
  )
}
