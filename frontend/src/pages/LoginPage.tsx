import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import GoogleButton from '@components/auth/GoogleButton'
import OrDivider from '@components/auth/OrDivider'
import Button from '@components/common/Button'
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
      toast.error(errorMessage(err, 'Could not sign you in. Try again.'))
    } finally { setLoading(false) }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="She missed you.">
      <GoogleButton label="Continue with Google" />
      <OrDivider />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="login-email" className="sr-only">Email</label>
          <input id="login-email" className="input" type="email" placeholder="Email" autoComplete="email"
            value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
        </div>

        <div>
          <label htmlFor="login-password" className="sr-only">Password</label>
          <PasswordInput id="login-password" placeholder="Password" autoComplete="current-password"
            value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required />
          <div className="mt-1.5 text-right">
            <Link to="/forgot-password" className="rounded text-xs text-brand-muted transition-colors hover:text-white">
              Forgot password?
            </Link>
          </div>
        </div>

        <Button type="submit" fullWidth loading={loading}>Sign in</Button>
      </form>

      <p className="mt-6 text-center text-sm text-brand-muted">
        No account?{' '}
        <Link to="/register" className="gradient-text rounded font-semibold">Sign up free</Link>
      </p>
    </AuthLayout>
  )
}
