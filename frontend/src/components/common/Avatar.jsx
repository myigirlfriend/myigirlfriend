export default function Avatar({ persona, name, size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-xl'
  }

  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  if (persona?.image) {
    return (
      <div
        className={`${sizes[size]} rounded-full overflow-hidden shrink-0 ${className}`}
        style={{ border: `2px solid ${persona.accentColor || '#9B59B6'}` }}
      >
        <img
          src={persona.image}
          alt={persona.name}
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  if (persona) {
    return (
      <div
        className={`${sizes[size]} rounded-full flex items-center justify-center font-bold text-white shrink-0 ${className}`}
        style={{ background: `linear-gradient(135deg, ${persona.gradientFrom ?? '#9B59B6'}, ${persona.gradientTo ?? '#E91E8C'})` }}
      >
        {persona.name?.[0]}
      </div>
    )
  }

  return (
    <div className={`${sizes[size]} rounded-full flex items-center justify-center font-bold text-white shrink-0 bg-brand-gradient ${className}`}>
      {initials}
    </div>
  )
}