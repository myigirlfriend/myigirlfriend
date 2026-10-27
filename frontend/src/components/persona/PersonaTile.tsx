import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { DEFAULT_GRADIENT } from '@config/personas'
import { fetchPriority } from '@utils/dom'
import { traitSentence } from '@utils/text'
import type { TilePersona } from '@/types'

interface PersonaTileProps {
  persona: TilePersona
  /** Makes the tile a button */
  onClick?: () => void
  /** Makes the tile a link, e.g. to her profile page. Takes precedence over onClick. */
  to?: string
  /** Greyed out, for a model hidden from members */
  dimmed?: boolean
  /** Shows "Chat with <name>" under the portrait */
  cta?: boolean
  /** Load the photo straight away, for tiles visible when the page opens */
  priority?: boolean
  className?: string
}

/**
 * Portrait card for a companion: the tile members choose from, and the preview admins see.
 * Photos are portrait, so the tile keeps a 4:5 shape and anchors the crop to the top so faces stay in frame.
 */
export default function PersonaTile({ persona, onClick, to, dimmed = false, cta = false, priority = false, className = '' }: PersonaTileProps) {
  const interactive = !!onClick || !!to
  const name = persona.name || 'Her name'
  const frame = `group relative block w-full text-left ${className}`

  const content = (
    <>
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-brand-card">
        {persona.image ? (
          <img
            src={persona.image}
            alt={persona.name ? `${persona.name}, AI girlfriend` : ''}
            width={800}
            height={1000}
            loading={priority ? 'eager' : 'lazy'}
            {...fetchPriority(priority ? 'high' : undefined)}
            className={`absolute inset-0 h-full w-full object-cover object-top
              ${interactive ? 'motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out group-hover:scale-[1.04]' : ''}
              ${dimmed ? 'opacity-40 grayscale' : ''}`}
          />
        ) : (
          // Her own colour comes from data, so it is set inline
          <div
            className={`absolute inset-0 flex items-center justify-center text-8xl font-black text-white/90 ${dimmed ? 'opacity-40' : ''}`}
            style={{ backgroundColor: persona.gradientTo || DEFAULT_GRADIENT.to }}
            aria-hidden="true"
          >
            {persona.name?.[0]?.toUpperCase()}
          </div>
        )}

        {/* Neutral scrim so her first line stays readable on any photo */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" /> {/* taste-skill-ignore: neutral scrim over a photo */}

        {persona.previewMessage && (
          <p className="absolute inset-x-3 bottom-3 w-fit max-w-[calc(100%-1.5rem)] rounded-[1.2rem] rounded-bl-md bg-brand-card px-3.5 py-2 text-[15px] leading-snug text-brand-text">
            <span className="line-clamp-2">{persona.previewMessage}</span>
          </p>
        )}
      </div>

      <div className="mt-3 flex items-start justify-between gap-3 px-1">
        <div className="min-w-0">
          <div className="heading truncate text-2xl">{name}</div>
          {persona.tagline && <div className="mt-1 text-[15px] leading-snug text-brand-muted">{traitSentence(persona.tagline)}</div>}
        </div>
        {cta && interactive && (
          <span
            aria-hidden="true"
            className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-card text-brand-text transition-colors duration-150 group-hover:bg-brand-rose group-hover:text-white"
          >
            <ArrowRight size={18} strokeWidth={2.5} />
          </span>
        )}
      </div>
    </>
  )

  if (to) {
    return (
      <Link to={to} className={`${frame} rounded-3xl transition-transform duration-150 active:scale-[0.99]`}>
        {content}
      </Link>
    )
  }

  if (!onClick) return <div className={frame}>{content}</div>

  return (
    <button type="button" onClick={onClick} className={`${frame} rounded-3xl transition-transform duration-150 active:scale-[0.99]`}>
      {content}
    </button>
  )
}
