import { useLocation } from 'react-router-dom'
import { legalSeo } from '@config/seo'
import { useSeo } from '@hooks/useSeo'
import PublicLayout from './PublicLayout'

export interface LegalSection {
  title: string
  content: string
}

interface LegalPageProps {
  title: string
  updated: string
  intro: string
  /** One or two sentences for search results */
  description: string
  sections: LegalSection[]
}

/** Shared layout of the Terms and Privacy pages. */
export default function LegalPage({ title, updated, intro, description, sections }: LegalPageProps) {
  const { pathname } = useLocation()
  useSeo(legalSeo(title, pathname, description))

  return (
    <PublicLayout>
      <article className="frame max-w-[46rem] pb-24 pt-12">
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
    </PublicLayout>
  )
}
