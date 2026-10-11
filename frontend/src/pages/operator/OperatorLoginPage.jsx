import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@store/index'
import api from '@services/api'

export default function OperatorLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const operator = useAuthStore(s => s.operator)
  const setOperator = useAuthStore(s => s.setOperator)
  const navigate = useNavigate()

  if (operator) return <Navigate to="/operator" replace />

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await api.post('/api/operator/login', form)
      setOperator(data.operator)
      navigate('/operator')
    } catch (err) {
      setError(err.message === 'Invalid credentials' ? 'That email and password do not match. Check them and try again.' : err.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-4 bg-brand-dark">
      <div className="w-full max-w-sm">
        <div className="text-base font-extrabold gradient-text">myigirlfriend</div>
        <h1 className="mt-4 text-2xl font-extrabold text-white">Team sign in</h1>
        <p className="mt-1 text-sm text-zinc-400">For admins and agents of myigirlfriend.</p>

        <form onSubmit={handle} className="mt-8 space-y-5">
          <div>
            <label htmlFor="op-email" className="admin-label">Email</label>
            <input id="op-email" className="admin-input" type="email" autoComplete="username"
              value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
          </div>
          <div>
            <label htmlFor="op-password" className="admin-label">Password</label>
            <input id="op-password" className="admin-input" type="password" autoComplete="current-password"
              value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
          </div>
          {error && <p className="text-sm font-semibold text-red-400" role="alert">{error}</p>}
          <button type="submit" disabled={loading} className="admin-btn-primary w-full py-3">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
