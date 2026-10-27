import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Breadcrumbs from '@components/common/Breadcrumbs'
import PublicLayout from '@components/layout/PublicLayout'
import { guidesSeo } from '@config/seo'
import { useSeo } from '@hooks/useSeo'
import { FREE_MESSAGE_LIMIT } from '@config/limits'
import { GUIDES } from '@/content/guides'

const QUICK_ANSWERS = [
  {
    q: 'What is an AI girlfriend?',
    a: 'An AI girlfriend is a chat companion powered by artificial intelligence, with her own name, personality and way of texting. She replies in seconds, remembers what you tell her and is available whenever you want to talk.',
  },
  {
    q: 'Is there a free AI girlfriend app?',
    a: `Yes. On myigirlfriend your first ${FREE_MESSAGE_LIMIT} messages are free and you do not need a card. Paid plans remove the limit when you want to keep talking.`,
  },
  {
    q: 'Can an AI girlfriend help with confidence?',
    a: 'Many people use one to practise starting conversations and flirting without pressure. It is a warm-up for real life, not a replacement for it.',
  },
]

export default function GuidesPage() {
  useSeo(guidesSeo(GUIDES))

  return (
    <PublicLayout>
      <section className="frame pb-[clamp(72px,9vw,128px)] pt-10">
        <Breadcrumbs items={[{ name: 'Home', to: '/' }, { name: 'Guides' }]} />
        <h1 className="heading mt-6 text-[clamp(40px,6vw,84px)]">AI girlfriend guides</h1>
        <p className="mt-5 max-w-[56ch] text-xl leading-relaxed text-brand-muted">
          Straight answers about AI girlfriends: how they work, what to look for in an app and how to get the most out of the conversation.
        </p>

        <ul className="mt-12 grid gap-3 md:grid-cols-3">
          {GUIDES.map((guide) => (
            <li key={guide.slug}>
              <Link to={`/guides/${guide.slug}`} className="surface group flex h-full flex-col justify-between gap-8 p-7 transition-colors hover:bg-brand-card">
                <span>
                  <span className="heading block text-2xl">{guide.title}</span>
                  <span className="mt-3 block text-[17px] leading-relaxed text-brand-muted">{guide.description}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-base font-extrabold text-brand-blush">
                  Read the guide <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-brand-surface py-[clamp(72px,9vw,128px)]" aria-labelledby="quick-answers">
        <div className="frame max-w-[52rem]">
          <h2 id="quick-answers" className="heading text-[clamp(32px,4vw,56px)]">Quick answers</h2>
          <div className="mt-10 space-y-10">
            {QUICK_ANSWERS.map(({ q, a }) => (
              <div key={q}>
                <h3 className="heading text-2xl">{q}</h3>
                <p className="mt-3 text-lg leading-relaxed text-brand-muted">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
