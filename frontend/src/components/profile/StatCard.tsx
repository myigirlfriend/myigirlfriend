import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  icon: LucideIcon
  value: number
  label: string
  /** Tailwind classes for the icon and its tinted background, e.g. "bg-brand-pink/15 text-brand-pink" */
  tone: string
}

export default function StatCard({ icon: Icon, value, label, tone }: StatCardProps) {
  return (
    <div className="surface flex flex-col items-center justify-center gap-1 p-4">
      <div className={`mb-1 flex h-8 w-8 items-center justify-center rounded-xl ${tone}`}>
        <Icon size={16} aria-hidden="true" />
      </div>
      <div className="text-2xl font-extrabold tabular-nums text-white">{value}</div>
      <div className="text-center text-xs font-medium leading-tight text-brand-muted">{label}</div>
    </div>
  )
}
