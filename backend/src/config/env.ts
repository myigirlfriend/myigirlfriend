import 'dotenv/config'

const required = (name: string): string => {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/+$/, '')

// Extra origins, comma-separated, e.g. a preview deployment
const extraOrigins = (process.env.CORS_ORIGINS ?? '').split(',').map((o) => o.trim().replace(/\/+$/, '')).filter(Boolean)

export const env = {
  port: Number(process.env.PORT) || 4000,
  isProd: process.env.NODE_ENV === 'production',
  /** Where Stripe sends members back to */
  frontendUrl,
  /** Origins the browser may call this API from */
  corsOrigins: [
    frontendUrl,
    'https://myigirlfriend.com',
    'https://www.myigirlfriend.com',
    'https://myigirlfriend.vercel.app',
    ...extraOrigins,
  ],
  jwtSecret: required('JWT_SECRET'),
  supabase: {
    url: required('SUPABASE_URL'),
    serviceRoleKey: required('SUPABASE_SERVICE_ROLE_KEY'),
  },
  openaiApiKey: required('OPENAI_API_KEY'),
  stripe: {
    secretKey: required('STRIPE_SECRET_KEY'),
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? '',
    basicPriceId: process.env.STRIPE_BASIC_PRICE_ID,
    premiumPriceId: process.env.STRIPE_PREMIUM_PRICE_ID,
  },
} as const
