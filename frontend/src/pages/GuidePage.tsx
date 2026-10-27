import { Link, useParams } from 'react-router-dom'
import Breadcrumbs from '@components/common/Breadcrumbs'
import ButtonLink from '@components/common/ButtonLink'
import PublicLayout from '@components/layout/PublicLayout'
import { FREE_MESSAGE_LIMIT } from '@config/limits'
import { guideSeo } from '@config/seo'
import { useSeo } from '@hooks/useSeo'
import { GUIDES, getGuide, type Guide } from '@/content/guides'
import NotFoundPage from './NotFoundPage'

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })

function Article({ guide }: { guide: Guide }) {
  useSeo(guideSeo(guide))
  const others = GUIDES.filter((g) => g.slug !== guide.slug)

  return (
    <PublicLayout>
      <article className="frame max-w-[48rem] pb-20 pt-10">
        <Breadcrumbs items={[{ name: 'Home', to: '/' }, { name: 'Guides', to: '/guides' }, { name: guide.title.split(':')[0]! }]} />
        <h1 className="heading mt-6 text-[clamp(36px,5vw,64px)]">{guide.title}</h1>
        <p className="mt-4 text-base text-brand-muted">
          Updated <time dateTime={guide.updated}>{formatDate(guide.updated)}</time>
        </p>
        <p className="mt-8 text-xl leading-relaxed text-brand-text">{guide.intro}</p>

        {guide.sections.map((section) => (
          <section key={section.heading} className="mt-12">
            <h2 className="heading text-3xl">{section.heading}</h2>
            {section.paragraphs.map((text) => (
              <p key={text.slice(0, 40)} className="mt-4 text-lg leading-relaxed text-brand-muted">{text}</p>
            ))}
            {section.list && (
              <ul className="mt-4 list-disc space-y-2 pl-6 text-lg leading-relaxed text-brand-muted marker:text-brand-blush">
                {section.list.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )}
          </section>
        ))}

        <aside className="surface--accent mt-16 rounded-[2rem] p-8">
          <p className="heading text-3xl text-white">Meet your AI girlfriend</p>
          <p className="mt-3 text-lg text-white/90">Swipe, match and start chatting. Your first {FREE_MESSAGE_LIMIT} messages are free.</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <ButtonLink to="/register" size="lg">Find your match</ButtonLink>
            <Link to="/companions" className="link text-lg text-white">See the companions</Link>
          </div>
        </aside>
      </article>

      <section className="bg-brand-surface py-16" aria-labelledby="more-guides">
        <div className="frame max-w-[48rem]">
          <h2 id="more-guides" className="heading text-2xl">More guides</h2>
          <ul className="mt-6 space-y-3">
            {others.map((g) => (
              <li key={g.slug}><Link to={`/guides/${g.slug}`} className="link text-lg">{g.title}</Link></li>
            ))}
          </ul>
        </div>
      </section>
    </PublicLayout>
  )
}

export default function GuidePage() {
  const { slug } = useParams()
  const guide = getGuide(slug)
  return guide ? <Article guide={guide} /> : <NotFoundPage />
}
