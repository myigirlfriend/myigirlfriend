import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import Button from '@components/common/Button'
import GoogleButton from '@components/auth/GoogleButton'

export default function RegisterPage() {
  const { register } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true)
    try { await register(form.name, form.email, form.password) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-brand-dark"
      style={{ background: 'radial-gradient(ellipse at top, #1a0a2e 0%, #0a0a0a 60%)' }}>
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-extrabold text-center mb-1">
          <span className="gradient-text">Create account</span>
        </h1>
        <p className="text-brand-muted text-center text-sm mb-8">Find your companion</p>

        {/* Google signup */}
        <GoogleButton label="Sign up with Google" />

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-brand-border" />
          <span className="text-brand-muted text-xs font-semibold">or</span>
          <div className="flex-1 h-px bg-brand-border" />
        </div>

        {/* Email signup */}
        <form onSubmit={handle} className="space-y-4">
          <input className="input-field" placeholder="Your name"
            value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
          <input className="input-field" type="email" placeholder="Email"
            value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
          <input className="input-field" type="password" placeholder="Password (min 8 chars)"
            minLength={8} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
          <Button type="submit" fullWidth loading={loading}>Create Account</Button>
        </form>

        <p className="text-center text-brand-muted text-xs mt-4 leading-relaxed">
          By creating an account you agree to our{' '}
          <Link to="/terms" className="gradient-text font-semibold">Terms</Link>
          {' '}and{' '}
          <Link to="/privacy" className="gradient-text font-semibold">Privacy Policy</Link>
        </p>

        <p className="text-center text-brand-muted text-sm mt-4">
          Have an account?{' '}
          <Link to="/login" className="gradient-text font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  )
}