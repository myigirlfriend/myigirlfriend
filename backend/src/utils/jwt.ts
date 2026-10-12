import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import type { AuthTokenPayload, OperatorTokenPayload, UserTokenPayload } from '../types'

export const signUserToken = (payload: UserTokenPayload): string =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: '7d' })

export const signOperatorToken = (payload: OperatorTokenPayload): string =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: '12h' })

/** Throws when the token is missing, malformed, expired or signed with another secret. */
export const verifyToken = (token: string): AuthTokenPayload => {
  const decoded = jwt.verify(token, env.jwtSecret)
  if (typeof decoded === 'string' || typeof decoded.id !== 'string') throw new Error('Malformed token')
  return decoded as AuthTokenPayload
}
