import type { ReactNode } from 'react'
import { usePageTitle } from '@hooks/usePageTitle'

interface MemberPageProps {
  title: string
  subtitle?: ReactNode
  /** Browser tab title, when the on-page title is too long or too specific for it */
  tabTitle?: string
  /** Buttons shown to the right of the title */
  actions?: ReactNode
  /** Use the full content width, for grids. Lists and forms read better in the default narrow column. */
  wide?: boolean
  children: ReactNode
}

/** Frame for the signed-in tab screens: page backdrop, one title style, room for the bottom nav. */
export default function MemberPage({ title, tabTitle, subtitle, actions, wide = false, children }: MemberPageProps) {
  usePageTitle(tabTitle ?? title)

  return (
    <div className="page pb-28">
      <div className={`mx-auto px-4 sm:px-6 ${wide ? 'max-w-6xl' : 'max-w-2xl'}`}>
        <header className="flex items-start justify-between gap-4 pb-6 pt-10">
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold text-white">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-brand-muted">{subtitle}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
        {children}
      </div>
    </div>
  )
}
