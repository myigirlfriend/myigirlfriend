import { supabase } from '../config/supabase'
import type { UserRow } from '../types'
import { one, required, total } from './base'

export const userRepository = {
  async findByEmail(email: string): Promise<UserRow | null> {
    return one<UserRow>(await supabase.from('users').select('*').eq('email', email).maybeSingle())
  },

  async create(user: Pick<UserRow, 'name' | 'email' | 'password_hash'> & { status?: string }): Promise<UserRow> {
    return required<UserRow>(await supabase.from('users').insert(user).select().single())
  },

  async count(): Promise<number> {
    return total(await supabase.from('users').select('*', { count: 'exact', head: true }))
  },
}
