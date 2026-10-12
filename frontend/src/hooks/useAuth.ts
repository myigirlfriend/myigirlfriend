import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authApi } from '@services/api'
import { useAuthStore } from '@store/index'

export function useAuth() {
  const { user, setUser, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const login = useCallback(async (email: string, password: string) => {
    const data = await authApi.login({ email, password })
    setUser(data.user)
    toast.success(`Welcome back, ${data.user.name}!`)
    navigate('/personas')
  }, [setUser, navigate])

  const register = useCallback(async (name: string, email: string, password: string) => {
    const data = await authApi.register({ name, email, password })
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
