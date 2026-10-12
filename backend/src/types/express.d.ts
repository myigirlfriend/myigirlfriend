import type { AuthTokenPayload, OperatorTokenPayload } from './auth.types'

declare global {
  namespace Express {
    interface Request {
      /** Set by authMiddleware / anyAuth */
      user?: AuthTokenPayload
      /** Set by operatorMiddleware */
      operator?: OperatorTokenPayload
    }
  }
}

export {}
