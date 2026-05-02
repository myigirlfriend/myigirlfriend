import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuthStore } from '@store/index'
import api from '@services/api'

export function useAuth() {
  const { user, setUser, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const login = useCallback(async (email, password) => {
    const data = await api.post('/api/auth/login', { email, password })
    setUser(data.user)
    toast.success(`Welcome back, ${data.user.name}!`)
    navigate('/personas')
  }, [setUser, navigate])

  const register = useCallback(async (name, email, password) => {
    const data = await api.post('/api/auth/register', { name, email, password })
    setUser(data.user)
    toast.success('Account created! Pick your companion.')
    navigate('/personas')
  }, [setUser, navigate])

  const logout = useCallback(() => {
    clearAuth()
    toast.success('See you soon!')
    navigate('/')
  }, [clearAuth, navigate])

  return { user, login, register, logout, isAuthenticated: !!user }
}
