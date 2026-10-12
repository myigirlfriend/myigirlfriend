import type { Response } from 'express'
import type { ErrorResponse } from '../types'

export const ok = <T>(res: Response, data: T, status = 200) => res.status(status).json(data)

export const err = (res: Response, message: string, status = 400) =>
  res.status(status).json({ error: message } satisfies ErrorResponse)
