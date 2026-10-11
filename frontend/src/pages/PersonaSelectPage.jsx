import { usePersona } from '@hooks/usePersona'
import { PERSONAS } from '@config/personas'
import PersonaTile from '@components/persona/PersonaTile'

export default function PersonaSelectPage() {
  const { personas, selectPersona } = usePersona()
  // Built-in models show instantly; the live list replaces them as soon as it loads
  const list = personas.length > 0 ? personas : PERSONAS

  return (
    <div
      className="min-h-[100dvh] pb-28"
      style={{ background: 'radial-gradient(ellipse at top, #1a0a2e 0%, #0a0a0a 60%)' }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="pt-12 pb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Who do you want to talk to?</h1>
          <p className="mt-2 text-sm sm:text-base text-zinc-400">
            Each one is different. Tap a photo to start chatting, free to try.
          </p>
        </header>

        {/* Tiles keep their portrait shape at every width; an odd one out sits centred */}
        <div className="flex flex-wrap justify-center gap-3">
          {list.map((p) => (
            <div
              key={p.id}
              className="w-[calc(50%-6px)] sm:w-[calc(33.333%-8px)] lg:w-[calc(25%-9px)] xl:w-[calc(20%-9.6px)]"
            >
              <PersonaTile persona={p} onClick={() => selectPersona(p)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
