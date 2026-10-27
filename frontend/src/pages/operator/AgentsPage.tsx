import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { KeyRound, Plus, Trash2, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import Badge from '@components/common/Badge'
import Button from '@components/common/Button'
import ConfirmDialog from '@components/common/ConfirmDialog'
import EmptyState from '@components/common/EmptyState'
import Field from '@components/common/Field'
import IconButton from '@components/common/IconButton'
import LoadError from '@components/common/LoadError'
import Modal from '@components/common/Modal'
import PasswordInput from '@components/common/PasswordInput'
import OperatorPage from '@components/operator/OperatorPage'
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
        <Field id="agent-name" label="Name">
          <input id="agent-name" required value={form.name} onChange={(e) => set('name', e.target.value)}
            className="input input--compact" autoComplete="off" />
        </Field>
        <Field id="agent-email" label="Email" help="They sign in with this on the team sign in page.">
          <input id="agent-email" type="email" required value={form.email} onChange={(e) => set('email', e.target.value)}
            className="input input--compact" autoComplete="off" spellCheck={false} />
        </Field>
        <Field id="agent-password" label="Password" help={`At least ${MIN_PASSWORD} characters.`}>
          <PasswordInput id="agent-password" required value={form.password} onChange={(e) => set('password', e.target.value)}
            className="input--compact" autoComplete="new-password" />
        </Field>
        <fieldset>
          <legend className="field__label">Access</legend>
          <div className="grid grid-cols-2 gap-2">
            {(['agent', 'admin'] as const).map((role) => (
              <label
                key={role}
                className={`cursor-pointer rounded-2xl px-4 py-3 text-[15px] ring-inset transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand-pink ${
                  form.role === role ? 'bg-brand-plum-2 text-white ring-2 ring-brand-pink' : 'bg-brand-card text-brand-muted ring-1 ring-brand-border'
                }`}
              >
                <input type="radio" name="agent-role" value={role} checked={form.role === role}
                  onChange={() => set('role', role)} className="sr-only" />
                <span className="block font-bold">{role === 'agent' ? 'Agent' : 'Admin'}</span>
                <span className="block text-sm">{role === 'agent' ? 'Answers assigned chats' : 'Full dashboard access'}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {error && <p className="field__error" role="alert">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" fullWidth onClick={close} disabled={saving}>Cancel</Button>
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
        <Field id="agent-new-password" label="New password" help={`At least ${MIN_PASSWORD} characters.`} error={error || undefined}>
          <PasswordInput id="agent-new-password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="input--compact" autoComplete="new-password" />
        </Field>
        <div className="flex gap-3">
          <Button type="button" variant="secondary" fullWidth onClick={close} disabled={saving}>Cancel</Button>
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
    <OperatorPage
      narrow
      title="Agents"
      subtitle={agents ? `${plural(agentCount, 'agent')} can sign in to answer chats.` : 'The people who can sign in to answer chats.'}
      actions={
        <Button size="sm" onClick={() => setAdding(true)}>
          <Plus size={16} aria-hidden="true" /> Add agent
        </Button>
      }
    >
        {failed ? (
          <LoadError title="The agents could not be loaded." onRetry={load} />
        ) : !agents ? (
          <div className="space-y-2" aria-busy="true">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-16" />)}
          </div>
        ) : agents.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No agents yet"
            description="Add the people who will answer chats. They sign in on the team sign in page."
            action={<Button onClick={() => setAdding(true)}><Plus size={16} aria-hidden="true" /> Add agent</Button>}
          />
        ) : (
          <ul className="space-y-2">
            {agents.map((agent) => {
              const isSelf = agent.id === operator.id
              return (
                <li key={agent.id} className="surface flex items-center justify-between gap-3 px-5 py-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 truncate text-base font-extrabold text-brand-text">
                      {agent.name}
                      {agent.role === 'admin' && <Badge>Admin</Badge>}
                      {isSelf && <span className="font-semibold text-brand-muted">(you)</span>}
                    </div>
                    <div className="truncate text-sm text-brand-muted">{agent.email}</div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <IconButton label={`Change password for ${agent.name}`} onClick={() => setResetting(agent)}>
                      <KeyRound size={17} aria-hidden="true" />
                    </IconButton>
                    {!isSelf && (
                      <IconButton label={`Remove ${agent.name}`} onClick={() => setDeleting(agent)} className="hover:text-red-300">
                        <Trash2 size={17} aria-hidden="true" />
                      </IconButton>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}

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
    </OperatorPage>
  )
}
