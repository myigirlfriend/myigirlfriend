import { useEffect, useState } from 'react'
import { PERSONAS, setLivePersonas, shufflePersonas } from '@config/personas'
import { personaApi } from '@services/api'
import type { Persona } from '@/types'

/** The companions switched on in the admin dashboard, shuffled, for visitors who are not signed in. Built-in ones show until the list arrives. */
export function usePublicPersonas(): Persona[] {
  const [personas, setPersonas] = useState<Persona[]>(() => shufflePersonas(PERSONAS))
  useEffect(() => {
    personaApi.listPublic()
      .then((data) => { if (data.personas.length > 0) setPersonas(shufflePersonas(setLivePersonas(data.personas))) })
      .catch(() => {})
  }, [])
  return personas
}
