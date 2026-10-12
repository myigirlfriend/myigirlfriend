import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { setLivePersonas } from '@config/personas'
import { chatApi, personaApi } from '@services/api'
import { usePersonaStore } from '@store/index'
import type { Persona } from '@/types'

export function usePersona() {
  const { personas, activePersona, setPersonas, setActivePersona } = usePersonaStore()
  const navigate = useNavigate()

  // Always refresh, so models added in the admin dashboard show up without a reload
  useEffect(() => {
    personaApi.list()
      .then((data) => setPersonas(setLivePersonas(data.personas)))
      .catch(() => toast.error('Could not load personas'))
  }, [setPersonas])

  /** Open the chat with a persona, creating the conversation if there is none yet. */
  const selectPersona = useCallback(async (persona: Persona) => {
    setActivePersona(persona)
    try {
      const data = await chatApi.start(persona.id)
      navigate(`/chat/${data.conversationId}`)
    } catch {
      toast.error('Could not start chat. Try again.')
    }
  }, [navigate, setActivePersona])

  /** Open a conversation that already exists. */
  const openConversation = useCallback((conversationId: string, persona: Persona | null) => {
    if (persona) setActivePersona(persona)
    navigate(`/chat/${conversationId}`)
  }, [navigate, setActivePersona])

  return { personas, activePersona, selectPersona, openConversation }
}
