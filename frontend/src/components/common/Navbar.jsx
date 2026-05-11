import { NavLink, useLocation } from 'react-router-dom'
import { useAuthStore } from '@store/index'
import { useChatStore, usePersonaStore } from '@store/index'

export default function Navbar() {
  const user = useAuthStore(s => s.user)
  const location = useLocation()
  const activeConversationId = useChatStore(s => s.activeConversationId)
  const activePersona = usePersonaStore(s => s.activePersona)

  // Hide on auth/landing/operator pages
  const hidden = ['/', '/login', '/register'].includes(location.pathname)
    || location.pathname.startsWith('/operator')
  if (!user || hidden) return null

  // Chat goes to active convo if exists, otherwise personas to pick one
  const chatPath = activeConversationId
    ? `/chat/${activeConversationId}`
    : '/personas'

  const NAV_ITEMS = [
    { path: '/personas',    label: 'Home',  icon: '🏠' },
    { path: chatPath,       label: 'Chat',  icon: '💬', match: '/chat' },
    { path: '/subscription', label: 'Plans', icon: '⭐' },
    { path: '/profile',     label: 'Me',    icon: '👤' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-brand-surface border-t border-brand-border px-2">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = item.match
            ? location.pathname.startsWith(item.match)
            : location.pathname === item.path
          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 py-3 px-4 text-xs font-bold transition-all duration-200 ${
                isActive ? 'gradient-text' : 'text-brand-muted'
              }`}
            >
              <span className="text-xl leading-none">{item.icon}</span>
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