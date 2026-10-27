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

/** Frame for the signed-in tab screens: one title style, room for the top bar (wide screens) and the tab bar (phones). */
export default function MemberPage({ title, tabTitle, subtitle, actions, wide = false, children }: MemberPageProps) {
  usePageTitle(tabTitle ?? title)

  return (
    <div className="page pb-32 md:pb-24 md:pt-16">
      <div className={`frame ${wide ? '' : 'max-w-[52rem]'}`}>
        <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4 pb-8 pt-10 md:pb-10 md:pt-14">
          <div className="min-w-0">
            <h1 className="heading text-4xl md:text-6xl">{title}</h1>
            {subtitle && <p className="mt-3 max-w-xl text-[17px] leading-relaxed text-brand-muted">{subtitle}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
        {children}
      </div>
    </div>
  )
}
