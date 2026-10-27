import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, LogOut } from 'lucide-react'
import ConversationRow from '@components/chat/ConversationRow'
import Avatar from '@components/common/Avatar'
import Button from '@components/common/Button'
import ButtonLink from '@components/common/ButtonLink'
import Stat from '@components/common/Stat'
import MemberPage from '@components/layout/MemberPage'
import { getPersonaById } from '@config/personas'
import { planLabel } from '@config/plans'
import { useAuth } from '@hooks/useAuth'
import { usePersona } from '@hooks/usePersona'
import { useSubscription } from '@hooks/useSubscription'
import { profileApi } from '@services/api'
import { plural } from '@utils/text'
import type { ProfileStats } from '@/types'

const ACCOUNT_LINKS = [
  { label: 'Change password', to: '/forgot-password' },
  { label: 'Plan and billing', to: '/subscription' },
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

  useEffect(() => {
    profileApi.stats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const recent = stats?.recentConversations ?? []

  // Favourite companion: the conversation with the most messages
  const favourite = recent.reduce<(typeof recent)[number] | null>(
    (top, c) => (c.messageCount > (top?.messageCount ?? 0) ? c : top), null)
  const favouritePersona = favourite ? getPersonaById(favourite.personaName) : null

  const joined = user?.createdAt ? new Date(user.createdAt) : null
  const daysActive = joined ? Math.max(1, Math.floor((Date.now() - joined.getTime()) / MS_PER_DAY)) : 1
  const memberSince = joined?.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })

  return (
    <MemberPage
      tabTitle="Profile"
      title={user?.name || 'Your profile'}
      subtitle={<>{user?.email}{memberSince && <><br />With us since {memberSince}</>}</>}
      actions={
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut size={16} aria-hidden="true" /> Sign out
        </Button>
      }
    >
      <div className="space-y-12">
        {/* Plan */}
        <section aria-labelledby="plan-title" className={`flex flex-wrap items-center gap-x-6 gap-y-4 rounded-3xl p-6 sm:p-8 ${isPaid ? 'bg-brand-plum-3 text-white' : 'bg-brand-plum text-white'}`}>
          <div className="min-w-0 flex-1">
            <h2 id="plan-title" className="text-3xl font-black tracking-tight">{isPaid ? `${planLabel(plan)} plan` : 'Free plan'}</h2>
            <p className="mt-1.5 text-base font-semibold opacity-85">
              {isPaid ? 'Unlimited messages are on.' : 'Upgrade for unlimited messages and a companion who remembers more.'}
            </p>
          </div>
          {isPaid
            ? <ButtonLink to="/subscription" variant="secondary">Manage plan</ButtonLink>
            : <ButtonLink to="/subscription">See plans</ButtonLink>}
        </section>

        {/* Numbers */}
        <section aria-label="Your numbers" className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-[7.5rem] rounded-3xl" />)
          ) : (
            <>
              <Stat label="Messages" value={stats?.totalMessages || 0} />
              <Stat label="Conversations" value={stats?.totalConversations || 0} />
              <Stat label="Days with us" value={daysActive} />
            </>
          )}
        </section>

        {/* Favourite companion */}
        {favourite && favouritePersona && (
          <section aria-labelledby="favourite-title">
            <h2 id="favourite-title" className="heading mb-4 text-2xl">You talk to her most</h2>
            <button
              type="button"
              onClick={() => openConversation(favourite.id, favouritePersona)}
              className="surface group flex w-full items-center gap-5 overflow-hidden p-0 text-left transition-colors duration-150 hover:bg-brand-card"
            >
              <span className="relative block aspect-[4/5] w-28 shrink-0 bg-brand-card sm:w-36">
                {favouritePersona.image
                  ? <img src={favouritePersona.image} alt="" className="absolute inset-0 h-full w-full object-cover object-top" />
                  : <Avatar persona={favouritePersona} size="xl" className="m-4" />}
              </span>
              <span className="min-w-0 flex-1 py-5">
                <span className="heading block text-3xl">{favouritePersona.name}</span>
                <span className="mt-1.5 block text-base text-brand-muted">{plural(favourite.messageCount, 'message')} together</span>
                <span className="mt-4 inline-flex items-center gap-1 text-base font-extrabold text-brand-pink">
                  Open chat <ChevronRight size={18} aria-hidden="true" />
                </span>
              </span>
            </button>
          </section>
        )}

        {/* Recent chats */}
        {recent.length > 0 && (
          <section aria-labelledby="recent-title">
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <h2 id="recent-title" className="heading text-2xl">Recent chats</h2>
              <Link to="/chat" className="link link--accent text-base">All chats</Link>
            </div>
            <ul className="space-y-2">
              {recent.map((conversation) => {
                const persona = getPersonaById(conversation.personaName)
                const name = persona?.name || conversation.personaName || 'Unknown'
                return (
                  <li key={conversation.id}>
                    <ConversationRow
                      persona={persona ?? { name }}
                      title={name}
                      preview={plural(conversation.messageCount, 'message')}
                      meta={conversation.date}
                      onClick={() => openConversation(conversation.id, persona)}
                    />
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        {/* Account */}
        <section aria-labelledby="account-title">
          <h2 id="account-title" className="heading mb-4 text-2xl">Account</h2>
          <nav aria-label="Account" className="surface overflow-hidden">
            {ACCOUNT_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center justify-between px-5 py-4 text-base font-bold text-brand-text transition-colors duration-150 hover:bg-brand-card"
              >
                {link.label}
                <ChevronRight size={18} className="text-brand-muted" aria-hidden="true" />
              </Link>
            ))}
          </nav>
        </section>
      </div>
    </MemberPage>
  )
}
