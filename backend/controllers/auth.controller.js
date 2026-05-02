const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const supabase = require('../config/supabase')
const { ok, err } = require('../utils/response')

const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })

const register = async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) return err(res, 'All fields required')

  // Check existing
  const { data: existing } = await supabase.from('users').select('id').eq('email', email).single()
  if (existing) return err(res, 'Email already registered')

  const passwordHash = await bcrypt.hash(password, 10)
  const { data: user, error } = await supabase
    .from('users').insert({ name, email, password_hash: passwordHash }).select().single()
  if (error) return err(res, 'Registration failed', 500)

  // Seed usage tracking row
  await supabase.from('usage_tracking').insert({ user_id: user.id, message_count: 0 })

  const token = signToken({ id: user.id, email: user.email, name: user.name })
  ok(res, { user: { id: user.id, name: user.name, email: user.email, token } }, 201)
}

const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return err(res, 'Email and password required')

  const { data: user } = await supabase.from('users').select('*').eq('email', email).single()
  if (!user) return err(res, 'Invalid credentials', 401)

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) return err(res, 'Invalid credentials', 401)

  const token = signToken({ id: user.id, email: user.email, name: user.name })
  ok(res, { user: { id: user.id, name: user.name, email: user.email, token } })
}

module.exports = { register, login }
