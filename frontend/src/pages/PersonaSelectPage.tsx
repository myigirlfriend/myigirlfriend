import MemberPage from '@components/layout/MemberPage'
import PersonaTile from '@components/persona/PersonaTile'
import { PERSONAS, shufflePersonas } from '@config/personas'
import { FREE_MESSAGE_LIMIT } from '@config/limits'
import { usePersona } from '@hooks/usePersona'
import { useSubscription } from '@hooks/useSubscription'

export default function PersonaSelectPage() {
  const { personas, selectPersona } = usePersona()
  const { isPaid } = useSubscription()
  // Built-in models show instantly; the live list replaces them as soon as it loads
  const list = personas.length > 0 ? personas : shufflePersonas(PERSONAS)

  return (
    <MemberPage
      wide
      tabTitle="Companions"
      title="Who do you want to talk to?"
      subtitle={isPaid
        ? 'Pick anyone. She will pick up where you left off.'
        : `Each one is different. Your first ${FREE_MESSAGE_LIMIT} messages are free.`}
    >
      <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 xl:grid-cols-5">
        {list.map((persona) => (
          <li key={persona.id}>
            <PersonaTile persona={persona} cta onClick={() => selectPersona(persona)} />
          </li>
        ))}
      </ul>
    </MemberPage>
  )
}
