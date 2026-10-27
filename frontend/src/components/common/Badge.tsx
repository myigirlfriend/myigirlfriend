import type { ReactNode } from 'react'

type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'danger'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const VARIANTS: Record<BadgeVariant, string> = {
  default: 'bg-brand-raised text-brand-muted',
  accent: 'bg-brand-rose text-white',
  success: 'bg-emerald-400/15 text-emerald-300',
  warning: 'bg-amber-400/15 text-amber-200',
  danger: 'bg-red-400/15 text-red-300',
}

/** Small pill for a real status, such as "Current plan" or "Hidden". */
export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[13px] font-bold leading-none ${VARIANTS[variant]} ${className}`}>
      {children}
    </span>
  )
}
