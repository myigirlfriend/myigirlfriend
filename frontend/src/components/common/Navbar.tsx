import { Link, NavLink, useLocation } from 'react-router-dom'
import { Crown, Heart, MessageCircle, User, type LucideIcon } from 'lucide-react'
import { useAuthStore, useSubStore } from '@store/index'
import ButtonLink from './ButtonLink'
import Logo from './Logo'

interface NavItem {
  path: string
  label: string
  Icon: LucideIcon
}

const NAV_ITEMS: NavItem[] = [
  { path: '/personas', label: 'Companions', Icon: Heart },
  { path: '/chat', label: 'Chats', Icon: MessageCircle },
  { path: '/subscription', label: 'Plans', Icon: Crown },
  { path: '/profile', label: 'Profile', Icon: User },
]

const HIDDEN_ON = ['/', '/login', '/register']

/** Hidden on the public pages, the team dashboard and inside a conversation (which has its own header). */
const isHidden = (pathname: string) =>
  HIDDEN_ON.includes(pathname) || pathname.startsWith('/operator') || /^\/chat\/[^/]+/.test(pathname)

/** Member navigation: a top bar on wide screens, a tab bar within thumb reach on phones. */
export default function Navbar() {
  const user = useAuthStore((s) => s.user)
  const isPaid = useSubStore((s) => s.subStatus === 'active')
  const { pathname } = useLocation()

  if (!user || isHidden(pathname)) return null

  return (
    <>
      {/* Wide screens */}
      <header className="fixed inset-x-0 top-0 z-40 hidden bg-brand-dark md:block">
        <div className="frame flex h-16 items-center gap-8">
          <Link to="/personas" className="rounded-full" aria-label="myigirlfriend, companions">
            <Logo />
          </Link>
          <nav aria-label="Main" className="flex flex-1 items-center gap-1">
            {NAV_ITEMS.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-[15px] font-extrabold transition-colors duration-150 ${
                    isActive ? 'bg-brand-card text-brand-text' : 'text-brand-muted hover:text-brand-text'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          {!isPaid && <ButtonLink to="/subscription" size="sm">Upgrade</ButtonLink>}
        </div>
      </header>

      {/* Phones */}
      <nav aria-label="Main" className="pb-safe fixed inset-x-0 bottom-0 z-40 bg-brand-surface md:hidden">
        <div className="mx-auto flex max-w-lg items-stretch justify-around px-2">
          {NAV_ITEMS.map(({ path, label, Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex min-w-[4.5rem] flex-col items-center gap-1 px-3 pb-2.5 pt-3 text-[13px] font-extrabold transition-colors duration-150 ${
                  isActive ? 'text-brand-pink' : 'text-brand-muted hover:text-brand-text'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={22} strokeWidth={2.2} fill={isActive ? 'currentColor' : 'none'} aria-hidden="true" />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  )
}
