import type { OperatorRole } from './db.types'

/** Payload of the JWT a member gets at login. */
export interface UserTokenPayload {
  id: string
  email: string
  name: string
}

/** Payload of the JWT an operator (admin or agent) gets at login. */
export interface OperatorTokenPayload extends UserTokenPayload {
  role: OperatorRole
}

/** Any token this API issues. `role` is only present on operator tokens. */
export interface AuthTokenPayload extends UserTokenPayload {
  role?: OperatorRole
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface GoogleAuthInput {
  /** The Supabase access token from the finished Google sign-in. This is what proves who the caller is. */
  token: string
  /** Display name to use if Google did not provide one */
  name: string
}

/** Who a Supabase access token belongs to, as confirmed by Supabase. */
export interface VerifiedIdentity {
  id: string
  email: string
  name: string | null
}

export interface AuthUser {
  id: string
  name: string
  email: string
  token: string
  createdAt: string
}

export interface AuthResponse {
  user: AuthUser
}
