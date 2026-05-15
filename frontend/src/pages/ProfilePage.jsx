import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import { useSubStore } from '@store/index'
import { getPersonaById } from '@config/personas'
import { LogOut, MessageCircle, Crown, Calendar, ChevronRight, Zap } from 'lucide-react'
import api from '@services/api'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const { plan, subStatus, setPlan, setSubStatus } = useSubStore()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/api/subscription/status'),
      api.get('/api/profile/stats'),
    ])
      .then(([sub, profile]) => {
        setPlan(sub.plan)
        setSubStatus(sub.status)
        setStats(profile)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const isPaid = subStatus === 'active'

  // Member since
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString([], { month: 'long', year: 'numeric' })
    : 'Recently joined'

  // Initials for avatar
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <div className="min-h-screen pb-28" style={{
      background: 'radial-gradient(ellipse at top, #1a0a2e 0%, #0a0a0a 70%)',
    }}>

      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #E91E8C, transparent)' }} />

      {/* Header */}
      <div className="px-4 pt-14 pb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-extrabold text-white">My Profile</h1>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-brand-muted hover:text-red-400 transition-colors text-sm font-semibold"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>

        {/* Avatar + name card */}
        <div className="flex items-center gap-4">
          {/* Gradient avatar */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl shadow-brand shrink-0"
            style={{ background: 'linear-gradient(135deg, #9B59B6, #E91E8C)' }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-extrabold text-white text-lg leading-tight truncate">
              {user?.name}
            </div>
            <div className="text-brand-muted text-xs truncate mt-0.5">{user?.email}</div>
            <div className="flex items-center gap-1 mt-1.5">
              <Calendar size={11} className="text-brand-muted" />
              <span className="text-brand-muted text-xs">Joined {memberSince}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-3">

        {/* Plan card */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: isPaid
              ? 'linear-gradient(135deg, rgba(155,89,182,0.2), rgba(233,30,140,0.2))'
              : 'rgba(255,255,255,0.04)',
            border: isPaid ? '1px solid rgba(155,89,182,0.4)' : '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown size={18} className={isPaid ? 'text-yellow-400' : 'text-brand-muted'} />
              <span className="text-white font-bold text-sm">
                {isPaid ? `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan` : 'Free Plan'}
              </span>
            </div>
            <div
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={isPaid ? {
                background: 'linear-gradient(135deg, #9B59B6, #E91E8C)',
                color: 'white',
              } : {
                background: 'rgba(255,255,255,0.08)',
                color: '#6b7280',
              }}
            >
              {isPaid ? 'ACTIVE' : 'FREE'}
            </div>
          </div>

          {!isPaid && (
            <button
              onClick={() => navigate('/subscription')}
              className="mt-3 w-full py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #9B59B6, #E91E8C)' }}
            >
              <Zap size={15} />
              Upgrade for unlimited access
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div
            className="rounded-2xl p-4 text-center"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {loading ? (
              <div className="h-8 w-12 bg-brand-card rounded mx-auto animate-pulse" />
            ) : (
              <div
                className="text-3xl font-extrabold"
                style={{
                  background: 'linear-gradient(135deg, #9B59B6, #E91E8C)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {stats?.totalMessages || 0}
              </div>
            )}
            <div className="text-brand-muted text-xs mt-1 font-medium">Messages sent</div>
          </div>

          <div
            className="rounded-2xl p-4 text-center"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {loading ? (
              <div className="h-8 w-12 bg-brand-card rounded mx-auto animate-pulse" />
            ) : (
              <div
                className="text-3xl font-extrabold"
                style={{
                  background: 'linear-gradient(135deg, #9B59B6, #E91E8C)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {stats?.totalConversations || 0}
              </div>
            )}
            <div className="text-brand-muted text-xs mt-1 font-medium">Conversations</div>
          </div>
        </div>

        {/* Recent chats */}
        {!loading && stats?.recentConversations?.length > 0 && (
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="px-4 py-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <MessageCircle size={14} className="text-brand-purple" />
                <span className="text-white font-bold text-sm">Recent Chats</span>
              </div>
            </div>

            {stats.recentConversations.map((conv, i) => {
              const persona = getPersonaById(conv.personaName?.toLowerCase() || conv.personaId)
              const displayName = persona?.name || conv.personaName || 'Unknown'
              const photo = persona?.image

              return (
                <button
                  key={conv.id}
                  onClick={() => {
                    if (persona) {
                      const { usePersonaStore } = require('@store/index')
                      usePersonaStore.getState().setActivePersona(persona)
                    }
                    navigate(`/chat/${conv.id}`)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 text-left"
                >
                  {/* Photo */}
                  <div
                    className="w-9 h-9 rounded-full overflow-hidden shrink-0"
                    style={{ border: `1.5px solid ${persona?.accentColor || '#9B59B6'}50` }}
                  >
                    {photo ? (
                      <img src={photo} alt={displayName} className="w-full h-full object-cover" />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: `linear-gradient(135deg, ${persona?.gradientFrom || '#9B59B6'}, ${persona?.gradientTo || '#E91E8C'})` }}
                      >
                        {displayName[0]}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white text-sm">{displayName}</div>
                    <div className="text-brand-muted text-xs">{conv.messageCount} messages · {conv.date}</div>
                  </div>

                  <ChevronRight size={14} className="text-brand-muted shrink-0" />
                </button>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}