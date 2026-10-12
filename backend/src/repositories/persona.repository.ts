import { supabase } from '../config/supabase'
import type { PersonaInsert, PersonaRow, PersonaUpdate } from '../types'
import { done, many, one, required } from './base'

export const personaRepository = {
  async findAll(): Promise<PersonaRow[]> {
    return many<PersonaRow>(await supabase.from('personas').select('*'))
  },

  async findById(id: string): Promise<PersonaRow | null> {
    return one<PersonaRow>(await supabase.from('personas').select('*').eq('id', id).maybeSingle())
  },

  /** Ids that start with `prefix`, used to pick a free slug for a new model. */
  async findIdsStartingWith(prefix: string): Promise<string[]> {
    const rows = many<Pick<PersonaRow, 'id'>>(await supabase.from('personas').select('id').like('id', `${prefix}%`))
    return rows.map((p) => p.id)
  },

  async findHighestSortOrder(): Promise<number> {
    const rows = many<Pick<PersonaRow, 'sort_order'>>(
      await supabase.from('personas').select('sort_order').order('sort_order', { ascending: false }).limit(1)
    )
    return rows[0]?.sort_order || 0
  },

  async create(persona: PersonaInsert): Promise<PersonaRow> {
    return required<PersonaRow>(await supabase.from('personas').insert(persona).select().single())
  },

  async createMany(personas: PersonaInsert[]): Promise<void> {
    done(await supabase.from('personas').insert(personas))
  },

  async update(id: string, changes: PersonaUpdate): Promise<PersonaRow> {
    return required<PersonaRow>(await supabase.from('personas').update(changes).eq('id', id).select().single())
  },

  async remove(id: string): Promise<void> {
    done(await supabase.from('personas').delete().eq('id', id))
  },
}
