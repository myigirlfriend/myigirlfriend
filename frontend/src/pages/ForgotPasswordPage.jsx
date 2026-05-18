import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, Mail } from 'lucide-react'
import { supabase } from '@services/supabaseClient'
import Button from '@components/common/Button'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      setSent(true)
    } catch (err) {
      // Even if email doesn't exist we show success — security best practice
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-dark"
      style={{ background: 'radial-gradient(ellipse at top, #1a0a2e 0%, #0a0a0a 60%)' }}>

      {/* Back button */}
      <div className="px-4 pt-12 pb-4">
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-1 text-brand-muted hover:text-white transition-colors text-sm font-semibold"
        >
          <ChevronLeft size={18} />
          Back to login
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">

          {!sent ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-brand-gradient flex items-center justify-center mx-auto mb-6 shadow-brand">
                <Mail size={28} className="text-white" />
              </div>

              <h1 className="text-2xl font-extrabold text-center text-white mb-2">
                Forgot your password?
              </h1>
              <p className="text-brand-muted text-sm text-center mb-8 leading-relaxed">
                No worries. Enter your email and we'll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  className="input-field"
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoFocus
                />
                <Button type="submit" fullWidth loading={loading}>
                  Send Reset Link
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              {/* Success icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                className="w-20 h-20 rounded-full bg-brand-gradient flex items-center justify-center mx-auto mb-6 shadow-brand-lg"
              >
                <span className="text-3xl">✉️</span>
              </motion.div>

              <h1 className="text-2xl font-extrabold text-white mb-2">
                Check your email
              </h1>
              <p className="text-brand-muted text-sm mb-2 leading-relaxed">
                We sent a password reset link to
              </p>
              <p className="gradient-text font-bold text-sm mb-8">{email}</p>
              <p className="text-brand-muted text-xs mb-8 leading-relaxed">
                Didn't receive it? Check your spam folder or try again.
              </p>

              <Button
                fullWidth
                variant="ghost"
                onClick={() => { setSent(false); setEmail('') }}
              >
                Try a different email
              </Button>

              <button
                onClick={() => navigate('/login')}
                className="mt-3 w-full text-brand-muted text-sm hover:text-white transition-colors py-2"
              >
                Back to login
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}