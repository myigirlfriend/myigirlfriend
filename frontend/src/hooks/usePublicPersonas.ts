import { useEffect, useState } from 'react'
import { getLivePersonas, setLivePersonas, shufflePersonas } from '@config/personas'
import { personaApi } from '@services/api'
import type { Persona } from '@/types'

/**
 * The companions switched on in the admin dashboard, for visitors who are not signed in.
 * Starts from the list the page was built with (or the built-in ones), then refreshes from the API.
 * Kept in the dashboard's order by default, so a prerendered page and the browser render the same thing.
 * `loaded` turns true once the API has answered, so a page can tell "not found" from "not loaded yet".
 */
export function usePublicPersonas({ shuffle = false }: { shuffle?: boolean } = {}): { personas: Persona[]; loaded: boolean } {
  const order = (list: Persona[]) => (shuffle ? shufflePersonas(list) : list)
  const [personas, setPersonas] = useState<Persona[]>(() => order(getLivePersonas()))
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    personaApi.listPublic()
      .then((data) => { if (data.personas.length > 0) setPersonas(order(setLivePersonas(data.personas))) })
      .catch(() => {})
      .finally(() => setLoaded(true))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { personas, loaded }
}
