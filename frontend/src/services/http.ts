import axios, { type AxiosRequestConfig } from 'axios'
import { useAuthStore } from '@store/index'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

const onOperatorPage = () => window.location.pathname.startsWith('/operator')

// ─── Request interceptor: attach JWT ─────────────────────────
client.interceptors.request.use((config) => {
  // Operator token for operator routes AND any request made from operator pages; member token otherwise
  const asOperator = config.url?.includes('/api/operator') || onOperatorPage()
  const { operator, user } = useAuthStore.getState()
  const token = asOperator ? operator?.token : user?.token

  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ─── Response interceptor: handle 401 globally ───────────────
client.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const response = axios.isAxiosError<{ error?: string }>(error) ? error.response : undefined

    // A signed-in member's session expired: sign them out. A 401 with nobody signed in is just a
    // failed login, which the form reports itself.
    if (response?.status === 401 && !onOperatorPage() && useAuthStore.getState().user) {
      useAuthStore.getState().clearAuth()
      window.location.href = '/login'
    }

    return Promise.reject(new Error(response?.data?.error || 'Something went wrong'))
  }
)

/** Typed wrapper around the API client. Each call resolves to the response body, or rejects with an Error whose message can be shown to the user. */
export const http = {
  get: <T>(url: string, config?: AxiosRequestConfig) => client.get<T>(url, config).then((r) => r.data),
  post: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) => client.post<T>(url, body, config).then((r) => r.data),
  put: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) => client.put<T>(url, body, config).then((r) => r.data),
  delete: <T>(url: string, config?: AxiosRequestConfig) => client.delete<T>(url, config).then((r) => r.data),
}
