import { personaRepository } from '../repositories'
import type { PersonaInsert, PersonaRow, PublicPersona } from '../types'
import { notFound } from '../utils/httpError'

// Seed personas if DB is empty - helpful for first run
const SEED_PERSONAS: PersonaInsert[] = [
  { id: 'zara',   name: 'Zara',   tone: 'playful, teasing, confident',   tagline: 'The Playful Flirt' },
  { id: 'maya',   name: 'Maya',   tone: 'warm, empathetic, caring',      tagline: 'The Supportive Listener' },
  { id: 'elena',  name: 'Elena',  tone: 'calm, intellectual, thoughtful', tagline: 'The Deep Thinker' },
  { id: 'mariah', name: 'Mariah', tone: 'soft, romantic, affectionate',  tagline: 'The Sweet Romantic' },
  { id: 'hannah', name: 'Hannah', tone: 'casual, funny, chill',          tagline: 'The Easygoing Friend' },
]

/** Admin-defined order first, then oldest first. */
export const sortPersonas = <T extends Pick<PersonaRow, 'sort_order' | 'created_at'>>(personas: T[]): T[] =>
  [...personas].sort(
    (a, b) => (a.sort_order || 0) - (b.sort_order || 0) || String(a.created_at).localeCompare(String(b.created_at))
  )

// Members never see the AI instructions
const toPublic = ({ prompt: _prompt, ...persona }: PersonaRow): PublicPersona => persona

export const personaService = {
  /** The models members can pick from: only the ones that are switched on. */
  async listVisible(): Promise<PublicPersona[]> {
    let personas = await personaRepository.findAll()
    if (personas.length === 0) {
      await personaRepository.createMany(SEED_PERSONAS)
      personas = SEED_PERSONAS as PersonaRow[]
    }

    return sortPersonas(personas.filter((p) => p.is_active !== false)).map(toPublic)
  },

  async getById(id: string): Promise<PublicPersona> {
    const persona = await personaRepository.findById(id)
    if (!persona) throw notFound('Persona not found')
    return toPublic(persona)
  },
}
