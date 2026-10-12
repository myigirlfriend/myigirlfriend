import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Lock, X } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@components/common/Button'
import PasswordInput from '@components/common/PasswordInput'
import AuthLayout from '@components/layout/AuthLayout'
import { supabase } from '@services/supabaseClient'
import { errorMessage } from '@utils/text'

const MIN_PASSWORD_LENGTH = 8

interface Strength {
  label: string
  /** Tailwind classes for the bar and the label */
  bar: string
  text: string
}

const passwordStrength = (password: string): Strength | null => {
  if (!password) return null
  if (password.length < 6) return { label: 'Too short', bar: 'w-1/4 bg-red-400', text: 'text-red-400' }
  if (password.length < MIN_PASSWORD_LENGTH) return { label: 'Weak', bar: 'w-2/4 bg-orange-400', text: 'text-orange-400' }
  if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return { label: 'Fair', bar: 'w-3/4 bg-amber-300', text: 'text-amber-300' }
  return { label: 'Strong', bar: 'w-full bg-emerald-400', text: 'text-emerald-300' }
}

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  const strength = passwordStrength(password)
  const matches = password === confirm

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!matches) return void toast.error('Passwords do not match')
    if (password.length < MIN_PASSWORD_LENGTH) {
      return void toast.error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`)
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      toast.success('Password updated')
      navigate('/login')
    } catch (err) {
      toast.error(errorMessage(err, 'Could not update password'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout icon={Lock} title="Set new password" subtitle="Choose a strong password you haven't used before.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="reset-password" className="sr-only">New password</label>
          <PasswordInput id="reset-password" placeholder="New password" autoComplete="new-password"
            value={password} onChange={(e) => setPassword(e.target.value)} required minLength={MIN_PASSWORD_LENGTH} autoFocus />

          {strength && (
            <div className="mt-2">
              <div className="h-1 overflow-hidden rounded-full bg-brand-border">
                <div className={`h-full rounded-full transition-all duration-300 ${strength.bar}`} />
              </div>
              <p className={`mt-1 text-xs font-semibold ${strength.text}`}>{strength.label}</p>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="reset-confirm" className="sr-only">Confirm new password</label>
          <PasswordInput id="reset-confirm" placeholder="Confirm new password" autoComplete="new-password"
            value={confirm} onChange={(e) => setConfirm(e.target.value)} required />

          {confirm && (
            <p className={`mt-2 flex items-center gap-1 text-xs font-semibold ${matches ? 'text-emerald-300' : 'text-red-400'}`}>
              {matches ? <Check size={13} aria-hidden="true" /> : <X size={13} aria-hidden="true" />}
              {matches ? 'Passwords match' : 'Passwords do not match'}
            </p>
          )}
        </div>

        <Button type="submit" fullWidth loading={loading}>Update password</Button>
      </form>
    </AuthLayout>
  )
}
