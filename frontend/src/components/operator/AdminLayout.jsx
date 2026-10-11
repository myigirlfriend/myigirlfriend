import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, Heart, MessagesSquare, Clock, LogOut, Menu, X } from 'lucide-react'
import { useAuthStore } from '@store/index'
import AgentHours from '@components/operator/AgentHours'

const NAV = [
  { to: '/operator', end: true, label: 'Overview', icon: LayoutDashboard, adminOnly: true },
  { to: '/operator/models', label: 'Models', icon: Heart, adminOnly: true },
  { to: '/operator/chats', label: 'Conversations', icon: MessagesSquare },
  { to: '/operator/hours', label: 'Agent hours', icon: Clock, adminOnly: true },
]

function Rail({ operator, onSignOut }) {
  const isAdmin = operator?.role === 'admin'
  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pt-6 pb-6 leading-tight">
        <div className="text-base font-extrabold gradient-text">myigirlfriend</div>
        <div className="mt-0.5 text-xs text-zinc-400">{isAdmin ? 'Admin dashboard' : 'Agent dashboard'}</div>
      </div>

      <nav aria-label="Dashboard sections" className="flex-1 space-y-1 px-3">
        {NAV.filter(item => isAdmin || !item.adminOnly).map(({ to, end, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors duration-150
               focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-pink
               ${isActive ? 'bg-white/[0.06] text-white' : 'text-zinc-400 hover:bg-white/[0.03] hover:text-white'}`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-brand-gradient" />}
                <Icon size={18} strokeWidth={2} aria-hidden="true" />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <AgentHours />

      <div className="flex items-center justify-between gap-2 border-t border-brand-border px-5 py-4">
        <div className="min-w-0">
          <div className="truncate text-sm font-bold text-white">{operator?.name}</div>
          <div className="truncate text-xs text-zinc-400">{operator?.email}</div>
        </div>
        <button
          onClick={onSignOut}
          aria-label="Sign out"
          title="Sign out"
          className="shrink-0 rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white transition-colors
                     focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-pink"
        >
          <LogOut size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const operator = useAuthStore(s => s.operator)
  const clearAuth = useAuthStore(s => s.clearAuth)
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  // Close the mobile menu after navigating
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const current = NAV.find(n => (n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)))

  return (
    <div className="flex h-[100dvh] bg-brand-dark text-brand-text">
      {/* Desktop rail */}
      <aside className="hidden lg:block w-60 shrink-0 border-r border-brand-border bg-brand-surface">
        <Rail operator={operator} onSignOut={clearAuth} />
      </aside>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMenuOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 max-w-[85vw] border-r border-brand-border bg-brand-surface">
            <Rail operator={operator} onSignOut={clearAuth} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <div className="lg:hidden flex h-14 shrink-0 items-center gap-3 border-b border-brand-border bg-brand-surface px-3">
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="rounded-lg p-2 text-white hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-pink"
          >
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
          <div className="text-sm font-extrabold text-white">{current?.label || 'Dashboard'}</div>
        </div>

        <main className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
