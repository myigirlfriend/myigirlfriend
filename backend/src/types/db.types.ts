// Row shapes of the Supabase tables in db/schema.sql. Column names stay snake_case, as stored.

export type MessageSender = 'user' | 'ai' | 'operator'
export type OperatorRole = 'admin' | 'agent' | 'operator'
export type SubscriptionPlan = 'free' | 'basic' | 'premium'
export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'past_due'

export interface UserRow {
  id: string
  name: string
  email: string
  password_hash: string
  status: string
  created_at: string
}

export interface PersonaRow {
  id: string
  name: string
  tone: string | null
  tagline: string | null
  created_at?: string
  // Added by db/migrations/001_model_details.sql, so absent on a database that has not run it
  description?: string | null
  prompt?: string | null
  preview_message?: string | null
  image_url?: string | null
  // Added by db/migrations/003_persona_gallery.sql: extra photos shown on her profile, in order
  gallery?: string[] | null
  gradient_from?: string | null
  gradient_to?: string | null
  is_active?: boolean
  sort_order?: number
  updated_at?: string
}

export type PersonaInsert = Pick<PersonaRow, 'id' | 'name'> & Partial<Omit<PersonaRow, 'id' | 'name' | 'created_at'>>
export type PersonaUpdate = Partial<Omit<PersonaRow, 'id' | 'created_at'>>

export interface ConversationRow {
  id: string
  user_id: string
  persona_id: string
  status: string
  assigned_to: string | null
  created_at: string
}

export interface MessageRow {
  id: string
  conversation_id: string
  sender: MessageSender
  content: string
  created_at: string
}

export interface UserMemoryRow {
  id: string
  user_id: string
  key: string
  value: string
  created_at: string
}

export interface SubscriptionRow {
  id: string
  user_id: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  stripe_customer_id: string | null
  created_at: string
}

export interface UsageTrackingRow {
  user_id: string
  message_count: number
  last_reset: string
}

export interface OperatorRow {
  id: string
  name: string
  email: string
  password_hash: string
  role: OperatorRole
  created_at: string
}

export interface OperatorSessionRow {
  id: string
  operator_id: string
  clock_in: string
  clock_out: string | null
}

/** `messages(count)` embedded in a conversation select comes back as a one-element array. */
export type EmbeddedCount = { count: number }[]
