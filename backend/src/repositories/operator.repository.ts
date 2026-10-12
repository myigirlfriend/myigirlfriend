import { supabase } from '../config/supabase'
import type { Agent, OperatorRow } from '../types'
import { many, one } from './base'

export const operatorRepository = {
  async findByEmail(email: string): Promise<OperatorRow | null> {
    return one<OperatorRow>(await supabase.from('operators').select('*').eq('email', email).maybeSingle())
  },

  /** Every operator without the password hash, ordered by name. */
  async findAll(): Promise<Agent[]> {
    return many<Agent>(await supabase.from('operators').select('id, name, email, role').order('name'))
  },
}
