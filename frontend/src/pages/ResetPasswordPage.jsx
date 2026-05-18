import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { supabase } from '@services/supabaseClient'
import Button from '@components/common/Button'
import toast from 'react-hot-toast'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Check if we have a valid session from the reset link
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
  }, [])

  const strength = () => {
    if (!password) return null
    if (password.length < 6) return { label: 'Too short', color: '#ef4444', width: '25%' }
    if (password.length < 8) return { label: 'Weak', color: '#f97316', width: '50%' }
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return { label: 'Fair', color: '#eab308', width: '75%' }
    return { label: 'Strong', color: '#22c55e', width: '100%' }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) {
      toast.error('Passwords do not match')
      return
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      toast.success('Password updated successfully!')
      navigate('/login')
    } catch (err) {
      toast.error(err.message || 'Could not update password')
    } finally {
      setLoading(false) }
  }

  const s = strength()

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-brand-dark"
      style={{ background: 'radial-gradient(ellipse at top, #1a0a2e 0%, #0a0a0a 60%)' }}>
      <div className="w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-brand-gradient flex items-center justify-center mx-auto mb-6 shadow-brand">
            <Lock size={28} className="text-white" />
          </div>

          <h1 className="text-2xl font-extrabold text-center text-white mb-2">
            Set new password
          </h1>
          <p className="text-brand-muted text-sm text-center mb-8">
            Choose a strong password you haven't used before.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Password */}
            <div className="relative">
              <input
                className="input-field pr-12"
                type={showPass ? 'text' : 'password'}
                placeholder="New password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-white transition-colors"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Strength indicator */}
            {s && (
              <div className="space-y-1">
                <div className="h-1 bg-brand-border rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: s.width }}
                    className="h-full rounded-full transition-all"
                    style={{ background: s.color }}
                  />
                </div>
                <p className="text-xs font-semibold" style={{ color: s.color }}>
                  {s.label}
                </p>
              </div>
            )}

            {/* Confirm password */}
            <div className="relative">
              <input
                className="input-field pr-12"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-white transition-colors"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Match indicator */}
            {confirm && (
              <p className={`text-xs font-semibold ${password === confirm ? 'text-green-400' : 'text-red-400'}`}>
                {password === confirm ? '✓ Passwords match' : '✗ Passwords do not match'}
              </p>
            )}

            <Button type="submit" fullWidth loading={loading}>
              Update Password
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}