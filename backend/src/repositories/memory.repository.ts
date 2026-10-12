import { supabase } from '../config/supabase'
import type { MemoryFact } from '../types'
import { done, many } from './base'

export const memoryRepository = {
  async findByUser(userId: string): Promise<MemoryFact[]> {
    return many<MemoryFact>(await supabase.from('user_memory').select('key, value').eq('user_id', userId))
  },

  async upsert(userId: string, key: string, value: string): Promise<void> {
    done(await supabase.from('user_memory').upsert({ user_id: userId, key, value }, { onConflict: 'user_id,key' }))
  },
}
