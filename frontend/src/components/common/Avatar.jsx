/**
 * Avatar — shows persona emoji avatar or user initials
 */
export default function Avatar({ persona, name, size = 'md', className = '' }) {
  const sizes = { sm: 'w-8 h-8 text-sm', md: 'w-10 h-10 text-base', lg: 'w-14 h-14 text-xl' }

  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  if (persona) {
    return (
      <div
        className={`${sizes[size]} rounded-full flex items-center justify-center font-bold text-white shrink-0 ${className}`}
        style={{ background: `linear-gradient(135deg, ${persona.gradientFrom ?? '#9B59B6'}, ${persona.gradientTo ?? '#E91E8C'})` }}
      >
        {persona.emoji}
      </div>
    )
  }

  return (
    <div className={`${sizes[size]} rounded-full flex items-center justify-center font-bold text-white shrink-0 bg-brand-gradient ${className}`}>
      {initials}
    </div>
  )
}
