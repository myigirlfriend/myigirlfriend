import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import { useSubStore } from '@store/index'
import { getPersonaById } from '@config/personas'
import {
  LogOut, MessageCircle, Crown, Calendar,
  ChevronRight, Zap, Settings, Heart,
  Flame, Clock, Star
} from 'lucide-react'
import api from '@services/api'

// ─── Generated Avatar ─────────────────────────────────────────
function GeneratedAvatar({ name, size = 72 }) {
  const hash = name?.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0) || 0

  const hue = Math.abs(hash) % 360
  const hue2 = (hue + 40) % 360
  const gradient = `linear-gradient(135deg, hsl(${hue}, 70%, 45%), hsl(${hue2}, 80%, 55%))`

  const shapes = name?.split('').slice(0, 5).map((char, i) => {
    const val = char.charCodeAt(0)
    return {
      x: (val * (i + 1) * 13) % 80 + 10,
      y: (val * (i + 2) * 7) % 80 + 10,
      r: (val % 10) + 5,
    }
  }) || []

  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <div
      className="rounded-full overflow-hidden shrink-0 relative"
      style={{
        width: size,
        height: size,
        background: gradient,
        boxShadow: `0 0 0 3px rgba(155,89,182,0.4), 0 0 20px rgba(155,89,182,0.2)`
      }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" className="absolute inset-0">
        {shapes.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white" opacity={0.12 + i * 0.04} />
        ))}
        <polygon points="50,10 90,75 10,75" fill="white" opacity="0.07" />
        <circle cx="50" cy="50" r="28" fill="white" opacity="0.05" />
        <text
          x="50" y="58"
          textAnchor="middle"
          fill="white"
          fontSize="30"
          fontWeight="900"
          fontFamily="Nunito, sans-serif"
          opacity="0.95"
        >
          {initials}
        </text>
      </svg>
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────
function StatCard({ icon: Icon, value, label, color }) {
  return (
    <div className="rounded-2xl p-4 flex flex-col items-center justify-center gap-1"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-1"
        style={{ background: `${color}20` }}>
        <Icon size={16} style={{ color }} />
      </div>
      <div className="text-2xl font-extrabold text-white">{value}</div>
      <div className="text-brand-muted text-xs font-medium text-center leading-tight">{label}</div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user, logout } = useAuth()
  const { plan, subStatus, setPlan, setSubStatus } = useSubStore()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showSettings, setShowSettings] = useState(false)

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

  // Favorite persona — most messages
  const favoritePersona = stats?.recentConversations?.length > 0
    ? stats.recentConversations.reduce((max, c) =>
        c.messageCount > (max?.messageCount || 0) ? c : max, null)
    : null

  const favPersonaData = favoritePersona
    ? getPersonaById(favoritePersona.personaName?.toLowerCase() || favoritePersona.personaId)
    : null

  // Days since joined
  const daysActive = user?.created_at
    ? Math.max(1, Math.floor((Date.now() - new Date(user.created_at)) / 86400000))
    : 1

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString([], { month: 'long', year: 'numeric' })
    : null

  return (
    <div className="min-h-screen pb-28 overflow-hidden" style={{
      background: 'radial-gradient(ellipse at top, #1a0a2e 0%, #0a0a0a 70%)',
    }}>
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #E91E8C, transparent)' }} />
      <div className="absolute top-20 left-0 w-48 h-48 rounded-full opacity-8 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #9B59B6, transparent)' }} />

      {/* Header */}
      <div className="px-4 pt-14 pb-4 flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-white">Profile</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-brand-muted hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <Settings size={16} />
          </button>
          <button
            onClick={logout}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-brand-muted hover:text-red-400 transition-colors"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Settings dropdown */}
      {showSettings && (
        <div className="mx-4 mb-3 rounded-2xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {[
            { label: 'Change Password', action: () => navigate('/forgot-password') },
            { label: 'Subscription & Billing', action: () => navigate('/subscription') },
            { label: 'Privacy Policy', action: () => navigate('/privacy') },
            { label: 'Terms of Service', action: () => navigate('/terms') },
          ].map((item, i) => (
            <button key={i} onClick={item.action}
              className="w-full flex items-center justify-between px-4 py-3 text-sm text-brand-muted hover:text-white hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 text-left">
              {item.label}
              <ChevronRight size={14} />
            </button>
          ))}
        </div>
      )}

      {/* Profile hero card */}
      <div className="mx-4 mb-4 rounded-3xl p-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(155,89,182,0.15), rgba(233,30,140,0.1))',
          border: '1px solid rgba(155,89,182,0.2)',
        }}>
        {/* Subtle bg pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #9B59B6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #E91E8C 0%, transparent 50%)' }} />

        <div className="flex items-center gap-4 relative z-10">
          <GeneratedAvatar name={user?.name} size={72} />
          <div className="flex-1 min-w-0">
            <div className="font-extrabold text-white text-xl leading-tight truncate">
              {user?.name}
            </div>
            <div className="text-brand-muted text-xs truncate mt-1">{user?.email}</div>
            {memberSince && (
              <div className="flex items-center gap-1.5 mt-2">
                <Calendar size={11} className="text-brand-purple" />
                <span className="text-brand-muted text-xs">Since {memberSince}</span>
              </div>
            )}
          </div>
        </div>

        {/* Plan badge */}
        <div className="mt-4 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <Crown size={15} className={isPaid ? 'text-yellow-400' : 'text-brand-muted'} />
            <span className="text-white text-sm font-bold">
              {isPaid ? `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan` : 'Free Plan'}
            </span>
          </div>
          {isPaid ? (
            <div className="text-xs font-bold px-3 py-1 rounded-full text-white"
              style={{ background: 'linear-gradient(135deg, #9B59B6, #E91E8C)' }}>
              ACTIVE ✓
            </div>
          ) : (
            <button onClick={() => navigate('/subscription')}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full text-white"
              style={{ background: 'linear-gradient(135deg, #9B59B6, #E91E8C)' }}>
              <Zap size={11} />
              Upgrade
            </button>
          )}
        </div>
      </div>

      <div className="px-4 space-y-3">

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl p-4 h-24 animate-pulse"
                style={{ background: 'rgba(255,255,255,0.04)' }} />
            ))
          ) : (
            <>
              <StatCard
                icon={MessageCircle}
                value={stats?.totalMessages || 0}
                label="Messages"
                color="#9B59B6"
              />
              <StatCard
                icon={Heart}
                value={stats?.totalConversations || 0}
                label="Companions"
                color="#E91E8C"
              />
              <StatCard
                icon={Flame}
                value={daysActive}
                label="Days active"
                color="#F59E0B"
              />
            </>
          )}
        </div>

        {/* Favorite companion */}
        {!loading && favPersonaData && (
          <div className="rounded-2xl p-4"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Star size={14} className="text-yellow-400" />
              <span className="text-white font-bold text-sm">Favourite Companion</span>
            </div>
            <button
              onClick={() => {
                const { usePersonaStore } = require('@store/index')
                usePersonaStore.getState().setActivePersona(favPersonaData)
                navigate(`/chat/${favoritePersona.id}`)
              }}
              className="w-full flex items-center gap-3 hover:opacity-80 transition-opacity text-left"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0"
                style={{ border: `2px solid ${favPersonaData.accentColor}` }}>
                {favPersonaData.image ? (
                  <img src={favPersonaData.image} alt={favPersonaData.name}
                    className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full"
                    style={{ background: `linear-gradient(135deg, ${favPersonaData.gradientFrom}, ${favPersonaData.gradientTo})` }} />
                )}
              </div>
              <div className="flex-1">
                <div className="font-bold text-white">{favPersonaData.name}</div>
                <div className="text-brand-muted text-xs">{favPersonaData.tagline}</div>
                <div className="text-xs mt-0.5" style={{ color: favPersonaData.accentColor }}>
                  {favoritePersona.messageCount} messages together
                </div>
              </div>
              <div className="text-2xl">💜</div>
            </button>
          </div>
        )}

        {/* Recent chats */}
        {!loading && stats?.recentConversations?.length > 0 && (
          <div className="rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-brand-purple" />
                <span className="text-white font-bold text-sm">Recent Chats</span>
              </div>
              <button onClick={() => navigate('/chat')}
                className="text-xs text-brand-purple font-semibold hover:text-brand-pink transition-colors">
                See all
              </button>
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
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full overflow-hidden"
                      style={{ border: `1.5px solid ${persona?.accentColor || '#9B59B6'}50` }}>
                      {photo ? (
                        <img src={photo} alt={displayName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ background: `linear-gradient(135deg, ${persona?.gradientFrom || '#9B59B6'}, ${persona?.gradientTo || '#E91E8C'})` }}>
                          {displayName[0]}
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-brand-dark" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white text-sm">{displayName}</div>
                    <div className="text-brand-muted text-xs">
                      {conv.messageCount} messages · {conv.date}
                    </div>
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