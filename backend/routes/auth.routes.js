const router = require('express').Router()
const { register, login } = require('../controllers/auth.controller')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const supabase = require('../config/supabase')
const { ok, err } = require('../utils/response')

router.post('/register', register)
router.post('/login', login)

// Google OAuth sync — creates or finds user from Google login
router.post('/google', async (req, res) => {
  const { email, name, googleId, token } = req.body
  if (!email || !googleId) return err(res, 'Missing required fields')

  try {
    // Check if user exists
    let { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (!user) {
      // Create new user from Google
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          name,
          email,
          password_hash: `google_${googleId}`, // placeholder — Google users don't use password
          status: 'active',
        })
        .select().single()

      if (error) return err(res, 'Could not create account', 500)
      user = newUser

      // Seed usage tracking
      await supabase.from('usage_tracking')
        .insert({ user_id: user.id, message_count: 0 })
    }

    // Generate our own JWT
    const jwt = require('jsonwebtoken')
    const ourToken = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    ok(res, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        token: ourToken,
      }
    })
  } catch (e) {
    console.error('[Google auth error]', e.message)
    err(res, 'Authentication failed', 500)
  }
})
module.exports = router
