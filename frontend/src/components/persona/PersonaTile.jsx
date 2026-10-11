/**
 * Portrait card for a model: the same tile members see when choosing who to talk to.
 * Photos are portrait, so the tile keeps a 3:4 shape and anchors the crop to the top (faces stay in frame).
 */
export default function PersonaTile({ persona, onClick, dimmed = false, className = '' }) {
  const Tag = onClick ? 'button' : 'div'
  const from = persona.gradientFrom || '#9B59B6'
  const to = persona.gradientTo || '#E91E8C'

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`group relative block w-full aspect-[3/4] overflow-hidden rounded-2xl bg-brand-card text-left
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink
        ${onClick ? 'active:scale-[0.99] transition-transform duration-150' : ''} ${className}`}
    >
      {persona.image ? (
        <img
          src={persona.image}
          alt={persona.name || ''}
          className={`absolute inset-0 h-full w-full object-cover object-top
            ${onClick ? 'motion-safe:transition-transform motion-safe:duration-500 group-hover:scale-[1.03]' : ''}
            ${dimmed ? 'grayscale opacity-50' : ''}`}
        />
      ) : (
        <div
          className={`absolute inset-0 flex items-center justify-center text-6xl font-extrabold text-white/90 ${dimmed ? 'opacity-50' : ''}`}
          style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
          aria-hidden="true"
        >
          {persona.name?.[0]?.toUpperCase()}
        </div>
      )}

      {/* Scrim so the name stays readable on any photo */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.94) 0%, rgba(10,10,10,0.45) 38%, rgba(10,10,10,0) 62%)' }}
      />

      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
        <div className="text-base sm:text-lg font-extrabold leading-tight text-white">
          {persona.name || 'Her name'}
        </div>
        {persona.tagline && (
          <div className="mt-0.5 text-xs sm:text-sm font-semibold text-white/80">{persona.tagline}</div>
        )}
        {persona.previewMessage && (
          <div className="mt-2 rounded-xl bg-white/10 px-2.5 py-1.5 backdrop-blur-sm">
            <p className="text-xs leading-snug text-white/90 line-clamp-2">{persona.previewMessage}</p>
          </div>
        )}
        <div className="mt-2.5 h-0.5 w-8 rounded-full" style={{ background: `linear-gradient(90deg, ${from}, ${to})` }} />
      </div>
    </Tag>
  )
}
