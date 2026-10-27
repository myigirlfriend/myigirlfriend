import { useCallback, useEffect, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, Heart, Plus } from 'lucide-react'
import Button from '@components/common/Button'
import EmptyState from '@components/common/EmptyState'
import LoadError from '@components/common/LoadError'
import ModelEditor from '@components/operator/ModelEditor'
import OperatorPage from '@components/operator/OperatorPage'
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
    <OperatorPage
      title="Models"
      subtitle="The companions your members can chat with. Select one to edit her."
      actions={
        <Button size="sm" onClick={() => setEditing('new')}>
          <Plus size={16} aria-hidden="true" /> Add model
        </Button>
      }
    >
      {failed ? (
        <LoadError
          title="The models could not be loaded."
          description="Check that the server is running, then try again."
          onRetry={load}
        />
      ) : !models ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4" aria-busy="true">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton aspect-[4/5] rounded-3xl" />)}
        </div>
      ) : models.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No models yet"
          description="Add your first model so members have someone to talk to."
          action={<Button onClick={() => setEditing('new')}><Plus size={16} aria-hidden="true" /> Add model</Button>}
        />
      ) : (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
          {models.map((model) => (
            <li key={model.id}>
              <PersonaTile persona={resolvePersona(model)} dimmed={!model.isActive} onClick={() => setEditing(model)} />
              <div className="mt-2 flex items-center justify-between gap-2 px-1 text-[15px]">
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
    </OperatorPage>
  )
}
