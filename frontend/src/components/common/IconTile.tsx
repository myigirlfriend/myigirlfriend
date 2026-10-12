import type { LucideIcon } from 'lucide-react'

interface IconTileProps {
  icon: LucideIcon
  size?: 'md' | 'lg'
  className?: string
}

const SIZES = {
  md: { box: 'h-14 w-14', icon: 26 },
  lg: { box: 'h-16 w-16', icon: 28 },
} as const

/** The gradient square that heads a page or an empty state. */
export default function IconTile({ icon: Icon, size = 'md', className = '' }: IconTileProps) {
  return (
    <div
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-brand ${SIZES[size].box} ${className}`}
    >
      <Icon size={SIZES[size].icon} />
    </div>
  )
}
