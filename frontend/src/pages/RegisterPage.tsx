import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import GoogleButton from '@components/auth/GoogleButton'
import OrDivider from '@components/auth/OrDivider'
import Button from '@components/common/Button'
import Field from '@components/common/Field'
import PasswordInput from '@components/common/PasswordInput'
import AuthLayout from '@components/layout/AuthLayout'
import { FREE_MESSAGE_LIMIT } from '@config/limits'
import { useAuth } from '@hooks/useAuth'
import { errorMessage } from '@utils/text'

const MIN_PASSWORD_LENGTH = 8

export default function RegisterPage() {
  const { register } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
    } catch (err) {
      toast.error(errorMessage(err, 'Could not create your account. Try again.'))
    } finally { setLoading(false) }
  }

  return (
    <AuthLayout
      title="Start free"
      tabTitle="Sign up"
      subtitle={`Your first ${FREE_MESSAGE_LIMIT} messages are on us. No card needed.`}
    >
      <GoogleButton label="Sign up with Google" />
      <OrDivider />

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field id="register-name" label="Your name" help="This is what she will call you.">
          <input id="register-name" className="input" autoComplete="name"
            value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
        </Field>
        <Field id="register-email" label="Email">
          <input id="register-email" className="input" type="email" autoComplete="email" inputMode="email" spellCheck={false}
            value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
        </Field>
        <Field id="register-password" label="Password" help={`At least ${MIN_PASSWORD_LENGTH} characters.`}>
          <PasswordInput id="register-password" autoComplete="new-password" minLength={MIN_PASSWORD_LENGTH}
            value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required />
        </Field>
        <Button type="submit" fullWidth size="lg" loading={loading} loadingText="Creating your account…">Create account</Button>
      </form>

      <p className="mt-5 text-sm leading-relaxed text-brand-muted">
        By creating an account you agree to our{' '}
        <Link to="/terms" className="link">Terms</Link> and <Link to="/privacy" className="link">Privacy Policy</Link>.
      </p>

      <p className="mt-6 text-base text-brand-muted">
        Have an account? <Link to="/login" className="link link--accent">Sign in</Link>
      </p>
    </AuthLayout>
  )
}
