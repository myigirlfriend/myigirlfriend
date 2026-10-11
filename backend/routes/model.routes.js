const router = require('express').Router()
const supabase = require('../config/supabase')
const { operatorMiddleware } = require('../middleware/auth.middleware')
const { ok, err } = require('../utils/response')

// Models are the AI personas users chat with. Admin only.
const BUCKET = 'personas'
const IMAGE_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const SETUP_MESSAGE = 'Model details are not set up in the database yet. Run backend/db/migrations/001_model_details.sql in the Supabase SQL editor.'

router.use(operatorMiddleware)
router.use((req, res, next) => {
  if (req.operator.role !== 'admin') return err(res, 'Forbidden', 403)
  next()
})

const toModel = (p, chats = 0) => ({
  id: p.id,
  name: p.name,
  tagline: p.tagline || '',
  description: p.description || '',
  tone: p.tone || '',
  prompt: p.prompt || '',
  previewMessage: p.preview_message || '',
  imageUrl: p.image_url || null,
  gradientFrom: p.gradient_from || null,
  gradientTo: p.gradient_to || null,
  isActive: p.is_active !== false,
  sortOrder: p.sort_order || 0,
  chats,
})

// Missing-column errors from Postgres / PostgREST mean the migration has not been run
const isSetupError = (error) =>
  ['42703', 'PGRST204'].includes(error?.code) || /column .* does not exist|Could not find the .* column/i.test(error?.message || '')

const slugify = (name) =>
  name.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40)

const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const isHex = (v) => typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v)

// Turn the request body into table columns. Only keys present in the body are written.
const toRow = (body) => {
  const row = {}
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

// Store a "data:image/...;base64,..." photo in Supabase Storage and return its public URL
const uploadImage = async (id, dataUrl) => {
  const match = /^data:(image\/[a-z+]+);base64,(.+)$/s.exec(dataUrl || '')
  const ext = match && IMAGE_TYPES[match[1]]
  if (!ext) throw new Error('Photo must be a JPG, PNG or WebP image')
  const buffer = Buffer.from(match[2], 'base64')
  if (buffer.length > MAX_IMAGE_BYTES) throw new Error('Photo is too large. Use an image under 5 MB')

  // Create the bucket the first time a photo is uploaded
  const { error: bucketError } = await supabase.storage.createBucket(BUCKET, { public: true })
  if (bucketError && !/exist/i.test(bucketError.message)) throw new Error('Could not prepare photo storage')

  const path = `${id}-${Date.now()}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, { contentType: match[1] })
  if (error) throw new Error('Could not upload the photo')
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

const removeImage = async (url) => {
  const path = url?.split(`/${BUCKET}/`)[1]
  if (path) await supabase.storage.from(BUCKET).remove([path]).catch(() => {})
}

// List every model, including hidden ones, with how many chats each has
router.get('/', async (req, res) => {
  const [{ data: personas, error }, { data: convs }] = await Promise.all([
    supabase.from('personas').select('*'),
    supabase.from('conversations').select('persona_id'),
  ])
  if (error) return err(res, 'Could not load models', 500)

  const chats = {}
  for (const c of convs || []) chats[c.persona_id] = (chats[c.persona_id] || 0) + 1

  const models = personas
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0) || String(a.created_at).localeCompare(String(b.created_at)))
    .map(p => toModel(p, chats[p.id] || 0))

  ok(res, { models })
})

// Add a model
router.post('/', async (req, res) => {
  const row = toRow(req.body)
  if (!row.name) return err(res, 'Give the model a name')

  const base = slugify(row.name)
  if (!base) return err(res, 'The name needs at least one letter or number')
  const { data: taken } = await supabase.from('personas').select('id').like('id', `${base}%`)
  const ids = new Set((taken || []).map(p => p.id))
  let id = base
  for (let n = 2; ids.has(id); n++) id = `${base}-${n}`

  try {
    if (req.body.image) row.image_url = await uploadImage(id, req.body.image)
  } catch (e) { return err(res, e.message) }

  const { data: last } = await supabase.from('personas').select('sort_order').order('sort_order', { ascending: false }).limit(1)
  row.sort_order = (last?.[0]?.sort_order || 0) + 1

  const { data, error } = await supabase.from('personas').insert({ id, ...row }).select().single()
  if (error) {
    await removeImage(row.image_url)
    return isSetupError(error) ? err(res, SETUP_MESSAGE, 409) : err(res, 'Could not save the model', 500)
  }
  ok(res, { model: toModel(data) }, 201)
})

// Edit a model
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { data: existing } = await supabase.from('personas').select('*').eq('id', id).single()
  if (!existing) return err(res, 'Model not found', 404)

  const row = toRow(req.body)
  if ('name' in row && !row.name) return err(res, 'Give the model a name')

  try {
    if (req.body.image) row.image_url = await uploadImage(id, req.body.image)
  } catch (e) { return err(res, e.message) }
  row.updated_at = new Date().toISOString()

  const { data, error } = await supabase.from('personas').update(row).eq('id', id).select().single()
  if (error) {
    if (row.image_url) await removeImage(row.image_url)
    return isSetupError(error) ? err(res, SETUP_MESSAGE, 409) : err(res, 'Could not save the model', 500)
  }
  // The old photo is no longer referenced once a new one is saved
  if (row.image_url && existing.image_url) await removeImage(existing.image_url)
  ok(res, { model: toModel(data) })
})

// Delete a model. Models that already have chats can only be hidden, so history is kept.
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  const { count } = await supabase.from('conversations').select('*', { count: 'exact', head: true }).eq('persona_id', id)
  if (count > 0) return err(res, 'This model already has chats, so she cannot be deleted. Hide her from users instead.', 409)

  const { data: existing } = await supabase.from('personas').select('*').eq('id', id).single()
  if (!existing) return err(res, 'Model not found', 404)

  const { error } = await supabase.from('personas').delete().eq('id', id)
  if (error) return err(res, 'Could not delete the model', 500)
  await removeImage(existing.image_url)
  ok(res, { success: true })
})

module.exports = router
