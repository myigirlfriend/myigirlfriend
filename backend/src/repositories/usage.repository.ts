import { supabase } from '../config/supabase'
import type { UsageTrackingRow } from '../types'
import { done, one } from './base'

export const usageRepository = {
  async findByUser(userId: string): Promise<Pick<UsageTrackingRow, 'message_count' | 'last_reset'> | null> {
    return one<Pick<UsageTrackingRow, 'message_count' | 'last_reset'>>(
      await supabase.from('usage_tracking').select('message_count, last_reset').eq('user_id', userId).maybeSingle()
    )
  },

  async create(userId: string): Promise<void> {
    done(await supabase.from('usage_tracking').insert({ user_id: userId, message_count: 0 }))
  },

  async setMessageCount(userId: string, messageCount: number): Promise<void> {
    done(await supabase.from('usage_tracking').update({ message_count: messageCount }).eq('user_id', userId))
  },
}
