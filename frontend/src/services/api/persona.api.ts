import { http } from '@services/http'
import type { PersonasResponse } from '@/types'

export const personaApi = {
  list: () => http.get<PersonasResponse>('/api/personas'),
}
