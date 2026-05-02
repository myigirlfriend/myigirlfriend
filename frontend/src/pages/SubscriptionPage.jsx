import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@components/common/Button'
import api from '@services/api'
import toast from 'react-hot-toast'

const PLANS = [
  { id: 'basic', label: 'Basic', price: '$9.99', period: '/mo', features: ['Unlimited messages', '1 persona', 'Standard support'] },
  { id: 'premium', label: 'Premium', price: '$19.99', period: '/mo', features: ['Unlimited messages', 'All 5 personas', 'Memory system', 'Priority support'], popular: true },
]

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(null)
  const navigate = useNavigate()

  const checkout = async (planId) => {
    setLoading(planId)
    try {
      const data = await api.post('/api/subscription/checkout', { plan: planId })
      window.location.href = data.url // Stripe checkout URL
    } catch (err) {
      toast.error(err.message)
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark px-4 py-12">
      <div className="max-w-lg mx-auto">
        <button onClick={() => navigate(-1)} className="text-brand-muted hover:text-white text-sm mb-8 block">‹ Back</button>
        <h1 className="text-3xl font-extrabold text-center gradient-text mb-2">Unlock everything</h1>
        <p className="text-brand-muted text-center text-sm mb-10">Get closer. No limits.</p>

        <div className="grid grid-cols-1 gap-4">
          {PLANS.map((plan) => (
            <div key={plan.id} className={`card relative ${plan.popular ? 'border-brand-purple/60 shadow-brand' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-gradient text-white text-xs font-bold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-bold text-white text-xl">{plan.label}</div>
                  <div className="gradient-text text-2xl font-extrabold">
                    {plan.price}<span className="text-sm text-brand-muted font-normal">{plan.period}</span>
                  </div>
                </div>
              </div>
              <ul className="space-y-2 mb-5">
                {plan.features.map(f => (
                  <li key={f} className="text-sm text-brand-muted flex items-center gap-2">
                    <span className="gradient-text font-bold">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Button fullWidth loading={loading === plan.id} onClick={() => checkout(plan.id)}>
                Get {plan.label}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
