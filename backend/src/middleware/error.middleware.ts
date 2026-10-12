import type { ErrorRequestHandler } from 'express'
import { HttpError } from '../utils/httpError'
import { logger } from '../utils/logger'
import { err } from '../utils/response'

const statusOf = (error: unknown): number => {
  const status = (error as { status?: unknown } | null)?.status
  return typeof status === 'number' && status >= 400 && status < 600 ? status : 500
}

/** Last middleware: turns anything thrown by a controller into the API's `{ error }` shape. */
export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof HttpError) return void err(res, error.message, error.status)

  // Errors from express itself (bad JSON, body too large) carry their own 4xx status
  const status = statusOf(error)
  if (status < 500 && error instanceof Error) return void err(res, error.message, status)

  logger.error(error)
  err(res, 'Internal server error', 500)
}
