import type { Request, RequestHandler } from 'express'
import type { AuthTokenPayload, OperatorTokenPayload } from '../types'
import { unauthorized } from '../utils/httpError'
import { verifyToken } from '../utils/jwt'
import { logger } from '../utils/logger'
import { err } from '../utils/response'

const OPERATOR_ROLES = ['operator', 'admin', 'agent']

const bearerToken = (req: Request): string | null => {
  const header = req.headers.authorization
  return header?.startsWith('Bearer ') ? (header.split(' ')[1] ?? null) : null
}

const requireToken = (invalidMessage: string): RequestHandler => (req, res, next) => {
  const token = bearerToken(req)
  if (!token) return void err(res, 'Unauthorized', 401)
  try {
    req.user = verifyToken(token)
    next()
  } catch {
    err(res, invalidMessage, 401)
  }
}

/** Requires a valid token and puts its payload on `req.user`. */
export const authMiddleware = requireToken('Invalid or expired token')

/** Same check, for routes that both members and operators call. */
export const anyAuth = requireToken('Invalid token')

/** Requires an operator token (admin or agent) and puts its payload on `req.operator`. */
export const operatorMiddleware: RequestHandler = (req, res, next) => {
  const token = bearerToken(req)
  if (!token) return void err(res, 'Unauthorized', 401)
  try {
    const decoded = verifyToken(token)
    if (!decoded.role || !OPERATOR_ROLES.includes(decoded.role)) return void err(res, 'Forbidden', 403)
    req.operator = { ...decoded, role: decoded.role }
    next()
  } catch (e) {
    logger.error('[operatorMiddleware] error:', e instanceof Error ? e.message : e)
    err(res, 'Invalid token', 401)
  }
}

/** Use after operatorMiddleware on routes only admins may call. */
export const adminOnly: RequestHandler = (req, res, next) => {
  if (req.operator?.role !== 'admin') return void err(res, 'Forbidden', 403)
  next()
}

// Controllers behind the middleware above read the caller through these, so the payload is never undefined.

export const currentUser = (req: Request): AuthTokenPayload => {
  if (!req.user) throw unauthorized()
  return req.user
}

export const currentOperator = (req: Request): OperatorTokenPayload => {
  if (!req.operator) throw unauthorized()
  return req.operator
}
