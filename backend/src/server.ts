import { app } from './app'
import { env } from './config/env'
import { logger } from './utils/logger'

app.listen(env.port, () => logger.info(`API running on http://localhost:${env.port}`))
