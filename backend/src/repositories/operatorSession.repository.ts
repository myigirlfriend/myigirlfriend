import { supabase } from '../config/supabase'
import type { AgentSession, OpenSessionWithOperator, OperatorSessionRow } from '../types'
import { done, many, one, required } from './base'

type SessionTimes = Pick<OperatorSessionRow, 'clock_in' | 'clock_out'>

export const operatorSessionRepository = {
  /** An operator's sessions that started at or after `sinceIso`, newest first. */
  async findByOperatorSince(operatorId: string, sinceIso: string): Promise<SessionTimes[]> {
    return many<SessionTimes>(
      await supabase
        .from('operator_sessions')
        .select('clock_in, clock_out')
        .eq('operator_id', operatorId)
        .gte('clock_in', sinceIso)
        .order('clock_in', { ascending: false })
    )
  },

  /** The session the operator is currently clocked in to, if any. */
  async findOpen(operatorId: string): Promise<Pick<OperatorSessionRow, 'id' | 'clock_in'> | null> {
    return one<Pick<OperatorSessionRow, 'id' | 'clock_in'>>(
      await supabase
        .from('operator_sessions')
        .select('id, clock_in')
        .eq('operator_id', operatorId)
        .is('clock_out', null)
        .limit(1)
        .maybeSingle()
    )
  },

  async create(operatorId: string): Promise<OperatorSessionRow> {
    return required<OperatorSessionRow>(
      await supabase.from('operator_sessions').insert({ operator_id: operatorId }).select().single()
    )
  },

  async close(id: string, clockOutIso: string): Promise<void> {
    done(await supabase.from('operator_sessions').update({ clock_out: clockOutIso }).eq('id', id))
  },

  /** Every operator's sessions that started inside the given window. */
  async findStartedBetween(fromIso: string, toIso: string): Promise<AgentSession[]> {
    return many<AgentSession>(
      await supabase
        .from('operator_sessions')
        .select('operator_id, clock_in, clock_out')
        .gte('clock_in', fromIso)
        .lte('clock_in', toIso)
    )
  },

  async findAllOpenWithOperator(): Promise<OpenSessionWithOperator[]> {
    return many<OpenSessionWithOperator>(
      await supabase.from('operator_sessions').select('clock_in, operators(id, name, role)').is('clock_out', null)
    )
  },
}
