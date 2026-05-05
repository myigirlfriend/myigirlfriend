import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import Button from '@components/common/Button'

export default function RegisterForm() {
  const { register } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true)
    try { await register(form.name, form.email, form.password) }
    finally { setLoading(false) }
  }

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }))

  return (
    <form onSubmit={handle} className="space-y-4">
      <input className="input-field" placeholder="Your name"
        value={form.name} onChange={set('name')} required />
      <input className="input-field" type="email" placeholder="Email"
        value={form.email} onChange={set('email')} required />
      <input className="input-field" type="password" placeholder="Password (min 8 chars)"
        minLength={8} value={form.password} onChange={set('password')} required />
      <Button type="submit" fullWidth loading={loading}>Create Account</Button>
      <p className="text-center text-brand-muted text-sm">
        Have an account?{' '}
        <Link to="/login" className="gradient-text font-semibold">Sign in</Link>
      </p>
    </form>
  )
}
