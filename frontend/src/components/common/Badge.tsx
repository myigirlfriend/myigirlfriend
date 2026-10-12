import type { ReactNode } from 'react'

type BadgeVariant = 'default' | 'gradient' | 'success' | 'warning' | 'danger'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const VARIANTS: Record<BadgeVariant, string> = {
  default: 'border-brand-border bg-brand-card text-brand-muted',
  gradient: 'border-transparent bg-brand-gradient bg-origin-border text-white',
  success: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  warning: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
  danger: 'border-red-400/30 bg-red-400/10 text-red-400',
}

/** Small pill for a status or a label such as "Most popular". */
export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-bold ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
