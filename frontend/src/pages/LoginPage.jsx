import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import Button from '@components/common/Button'
import GoogleButton from '@components/auth/GoogleButton'

export default function LoginPage() {
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true)
    try { await login(form.email, form.password) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-brand-dark"
      style={{ background: 'radial-gradient(ellipse at top, #1a0a2e 0%, #0a0a0a 60%)' }}>
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-extrabold text-center mb-1">
          <span className="gradient-text">Welcome back</span>
        </h1>
        <p className="text-brand-muted text-center text-sm mb-8">She missed you 💜</p>

        {/* Google login */}
        <GoogleButton label="Continue with Google" />

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-brand-border" />
          <span className="text-brand-muted text-xs font-semibold">or</span>
          <div className="flex-1 h-px bg-brand-border" />
        </div>

        {/* Email login */}
        <form onSubmit={handle} className="space-y-4">
          <input className="input-field" type="email" placeholder="Email"
            value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />

          <div className="space-y-1">
            <input className="input-field" type="password" placeholder="Password"
              value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
            <div className="text-right">
              <Link to="/forgot-password" className="text-xs text-brand-muted hover:text-white transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>

          <Button type="submit" fullWidth loading={loading}>Sign In</Button>
        </form>

        <p className="text-center text-brand-muted text-sm mt-6">
          No account?{' '}
          <Link to="/register" className="gradient-text font-semibold">Sign up free</Link>
        </p>
      </div>
    </div>
  )
}