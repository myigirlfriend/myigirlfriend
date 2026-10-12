import { http } from '@services/http'
import type { AuthResponse, Credentials, GoogleAuthPayload, RegisterPayload } from '@/types'

export const authApi = {
  login: (credentials: Credentials) => http.post<AuthResponse>('/api/auth/login', credentials),
  register: (payload: RegisterPayload) => http.post<AuthResponse>('/api/auth/register', payload),
  /** Exchanges a finished Google sign-in for our own session. */
  google: (payload: GoogleAuthPayload) => http.post<AuthResponse>('/api/auth/google', payload),
}
