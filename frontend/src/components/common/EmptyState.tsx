import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import IconTile from './IconTile'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  /** Usually a Button or ButtonLink */
  action?: ReactNode
}

/** What a list shows when there is nothing in it yet. */
export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="surface flex flex-col items-center px-6 py-14 text-center">
      <IconTile icon={icon} className="mb-5" />
      <h2 className="heading text-2xl">{title}</h2>
      {description && <p className="mt-2 max-w-sm text-base leading-relaxed text-brand-muted">{description}</p>}
      {action && <div className="mt-7">{action}</div>}
    </div>
  )
}
