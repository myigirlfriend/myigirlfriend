import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, ChevronRight, Clock, Crown, Flame, Heart, LogOut, MessageCircle, Settings, Star, Zap } from 'lucide-react'
import Avatar from '@components/common/Avatar'
import Badge from '@components/common/Badge'
import IconButton from '@components/common/IconButton'
import MemberPage from '@components/layout/MemberPage'
import GeneratedAvatar from '@components/profile/GeneratedAvatar'
import StatCard from '@components/profile/StatCard'
import { getPersonaById } from '@config/personas'
import { planLabel } from '@config/plans'
import { useAuth } from '@hooks/useAuth'
import { usePersona } from '@hooks/usePersona'
import { useSubscription } from '@hooks/useSubscription'
import { profileApi } from '@services/api'
import { plural } from '@utils/text'
import type { ProfileStats } from '@/types'

const SETTINGS_LINKS = [
  { label: 'Change password', to: '/forgot-password' },
  { label: 'Subscription and billing', to: '/subscription' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
]

const MS_PER_DAY = 86400000

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const { plan, isPaid } = useSubscription()
  const { openConversation } = usePersona()
  const [stats, setStats] = useState<ProfileStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    profileApi.stats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const recent = stats?.recentConversations ?? []

  // Favourite companion — the conversation with the most messages
  const favourite = recent.reduce<(typeof recent)[number] | null>(
    (top, c) => (c.messageCount > (top?.messageCount ?? 0) ? c : top), null)
  const favouritePersona = favourite ? getPersonaById(favourite.personaName) : null

  const joined = user?.createdAt ? new Date(user.createdAt) : null
  const daysActive = joined ? Math.max(1, Math.floor((Date.now() - joined.getTime()) / MS_PER_DAY)) : 1
  const memberSince = joined?.toLocaleDateString([], { month: 'long', year: 'numeric' })

  return (
    <MemberPage
      title="Profile"
      actions={
        <>
          <IconButton label="Settings" variant="surface" aria-expanded={showSettings} onClick={() => setShowSettings((open) => !open)}>
            <Settings size={16} />
          </IconButton>
          <IconButton label="Sign out" variant="surface" onClick={logout}>
            <LogOut size={16} />
          </IconButton>
        </>
      }
    >
      <div className="space-y-3">
        {showSettings && (
          <nav aria-label="Settings" className="surface overflow-hidden">
            {SETTINGS_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center justify-between border-b border-white/5 px-4 py-3 text-sm text-brand-muted transition-colors last:border-0 hover:bg-white/5 hover:text-white"
              >
                {link.label}
                <ChevronRight size={14} aria-hidden="true" />
              </Link>
            ))}
          </nav>
        )}

        {/* Profile hero card */}
        <section className="surface surface--accent rounded-3xl p-5">
          <div className="flex items-center gap-4">
            <GeneratedAvatar name={user?.name} size={72} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-xl font-extrabold leading-tight text-white">{user?.name}</div>
              <div className="mt-1 truncate text-xs text-brand-muted">{user?.email}</div>
              {memberSince && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-brand-muted">
                  <Calendar size={11} className="text-brand-purple" aria-hidden="true" />
                  Since {memberSince}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Crown size={15} className={isPaid ? 'text-amber-300' : 'text-brand-muted'} aria-hidden="true" />
              {isPaid ? `${planLabel(plan)} plan` : 'Free plan'}
            </div>
            {isPaid ? (
              <Badge variant="success">Active</Badge>
            ) : (
              <Link to="/subscription" className="btn btn--primary btn--xs">
                <Zap size={12} aria-hidden="true" />
                Upgrade
              </Link>
            )}
          </div>
        </section>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)
          ) : (
            <>
              <StatCard icon={MessageCircle} value={stats?.totalMessages || 0} label="Messages" tone="bg-brand-purple/15 text-brand-purple" />
              <StatCard icon={Heart} value={stats?.totalConversations || 0} label="Companions" tone="bg-brand-pink/15 text-brand-pink" />
              <StatCard icon={Flame} value={daysActive} label="Days active" tone="bg-amber-400/15 text-amber-300" />
            </>
          )}
        </div>

        {/* Favourite companion */}
        {favourite && favouritePersona && (
          <section className="surface p-4">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
              <Star size={14} className="text-amber-300" aria-hidden="true" />
              Favourite companion
            </h2>
            <button
              type="button"
              onClick={() => openConversation(favourite.id, favouritePersona)}
              className="flex w-full items-center gap-3 rounded-xl text-left transition-opacity hover:opacity-80"
            >
              <Avatar persona={favouritePersona} size="lg" />
              <span className="min-w-0 flex-1">
                <span className="block font-bold text-white">{favouritePersona.name}</span>
                <span className="block truncate text-xs text-brand-muted">{favouritePersona.tagline}</span>
                <span className="mt-0.5 block text-xs text-brand-muted">{plural(favourite.messageCount, 'message')} together</span>
              </span>
              <ChevronRight size={16} className="shrink-0 text-brand-muted" aria-hidden="true" />
            </button>
          </section>
        )}

        {/* Recent chats */}
        {recent.length > 0 && (
          <section className="surface overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
              <h2 className="flex items-center gap-2 text-sm font-bold text-white">
                <Clock size={14} className="text-brand-purple" aria-hidden="true" />
                Recent chats
              </h2>
              <Link to="/chat" className="rounded text-xs font-semibold text-brand-pink hover:underline">See all</Link>
            </div>

            <ul className="divide-y divide-white/5">
              {recent.map((conversation) => {
                const persona = getPersonaById(conversation.personaName)
                const name = persona?.name || conversation.personaName || 'Unknown'

                return (
                  <li key={conversation.id}>
                    <button
                      type="button"
                      onClick={() => openConversation(conversation.id, persona)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5"
                    >
                      <Avatar persona={persona ?? { name }} online />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-white">{name}</span>
                        <span className="block text-xs text-brand-muted">
                          {plural(conversation.messageCount, 'message')} · {conversation.date}
                        </span>
                      </span>
                      <ChevronRight size={14} className="shrink-0 text-brand-muted" aria-hidden="true" />
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        )}
      </div>
    </MemberPage>
  )
}
