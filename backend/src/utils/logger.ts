import { env } from '../config/env'

export const logger = {
  info: (...args: unknown[]) => console.log('[INFO]', ...args),
  warn: (...args: unknown[]) => console.warn('[WARN]', ...args),
  error: (...args: unknown[]) => console.error('[ERROR]', ...args),
  debug: (...args: unknown[]) => { if (!env.isProd) console.log('[DEBUG]', ...args) },
}
