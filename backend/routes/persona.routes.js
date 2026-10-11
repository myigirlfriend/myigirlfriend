const router = require('express').Router()
const { authMiddleware } = require('../middleware/auth.middleware')
const supabase = require('../config/supabase')
const { ok, err } = require('../utils/response')

// Seed personas if DB is empty - helpful for first run
const SEED_PERSONAS = [
  { id: 'zara',   name: 'Zara',   tone: 'playful, teasing, confident',        tagline: 'The Playful Flirt' },
  { id: 'maya',   name: 'Maya',   tone: 'warm, empathetic, caring',            tagline: 'The Supportive Listener' },
  { id: 'elena',  name: 'Elena',  tone: 'calm, intellectual, thoughtful',      tagline: 'The Deep Thinker' },
  { id: 'mariah', name: 'Mariah', tone: 'soft, romantic, affectionate',        tagline: 'The Sweet Romantic' },
  { id: 'hannah', name: 'Hannah', tone: 'casual, funny, chill',                tagline: 'The Easygoing Friend' },
]

router.use(authMiddleware)

router.get('/', async (req, res) => {
  let { data: personas } = await supabase.from('personas').select('*')
  if (!personas || personas.length === 0) {
    await supabase.from('personas').insert(SEED_PERSONAS)
    personas = SEED_PERSONAS
  }
  // Users only see models that are switched on, and never the AI instructions
  const visible = personas
    .filter(p => p.is_active !== false)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0) || String(a.created_at).localeCompare(String(b.created_at)))
    .map(({ prompt, ...rest }) => rest)
  ok(res, { personas: visible })
})

router.get('/:id', async (req, res) => {
  const { data: persona } = await supabase.from('personas').select('*').eq('id', req.params.id).single()
  if (!persona) return err(res, 'Persona not found', 404)
  const { prompt, ...rest } = persona
  ok(res, { persona: rest })
})

module.exports = router
