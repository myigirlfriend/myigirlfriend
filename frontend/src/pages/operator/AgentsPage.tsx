import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { KeyRound, Plus, Trash2, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@components/common/Button'
import ConfirmDialog from '@components/common/ConfirmDialog'
import IconButton from '@components/common/IconButton'
import LoadError from '@components/common/LoadError'
import Modal from '@components/common/Modal'
import PasswordInput from '@components/common/PasswordInput'
import { operatorApi } from '@services/api'
import { useAuthStore } from '@store/index'
import { errorMessage, plural } from '@utils/text'
import type { Agent, NewAgent } from '@/types'

const MIN_PASSWORD = 6
const EMPTY_FORM: NewAgent = { name: '', email: '', password: '', role: 'agent' }

function AddAgentModal({ isOpen, onClose, onAdded }: { isOpen: boolean; onClose: () => void; onAdded: () => void }) {
  const [form, setForm] = useState<NewAgent>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = <K extends keyof NewAgent>(key: K, value: NewAgent[K]) => setForm((f) => ({ ...f, [key]: value }))

  const close = () => {
    setForm(EMPTY_FORM)
    setError('')
    onClose()
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (form.password.length < MIN_PASSWORD) return setError(`The password needs at least ${MIN_PASSWORD} characters.`)
    setSaving(true)
    setError('')
    try {
      await operatorApi.createAgent(form)
      toast.success(`${form.name.trim()} can now sign in`)
      setForm(EMPTY_FORM)
      onAdded()
    } catch (err) {
      setError(errorMessage(err))
    } finally { setSaving(false) }
  }

  return (
    <Modal isOpen={isOpen} onClose={close} title="Add agent">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="agent-name" className="field__label">Name</label>
          <input id="agent-name" required value={form.name} onChange={(e) => set('name', e.target.value)}
            className="input input--compact" autoComplete="off" />
        </div>
        <div>
          <label htmlFor="agent-email" className="field__label">Email</label>
          <input id="agent-email" type="email" required value={form.email} onChange={(e) => set('email', e.target.value)}
            className="input input--compact" autoComplete="off" />
          <p className="field__help">They sign in with this at the operator login page.</p>
        </div>
        <div>
          <label htmlFor="agent-password" className="field__label">Password</label>
          <PasswordInput id="agent-password" required value={form.password} onChange={(e) => set('password', e.target.value)}
            className="input--compact" autoComplete="new-password" />
        </div>
        <fieldset>
          <legend className="field__label">Access</legend>
          <div className="grid grid-cols-2 gap-2">
            {(['agent', 'admin'] as const).map((role) => (
              <label
                key={role}
                className={`cursor-pointer rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                  form.role === role ? 'border-brand-purple bg-brand-purple/10 text-white' : 'border-brand-border text-brand-muted'
                }`}
              >
                <input type="radio" name="agent-role" value={role} checked={form.role === role}
                  onChange={() => set('role', role)} className="sr-only" />
                <span className="block font-bold">{role === 'agent' ? 'Agent' : 'Admin'}</span>
                <span className="block text-xs">{role === 'agent' ? 'Answers assigned chats' : 'Full dashboard access'}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {error && <p className="field__error" role="alert">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" fullWidth onClick={close} disabled={saving}>Cancel</Button>
          <Button type="submit" fullWidth loading={saving}>Add agent</Button>
        </div>
      </form>
    </Modal>
  )
}

function ResetPasswordModal({ agent, onClose }: { agent: Agent | null; onClose: () => void }) {
  const [password, setPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const close = () => { setPassword(''); setError(''); onClose() }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!agent) return
    if (password.length < MIN_PASSWORD) return setError(`The password needs at least ${MIN_PASSWORD} characters.`)
    setSaving(true)
    try {
      await operatorApi.resetAgentPassword(agent.id, password)
      toast.success(`Password changed for ${agent.name}`)
      close()
    } catch (err) {
      setError(errorMessage(err))
    } finally { setSaving(false) }
  }

  return (
    <Modal isOpen={agent !== null} onClose={close} title={`New password for ${agent?.name ?? ''}`} size="sm">
      <form onSubmit={submit} className="space-y-4">
        <PasswordInput aria-label="New password" required value={password} onChange={(e) => setPassword(e.target.value)}
          className="input--compact" autoComplete="new-password" />
        {error && <p className="field__error" role="alert">{error}</p>}
        <div className="flex gap-3">
          <Button type="button" variant="ghost" fullWidth onClick={close} disabled={saving}>Cancel</Button>
          <Button type="submit" fullWidth loading={saving}>Save</Button>
        </div>
      </form>
    </Modal>
  )
}

export default function AgentsPage() {
  const operator = useAuthStore((s) => s.operator)
  const [agents, setAgents] = useState<Agent[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [adding, setAdding] = useState(false)
  const [resetting, setResetting] = useState<Agent | null>(null)
  const [deleting, setDeleting] = useState<Agent | null>(null)
  const [busy, setBusy] = useState(false)

  const load = useCallback(() => {
    setFailed(false)
    operatorApi.agents()
      .then((data) => setAgents(data.agents))
      .catch(() => setFailed(true))
  }, [])
  useEffect(load, [load])

  if (operator?.role !== 'admin') return <Navigate to="/operator/chats" replace />

  const confirmDelete = async () => {
    if (!deleting) return
    setBusy(true)
    try {
      await operatorApi.deleteAgent(deleting.id)
      toast.success(`${deleting.name} was removed`)
      setDeleting(null)
      load()
    } catch (err) {
      toast.error(errorMessage(err))
    } finally { setBusy(false) }
  }

  const agentCount = agents?.filter((a) => a.role !== 'admin').length ?? 0

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-10">
      <div className="max-w-3xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Agents</h1>
            <p className="mt-1 text-sm text-brand-muted">
              {agents ? `${plural(agentCount, 'agent')} can sign in to answer chats.` : 'The people who can sign in to answer chats.'}
            </p>
          </div>
          <Button size="sm" onClick={() => setAdding(true)}>
            <Plus size={16} aria-hidden="true" /> Add agent
          </Button>
        </div>

        {failed ? (
          <div className="mt-8">
            <LoadError title="The agents could not be loaded." onRetry={load} />
          </div>
        ) : !agents ? (
          <div className="mt-8 space-y-2" aria-busy="true">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-16" />)}
          </div>
        ) : agents.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-brand-border px-6 py-14 text-center">
            <Users size={28} className="mx-auto text-brand-muted" aria-hidden="true" />
            <p className="mt-3 font-bold text-white">No agents yet</p>
          </div>
        ) : (
          <ul className="mt-8 divide-y divide-brand-border rounded-2xl border border-brand-border">
            {agents.map((agent) => {
              const isSelf = agent.id === operator.id
              return (
                <li key={agent.id} className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-white">
                      {agent.name}
                      {agent.role === 'admin' && <span className="ml-2 font-normal text-brand-muted">admin</span>}
                      {isSelf && <span className="ml-2 font-normal text-brand-muted">(you)</span>}
                    </div>
                    <div className="truncate text-xs text-brand-muted">{agent.email}</div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <IconButton label={`Change password for ${agent.name}`} onClick={() => setResetting(agent)} className="p-2">
                      <KeyRound size={17} aria-hidden="true" />
                    </IconButton>
                    {!isSelf && (
                      <IconButton label={`Remove ${agent.name}`} onClick={() => setDeleting(agent)} className="p-2 hover:text-red-400">
                        <Trash2 size={17} aria-hidden="true" />
                      </IconButton>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <AddAgentModal isOpen={adding} onClose={() => setAdding(false)} onAdded={() => { setAdding(false); load() }} />
      <ResetPasswordModal agent={resetting} onClose={() => setResetting(null)} />
      <ConfirmDialog
        isOpen={deleting !== null}
        title={`Remove ${deleting?.name ?? ''}?`}
        message="They will no longer be able to sign in. Chats assigned to them go back to the queue, and their clock-in history is deleted."
        confirmLabel="Remove"
        danger
        loading={busy}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}
