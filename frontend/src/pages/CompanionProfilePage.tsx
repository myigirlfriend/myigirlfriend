import { useParams } from 'react-router-dom'
import Breadcrumbs from '@components/common/Breadcrumbs'
import ButtonLink from '@components/common/ButtonLink'
import Avatar from '@components/common/Avatar'
import PublicLayout from '@components/layout/PublicLayout'
import Bubble from '@components/chat/Bubble'
import PersonaTile from '@components/persona/PersonaTile'
import PhotoGallery from '@components/persona/PhotoGallery'
import { FREE_MESSAGE_LIMIT } from '@config/limits'
import { companionSeo } from '@config/seo'
import { usePublicPersonas } from '@hooks/usePublicPersonas'
import { useSeo } from '@hooks/useSeo'
import { traits, traitSentence } from '@utils/text'
import type { Persona } from '@/types'
import { styleFor } from '@/content/companionCopy'
import NotFoundPage from './NotFoundPage'

/** Questions answered for this companion; the answers use her own name and personality. */
const questionsFor = (p: Persona) => [
  {
    q: `Is it free to chat with ${p.name}?`,
    a: `Yes. Create a free account and your first ${FREE_MESSAGE_LIMIT} messages with ${p.name} are free, no card needed. A plan unlocks unlimited messages.`,
  },
  {
    q: `Does ${p.name} remember our conversations?`,
    a: `Yes. ${p.name} remembers what you tell her, like your name and what is going on in your life, so every chat picks up where the last one ended.`,
  },
  {
    q: `What is ${p.name} like to talk to?`,
    a: `${p.name} is ${p.tone || traitSentence(p.tagline).toLowerCase() || 'warm and easy to talk to'}. ${p.description}`.trim(),
  },
]

function Profile({ persona, others }: { persona: Persona; others: Persona[] }) {
  useSeo(companionSeo(persona))
  const images = [persona.image, ...persona.gallery].filter((src): src is string => !!src)
  const personality = [...new Set([...traits(persona.tagline), ...traits(persona.tone)].map((t) => t.toLowerCase()))]
  const style = styleFor(persona)

  return (
    <>
      <section className="frame pb-[clamp(72px,9vw,128px)] pt-10">
        <Breadcrumbs items={[{ name: 'Home', to: '/' }, { name: 'Companions', to: '/companions' }, { name: persona.name }]} />

        <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <PhotoGallery images={images} name={persona.name} priority className="lg:sticky lg:top-24" />

          <div>
            <h1 className="heading text-[clamp(48px,6vw,88px)]">{persona.name}</h1>
            <p className="mt-3 text-xl font-bold text-brand-blush">{traitSentence(persona.tagline)} AI girlfriend</p>
            {persona.description && <p className="mt-6 max-w-[52ch] text-xl leading-relaxed text-brand-text">{persona.description}</p>}

            {persona.previewMessage && (
              <div className="mt-8">
                <h2 className="text-base font-bold text-brand-muted">Her first message to you</h2>
                <div className="mt-3" data-ui>
                  <Bubble tone="received" size="lg" avatar={<Avatar persona={persona} size="md" />}>{persona.previewMessage}</Bubble>
                </div>
              </div>
            )}

            {personality.length > 0 && (
              <div className="mt-8">
                <h2 className="text-base font-bold text-brand-muted">Personality</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {personality.map((trait) => (
                    <li key={trait} className="rounded-full bg-brand-card px-4 py-2 text-base font-bold capitalize text-brand-text">{trait}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              <ButtonLink to="/register" size="lg">Chat with {persona.name} free</ButtonLink>
              <span className="text-base text-brand-muted">First {FREE_MESSAGE_LIMIT} messages free. No card.</span>
            </div>

            <section className="mt-16" aria-labelledby="about-her">
              <h2 id="about-her" className="heading text-3xl">What {persona.name} is like</h2>
              <p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-brand-muted">
                {persona.name} is {persona.tone || traitSentence(persona.tagline).toLowerCase()}. {style.feel} She is a good match if you want {style.goodFor}.
              </p>
            </section>

            <section className="mt-12" aria-labelledby="starters">
              <h2 id="starters" className="heading text-3xl">Conversation starters for {persona.name}</h2>
              <p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-brand-muted">Not sure what to say first? Try one of these:</p>
              <ul className="mt-5 space-y-2.5" data-ui>
                {style.starters.map((line) => (
                  <li key={line}><Bubble tone="sent" side="start">{line}</Bubble></li>
                ))}
              </ul>
            </section>

            <section className="mt-12" aria-labelledby="how-to-chat">
              <h2 id="how-to-chat" className="heading text-3xl">How to chat with {persona.name}</h2>
              <ol className="mt-4 list-decimal space-y-2 pl-6 text-lg leading-relaxed text-brand-muted marker:font-bold marker:text-brand-blush">
                <li>Create a free account with Google or email.</li>
                <li>Choose {persona.name} from the companions.</li>
                <li>Send your first message. She replies in seconds, and your first {FREE_MESSAGE_LIMIT} messages are free.</li>
              </ol>
            </section>

            <div className="mt-12 space-y-8">
              {questionsFor(persona).map(({ q, a }) => (
                <div key={q}>
                  <h2 className="heading text-2xl">{q}</h2>
                  <p className="mt-2 max-w-[60ch] text-[17px] leading-relaxed text-brand-muted">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="bg-brand-surface py-[clamp(72px,9vw,128px)]" aria-labelledby="others-title">
          <div className="frame">
            <h2 id="others-title" className="heading text-[clamp(32px,4vw,56px)]">More AI girlfriends to meet</h2>
            <ul className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-4">
              {others.map((p) => (
                <li key={p.id}><PersonaTile persona={p} cta to={`/companions/${p.id}`} /></li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}

/** A companion's public profile: her photos, personality and first message. */
export default function CompanionProfilePage() {
  const { companionId } = useParams()
  const { personas, loaded } = usePublicPersonas({ shuffle: false })
  const persona = personas.find((p) => p.id === companionId)

  if (!persona) {
    if (loaded) return <NotFoundPage />
    return (
      <PublicLayout>
        <div className="frame grid gap-10 pb-24 pt-20 lg:grid-cols-2" aria-busy="true">
          <div className="skeleton aspect-[4/5] rounded-[2rem]" />
          <div className="space-y-4"><div className="skeleton h-20 w-2/3" /><div className="skeleton h-6 w-1/2" /><div className="skeleton h-24" /></div>
        </div>
      </PublicLayout>
    )
  }

  const index = personas.indexOf(persona)
  const others = [...personas.slice(index + 1), ...personas.slice(0, index)].slice(0, 4)

  return (
    <PublicLayout>
      <Profile persona={persona} others={others} />
    </PublicLayout>
  )
}
