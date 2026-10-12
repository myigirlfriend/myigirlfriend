import { http } from '@services/http'
import type { ProfileStats } from '@/types'

export const profileApi = {
  stats: () => http.get<ProfileStats>('/api/profile/stats'),
}
