import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import { useSubStore } from '@store/index'
import api from '@services/api'
import Badge from '@components/common/Badge'
import Spinner from '@components/common/Spinner'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const { plan, subStatus } = useSubStore()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/api/subscription/status'),
      api.get('/api/profile/stats'),
    ])
      .then(([sub, profile]) => {
        useSubStore.getState().setPlan(sub.plan)
        useSubStore.getState().setSubStatus(sub.status)
        setStats(profile)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const isPaid = subStatus === 'active'

  return (
    <div className="min-h-screen bg-brand-dark px-4 py-10 pb-24">
      <div className="max-w-sm mx-auto">
        <h1 className="text-2xl font-extrabold gradient-text mb-6">My Profile</h1>

        {/* Avatar + name */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-brand-gradient flex items-center justify-center text-2xl font-extrabold text-white shadow-brand">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-white text-lg">{user?.name}</div>
            <div className="text-brand-muted text-sm">{user?.email}</div>
          </div>
        </div>

        {/* Plan status */}
        <div className="card mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-brand-muted text-sm font-semibold">Current Plan</span>
            <Badge
              label={isPaid ? plan.toUpperCase() : 'FREE'}
              variant={isPaid ? 'gradient' : 'default'}
            />
          </div>
          {!isPaid && (
            <button
              onClick={() => navigate('/subscription')}
              className="w-full py-2.5 rounded-xl bg-brand-gradient text-white text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Upgrade Now ⭐
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="card mb-4">
          <div className="text-brand-muted text-sm font-semibold mb-3">My Stats</div>
          {loading ? (
            <div className="flex justify-center py-4"><Spinner /></div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-brand-surface rounded-xl p-3 text-center">
                <div className="gradient-text text-2xl font-extrabold">
                  {stats?.totalMessages || 0}
                </div>
                <div className="text-brand-muted text-xs mt-1">Messages sent</div>
              </div>
              <div className="bg-brand-surface rounded-xl p-3 text-center">
                <div className="gradient-text text-2xl font-extrabold">
                  {stats?.totalConversations || 0}
                </div>
                <div className="text-brand-muted text-xs mt-1">Conversations</div>
              </div>
            </div>
          )}
        </div>

        {/* Recent conversations */}
        <div className="card mb-6">
          <div className="text-brand-muted text-sm font-semibold mb-3">Recent Chats</div>
          {loading ? (
            <div className="flex justify-center py-4"><Spinner /></div>
          ) : stats?.recentConversations?.length > 0 ? (
            <div className="space-y-2">
              {stats.recentConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => navigate(`/chat/${conv.id}`)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-brand-surface transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center text-sm shrink-0">
                    💬
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-semibold">{conv.personaName}</div>
                    <div className="text-brand-muted text-xs">{conv.messageCount} messages</div>
                  </div>
                  <div className="text-brand-muted text-xs shrink-0">{conv.date}</div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-brand-muted text-sm text-center py-2">No chats yet</p>
          )}
        </div>

        <button
          onClick={logout}
          className="w-full py-3 rounded-xl border border-brand-border text-brand-muted font-bold hover:border-red-500/50 hover:text-red-400 transition-all"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}