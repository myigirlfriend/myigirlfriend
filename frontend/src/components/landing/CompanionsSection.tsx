import ButtonLink from '@components/common/ButtonLink'
import { Reveal, RevealItem } from '@components/common/Reveal'
import PersonaTile from '@components/persona/PersonaTile'
import type { Persona } from '@/types'
import SectionHeading from './SectionHeading'

// More than this and the rest wait behind sign up
const SHOWN = 8

/** Every companion switched on in the admin dashboard, as profile cards. */
export default function CompanionsSection({ personas }: { personas: Persona[] }) {
  const shown = personas.slice(0, SHOWN)
  const more = personas.length - shown.length

  return (
    <section id="companions" className="scroll-mt-20 bg-brand-surface py-[clamp(88px,11vw,160px)]">
      <div className="frame">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            title="Meet the companions"
            intro="Playful, sweet, deep or easygoing. Each one has her own personality and her own way of talking to you."
          />
          <ButtonLink to="/companions" variant="secondary" className="mb-1">See all companions</ButtonLink>
        </div>

        <Reveal as="ul" className="mt-12 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
          {shown.map((persona) => (
            <RevealItem as="li" key={persona.id}>
              <PersonaTile persona={persona} cta to={`/companions/${persona.id}`} />
            </RevealItem>
          ))}
        </Reveal>

        {more > 0 && (
          <p className="mt-10 text-center text-lg text-brand-muted">
            And {more} more waiting inside. <ButtonLink to="/companions" variant="ghost" size="sm" className="ml-2">See them all</ButtonLink>
          </p>
        )}
      </div>
    </section>
  )
}
