import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { MailCheck } from 'lucide-react'
import Button from '@components/common/Button'
import Field from '@components/common/Field'
import AuthLayout from '@components/layout/AuthLayout'
import { supabase } from '@services/supabaseClient'

const BACK = { to: '/login', label: 'Sign in' }

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
        subtitle={<>If <span className="font-bold text-brand-text">{email}</span> has an account, a reset link is on its way.</>}
        back={BACK}
      >
        <p className="mb-6 text-base leading-relaxed text-brand-muted">
          Nothing after a few minutes? Look in your spam folder, or send it to a different address.
        </p>
        <Button fullWidth variant="secondary" onClick={() => { setSent(false); setEmail('') }}>
          Use a different email
        </Button>
        <p className="mt-6 text-base">
          <Link to="/login" className="link link--muted">Back to sign in</Link>
        </p>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Reset your password"
      tabTitle="Reset password"
      subtitle="Enter the email you signed up with and we will send you a link to choose a new one."
      back={BACK}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field id="forgot-email" label="Email">
          <input id="forgot-email" className="input" type="email" autoComplete="email" inputMode="email" spellCheck={false}
            value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
        </Field>
        <Button type="submit" fullWidth size="lg" loading={loading} loadingText="Sending…">Send reset link</Button>
      </form>
    </AuthLayout>
  )
}
