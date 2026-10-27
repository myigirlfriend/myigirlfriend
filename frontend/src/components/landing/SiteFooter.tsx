import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Logo from '@components/common/Logo'
import { SECTION_LINKS } from './LandingNav'
import { RedditIcon, TikTokIcon, XIcon } from './SocialIcons'

const SUPPORT_EMAIL = 'Customerservice@myigirlfriend.com'

const SOCIAL_LINKS = [
  { label: 'X', href: 'https://x.com/myigirlfriend?s=21', Icon: XIcon },
  { label: 'TikTok', href: 'https://www.tiktok.com/@myigirlfriend?_r=1&_t=ZN-96Jd88qwFSY', Icon: TikTokIcon },
  { label: 'Reddit', href: 'https://www.reddit.com/u/Myigirlfriend/s/S6wxKCZsNX', Icon: RedditIcon },
]

const ACCOUNT_LINKS = [
  { label: 'Create account', to: '/register' },
  { label: 'Sign in', to: '/login' },
  { label: 'Reset password', to: '/forgot-password' },
  { label: 'Team sign in', to: '/operator/login' },
]

const LEGAL_LINKS = [
  { label: 'Terms of Service', to: '/terms' },
  { label: 'Privacy Policy', to: '/privacy' },
]

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-base font-extrabold text-brand-text">{title}</h2>
      <ul className="mt-4 space-y-3 text-[15px]">{children}</ul>
    </div>
  )
}

export default function SiteFooter() {
  return (
    <footer className="bg-brand-dark pb-10 pt-[clamp(72px,8vw,120px)]">
      <div className="frame">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo size="lg" />
            <p className="mt-5 max-w-[34ch] text-base leading-relaxed text-brand-muted">
              Conversation, connection, something real. Someone to talk to, whenever you want.
            </p>
            <ul className="mt-6 flex gap-2">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`myigirlfriend on ${label}`}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-card text-brand-text transition-colors hover:bg-brand-rose"
                  >
                    <Icon />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <Column title="Explore">
            {SECTION_LINKS.map((link) => (
              <li key={link.href}><a href={link.href} className="link link--muted">{link.label}</a></li>
            ))}
          </Column>

          <Column title="Account">
            {ACCOUNT_LINKS.map((link) => (
              <li key={link.to}><Link to={link.to} className="link link--muted">{link.label}</Link></li>
            ))}
          </Column>

          <Column title="Help">
            <li>
              <span className="block text-brand-muted">Email support</span>
              <a href={`mailto:${SUPPORT_EMAIL}`} className="link mt-1 inline-block [overflow-wrap:anywhere]">{SUPPORT_EMAIL}</a>
            </li>
            {LEGAL_LINKS.map((link) => (
              <li key={link.to}><Link to={link.to} className="link link--muted">{link.label}</Link></li>
            ))}
          </Column>
        </div>

        <p className="mt-16 text-sm text-brand-muted">© {new Date().getFullYear()} myigirlfriend. For adults 18 and over.</p>
      </div>
    </footer>
  )
}
