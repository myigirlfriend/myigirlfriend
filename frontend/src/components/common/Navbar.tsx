import { useId, type ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuthStore } from '@store/index'
import BrandGradient from './BrandGradient'

// ─── Custom SVG icons unique to myigirlfriend ─────────────────
// Outlined in the current text colour when idle, filled with the brand gradient when active.

interface NavIconProps {
  active: boolean
}

function NavIcon({ children }: { children: (gradient: string) => ReactNode }) {
  const gradientId = useId()
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <BrandGradient id={gradientId} />
      {children(`url(#${gradientId})`)}
    </svg>
  )
}

// Heart-shaped home
function HomeIcon({ active }: NavIconProps) {
  return (
    <NavIcon>
      {(gradient) => (
        <path
          d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 12 21 12 21Z"
          fill={active ? gradient : 'none'}
          stroke={active ? 'none' : 'currentColor'}
        />
      )}
    </NavIcon>
  )
}

// Chat bubble with 3 dots
function ChatIcon({ active }: NavIconProps) {
  return (
    <NavIcon>
      {(gradient) => (
        <>
          <path
            d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
            fill={active ? gradient : 'none'}
            stroke={active ? 'none' : 'currentColor'}
          />
          {[9, 12, 15].map((cx) => (
            <circle key={cx} cx={cx} cy="10" r="1" fill={active ? 'white' : 'currentColor'} />
          ))}
        </>
      )}
    </NavIcon>
  )
}

// Crown
function PlansIcon({ active }: NavIconProps) {
  return (
    <NavIcon>
      {(gradient) => (
        <path
          d="M2 19H22M3 19L5 9L9 13L12 5L15 13L19 9L21 19"
          stroke={active ? gradient : 'currentColor'}
          fill={active ? gradient : 'none'}
          fillOpacity={active ? 0.15 : 0}
        />
      )}
    </NavIcon>
  )
}

// Person
function MeIcon({ active }: NavIconProps) {
  return (
    <NavIcon>
      {(gradient) => (
        <>
          <circle cx="12" cy="8" r="4" fill={active ? gradient : 'none'} stroke={active ? 'none' : 'currentColor'} />
          <path d="M4 20C4 17 7.58 15 12 15C16.42 15 20 17 20 20" stroke={active ? gradient : 'currentColor'} />
        </>
      )}
    </NavIcon>
  )
}

const NAV_ITEMS = [
  { path: '/personas',     label: 'Home',  Icon: HomeIcon },
  { path: '/chat',         label: 'Chat',  Icon: ChatIcon },
  { path: '/subscription', label: 'Plans', Icon: PlansIcon },
  { path: '/profile',      label: 'Me',    Icon: MeIcon },
]

const HIDDEN_ON = ['/', '/login', '/register']

/** Bottom tab bar for signed-in members. */
export default function Navbar() {
  const user = useAuthStore((s) => s.user)
  const { pathname } = useLocation()

  if (!user || HIDDEN_ON.includes(pathname) || pathname.startsWith('/operator')) return null

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-border bg-brand-surface px-2 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {NAV_ITEMS.map(({ path, label, Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 rounded-lg px-4 py-3 text-xs font-bold transition-colors duration-150 ${
                isActive ? 'text-white' : 'text-brand-muted hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon active={isActive} />
                <span className={isActive ? 'gradient-text' : ''}>{label}</span>
                <span className={`h-1 w-1 rounded-full ${isActive ? 'bg-brand-pink' : 'bg-transparent'}`} />
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
