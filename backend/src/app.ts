import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { env } from './config/env'
import { errorHandler } from './middleware/error.middleware'
import authRoutes from './routes/auth.routes'
import chatRoutes from './routes/chat.routes'
import modelRoutes from './routes/model.routes'
import operatorRoutes from './routes/operator.routes'
import personaRoutes from './routes/persona.routes'
import profileRoutes from './routes/profile.routes'
import subscriptionRoutes from './routes/subscription.routes'

const FIFTEEN_MINUTES = 15 * 60 * 1000

export const app = express()

// ─── Security middleware ──────────────────────────────────────
app.use(helmet())
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || env.corsOrigins.includes(origin)) return cb(null, true)
    // In dev, Vite picks the next free port (5174, 5175…) — allow any localhost origin
    if (!env.isProd && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) return cb(null, true)
    cb(null, false)
  },
  credentials: true,
}))

// Stripe webhook needs raw body — must come before express.json()
app.use('/api/subscription/webhook', express.raw({ type: 'application/json' }))
// Model photos arrive as base64 inside JSON — allow a larger body on that route only
app.use('/api/operator/models', express.json({ limit: '8mb' }))
app.use(express.json())

// ─── Rate limiters ────────────────────────────────────────────
app.use('/api/', rateLimit({
  windowMs: FIFTEEN_MINUTES,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
}))

// Stricter limiter for auth routes only
const authLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)

// ─── Routes ──────────────────────────────────────────────────
app.use('/api/profile', profileRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/personas', personaRoutes)
app.use('/api/subscription', subscriptionRoutes)
app.use('/api/operator/models', modelRoutes)
app.use('/api/operator', operatorRoutes)

// ─── Health check ─────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', ts: new Date().toISOString() })
})

// ─── Global error handler ─────────────────────────────────────
app.use(errorHandler)
