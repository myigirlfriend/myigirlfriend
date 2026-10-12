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
    <AuthLayout title="Create account" tabTitle="Sign up" subtitle="Find your companion.">
      <GoogleButton label="Sign up with Google" />
      <OrDivider />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="register-name" className="sr-only">Your name</label>
          <input id="register-name" className="input" placeholder="Your name" autoComplete="name"
            value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
        </div>
        <div>
          <label htmlFor="register-email" className="sr-only">Email</label>
          <input id="register-email" className="input" type="email" placeholder="Email" autoComplete="email"
            value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
        </div>
        <div>
          <label htmlFor="register-password" className="sr-only">Password</label>
          <PasswordInput id="register-password" placeholder={`Password (min ${MIN_PASSWORD_LENGTH} characters)`}
            autoComplete="new-password" minLength={MIN_PASSWORD_LENGTH}
            value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required />
        </div>
        <Button type="submit" fullWidth loading={loading}>Create account</Button>
      </form>

      <p className="mt-4 text-center text-xs leading-relaxed text-brand-muted">
        By creating an account you agree to our{' '}
        <Link to="/terms" className="gradient-text rounded font-semibold">Terms</Link>
        {' '}and{' '}
        <Link to="/privacy" className="gradient-text rounded font-semibold">Privacy Policy</Link>
      </p>

      <p className="mt-4 text-center text-sm text-brand-muted">
        Have an account?{' '}
        <Link to="/login" className="gradient-text rounded font-semibold">Sign in</Link>
      </p>
    </AuthLayout>
  )
}
