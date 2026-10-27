import elenaImg from '@/assets/personas/elena.jpeg'
import hannahImg from '@/assets/personas/hannah.jpeg'
import mariahImg from '@/assets/personas/mariah.jpeg'
import mayaImg from '@/assets/personas/maya.jpeg'
import zaraImg from '@/assets/personas/zara.jpeg'
import type { Persona, PersonaSource } from '@/types'

export const DEFAULT_GRADIENT = { from: '#9B59B6', to: '#E91E8C' } as const

export const PERSONAS: Persona[] = [
  {
    id: 'zara',
    name: 'Zara',
    tagline: 'Playful · Flirty · Bold',
    description: 'Bold, witty, and a little cheeky. She keeps things exciting.',
    tone: 'playful, teasing, confident',
    image: zaraImg,
    gradientFrom: '#9B59B6', // taste-skill-ignore: data, admin-editable
    gradientTo: '#E91E8C', // taste-skill-ignore: data, admin-editable
    accentColor: '#E91E8C', // taste-skill-ignore: data, admin-editable
    previewMessage: 'Took you long enough to show up 😏', // taste-skill-ignore: data, admin-editable
  },
  {
    id: 'maya',
    name: 'Maya',
    tagline: 'Warm · Caring · Present',
    description: 'Warm, patient, and genuinely interested in your world.',
    tone: 'warm, empathetic, caring',
    image: mayaImg,
    gradientFrom: '#8B5CF6', // taste-skill-ignore: data, admin-editable
    gradientTo: '#EC4899', // taste-skill-ignore: data, admin-editable
    accentColor: '#EC4899', // taste-skill-ignore: data, admin-editable
    previewMessage: 'I was thinking about you today 💜', // taste-skill-ignore: data, admin-editable
  },
  {
    id: 'elena',
    name: 'Elena',
    tagline: 'Deep · Thoughtful · Real',
    description: 'Calm, philosophical, and always says something that makes you think.',
    tone: 'calm, intellectual, thoughtful',
    image: elenaImg,
    gradientFrom: '#6366F1', // taste-skill-ignore: data, admin-editable
    gradientTo: '#A855F7', // taste-skill-ignore: data, admin-editable
    accentColor: '#A855F7', // taste-skill-ignore: data, admin-editable
    previewMessage: "What's been on your mind? I actually want to know.", // taste-skill-ignore: data, admin-editable
  },
  {
    id: 'mariah',
    name: 'Mariah',
    tagline: 'Gentle · Romantic · Sweet',
    description: 'Gentle, affectionate, and makes you feel genuinely cared for.',
    tone: 'soft, romantic, affectionate',
    image: mariahImg,
    gradientFrom: '#EC4899', // taste-skill-ignore: data, admin-editable
    gradientTo: '#F43F5E', // taste-skill-ignore: data, admin-editable
    accentColor: '#F43F5E', // taste-skill-ignore: data, admin-editable
    previewMessage: 'You crossed my mind and I smiled 🌹', // taste-skill-ignore: data, admin-editable
  },
  {
    id: 'hannah',
    name: 'Hannah',
    tagline: 'Chill · Funny · Easy to talk to',
    description: 'Casual, funny, and zero pressure. Like texting your best friend.',
    tone: 'casual, funny, chill',
    image: hannahImg,
    gradientFrom: '#F59E0B', // taste-skill-ignore: data, admin-editable
    gradientTo: '#EF4444', // taste-skill-ignore: data, admin-editable
    accentColor: '#F59E0B', // taste-skill-ignore: data, admin-editable
    previewMessage: 'okay you have to hear what just happened 😂', // taste-skill-ignore: data, admin-editable
  },
]

// Models added or edited in the admin dashboard arrive from the API.
// The built-in entries above fill in anything a row does not set (e.g. bundled photos).
export const resolvePersona = (row: PersonaSource): Persona => {
  const base = PERSONAS.find((p) => p.id === row.id)
  const gradientFrom = row.gradient_from ?? row.gradientFrom ?? base?.gradientFrom ?? DEFAULT_GRADIENT.from
  const gradientTo = row.gradient_to ?? row.gradientTo ?? base?.gradientTo ?? DEFAULT_GRADIENT.to
  return {
    id: row.id,
    name: row.name || base?.name || '',
    tagline: row.tagline || base?.tagline || '',
    description: row.description || base?.description || '',
    tone: row.tone || base?.tone || '',
    image: row.image_url || row.imageUrl || base?.image || null,
    gradientFrom,
    gradientTo,
    accentColor: gradientTo,
    previewMessage: row.preview_message || row.previewMessage || base?.previewMessage || '', // taste-skill-ignore: data, admin-editable
  }
}

let livePersonas: Persona[] = PERSONAS

export const setLivePersonas = (rows: PersonaSource[]): Persona[] => {
  livePersonas = rows.map(resolvePersona)
  return livePersonas
}

export const getPersonaById = (id: string | null | undefined): Persona | null =>
  livePersonas.find((p) => p.id === id) ?? PERSONAS.find((p) => p.id === id) ?? null

// Each model gets one random rank per visit. Lists come out shuffled, but keep the same order
// while the visitor moves between pages, and a fresh order on the next visit.
const visitRank = new Map<string, number>()
const rankOf = (id: string): number => {
  let rank = visitRank.get(id)
  if (rank === undefined) {
    rank = Math.random()
    visitRank.set(id, rank)
  }
  return rank
}

export const shufflePersonas = <T extends { id: string }>(list: T[]): T[] =>
  [...list].sort((a, b) => rankOf(a.id) - rankOf(b.id))
