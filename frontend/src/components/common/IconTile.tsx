import type { LucideIcon } from 'lucide-react'

interface IconTileProps {
  icon: LucideIcon
  size?: 'md' | 'lg'
  className?: string
}

const SIZES = {
  md: { box: 'h-14 w-14', icon: 26 },
  lg: { box: 'h-16 w-16', icon: 30 },
} as const

/** The plum disc with a pink icon that heads an empty state or a status screen. */
export default function IconTile({ icon: Icon, size = 'md', className = '' }: IconTileProps) {
  return (
    <div
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-brand-plum text-brand-pink ${SIZES[size].box} ${className}`}
    >
      <Icon size={SIZES[size].icon} strokeWidth={2.2} />
    </div>
  )
}
