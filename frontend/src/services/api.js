import axios from 'axios'
import { useAuthStore } from '@store/index'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// ─── Request interceptor: attach JWT ─────────────────────────
api.interceptors.request.use(
  (config) => {
    const isOperatorRoute = config.url?.includes('/api/operator')
    const isOnOperatorPage = window.location.pathname.startsWith('/operator')

    if (isOperatorRoute || isOnOperatorPage) {
      // Use operator token for operator routes AND any request made from operator pages
      const operator = useAuthStore.getState().operator
      if (operator?.token) {
        config.headers.Authorization = `Bearer ${operator.token}`
      }
    } else {
      // Use user token for everything else
      const user = useAuthStore.getState().user
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response interceptor: handle 401 globally ───────────────
api.interceptors.response.use(
  (res) => res.data,
  (error) => {
    if (error.response?.status === 401) {
      const isOperatorRoute = window.location.pathname.startsWith('/operator')
      if (!isOperatorRoute) {
        useAuthStore.getState().clearAuth()
        window.location.href = '/login'
      }
    }
    const message = error.response?.data?.error || 'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

export default api
