import { initials } from '@utils/text'
import type { AvatarPersona } from '@/types'

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  /** A companion: shows her photo, or her initial on her own gradient */
  persona?: AvatarPersona | null
  /** A person without a photo: shows their initials on the brand gradient */
  name?: string
  size?: AvatarSize
  /** Adds the green "online" dot */
  online?: boolean
  className?: string
}

const SIZES: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-20 w-20 text-2xl',
}

/** The one round avatar, for companions and people alike. */
export default function Avatar({ persona, name, size = 'md', online = false, className = '' }: AvatarProps) {
  const face = 'flex h-full w-full items-center justify-center font-bold text-white'

  return (
    <span className={`relative inline-block shrink-0 ${SIZES[size]} ${className}`}>
      <span
        className="block h-full w-full overflow-hidden rounded-full border-2 border-brand-purple"
        style={persona?.accentColor ? { borderColor: persona.accentColor } : undefined}
      >
        {persona?.image ? (
          <img src={persona.image} alt={persona.name} className="h-full w-full object-cover" />
        ) : persona ? (
          <span
            className={`${face} bg-brand-gradient`}
            style={persona.gradientFrom && persona.gradientTo
              ? { backgroundImage: `linear-gradient(135deg, ${persona.gradientFrom}, ${persona.gradientTo})` }
              : undefined}
          >
            {persona.name?.[0]?.toUpperCase() ?? '?'}
          </span>
        ) : (
          <span className={`${face} bg-brand-gradient`}>{initials(name)}</span>
        )}
      </span>

      {online && (
        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-brand-dark bg-emerald-400">
          <span className="sr-only">Online</span>
        </span>
      )}
    </span>
  )
}
