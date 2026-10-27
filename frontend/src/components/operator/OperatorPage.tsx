import type { ReactNode } from 'react'

interface OperatorPageProps {
  title: string
  subtitle?: ReactNode
  /** Buttons shown to the right of the title */
  actions?: ReactNode
  /** Shown above the title, e.g. a back link */
  before?: ReactNode
  /** Keeps lists and forms to a readable width; grids use the full width */
  narrow?: boolean
  children: ReactNode
}

/** Frame for the team dashboard screens: one title style and one content width. */
export default function OperatorPage({ title, subtitle, actions, before, narrow = false, children }: OperatorPageProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12">
      <div className={narrow ? 'max-w-3xl' : ''}>
        {before}
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="heading text-3xl sm:text-4xl">{title}</h1>
            {subtitle && <p className="mt-2 text-base text-brand-muted">{subtitle}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  )
}
