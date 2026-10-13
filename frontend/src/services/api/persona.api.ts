import { http } from '@services/http'
import type { PersonasResponse } from '@/types'

export const personaApi = {
  list: () => http.get<PersonasResponse>('/api/personas'),
  /** The live models, for visitors who are not signed in (landing page). */
  listPublic: () => http.get<PersonasResponse>('/api/personas/public'),
}
