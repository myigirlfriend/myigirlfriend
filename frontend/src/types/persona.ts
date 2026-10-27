/** A companion as the UI renders it. Built by `resolvePersona` from an API row or an admin model. */
export interface Persona {
  id: string
  name: string
  tagline: string
  description: string
  tone: string
  image: string | null
  /** More photos of her, shown on her profile. The main photo is not repeated here. */
  gallery: string[]
  gradientFrom: string
  gradientTo: string
  accentColor: string
  previewMessage: string
}

/** A persona as `GET /api/personas` returns it (database column names). */
export interface PersonaRow {
  id: string
  name: string
  tone?: string | null
  tagline?: string | null
  description?: string | null
  preview_message?: string | null
  image_url?: string | null
  gallery?: string[] | null
  gradient_from?: string | null
  gradient_to?: string | null
  is_active?: boolean
  sort_order?: number
  created_at?: string
}

/** A persona as the admin dashboard reads and edits it. */
export interface Model {
  id: string
  name: string
  tagline: string
  description: string
  tone: string
  prompt: string
  previewMessage: string
  imageUrl: string | null
  gallery: string[]
  gradientFrom: string | null
  gradientTo: string | null
  isActive: boolean
  sortOrder: number
  chats: number
}

/** The editable fields of a model. */
export interface ModelFormValues {
  name: string
  tagline: string
  description: string
  tone: string
  prompt: string
  previewMessage: string
  gradientFrom: string
  gradientTo: string
  isActive: boolean
}

/**
 * Body of the create / update model requests. `image` is a data URL, sent only when a new photo was chosen.
 * `gallery` is the full list of extra photos in order: URLs of photos to keep and data URLs of new ones.
 */
export interface ModelPayload extends ModelFormValues {
  image?: string
  gallery?: string[]
}

/** Anything `resolvePersona` accepts: an API row (snake_case) or an admin model (camelCase). */
export interface PersonaSource {
  id: string
  name?: string | null
  tagline?: string | null
  description?: string | null
  tone?: string | null
  image_url?: string | null
  imageUrl?: string | null
  gallery?: string[] | null
  gradient_from?: string | null
  gradientFrom?: string | null
  gradient_to?: string | null
  gradientTo?: string | null
  preview_message?: string | null
  previewMessage?: string | null
}

/** What an avatar needs. A bare name is enough; photo and colours are optional. */
export type AvatarPersona = Pick<Persona, 'name'> &
  Partial<Pick<Persona, 'image' | 'gradientFrom' | 'gradientTo' | 'accentColor'>>

/** What a portrait tile needs. All optional so the model editor can preview a half-filled form. */
export type TilePersona = Partial<
  Pick<Persona, 'name' | 'tagline' | 'image' | 'previewMessage' | 'gradientFrom' | 'gradientTo'>
>

export interface PersonasResponse {
  personas: PersonaRow[]
}

export interface ModelsResponse {
  models: Model[]
}

export interface ModelResponse {
  model: Model
}
