import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import IconButton from '@components/common/IconButton'
import { usePageTitle } from '@hooks/usePageTitle'

export interface LegalSection {
  title: string
  content: string
}

interface LegalPageProps {
  title: string
  updated: string
  intro: string
  sections: LegalSection[]
}

/** Shared layout of the Terms and Privacy pages. */
export default function LegalPage({ title, updated, intro, sections }: LegalPageProps) {
  const navigate = useNavigate()
  usePageTitle(title)

  return (
    <div className="min-h-[100dvh] bg-brand-dark pb-28">
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-brand-border bg-brand-dark/90 px-4 py-3 backdrop-blur-md">
        <IconButton label="Go back" onClick={() => navigate(-1)}>
          <ChevronLeft size={22} />
        </IconButton>
        <span className="text-sm font-bold text-white">{title}</span>
      </div>

      <div className="mx-auto max-w-2xl px-4 pt-8 sm:px-6">
        <h1 className="text-2xl font-extrabold text-white">{title}</h1>
        <p className="mt-1 text-sm text-brand-muted">Last updated: {updated}</p>
        <p className="mt-3 text-sm leading-relaxed text-brand-muted">{intro}</p>

        <div className="mt-8 space-y-6">
          {sections.map((section) => (
            <section key={section.title} className="border-b border-brand-border pb-6 last:border-0">
              <h2 className="mb-2 text-sm font-bold text-white">{section.title}</h2>
              <p className="text-sm leading-relaxed text-brand-muted">{section.content}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
