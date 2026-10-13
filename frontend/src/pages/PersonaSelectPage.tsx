import MemberPage from '@components/layout/MemberPage'
import PersonaTile from '@components/persona/PersonaTile'
import { PERSONAS, shufflePersonas } from '@config/personas'
import { usePersona } from '@hooks/usePersona'

export default function PersonaSelectPage() {
  const { personas, selectPersona } = usePersona()
  // Built-in models show instantly; the live list replaces them as soon as it loads
  const list = personas.length > 0 ? personas : shufflePersonas(PERSONAS)

  return (
    <MemberPage
      wide
      tabTitle="Companions"
      title="Who do you want to talk to?"
      subtitle="Each one is different. Tap a photo to start chatting, free to try."
    >
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {list.map((persona) => (
          <li key={persona.id}>
            <PersonaTile persona={persona} onClick={() => selectPersona(persona)} />
          </li>
        ))}
      </ul>
    </MemberPage>
  )
}
