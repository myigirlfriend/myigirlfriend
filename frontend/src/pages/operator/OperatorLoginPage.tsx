import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Button from '@components/common/Button'
import PasswordInput from '@components/common/PasswordInput'
import AuthLayout from '@components/layout/AuthLayout'
import { operatorApi } from '@services/api'
import { useAuthStore } from '@store/index'
import { errorMessage } from '@utils/text'

export default function OperatorLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const operator = useAuthStore((s) => s.operator)
  const setOperator = useAuthStore((s) => s.setOperator)
  const navigate = useNavigate()

  if (operator) return <Navigate to="/operator" replace />

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await operatorApi.login(form)
      setOperator(data.operator)
      navigate('/operator')
    } catch (err) {
      const message = errorMessage(err)
      setError(message === 'Invalid credentials' ? 'That email and password do not match. Check them and try again.' : message)
    } finally { setLoading(false) }
  }

  return (
    <AuthLayout title="Team sign in" subtitle="For admins and agents of myigirlfriend.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="op-email" className="field__label">Email</label>
          <input id="op-email" className="input" type="email" autoComplete="username"
            value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
        </div>
        <div>
          <label htmlFor="op-password" className="field__label">Password</label>
          <PasswordInput id="op-password" autoComplete="current-password"
            value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required />
        </div>
        {error && <p className="field__error" role="alert">{error}</p>}
        <Button type="submit" fullWidth loading={loading} loadingText="Signing in…">Sign in</Button>
      </form>
    </AuthLayout>
  )
}
