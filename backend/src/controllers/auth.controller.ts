import type { Request, Response } from 'express'
import { authService } from '../services'
import type { AuthResponse } from '../types'
import { badRequest } from '../utils/httpError'
import { ok } from '../utils/response'
import { text } from '../utils/validate'

export const authController = {
  async register(req: Request, res: Response) {
    const name = text(req.body.name)
    const email = text(req.body.email)
    const password = text(req.body.password)
    if (!name || !email || !password) throw badRequest('All fields required')

    const user = await authService.register({ name, email, password })
    ok<AuthResponse>(res, { user }, 201)
  },

  async login(req: Request, res: Response) {
    const email = text(req.body.email)
    const password = text(req.body.password)
    if (!email || !password) throw badRequest('Email and password required')

    const user = await authService.login({ email, password })
    ok<AuthResponse>(res, { user })
  },

  async google(req: Request, res: Response) {
    const token = text(req.body.token)
    if (!token) throw badRequest('Missing required fields')

    const user = await authService.syncGoogleUser({ token, name: text(req.body.name) })
    ok<AuthResponse>(res, { user })
  },
}
