import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import Button from '@components/common/Button'

export default function LoginForm() {
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true)
    try { await login(form.email, form.password) }
    finally { setLoading(false) }
  }

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }))

  return (
    <form onSubmit={handle} className="space-y-4">
      <input className="input-field" type="email" placeholder="Email"
        value={form.email} onChange={set('email')} required />
      <input className="input-field" type="password" placeholder="Password"
        value={form.password} onChange={set('password')} required />
      <Button type="submit" fullWidth loading={loading}>Sign In</Button>
      <p className="text-center text-brand-muted text-sm">
        No account?{' '}
        <Link to="/register" className="gradient-text font-semibold">Sign up free</Link>
      </p>
    </form>
  )
}
