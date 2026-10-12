import type { Request, Response } from 'express'
import { personaService } from '../services'
import type { PersonaResponse, PersonasResponse } from '../types'
import { ok } from '../utils/response'

export const personaController = {
  async list(_req: Request, res: Response) {
    ok<PersonasResponse>(res, { personas: await personaService.listVisible() })
  },

  async getOne(req: Request, res: Response) {
    ok<PersonaResponse>(res, { persona: await personaService.getById(req.params.id ?? '') })
  },
}
