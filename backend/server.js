require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

const authRoutes = require('./routes/auth.routes')
const chatRoutes = require('./routes/chat.routes')
const personaRoutes = require('./routes/persona.routes')
const subscriptionRoutes = require('./routes/subscription.routes')
const operatorRoutes = require('./routes/operator.routes')

const app = express()
const PORT = process.env.PORT || 4000

// ─── Security middleware ──────────────────────────────────────
app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }))

// Stripe webhook needs raw body — must come before express.json()
app.use('/api/subscription/webhook', express.raw({ type: 'application/json' }))
app.use(express.json())

// ─── Global rate limiter ──────────────────────────────────────
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true }))

// ─── Routes ──────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/personas', personaRoutes)
app.use('/api/subscription', subscriptionRoutes)
app.use('/api/operator', operatorRoutes)

// ─── Health check ─────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ status: 'ok', ts: new Date().toISOString() }))

// ─── Global error handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`))
