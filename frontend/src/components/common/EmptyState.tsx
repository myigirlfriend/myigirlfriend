import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import IconTile from './IconTile'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  /** Usually a Button */
  action?: ReactNode
}

/** What a list shows when there is nothing in it yet. */
export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <IconTile icon={icon} className="mb-4" />
      <h2 className="text-base font-bold text-white">{title}</h2>
      {description && <p className="mt-1 text-sm leading-relaxed text-brand-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
