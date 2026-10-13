import { supabase } from '../config/supabase'
import type { Agent, OperatorRole, OperatorRow } from '../types'
import { done, many, one, required } from './base'

const PUBLIC_COLUMNS = 'id, name, email, role, created_at'

export const operatorRepository = {
  async findByEmail(email: string): Promise<OperatorRow | null> {
    return one<OperatorRow>(await supabase.from('operators').select('*').eq('email', email.trim().toLowerCase()).maybeSingle())
  },

  async findById(id: string): Promise<Agent | null> {
    return one<Agent>(await supabase.from('operators').select(PUBLIC_COLUMNS).eq('id', id).maybeSingle())
  },

  /** Every operator without the password hash, ordered by name. */
  async findAll(): Promise<Agent[]> {
    return many<Agent>(await supabase.from('operators').select(PUBLIC_COLUMNS).order('name'))
  },

  async create(row: { name: string; email: string; password_hash: string; role: OperatorRole }): Promise<Agent> {
    return required<Agent>(await supabase.from('operators').insert(row).select(PUBLIC_COLUMNS).single())
  },

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    done(await supabase.from('operators').update({ password_hash: passwordHash }).eq('id', id))
  },

  /** Deletes the operator. Their clock-in sessions go with them (on delete cascade). */
  async remove(id: string): Promise<void> {
    done(await supabase.from('operators').delete().eq('id', id))
  },
}
