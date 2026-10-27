import Breadcrumbs from '@components/common/Breadcrumbs'
import ButtonLink from '@components/common/ButtonLink'
import PublicLayout from '@components/layout/PublicLayout'
import PersonaTile from '@components/persona/PersonaTile'
import { FREE_MESSAGE_LIMIT } from '@config/limits'
import { companionsSeo } from '@config/seo'
import { usePublicPersonas } from '@hooks/usePublicPersonas'
import { useSeo } from '@hooks/useSeo'

const COMPANION_QUESTIONS = [
  {
    q: 'Can I talk to more than one AI girlfriend?',
    a: 'Yes. Basic gives you unlimited messages with one companion of your choice, and Premium lets you talk to every companion. Each one keeps her own memory of you.',
  },
  {
    q: 'Are the companions real people?',
    a: 'No. Each companion is a character with her own personality, and her replies are written by AI. Some conversations may also be handled by our team, as our Terms explain.',
  },
  {
    q: 'Which companion should I start with?',
    a: 'Go with your mood: playful if you want to flirt, supportive if you want to be listened to, thoughtful if you want a deep talk. You can switch any time.',
  },
  {
    q: 'Are new companions added?',
    a: 'Yes. New companions join from time to time, and each one gets her own profile here with her photos and personality.',
  },
]

/** Every companion, each linking to her profile page. */
export default function CompanionsPage() {
  const { personas } = usePublicPersonas({ shuffle: false })
  useSeo(companionsSeo(personas))

  return (
    <PublicLayout>
      <section className="frame pb-[clamp(72px,9vw,128px)] pt-10">
        <Breadcrumbs items={[{ name: 'Home', to: '/' }, { name: 'Companions' }]} />
        <h1 className="heading mt-6 max-w-4xl text-[clamp(40px,6vw,84px)]">AI girlfriends to chat with</h1>
        <p className="mt-5 max-w-[60ch] text-xl leading-relaxed text-brand-muted">
          Each companion has her own personality, her own interests and her own way of texting. Open a profile to see her photos
          and the first thing she would say to you. Your first {FREE_MESSAGE_LIMIT} messages are free with any of them.
        </p>

        {/* On screen as soon as the page opens, so no entrance animation: the photos paint straight away */}
        <ul className="mt-12 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
          {personas.map((persona, i) => (
            <li key={persona.id}>
              <PersonaTile persona={persona} cta priority={i < 2} to={`/companions/${persona.id}`} />
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-brand-surface py-[clamp(72px,9vw,128px)]" aria-labelledby="choose-title">
        <div className="frame grid gap-10 lg:grid-cols-2">
          <h2 id="choose-title" className="heading text-[clamp(32px,4vw,56px)]">How to choose your AI girlfriend</h2>
          <div className="space-y-5 text-lg leading-relaxed text-brand-muted">
            <p>
              An AI girlfriend is only as good as the conversation, so start with how you want to feel. Pick the personality that matches your mood. A playful companion teases you and keeps things exciting. A supportive
              one listens after a long day. A thoughtful one is there for the late-night, big-question conversations.
            </p>
            <p>
              You do not have to choose forever. Start with one, and with Premium you can talk to every companion whenever you like.
              Each of them remembers you separately.
            </p>
            <p>
              Every companion remembers what you tell her, replies in a sentence or two like a real text, and keeps things tasteful.
              The differences are in how she talks to you: how much she flirts, how much she jokes and how deep she likes to go.
            </p>
            <ButtonLink to="/register" size="lg">Find your match</ButtonLink>
          </div>
        </div>
      </section>

      <section className="frame py-[clamp(72px,9vw,128px)]" aria-labelledby="companions-faq">
        <h2 id="companions-faq" className="heading text-[clamp(32px,4vw,56px)]">Questions about the companions</h2>
        <dl className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {COMPANION_QUESTIONS.map(({ q, a }) => (
            <div key={q}>
              <dt className="heading text-2xl">{q}</dt>
              <dd className="mt-3 text-lg leading-relaxed text-brand-muted">{a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </PublicLayout>
  )
}
