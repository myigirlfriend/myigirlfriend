import type { NextFunction, Request, RequestHandler, Response } from 'express'

/** Express 4 does not catch rejected promises, so async controllers are wrapped to forward errors. */
export const asyncHandler =
  (handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    handler(req, res, next).catch(next)
  }
