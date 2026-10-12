import bcrypt from 'bcryptjs'
import { identityRepository, userRepository } from '../repositories'
import type { AuthUser, GoogleAuthInput, LoginInput, RegisterInput, UserRow } from '../types'
import { badRequest, serverError, unauthorized } from '../utils/httpError'
import { signUserToken } from '../utils/jwt'
import { logger } from '../utils/logger'
import { usageService } from './usage.service'

const toAuthUser = (user: UserRow): AuthUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  token: signUserToken({ id: user.id, email: user.email, name: user.name }),
  createdAt: user.created_at,
})

// A missing usage row only means the free counter starts on the first message, so it must not fail sign-up
const startUsage = async (userId: string): Promise<void> => {
  try {
    await usageService.start(userId)
  } catch (e) {
    logger.error('[auth] Could not create the usage row for', userId, e)
  }
}

export const authService = {
  async register({ name, email, password }: RegisterInput): Promise<AuthUser> {
    if (await userRepository.findByEmail(email)) throw badRequest('Email already registered')

    const passwordHash = await bcrypt.hash(password, 10)
    let user: UserRow
    try {
      user = await userRepository.create({ name, email, password_hash: passwordHash })
    } catch (e) {
      logger.error('[auth] Registration failed', e)
      throw serverError('Registration failed')
    }

    await startUsage(user.id)
    return toAuthUser(user)
  },

  async login({ email, password }: LoginInput): Promise<AuthUser> {
    const user = await userRepository.findByEmail(email)
    if (!user) throw unauthorized('Invalid credentials')

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) throw unauthorized('Invalid credentials')

    return toAuthUser(user)
  },

  /**
   * Google OAuth sync — finds the member behind a Google login, or creates one the first time.
   * The email comes from the verified token, never from the request, so nobody can sign in as someone else.
   */
  async syncGoogleUser({ token, name }: GoogleAuthInput): Promise<AuthUser> {
    const identity = await identityRepository.findByAccessToken(token)
    if (!identity) throw unauthorized('Google sign-in could not be verified. Please try again.')
    const { email } = identity

    try {
      const existing = await userRepository.findByEmail(email)
      if (existing) return toAuthUser(existing)
    } catch (e) {
      logger.error('[Google auth error]', e)
      throw serverError('Authentication failed')
    }

    let user: UserRow
    try {
      user = await userRepository.create({
        name: identity.name || name || email.split('@')[0] || email,
        email,
        password_hash: `google_${identity.id}`, // placeholder — Google users don't use password
        status: 'active',
      })
    } catch (e) {
      logger.error('[Google auth error]', e)
      throw serverError('Could not create account')
    }

    await startUsage(user.id)
    return toAuthUser(user)
  },
}
