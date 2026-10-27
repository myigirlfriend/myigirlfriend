import type { ReactNode } from 'react'

interface StatProps {
  label: string
  value: ReactNode
  /** One short line under the value */
  note?: ReactNode
  className?: string
}

/** A figure with its label. Used on the member profile and the operator overview. */
export default function Stat({ label, value, note, className = '' }: StatProps) {
  return (
    <div className={`surface p-5 ${className}`}>
      <div className="text-sm font-semibold text-brand-muted">{label}</div>
      <div className="heading mt-2 text-4xl tabular-nums">{value}</div>
      {note && <div className="mt-1.5 text-sm text-brand-muted">{note}</div>}
    </div>
  )
}
