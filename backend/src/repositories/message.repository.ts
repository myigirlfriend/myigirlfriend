import { supabase } from '../config/supabase'
import type { ChatHistoryEntry, MessageRow, MessageSender } from '../types'
import { many, required, total } from './base'

export const messageRepository = {
  async create(conversationId: string, sender: MessageSender, content: string): Promise<MessageRow> {
    return required<MessageRow>(
      await supabase
        .from('messages')
        .insert({ conversation_id: conversationId, sender, content })
        .select()
        .single()
    )
  },

  async findByConversation(conversationId: string): Promise<MessageRow[]> {
    return many<MessageRow>(
      await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
    )
  },

  /** The latest `limit` messages of a conversation, oldest first. */
  async findLatest(conversationId: string, limit: number): Promise<ChatHistoryEntry[]> {
    const newestFirst = many<ChatHistoryEntry>(
      await supabase
        .from('messages')
        .select('sender, content, created_at')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .limit(limit)
    )
    return newestFirst.reverse()
  },

  async countSince(sinceIso: string): Promise<number> {
    return total(
      await supabase.from('messages').select('*', { count: 'exact', head: true }).gte('created_at', sinceIso)
    )
  },
}
