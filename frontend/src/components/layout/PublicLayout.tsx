import type { ReactNode } from 'react'
import LandingNav from '@components/landing/LandingNav'
import SiteFooter from '@components/landing/SiteFooter'

/** Frame of every public page: the top bar, the page, and the footer with links to the rest of the site. */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="page overflow-x-clip">
      <LandingNav />
      <main id="main">{children}</main>
      <SiteFooter />
    </div>
  )
}
