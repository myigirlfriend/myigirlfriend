import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import GoogleButton from '@components/auth/GoogleButton'
import OrDivider from '@components/auth/OrDivider'
import Button from '@components/common/Button'
import Field from '@components/common/Field'
import PasswordInput from '@components/common/PasswordInput'
import AuthLayout from '@components/layout/AuthLayout'
import { useAuth } from '@hooks/useAuth'
import { errorMessage } from '@utils/text'

export default function LoginPage() {
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
    } catch (err) {
      toast.error(errorMessage(err, 'Could not sign you in. Check your email and password, then try again.'))
    } finally { setLoading(false) }
  }

  return (
    <AuthLayout title="Welcome back" tabTitle="Sign in" subtitle="She kept your conversation where you left it.">
      <GoogleButton label="Continue with Google" />
      <OrDivider />

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field id="login-email" label="Email">
          <input id="login-email" className="input" type="email" autoComplete="email" inputMode="email" spellCheck={false}
            value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
        </Field>

        <Field
          id="login-password"
          label="Password"
          aside={<Link to="/forgot-password" className="link link--muted text-sm">Forgot password?</Link>}
        >
          <PasswordInput id="login-password" autoComplete="current-password"
            value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required />
        </Field>

        <Button type="submit" fullWidth size="lg" loading={loading} loadingText="Signing in…">Sign in</Button>
      </form>

      <p className="mt-8 text-base text-brand-muted">
        New here? <Link to="/register" className="link link--accent">Start free</Link>
      </p>
    </AuthLayout>
  )
}
