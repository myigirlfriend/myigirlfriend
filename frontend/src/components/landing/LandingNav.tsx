import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import ButtonLink from '@components/common/ButtonLink'
import IconButton from '@components/common/IconButton'
import Logo from '@components/common/Logo'

// Real pages use the router; sections of the home page are plain links, so they scroll on the home page and navigate from anywhere else
export const SECTION_LINKS = [
  { href: '/companions', label: 'Companions', page: true },
  { href: '/#how-it-works', label: 'How it works', page: false },
  { href: '/#pricing', label: 'Pricing', page: false },
  { href: '/guides', label: 'Guides', page: true },
  { href: '/#faq', label: 'FAQ', page: false },
]

/** A nav link: the router for pages, a plain anchor for a section of the home page. */
export function SiteLink({ href, page, className, children, onClick }: { href: string; page: boolean; className: string; children: ReactNode; onClick?: () => void }) {
  return page
    ? <Link to={href} className={className} onClick={onClick}>{children}</Link>
    : <a href={href} className={className} onClick={onClick}>{children}</a>
}

/** The landing page's sticky top bar. */
export default function LandingNav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-brand-dark pt-[env(safe-area-inset-top,0px)]">
      <nav aria-label="Main" className="frame flex h-[4.5rem] items-center justify-between gap-6">
        <Link to="/" className="rounded-full" aria-label="myigirlfriend home">
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {SECTION_LINKS.map((link) => (
            <SiteLink key={link.href} {...link} className="rounded-full px-4 py-2 text-[15px] font-bold text-brand-muted transition-colors hover:text-brand-text">
              {link.label}
            </SiteLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Link to="/login" className="rounded-full px-4 py-2 text-[15px] font-extrabold text-brand-text transition-colors hover:bg-white/[0.06]">Sign in</Link>
          <ButtonLink to="/register" size="sm">Find your match</ButtonLink>
        </div>

        <IconButton
          label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="landing-menu"
          onClick={() => setOpen(!open)}
          className="text-brand-text lg:hidden"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </IconButton>
      </nav>

      {open && (
        <div id="landing-menu" className="frame pb-5 lg:hidden">
          <div className="flex flex-col gap-1 rounded-3xl bg-brand-surface p-3">
            {SECTION_LINKS.map((link) => (
              <SiteLink key={link.href} {...link} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-lg font-extrabold text-brand-text hover:bg-brand-card">
                {link.label}
              </SiteLink>
            ))}
            <Link to="/login" className="rounded-2xl px-4 py-3 text-lg font-extrabold text-brand-text hover:bg-brand-card">Sign in</Link>
            <ButtonLink to="/register" size="lg" fullWidth className="mt-2">Find your match</ButtonLink>
          </div>
        </div>
      )}
    </header>
  )
}
