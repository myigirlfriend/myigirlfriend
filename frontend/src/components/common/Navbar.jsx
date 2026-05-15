import { NavLink, useLocation } from 'react-router-dom'
import { useAuthStore } from '@store/index'
import { useChatStore, usePersonaStore } from '@store/index'

// ─── Custom SVG Icons unique to myigirlfriend ─────────────────

function HomeIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="homeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9B59B6" />
          <stop offset="100%" stopColor="#E91E8C" />
        </linearGradient>
      </defs>
      {/* Heart-shaped home */}
      <path
        d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 12 21 12 21Z"
        fill={active ? 'url(#homeGrad)' : 'none'}
        stroke={active ? 'none' : '#6b7280'}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChatIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="chatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9B59B6" />
          <stop offset="100%" stopColor="#E91E8C" />
        </linearGradient>
      </defs>
      {/* Chat bubble with 3 dots */}
      <path
        d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
        fill={active ? 'url(#chatGrad)' : 'none'}
        stroke={active ? 'none' : '#6b7280'}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Dots */}
      {active && (
        <>
          <circle cx="9" cy="10" r="1" fill="white" />
          <circle cx="12" cy="10" r="1" fill="white" />
          <circle cx="15" cy="10" r="1" fill="white" />
        </>
      )}
      {!active && (
        <>
          <circle cx="9" cy="10" r="1" fill="#6b7280" />
          <circle cx="12" cy="10" r="1" fill="#6b7280" />
          <circle cx="15" cy="10" r="1" fill="#6b7280" />
        </>
      )}
    </svg>
  )
}

function PlansIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="plansGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9B59B6" />
          <stop offset="100%" stopColor="#E91E8C" />
        </linearGradient>
      </defs>
      {/* Crown / premium icon */}
      <path
        d="M2 19H22M3 19L5 9L9 13L12 5L15 13L19 9L21 19"
        stroke={active ? 'url(#plansGrad)' : '#6b7280'}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={active ? 'url(#plansGrad)' : 'none'}
        fillOpacity={active ? '0.15' : '0'}
      />
    </svg>
  )
}

function MeIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="meGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9B59B6" />
          <stop offset="100%" stopColor="#E91E8C" />
        </linearGradient>
      </defs>
      {/* Person with subtle heart */}
      <circle
        cx="12" cy="8" r="4"
        fill={active ? 'url(#meGrad)' : 'none'}
        stroke={active ? 'none' : '#6b7280'}
        strokeWidth="1.8"
      />
      <path
        d="M4 20C4 17 7.58 15 12 15C16.42 15 20 17 20 20"
        stroke={active ? 'url(#meGrad)' : '#6b7280'}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

// ─── Navbar ───────────────────────────────────────────────────
export default function Navbar() {
  const user = useAuthStore(s => s.user)
  const location = useLocation()

  const hidden = ['/', '/login', '/register'].includes(location.pathname)
    || location.pathname.startsWith('/operator')
  if (!user || hidden) return null
  const chatPath = '/chat'

  const NAV_ITEMS = [
    { path: '/personas',     label: 'Home',  Icon: HomeIcon },
    { path: chatPath,        label: 'Chat',  Icon: ChatIcon,  match: '/chat' },
    { path: '/subscription', label: 'Plans', Icon: PlansIcon },
    { path: '/profile',      label: 'Me',    Icon: MeIcon },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-brand-surface border-t border-brand-border px-2">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = item.match
            ? location.pathname.startsWith(item.match)
            : location.pathname === item.path
          const { Icon } = item

          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 py-3 px-4 text-xs font-bold transition-all duration-200 ${
                isActive ? 'gradient-text' : 'text-brand-muted'
              }`}
            >
              <Icon active={isActive} />
              <span>{item.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-brand-pink" />
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}