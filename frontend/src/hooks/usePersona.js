import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { usePersonaStore, useAuthStore } from '@store/index'
import api from '@services/api'
import { setLivePersonas } from '@config/personas'

export function usePersona() {
  const { personas, activePersona, setPersonas, setActivePersona } = usePersonaStore()
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  // Always refresh, so models added in the admin dashboard show up without a reload
  useEffect(() => {
    api.get('/api/personas')
      .then((data) => setPersonas(setLivePersonas(data.personas)))
      .catch(() => toast.error('Could not load personas'))
  }, [])

  const selectPersona = useCallback(async (persona) => {
    setActivePersona(persona)
    try {
      // Create or resume conversation for this persona
      const data = await api.post('/api/chat/start', { personaId: persona.id })
      navigate(`/chat/${data.conversationId}`)
    } catch (err) {
      toast.error('Could not start chat. Try again.')
    }
  }, [navigate, setActivePersona])

  return { personas, activePersona, selectPersona }
}
