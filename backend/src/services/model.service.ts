import { randomUUID } from 'node:crypto'
import { RepositoryError, conversationRepository, personaImageRepository, personaRepository } from '../repositories'
import type { Model, ModelInput, PersonaRow, PersonaUpdate } from '../types'
import { HttpError, badRequest, conflict, notFound, serverError } from '../utils/httpError'
import { logger } from '../utils/logger'
import { planGallery, type GalleryPlan } from './gallery'
import { sortPersonas } from './persona.service'

// Models are the AI personas users chat with. Admin only.
const IMAGE_TYPES: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const SETUP_MESSAGE = 'Model details are not set up in the database yet. Run the files in backend/db/migrations (001, 002, 003) in the Supabase SQL editor.'

const toModel = (p: PersonaRow, chats = 0): Model => ({
  id: p.id,
  name: p.name,
  tagline: p.tagline || '',
  description: p.description || '',
  tone: p.tone || '',
  prompt: p.prompt || '',
  previewMessage: p.preview_message || '',
  imageUrl: p.image_url || null,
  gallery: p.gallery ?? [],
  gradientFrom: p.gradient_from || null,
  gradientTo: p.gradient_to || null,
  isActive: p.is_active !== false,
  sortOrder: p.sort_order || 0,
  chats,
})

// Missing-column errors from Postgres / PostgREST mean the migration has not been run
const isSetupError = (error: unknown): boolean =>
  error instanceof RepositoryError
  && (['42703', 'PGRST204'].includes(error.code ?? '')
    || /column .* does not exist|Could not find the .* column/i.test(error.message))

const saveError = (error: unknown): HttpError => {
  if (isSetupError(error)) return conflict(SETUP_MESSAGE)
  logger.error('[models] Could not save the model', error)
  return serverError('Could not save the model')
}

const slugify = (name: string): string =>
  name.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40)

const clean = (value: unknown, max: number): string => (typeof value === 'string' ? value.trim().slice(0, max) : '')
const isHex = (value: unknown): value is string => typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value)

// Turn the request body into table columns. Only keys present in the body are written.
const toRow = (body: ModelInput): PersonaUpdate => {
  const row: PersonaUpdate = {}
  if ('name' in body) row.name = clean(body.name, 40)
  if ('tagline' in body) row.tagline = clean(body.tagline, 80)
  if ('description' in body) row.description = clean(body.description, 300)
  if ('tone' in body) row.tone = clean(body.tone, 120)
  if ('prompt' in body) row.prompt = clean(body.prompt, 4000)
  if ('previewMessage' in body) row.preview_message = clean(body.previewMessage, 200)
  if (isHex(body.gradientFrom)) row.gradient_from = body.gradientFrom
  if (isHex(body.gradientTo)) row.gradient_to = body.gradientTo
  if (typeof body.isActive === 'boolean') row.is_active = body.isActive
  return row
}

// Store a "data:image/...;base64,..." photo and return its public URL
const uploadImage = async (id: string, dataUrl: unknown): Promise<string> => {
  const match = /^data:(image\/[a-z+]+);base64,(.+)$/s.exec(typeof dataUrl === 'string' ? dataUrl : '')
  const [, contentType, base64] = match ?? []
  const extension = contentType && IMAGE_TYPES[contentType]
  if (!contentType || !base64 || !extension) throw badRequest('Photo must be a JPG, PNG or WebP image')

  const file = Buffer.from(base64, 'base64')
  if (file.length > MAX_IMAGE_BYTES) throw badRequest('Photo is too large. Use an image under 5 MB')

  try {
    await personaImageRepository.ensureBucket()
  } catch {
    throw badRequest('Could not prepare photo storage')
  }

  try {
    return await personaImageRepository.upload(`${id}-${Date.now()}-${randomUUID().slice(0, 8)}.${extension}`, file, contentType)
  } catch {
    throw badRequest('Could not upload the photo')
  }
}

// A photo left behind in storage is harmless, so failing to delete one never fails the request
const removeImage = async (url: string | null | undefined): Promise<void> => {
  if (!url) return
  await personaImageRepository.removeByUrl(url).catch((e) => logger.warn('[models] Photo was not removed', e))
}

const removeImages = (urls: string[]): Promise<void[]> => Promise.all(urls.map(removeImage))

/** Upload the new photos of a gallery plan. Returns the final list and what was uploaded (to clean up on failure). */
const applyGallery = async (id: string, plan: GalleryPlan): Promise<{ gallery: string[]; uploaded: string[] }> => {
  const uploaded: string[] = []
  try {
    const gallery: string[] = []
    for (const entry of plan.entries) {
      if ('keep' in entry) gallery.push(entry.keep)
      else {
        const url = await uploadImage(`${id}-gallery`, entry.upload)
        uploaded.push(url)
        gallery.push(url)
      }
    }
    return { gallery, uploaded }
  } catch (e) {
    await removeImages(uploaded)
    throw e
  }
}

export const modelService = {
  /** Every model, including hidden ones, with how many chats each has. */
  async list(): Promise<Model[]> {
    const [personas, conversationPersonaIds] = await Promise.all([
      personaRepository.findAll().catch((e) => {
        logger.error('[models] Could not load models', e)
        throw serverError('Could not load models')
      }),
      conversationRepository.findAllPersonaIds().catch(() => [] as string[]),
    ])

    const chats = new Map<string, number>()
    for (const personaId of conversationPersonaIds) chats.set(personaId, (chats.get(personaId) || 0) + 1)

    return sortPersonas(personas).map((p) => toModel(p, chats.get(p.id) || 0))
  },

  async create(body: ModelInput): Promise<Model> {
    const row = toRow(body)
    if (!row.name) throw badRequest('Give the model a name')

    const base = slugify(row.name)
    if (!base) throw badRequest('The name needs at least one letter or number')
    const taken = new Set(await personaRepository.findIdsStartingWith(base))
    let id = base
    for (let n = 2; taken.has(id); n++) id = `${base}-${n}`

    // Checked before the photo is uploaded, so a database that still needs the migration
    // fails here with the setup message and leaves no stray file behind
    try {
      row.sort_order = (await personaRepository.findHighestSortOrder()) + 1
    } catch (e) {
      throw saveError(e)
    }

    const plan = 'gallery' in body ? planGallery(body.gallery, []) : null

    if (body.image) row.image_url = await uploadImage(id, body.image)
    let uploaded: string[] = []
    if (plan) {
      try {
        const result = await applyGallery(id, plan)
        row.gallery = result.gallery
        uploaded = result.uploaded
      } catch (e) {
        await removeImage(row.image_url)
        throw e
      }
    }

    try {
      return toModel(await personaRepository.create({ ...row, id, name: row.name }))
    } catch (e) {
      await removeImages([row.image_url ?? '', ...uploaded].filter(Boolean))
      throw saveError(e)
    }
  },

  async update(id: string, body: ModelInput): Promise<Model> {
    const existing = await personaRepository.findById(id)
    if (!existing) throw notFound('Model not found')

    const row = toRow(body)
    if ('name' in row && !row.name) throw badRequest('Give the model a name')

    // Checked before anything is uploaded, so a bad request leaves storage untouched
    const plan = 'gallery' in body ? planGallery(body.gallery, existing.gallery ?? []) : null

    if (body.image) row.image_url = await uploadImage(id, body.image)
    let uploaded: string[] = []
    if (plan) {
      try {
        const result = await applyGallery(id, plan)
        row.gallery = result.gallery
        uploaded = result.uploaded
      } catch (e) {
        await removeImage(row.image_url)
        throw e
      }
    }
    row.updated_at = new Date().toISOString()

    let saved: PersonaRow
    try {
      saved = await personaRepository.update(id, row)
    } catch (e) {
      await removeImages([row.image_url ?? '', ...uploaded].filter(Boolean))
      throw saveError(e)
    }

    // Photos no longer referenced once the new ones are saved
    if (row.image_url) await removeImage(existing.image_url)
    if (plan) await removeImages(plan.removed)
    return toModel(saved)
  },

  /** Delete a model. Models that already have chats can only be hidden, so history is kept. */
  async remove(id: string): Promise<void> {
    if ((await conversationRepository.countByPersona(id)) > 0) {
      throw conflict('This model already has chats, so she cannot be deleted. Hide her from users instead.')
    }

    const existing = await personaRepository.findById(id)
    if (!existing) throw notFound('Model not found')

    try {
      await personaRepository.remove(id)
    } catch (e) {
      logger.error('[models] Could not delete the model', e)
      throw serverError('Could not delete the model')
    }
    await removeImage(existing.image_url)
    await removeImages(existing.gallery ?? [])
  },
}
