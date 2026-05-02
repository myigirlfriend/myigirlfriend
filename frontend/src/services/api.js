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
    const user = useAuthStore.getState().user
    const operator = useAuthStore.getState().operator
    const token = user?.token || operator?.token
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response interceptor: handle 401 globally ───────────────
api.interceptors.response.use(
  (res) => res.data,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth()
      window.location.href = '/login'
    }
    const message = error.response?.data?.error || 'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

export default api
