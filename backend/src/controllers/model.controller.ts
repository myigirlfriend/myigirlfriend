import type { Request, Response } from 'express'
import { modelService } from '../services'
import type { ModelInput, ModelResponse, ModelsResponse, SuccessResponse } from '../types'
import { ok } from '../utils/response'
import { isRecord } from '../utils/validate'

const modelInput = (body: unknown): ModelInput => (isRecord(body) ? body : {})

export const modelController = {
  async list(_req: Request, res: Response) {
    ok<ModelsResponse>(res, { models: await modelService.list() })
  },

  async create(req: Request, res: Response) {
    ok<ModelResponse>(res, { model: await modelService.create(modelInput(req.body)) }, 201)
  },

  async update(req: Request, res: Response) {
    ok<ModelResponse>(res, { model: await modelService.update(req.params.id ?? '', modelInput(req.body)) })
  },

  async remove(req: Request, res: Response) {
    await modelService.remove(req.params.id ?? '')
    ok<SuccessResponse>(res, { success: true })
  },
}
