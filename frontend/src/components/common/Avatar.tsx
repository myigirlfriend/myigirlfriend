import { initials } from '@utils/text'
import type { AvatarPersona } from '@/types'

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  /** A companion: shows her photo, or her initial on her own colour */
  persona?: AvatarPersona | null
  /** A person without a photo: shows their initials */
  name?: string
  size?: AvatarSize
  /** Adds the green "online" dot */
  online?: boolean
  className?: string
}

const SIZES: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-24 w-24 text-3xl',
}

const DOT: Record<AvatarSize, string> = {
  sm: 'h-2.5 w-2.5 border-2',
  md: 'h-3 w-3 border-2',
  lg: 'h-3.5 w-3.5 border-2',
  xl: 'h-5 w-5 border-[3px]',
}

/** The one round avatar, for companions and people alike. */
export default function Avatar({ persona, name, size = 'md', online = false, className = '' }: AvatarProps) {
  const face = 'flex h-full w-full items-center justify-center font-black text-white'

  return (
    <span className={`relative inline-block shrink-0 ${SIZES[size]} ${className}`}>
      <span className="block h-full w-full overflow-hidden rounded-full bg-brand-raised">
        {persona?.image ? (
          <img src={persona.image} alt="" className="h-full w-full object-cover object-top" />
        ) : persona ? (
          // Her own colour comes from data, so it is set inline
          <span className={face} style={{ backgroundColor: persona.accentColor ?? persona.gradientTo ?? undefined }}>
            {persona.name?.[0]?.toUpperCase() ?? '?'}
          </span>
        ) : (
          <span className={`${face} bg-brand-plum-3`}>{initials(name)}</span>
        )}
      </span>

      {online && (
        <span className={`absolute bottom-0 right-0 rounded-full border-brand-dark bg-emerald-400 ${DOT[size]}`}>
          <span className="sr-only">Online</span>
        </span>
      )}
    </span>
  )
}
