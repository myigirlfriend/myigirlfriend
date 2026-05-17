import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Crown, X } from 'lucide-react'
import { useSubStore } from '@store/index'
import api from '@services/api'
import toast from 'react-hot-toast'

export default function UpsellModal() {
  const { showUpsell, setShowUpsell } = useSubStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(null)

  const checkout = async (plan) => {
    setLoading(plan)
    try {
      const data = await api.post('/api/subscription/checkout', { plan })
      window.location.href = data.url
    } catch (err) {
      toast.error(err.message || 'Something went wrong')
      setLoading(null)
    }
  }

  return (
    <AnimatePresence>
      {showUpsell && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowUpsell(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-sm rounded-3xl p-6 z-10"
            style={{
              background: '#111111',
              border: '1px solid rgba(155,89,182,0.3)',
              boxShadow: '0 0 60px rgba(155,89,182,0.2)',
            }}
          >
            {/* Close */}
            <button
              onClick={() => setShowUpsell(false)}
              className="absolute top-4 right-4 text-brand-muted hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            {/* Icon */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg, #9B59B6, #E91E8C)', boxShadow: '0 0 30px rgba(233,30,140,0.3)' }}
            >
              <Crown size={26} className="text-white" />
            </div>

            <h2 className="text-xl font-extrabold text-white text-center mb-1">
              She wants to keep talking…
            </h2>
            <p className="text-brand-muted text-sm text-center mb-6">
              You've reached the free limit. Unlock unlimited conversations.
            </p>

            {/* Plans */}
            <div className="space-y-3 mb-4">
              {/* Basic */}
              <button
                onClick={() => checkout('basic')}
                disabled={!!loading}
                className="w-full flex items-center justify-between p-4 rounded-2xl border border-white/10 hover:border-brand-purple/40 transition-all"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <div className="text-left">
                  <div className="font-bold text-white text-sm">Basic</div>
                  <div className="text-brand-muted text-xs">1 companion · Unlimited messages</div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <div className="font-extrabold text-white">$9.99</div>
                  <div className="text-brand-muted text-xs">/ 7 days</div>
                </div>
              </button>

              {/* Premium */}
              <button
                onClick={() => checkout('premium')}
                disabled={!!loading}
                className="w-full flex items-center justify-between p-4 rounded-2xl relative overflow-hidden transition-all"
                style={{
                  background: 'linear-gradient(135deg, rgba(155,89,182,0.2), rgba(233,30,140,0.2))',
                  border: '1px solid rgba(155,89,182,0.5)',
                }}
              >
                <div className="absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ background: 'linear-gradient(135deg, #9B59B6, #E91E8C)' }}>
                  Popular
                </div>
                <div className="text-left">
                  <div className="font-bold text-white text-sm">Premium</div>
                  <div className="text-brand-muted text-xs">All 5 companions · Memory</div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <div className="font-extrabold text-white">$19.99</div>
                  <div className="text-brand-muted text-xs">/ month</div>
                </div>
              </button>
            </div>

            {loading && (
              <div className="flex items-center justify-center gap-2 text-brand-muted text-sm mb-3">
                <span className="w-4 h-4 border-2 border-brand-purple/30 border-t-brand-purple rounded-full animate-spin" />
                Redirecting to checkout…
              </div>
            )}

            <button
              onClick={() => setShowUpsell(false)}
              className="w-full text-brand-muted text-sm hover:text-white transition-colors py-2"
            >
              Maybe later
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}