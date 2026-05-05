import PersonaCard from './PersonaCard'
import Spinner from '@components/common/Spinner'

export default function PersonaGrid({ personas, onSelect, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {personas.map((persona, i) => (
        <PersonaCard
          key={persona.id}
          persona={persona}
          onClick={onSelect}
          index={i}
        />
      ))}
    </div>
  )
}
