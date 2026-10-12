import type { Request, Response } from 'express'
import { currentUser } from '../middleware/auth.middleware'
import { profileService } from '../services'
import type { ProfileStatsResponse } from '../types'
import { ok } from '../utils/response'

export const profileController = {
  async stats(req: Request, res: Response) {
    ok<ProfileStatsResponse>(res, await profileService.getStats(currentUser(req).id))
  },
}
