import { useCallback, useEffect, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, Heart, Plus } from 'lucide-react'
import Button from '@components/common/Button'
import LoadError from '@components/common/LoadError'
import ModelEditor from '@components/operator/ModelEditor'
import PersonaTile from '@components/persona/PersonaTile'
import { resolvePersona } from '@config/personas'
import { modelApi } from '@services/api'
import { useAuthStore } from '@store/index'
import { plural } from '@utils/text'
import type { Model } from '@/types'

export default function ModelsPage() {
  const operator = useAuthStore((s) => s.operator)
  const [params, setParams] = useSearchParams()
  const [models, setModels] = useState<Model[] | null>(null)
  const [failed, setFailed] = useState(false)
  // null = list, 'new' = add form, otherwise the model being edited
  const [editing, setEditing] = useState<Model | 'new' | null>(params.get('new') ? 'new' : null)

  const load = useCallback(() => {
    setFailed(false)
    modelApi.list()
      .then((data) => setModels(data.models))
      .catch(() => setFailed(true))
  }, [])
  useEffect(load, [load])

  const closeEditor = () => {
    setEditing(null)
    if (params.get('new')) setParams({}, { replace: true })
  }
  const closeAndReload = () => { closeEditor(); load() }

  if (operator?.role !== 'admin') return <Navigate to="/operator/chats" replace />

  if (editing) {
    return (
      <ModelEditor
        key={editing === 'new' ? 'new' : editing.id}
        model={editing === 'new' ? null : editing}
        onClose={closeEditor}
        onSaved={closeAndReload}
        onDeleted={closeAndReload}
      />
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Models</h1>
          <p className="mt-1 text-sm text-brand-muted">The companions your members can chat with. Select one to edit her.</p>
        </div>
        <Button size="sm" onClick={() => setEditing('new')}>
          <Plus size={16} aria-hidden="true" /> Add model
        </Button>
      </div>

      {failed ? (
        <div className="mt-8">
          <LoadError
            title="The models could not be loaded."
            description="Check that the server is running, then try again."
            onRetry={load}
          />
        </div>
      ) : !models ? (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4" aria-busy="true">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton aspect-[3/4] rounded-2xl" />)}
        </div>
      ) : models.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-brand-border px-6 py-14 text-center">
          <Heart size={28} className="mx-auto text-brand-muted" aria-hidden="true" />
          <p className="mt-3 font-bold text-white">No models yet</p>
          <p className="mt-1 text-sm text-brand-muted">Add your first model so members have someone to talk to.</p>
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 xl:grid-cols-4">
          {models.map((model) => (
            <li key={model.id}>
              <PersonaTile persona={resolvePersona(model)} dimmed={!model.isActive} onClick={() => setEditing(model)} />
              <div className="mt-2 flex items-center justify-between gap-2 px-1 text-sm">
                <span className={`inline-flex items-center gap-1.5 font-bold ${model.isActive ? 'text-emerald-300' : 'text-brand-muted'}`}>
                  {model.isActive ? <Eye size={15} aria-hidden="true" /> : <EyeOff size={15} aria-hidden="true" />}
                  {model.isActive ? 'Shown' : 'Hidden'}
                </span>
                <span className="tabular-nums text-brand-muted">{plural(model.chats, 'chat')}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
