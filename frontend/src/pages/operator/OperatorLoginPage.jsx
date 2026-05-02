import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@store/index'
import Button from '@components/common/Button'
import api from '@services/api'
import toast from 'react-hot-toast'

export default function OperatorLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const setOperator = useAuthStore(s => s.setOperator)
  const navigate = useNavigate()

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await api.post('/api/operator/login', form)
      setOperator(data.operator)
      navigate('/operator/dashboard')
    } catch (err) {
      toast.error(err.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-brand-dark">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-extrabold gradient-text text-center mb-2">Operator Portal</h1>
        <p className="text-brand-muted text-center text-sm mb-8">Agent access only</p>
        <form onSubmit={handle} className="space-y-4">
          <input className="input-field" type="email" placeholder="Agent email"
            value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
          <input className="input-field" type="password" placeholder="Password"
            value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
          <Button type="submit" fullWidth loading={loading}>Sign In as Agent</Button>
        </form>
      </div>
    </div>
  )
}
