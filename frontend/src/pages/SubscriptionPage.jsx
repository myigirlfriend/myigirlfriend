import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Crown, Zap, X } from 'lucide-react'
import { useSubStore } from '@store/index'
import api from '@services/api'
import toast from 'react-hot-toast'

const PLANS = [
  {
    id: 'basic',
    label: 'Basic',
    price: '$9.99',
    period: '/ 7 days',
    description: 'Perfect for getting started',
    features: [
      'Unlimited messages',
      '1 companion of your choice',
      'She remembers you',
      'Standard support',
    ],
    popular: false,
  },
  {
    id: 'premium',
    label: 'Premium',
    price: '$19.99',
    period: '/ month',
    description: 'The full experience',
    features: [
      'Unlimited messages',
      'All 5 companions',
      'Deep memory system',
      'Priority support',
      'Early access to new features',
    ],
    popular: true,
  },
]

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(null)
  const [cancelling, setCancelling] = useState(false)
  const { plan, subStatus, setPlan, setSubStatus } = useSubStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const isPaid = subStatus === 'active'

  useEffect(() => {
    // Fetch latest subscription status
    api.get('/api/subscription/status')
      .then(data => {
        setPlan(data.plan)
        setSubStatus(data.status)
      })
      .catch(() => {})

    // Handle return from Stripe
    if (searchParams.get('upgraded') === 'true') {
      toast.success('Welcome to premium! Enjoy unlimited access 💜')
      navigate('/subscription', { replace: true })
    }
    if (searchParams.get('cancelled') === 'true') {
      toast.error('Payment cancelled — no charge made')
      navigate('/subscription', { replace: true })
    }
  }, [])

  const checkout = async (planId) => {
    setLoading(planId)
    try {
      const data = await api.post('/api/subscription/checkout', { plan: planId })
      window.location.href = data.url
    } catch (err) {
      toast.error(err.message || 'Something went wrong. Try again.')
      setLoading(null)
    }
  }

  const cancelSubscription = async () => {
    if (!window.confirm('Cancel your subscription? You keep access until the end of your billing period.')) return
    setCancelling(true)
    try {
      await api.post('/api/subscription/cancel')
      toast.success('Subscription cancelled. You keep access until your billing period ends.')
      setSubStatus('cancelled')
    } catch (err) {
      toast.error(err.message)
    } finally { setCancelling(false) }
  }

  return (
    <div className="min-h-screen pb-28" style={{
      background: 'radial-gradient(ellipse at top, #1a0a2e 0%, #0a0a0a 70%)',
    }}>
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #E91E8C, transparent)' }} />

      {/* Header */}
      <div className="px-4 pt-14 pb-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-14 h-14 rounded-2xl bg-brand-gradient flex items-center justify-center mx-auto mb-4 shadow-brand">
            <Crown size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white mb-1">
            {isPaid ? 'Your subscription' : 'Unlock everything'}
          </h1>
          <p className="text-brand-muted text-sm">
            {isPaid
              ? `You're on the ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan`
              : 'No limits. Real connection.'}
          </p>
        </motion.div>
      </div>

      {/* Current plan banner — paid users */}
      {isPaid && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mb-4 rounded-2xl p-4 relative z-10"
          style={{
            background: 'linear-gradient(135deg, rgba(155,89,182,0.25), rgba(233,30,140,0.25))',
            border: '1px solid rgba(155,89,182,0.4)',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-yellow-400" />
              <span className="text-white font-bold text-sm">
                {plan.charAt(0).toUpperCase() + plan.slice(1)} — Active
              </span>
            </div>
            <div className="text-xs text-green-400 font-semibold bg-green-400/10 px-2 py-1 rounded-full">
              ✓ Active
            </div>
          </div>
          <p className="text-brand-muted text-xs mt-2">
            You have unlimited access to all features on your plan.
          </p>
        </motion.div>
      )}

      {/* Plans */}
      <div className="px-4 space-y-4 relative z-10">
        {PLANS.map((p, i) => {
          const isCurrent = isPaid && plan === p.id
          const isDisabled = isPaid && plan !== p.id && plan === 'premium'

          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-5 relative"
              style={{
                background: p.popular
                  ? 'linear-gradient(135deg, rgba(155,89,182,0.15), rgba(233,30,140,0.15))'
                  : 'rgba(255,255,255,0.04)',
                border: isCurrent
                  ? '1px solid rgba(155,89,182,0.6)'
                  : p.popular
                  ? '1px solid rgba(155,89,182,0.3)'
                  : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {/* Popular badge */}
              {p.popular && !isCurrent && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap"
                  style={{ background: 'linear-gradient(135deg, #9B59B6, #E91E8C)' }}
                >
                  Most Popular
                </div>
              )}

              {/* Current badge */}
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                  ✓ Current Plan
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div>
                  <div
                    className="font-extrabold text-xl"
                    style={p.popular ? {
                      background: 'linear-gradient(135deg, #9B59B6, #E91E8C)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    } : { color: '#f9fafb' }}
                  >
                    {p.label}
                  </div>
                  <div className="text-brand-muted text-xs mt-0.5">{p.description}</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-extrabold text-2xl">{p.price}</div>
                  <div className="text-brand-muted text-xs">{p.period}</div>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-2 mb-5">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-brand-muted">
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: 'linear-gradient(135deg, #9B59B6, #E91E8C)' }}
                    >
                      <Check size={10} className="text-white" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA button */}
              {isCurrent ? (
                <button
                  onClick={cancelSubscription}
                  disabled={cancelling}
                  className="w-full py-3 rounded-xl text-sm font-semibold text-red-400 border border-red-400/20 hover:bg-red-400/10 transition-all"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel subscription'}
                </button>
              ) : (
                <button
                  onClick={() => checkout(p.id)}
                  disabled={!!loading || isDisabled}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
                  style={p.popular ? {
                    background: 'linear-gradient(135deg, #9B59B6, #E91E8C)',
                    boxShadow: '0 0 20px rgba(155,89,182,0.3)',
                  } : {
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                  }}
                >
                  {loading === p.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Redirecting...
                    </span>
                  ) : isDisabled ? (
                    'Included in Premium'
                  ) : (
                    `Get ${p.label}`
                  )}
                </button>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Footer note */}
      <div className="px-4 mt-6 relative z-10">
        <p className="text-brand-muted text-xs text-center leading-relaxed">
          Secure payment via Stripe · Cancel anytime · No hidden fees
        </p>
      </div>
    </div>
  )
}