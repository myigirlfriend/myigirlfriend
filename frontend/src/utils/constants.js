export const FREE_MSG_LIMIT = 10
export const FREE_SESSION_MINUTES = 10
export const FREE_SESSION_MS = FREE_SESSION_MINUTES * 60 * 1000

export const PLAN_LABELS = {
  free: 'Free',
  basic: 'Basic',
  premium: 'Premium',
}

export const PLAN_PRICES = {
  basic: '$9.99',
  premium: '$19.99',
}

export const API_ROUTES = {
  // Auth
  REGISTER: '/api/auth/register',
  LOGIN: '/api/auth/login',
  // Chat
  CHAT_START: '/api/chat/start',
  CHAT_SEND: '/api/chat/send',
  CHAT_HISTORY: (id) => `/api/chat/history/${id}`,
  // Personas
  PERSONAS: '/api/personas',
  PERSONA: (id) => `/api/personas/${id}`,
  // Subscription
  SUB_CHECKOUT: '/api/subscription/checkout',
  SUB_STATUS: '/api/subscription/status',
  // Operator
  OP_LOGIN: '/api/operator/login',
  OP_QUEUE: '/api/operator/queue',
  OP_SUGGEST: '/api/operator/suggest',
  OP_REPLY: '/api/operator/reply',
}
