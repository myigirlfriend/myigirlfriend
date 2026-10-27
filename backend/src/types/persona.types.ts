import type { PersonaRow } from './db.types'

/** What members see: a persona row without the AI instructions. */
export type PublicPersona = Omit<PersonaRow, 'prompt'>

/** Enough of a persona to build its system prompt. */
export type PromptPersona = Pick<PersonaRow, 'id'> & Partial<Pick<PersonaRow, 'name' | 'tone' | 'prompt' | 'tagline' | 'description' | 'preview_message'>>

export interface PersonasResponse {
  personas: PublicPersona[]
}

export interface PersonaResponse {
  persona: PublicPersona
}

/** A persona as the admin dashboard edits it. */
export interface Model {
  id: string
  name: string
  tagline: string
  description: string
  tone: string
  prompt: string
  previewMessage: string
  imageUrl: string | null
  /** Extra photos, in display order */
  gallery: string[]
  gradientFrom: string | null
  gradientTo: string | null
  isActive: boolean
  sortOrder: number
  chats: number
}

/** Request body for creating or editing a model. Untrusted, so every field is validated before use. */
export interface ModelInput {
  name?: unknown
  tagline?: unknown
  description?: unknown
  tone?: unknown
  prompt?: unknown
  previewMessage?: unknown
  gradientFrom?: unknown
  gradientTo?: unknown
  isActive?: unknown
  /** New photo as a `data:image/...;base64,...` URL */
  image?: unknown
  /**
   * The complete gallery, in order. Each entry is either the URL of a photo already in her gallery (kept)
   * or a `data:image/...` URL (uploaded). Photos left out are deleted. Omit to leave the gallery unchanged.
   */
  gallery?: unknown
}

export interface ModelsResponse {
  models: Model[]
}

export interface ModelResponse {
  model: Model
}
