import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { usePersonaStore, useAuthStore } from '@store/index'
import api from '@services/api'

export function usePersona() {
  const { personas, activePersona, setPersonas, setActivePersona } = usePersonaStore()
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  useEffect(() => {
    if (personas.length === 0) {
      api.get('/api/personas')
        .then((data) => setPersonas(data.personas))
        .catch(() => toast.error('Could not load personas'))
    }
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
