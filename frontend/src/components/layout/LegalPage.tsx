import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import IconButton from '@components/common/IconButton'
import Logo from '@components/common/Logo'
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
    <div className="page pb-32">
      <div className="sticky top-[env(safe-area-inset-top,0px)] z-10 bg-brand-dark">
        <div className="frame flex h-16 items-center gap-3">
          <IconButton label="Go back" onClick={() => navigate(-1)} className="-ml-2.5">
            <ChevronLeft size={24} />
          </IconButton>
          <Logo />
        </div>
      </div>

      <article className="frame max-w-[46rem] pt-10">
        <h1 className="heading text-5xl md:text-6xl">{title}</h1>
        <p className="mt-3 text-base text-brand-muted">Last updated {updated}</p>
        <p className="mt-8 text-lg leading-relaxed text-brand-text">{intro}</p>

        <div className="mt-12 space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="heading text-2xl">{section.title}</h2>
              <p className="mt-3 text-[17px] leading-relaxed text-brand-muted">{section.content}</p>
            </section>
          ))}
        </div>
      </article>
    </div>
  )
}
