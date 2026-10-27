import type { ReactNode } from 'react'
import Avatar from '@components/common/Avatar'
import { Reveal, RevealItem } from '@components/common/Reveal'
import Bubble from '@components/chat/Bubble'
import { traits } from '@utils/text'
import nightImage from '@/assets/landing/feature-3am.webp'
import commuteImage from '@/assets/landing/feature-commute.webp'
import balconyImage from '@/assets/landing/feature-private.webp'
import type { Persona } from '@/types'
import SectionHeading from './SectionHeading'

interface PhotoCellProps {
  image: string
  title: string
  text: string
  className?: string
}

/** A bento cell that is one photograph with its words over the bottom. */
function PhotoCell({ image, title, text, className = '' }: PhotoCellProps) {
  return (
    <RevealItem className={`relative min-h-[340px] overflow-hidden rounded-[2rem] bg-brand-card ${className}`}>
      <img src={image} alt="" width={1280} height={960} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 to-transparent" /> {/* taste-skill-ignore: neutral scrim over a photo */}
      <div className="absolute inset-x-0 bottom-0 p-7">
        <h3 className="heading text-3xl text-white">{title}</h3>
        <p className="mt-2 max-w-[40ch] text-[17px] leading-relaxed text-white/90">{text}</p>
      </div>
    </RevealItem>
  )
}

function PanelCell({ title, text, children, className = '' }: { title: string; text: string; children: ReactNode; className?: string }) {
  return (
    <RevealItem className={`flex flex-col justify-between gap-8 rounded-[2rem] p-7 ${className}`}>
      <div data-ui>{children}</div>
      <div>
        <h3 className="heading text-3xl text-white">{title}</h3>
        <p className="mt-2 max-w-[40ch] text-[17px] leading-relaxed text-white/90">{text}</p>
      </div>
    </RevealItem>
  )
}

/** What makes it feel like someone, not something: five cells of unequal size. */
export default function FeaturesSection({ persona, personas }: { persona: Persona | undefined; personas: Persona[] }) {
  // The personalities on offer, read from the companions' own taglines
  const allTraits = [...new Set(personas.flatMap((p) => traits(p.tagline)))].slice(0, 12)

  return (
    <section className="frame py-[clamp(88px,11vw,160px)]" aria-labelledby="features-title">
      <SectionHeading id="features-title" title="It feels like someone is really there" intro="Because she answers like a person: short, warm, curious about you, and never in a hurry to leave." />

      <Reveal className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-6 lg:grid-rows-[minmax(360px,auto)_minmax(360px,auto)]">
        <PhotoCell
          image={nightImage}
          title="Up at 3am? So is she."
          text="Message her any time, day or night. She replies in seconds, at the pace of a real conversation."
          className="md:col-span-2 lg:col-span-4"
        />

        <PanelCell title="She remembers you" text="Your name, your week, the thing you mentioned yesterday. Every chat picks up where the last one ended." className="bg-brand-plum lg:col-span-2">
          {persona && (
            <div className="space-y-2.5">
              <Bubble tone="received" avatar={<Avatar persona={persona} size="sm" />}>How did the interview go on Thursday?</Bubble>
              <Bubble tone="sent">wait, you remembered?</Bubble>
            </div>
          )}
        </PanelCell>

        <PanelCell title="Pick her personality" text="Flirty when you want it, supportive when you need it, deep when you can't sleep." className="bg-brand-plum-2 lg:col-span-2">
          <ul className="flex flex-wrap gap-2" aria-label="Personalities">
            {allTraits.map((trait) => (
              <li key={trait} className="rounded-full bg-white/10 px-3.5 py-1.5 text-[15px] font-bold text-white">{trait}</li>
            ))}
          </ul>
        </PanelCell>

        <PhotoCell
          image={commuteImage}
          title="Fits into your day"
          text="A quick hello on the train, a long talk before bed. She is in your pocket wherever you are."
          className="lg:col-span-2"
        />

        <PhotoCell
          image={balconyImage}
          title="No pressure, no judgement"
          text="Practise flirting, vent about your day or just talk. Go at your own pace."
          className="lg:col-span-2"
        />
      </Reveal>
    </section>
  )
}
