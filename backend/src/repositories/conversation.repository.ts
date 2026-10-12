import { supabase } from '../config/supabase'
import type {
  ConversationPersonaRef,
  ConversationQueueRow,
  ConversationRow,
  ConversationWithMessageCount,
  ConversationWithMessages,
  ConversationWithPersona,
} from '../types'
import { done, many, one, required, total } from './base'

export const conversationRepository = {
  async findActiveId(userId: string, personaId: string): Promise<string | null> {
    const row = one<Pick<ConversationRow, 'id'>>(
      await supabase
        .from('conversations')
        .select('id')
        .eq('user_id', userId)
        .eq('persona_id', personaId)
        .eq('status', 'active')
        .limit(1)
        .maybeSingle()
    )
    return row?.id ?? null
  },

  async create(userId: string, personaId: string): Promise<ConversationRow> {
    return required<ConversationRow>(
      await supabase
        .from('conversations')
        .insert({ user_id: userId, persona_id: personaId, status: 'active' })
        .select()
        .single()
    )
  },

  /** The member's own conversation together with the persona they are talking to. */
  async findForUserWithPersona(id: string, userId: string): Promise<ConversationWithPersona | null> {
    return one<ConversationWithPersona>(
      await supabase.from('conversations').select('*, personas(*)').eq('id', id).eq('user_id', userId).maybeSingle()
    )
  },

  async belongsToUser(id: string, userId: string): Promise<boolean> {
    const row = one<Pick<ConversationRow, 'id'>>(
      await supabase.from('conversations').select('id').eq('id', id).eq('user_id', userId).maybeSingle()
    )
    return row !== null
  },

  async findPersonaRef(id: string): Promise<ConversationPersonaRef | null> {
    return one<ConversationPersonaRef>(
      await supabase.from('conversations').select('persona_id, personas(*)').eq('id', id).maybeSingle()
    )
  },

  async findActiveByUserWithMessages(userId: string): Promise<ConversationWithMessages[]> {
    return many<ConversationWithMessages>(
      await supabase
        .from('conversations')
        .select('id, persona_id, created_at, status, messages(content, created_at)')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
    )
  },

  async findRecentByUser(userId: string, limit: number): Promise<ConversationWithMessageCount[]> {
    return many<ConversationWithMessageCount>(
      await supabase
        .from('conversations')
        .select('id, persona_id, created_at, messages(count)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)
    )
  },

  /** Active conversations for the operator queue. Pass `assignedTo` to limit it to one agent. */
  async findActiveQueue(options: { assignedTo?: string; limit: number }): Promise<ConversationQueueRow[]> {
    let query = supabase
      .from('conversations')
      .select('id, status, created_at, assigned_to, persona_id, users(name), personas(name), messages(count)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(options.limit)

    if (options.assignedTo) query = query.eq('assigned_to', options.assignedTo)

    return many<ConversationQueueRow>(await query)
  },

  async findActiveUnassigned(limit: number): Promise<ConversationQueueRow[]> {
    return many<ConversationQueueRow>(
      await supabase
        .from('conversations')
        .select('id, created_at, persona_id, users(name), personas(name), messages(count)')
        .eq('status', 'active')
        .is('assigned_to', null)
        .order('created_at', { ascending: false })
        .limit(limit)
    )
  },

  async assign(id: string, operatorId: string | null): Promise<void> {
    done(await supabase.from('conversations').update({ assigned_to: operatorId }).eq('id', id))
  },

  /** The persona id of every conversation, for counting chats per model. */
  async findAllPersonaIds(): Promise<string[]> {
    const rows = many<Pick<ConversationRow, 'persona_id'>>(await supabase.from('conversations').select('persona_id'))
    return rows.map((c) => c.persona_id)
  },

  async countByPersona(personaId: string): Promise<number> {
    return total(
      await supabase.from('conversations').select('*', { count: 'exact', head: true }).eq('persona_id', personaId)
    )
  },

  async countActive(): Promise<number> {
    return total(await supabase.from('conversations').select('*', { count: 'exact', head: true }).eq('status', 'active'))
  },
}
