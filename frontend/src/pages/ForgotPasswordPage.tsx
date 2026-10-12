import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Mail, MailCheck } from 'lucide-react'
import Button from '@components/common/Button'
import AuthLayout from '@components/layout/AuthLayout'
import { supabase } from '@services/supabaseClient'

const BACK = { to: '/login', label: 'Back to login' }

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
    } catch {
      // Ignored on purpose, see below
    } finally {
      // Success is shown whether or not the email exists, so this form cannot be used to find out who has an account
      setSent(true)
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <AuthLayout
        icon={MailCheck}
        title="Check your email"
        subtitle={<>We sent a password reset link to <span className="gradient-text font-bold">{email}</span></>}
        back={BACK}
      >
        <p className="mb-6 text-center text-xs leading-relaxed text-brand-muted">
          Didn't receive it? Check your spam folder or try again.
        </p>
        <Button fullWidth variant="ghost" onClick={() => { setSent(false); setEmail('') }}>
          Try a different email
        </Button>
        <p className="mt-4 text-center text-sm">
          <Link to="/login" className="rounded text-brand-muted transition-colors hover:text-white">Back to login</Link>
        </p>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      icon={Mail}
      title="Forgot your password?"
      subtitle="No worries. Enter your email and we'll send you a reset link."
      back={BACK}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="forgot-email" className="sr-only">Your email address</label>
          <input id="forgot-email" className="input" type="email" placeholder="Your email address" autoComplete="email"
            value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
        </div>
        <Button type="submit" fullWidth loading={loading}>Send reset link</Button>
      </form>
    </AuthLayout>
  )
}
