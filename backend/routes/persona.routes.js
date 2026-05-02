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
  let { data: personas } = await supabase.from('personas').select('id, name, tone, tagline')
  if (!personas || personas.length === 0) {
    await supabase.from('personas').insert(SEED_PERSONAS)
    personas = SEED_PERSONAS
  }
  ok(res, { personas })
})

router.get('/:id', async (req, res) => {
  const { data: persona } = await supabase.from('personas').select('*').eq('id', req.params.id).single()
  if (!persona) return err(res, 'Persona not found', 404)
  ok(res, { persona })
})

module.exports = router
