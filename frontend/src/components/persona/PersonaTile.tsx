import { DEFAULT_GRADIENT } from '@config/personas'
import type { TilePersona } from '@/types'

interface PersonaTileProps {
  persona: TilePersona
  /** Makes the tile a button */
  onClick?: () => void
  /** Greyed out, for a model hidden from members */
  dimmed?: boolean
  className?: string
}

/**
 * Portrait card for a model: the same tile members see when choosing who to talk to.
 * Photos are portrait, so the tile keeps a 3:4 shape and anchors the crop to the top (faces stay in frame).
 */
export default function PersonaTile({ persona, onClick, dimmed = false, className = '' }: PersonaTileProps) {
  const from = persona.gradientFrom || DEFAULT_GRADIENT.from
  const to = persona.gradientTo || DEFAULT_GRADIENT.to
  const frame = `group relative block w-full aspect-[3/4] overflow-hidden rounded-2xl bg-brand-card text-left ${className}`

  const content = (
    <>
      {persona.image ? (
        <img
          src={persona.image}
          alt={persona.name || ''}
          className={`absolute inset-0 h-full w-full object-cover object-top
            ${onClick ? 'motion-safe:transition-transform motion-safe:duration-500 group-hover:scale-[1.03]' : ''}
            ${dimmed ? 'opacity-50 grayscale' : ''}`}
        />
      ) : (
        <div
          className={`absolute inset-0 flex items-center justify-center text-6xl font-extrabold text-white/90 ${dimmed ? 'opacity-50' : ''}`}
          style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
          aria-hidden="true"
        >
          {persona.name?.[0]?.toUpperCase()}
        </div>
      )}

      {/* Scrim so the name stays readable on any photo */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-brand-dark/45 via-[38%] to-transparent to-[62%]" />

      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
        <div className="text-base font-extrabold leading-tight text-white sm:text-lg">
          {persona.name || 'Her name'}
        </div>
        {persona.tagline && (
          <div className="mt-0.5 text-xs font-semibold text-white/80 sm:text-sm">{persona.tagline}</div>
        )}
        {persona.previewMessage && (
          <div className="mt-2 rounded-xl bg-white/10 px-2.5 py-1.5 backdrop-blur-sm">
            <p className="line-clamp-2 text-xs leading-snug text-white/90">{persona.previewMessage}</p>
          </div>
        )}
        <div className="mt-2.5 h-0.5 w-8 rounded-full" style={{ backgroundImage: `linear-gradient(90deg, ${from}, ${to})` }} />
      </div>
    </>
  )

  if (!onClick) return <div className={frame}>{content}</div>

  return (
    <button type="button" onClick={onClick} className={`${frame} transition-transform duration-150 active:scale-[0.99]`}>
      {content}
    </button>
  )
}
