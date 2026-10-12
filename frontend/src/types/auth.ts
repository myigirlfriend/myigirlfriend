export type OperatorRole = 'admin' | 'agent' | 'operator'

/** The signed-in member, as returned by the auth endpoints and kept in the auth store. */
export interface AuthUser {
  id: string
  name: string
  email: string
  token: string
  /** Missing on sessions saved before the API started sending it */
  createdAt?: string
}

/** The signed-in admin or agent. */
export interface Operator {
  id: string
  name: string
  email: string
  role: OperatorRole
  token: string
}

export interface AuthResponse {
  user: AuthUser
}

export interface OperatorLoginResponse {
  operator: Operator
}

export interface Credentials {
  email: string
  password: string
}

export interface RegisterPayload extends Credentials {
  name: string
}

export interface GoogleAuthPayload {
  email: string
  name: string
  googleId: string
  token: string
}
