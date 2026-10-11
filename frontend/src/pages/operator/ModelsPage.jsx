import { useEffect, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { Plus, Eye, EyeOff, Heart } from 'lucide-react'
import api from '@services/api'
import { useAuthStore } from '@store/index'
import PersonaTile from '@components/persona/PersonaTile'
import ModelEditor from '@components/operator/ModelEditor'
import { resolvePersona } from '@config/personas'

export default function ModelsPage() {
  const operator = useAuthStore(s => s.operator)
  const [params, setParams] = useSearchParams()
  const [models, setModels] = useState(null)
  const [failed, setFailed] = useState(false)
  // null = list, 'new' = add form, otherwise the model being edited
  const [editing, setEditing] = useState(params.get('new') ? 'new' : null)

  const load = () => {
    setFailed(false)
    api.get('/api/operator/models')
      .then(data => setModels(data.models))
      .catch(() => setFailed(true))
  }
  useEffect(load, [])

  const closeEditor = () => {
    setEditing(null)
    if (params.get('new')) setParams({}, { replace: true })
  }

  if (operator?.role !== 'admin') return <Navigate to="/operator/chats" replace />

  if (editing) {
    return (
      <ModelEditor
        key={editing === 'new' ? 'new' : editing.id}
        model={editing === 'new' ? null : editing}
        onClose={closeEditor}
        onSaved={() => { closeEditor(); load() }}
        onDeleted={() => { closeEditor(); load() }}
      />
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Models</h1>
          <p className="mt-1 text-sm text-zinc-400">The companions your members can chat with. Select one to edit her.</p>
        </div>
        <button onClick={() => setEditing('new')} className="admin-btn-primary">
          <Plus size={16} aria-hidden="true" /> Add model
        </button>
      </div>

      {failed ? (
        <div className="mt-8 rounded-2xl border border-brand-border p-6">
          <p className="font-bold text-white">The models could not be loaded.</p>
          <p className="mt-1 text-sm text-zinc-400">Check that the server is running, then try again.</p>
          <button onClick={load} className="admin-btn mt-4">Try again</button>
        </div>
      ) : !models ? (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4" aria-busy="true">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="admin-skeleton aspect-[3/4] rounded-2xl" />)}
        </div>
      ) : models.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-brand-border px-6 py-14 text-center">
          <Heart size={28} className="mx-auto text-zinc-400" aria-hidden="true" />
          <p className="mt-3 font-bold text-white">No models yet</p>
          <p className="mt-1 text-sm text-zinc-400">Add your first model so members have someone to talk to.</p>
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 xl:grid-cols-4">
          {models.map(m => (
            <li key={m.id}>
              <PersonaTile
                persona={resolvePersona(m)}
                dimmed={!m.isActive}
                onClick={() => setEditing(m)}
              />
              <div className="mt-2 flex items-center justify-between gap-2 px-1 text-sm">
                <span className={`inline-flex items-center gap-1.5 font-bold ${m.isActive ? 'text-emerald-300' : 'text-zinc-400'}`}>
                  {m.isActive ? <Eye size={15} aria-hidden="true" /> : <EyeOff size={15} aria-hidden="true" />}
                  {m.isActive ? 'Shown' : 'Hidden'}
                </span>
                <span className="text-zinc-400 tabular-nums">{m.chats} {m.chats === 1 ? 'chat' : 'chats'}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
