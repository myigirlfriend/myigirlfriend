import { useRef, useState } from 'react'
import { ArrowLeft, ImagePlus, Wand2, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@services/api'
import PersonaTile from '@components/persona/PersonaTile'
import { resolvePersona } from '@config/personas'

const COLOURS = [
  { name: 'Orchid', from: '#9B59B6', to: '#E91E8C' },
  { name: 'Violet', from: '#8B5CF6', to: '#EC4899' },
  { name: 'Indigo', from: '#6366F1', to: '#A855F7' },
  { name: 'Rose', from: '#EC4899', to: '#F43F5E' },
  { name: 'Sunset', from: '#F59E0B', to: '#EF4444' },
  { name: 'Lagoon', from: '#06B6D4', to: '#6366F1' },
]

const LIMITS = { name: 40, tagline: 80, description: 300, tone: 120, prompt: 4000, previewMessage: 200 }
const MAX_FILE_BYTES = 5 * 1024 * 1024

// Shrink large photos in the browser so uploads stay quick. Returns a JPEG data URL.
const readPhoto = (file) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, 1400 / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.88))
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('That file could not be read as an image')) }
    img.src = url
  })

const draftPrompt = ({ name, tone, description }) =>
  `You are ${name || 'her'}, an AI companion. Your personality is ${tone || 'warm, curious and a little playful'}.
${description ? `${description}\n` : ''}You are genuinely interested in the person you are talking to and you remember what they tell you.
You never say you're an AI unless directly pressed.`

function Field({ id, label, help, count, max, error, children }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="admin-label">{label}</label>
        {max && <span className="text-xs text-zinc-400 tabular-nums">{count}/{max}</span>}
      </div>
      {children}
      {error
        ? <p className="mt-1.5 text-sm font-semibold text-red-400" role="alert">{error}</p>
        : help && <p className="admin-help">{help}</p>}
    </div>
  )
}

/**
 * Add or edit one model. `model` is null when adding.
 * onSaved / onDeleted let the list refresh; onClose returns to the list.
 */
export default function ModelEditor({ model, onClose, onSaved, onDeleted }) {
  const isNew = !model
  const fallback = model ? resolvePersona(model) : null
  const fileRef = useRef(null)

  const [form, setForm] = useState({
    name: model?.name || '',
    tagline: model?.tagline || '',
    description: model?.description || '',
    tone: model?.tone || '',
    prompt: model?.prompt || '',
    previewMessage: model?.previewMessage || '',
    gradientFrom: model?.gradientFrom || fallback?.gradientFrom || COLOURS[0].from,
    gradientTo: model?.gradientTo || fallback?.gradientTo || COLOURS[0].to,
    isActive: model ? model.isActive : true,
  })
  const [photo, setPhoto] = useState(null)        // new photo as a data URL, if one was chosen
  const [nameError, setNameError] = useState('')
  const [saveError, setSaveError] = useState('')
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const set = (key) => (e) => {
    const value = e.target.value.slice(0, LIMITS[key])
    setForm(f => ({ ...f, [key]: value }))
    if (key === 'name') setNameError('')
  }

  const choosePhoto = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return toast.error('Choose a JPG, PNG or WebP photo')
    if (file.size > MAX_FILE_BYTES * 3) return toast.error('That photo is too large. Choose one under 15 MB')
    try { setPhoto(await readPhoto(file)) } catch (err) { toast.error(err.message) }
  }

  const save = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setNameError('Give her a name before saving')
      document.getElementById('model-name')?.focus()
      return
    }
    setSaving(true)
    setSaveError('')
    try {
      const body = { ...form, ...(photo ? { image: photo } : {}) }
      const data = isNew
        ? await api.post('/api/operator/models', body)
        : await api.put(`/api/operator/models/${model.id}`, body)
      toast.success('Model saved')
      onSaved(data.model)
    } catch (err) {
      setSaveError(err.message)
    } finally { setSaving(false) }
  }

  const remove = async () => {
    setSaving(true)
    try {
      await api.delete(`/api/operator/models/${model.id}`)
      toast.success('Model deleted')
      onDeleted(model.id)
    } catch (err) {
      setSaveError(err.message)
      setConfirmDelete(false)
    } finally { setSaving(false) }
  }

  const currentImage = photo || fallback?.image || null
  const preview = { ...form, image: currentImage }

  return (
    <form onSubmit={save} className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-10" noValidate>
      <button type="button" onClick={onClose} className="inline-flex items-center gap-1.5 text-sm font-bold text-zinc-400 hover:text-white transition-colors">
        <ArrowLeft size={16} aria-hidden="true" /> Models
      </button>
      <h1 className="mt-3 text-2xl font-extrabold text-white">{isNew ? 'Add model' : `Edit ${model.name}`}</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-7 lg:max-w-2xl">
          {/* Photo */}
          <div>
            <span className="admin-label">Photo</span>
            <div className="flex items-center gap-4">
              <div className="relative h-28 w-[84px] shrink-0 overflow-hidden rounded-xl border border-brand-border bg-brand-surface">
                {currentImage
                  ? <img src={currentImage} alt="" className="h-full w-full object-cover object-top" />
                  : <div className="flex h-full w-full items-center justify-center text-zinc-400"><ImagePlus size={22} aria-hidden="true" /></div>}
              </div>
              <div>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={choosePhoto} className="sr-only" id="model-photo" />
                <button type="button" onClick={() => fileRef.current?.click()} className="admin-btn">
                  <ImagePlus size={16} aria-hidden="true" /> {currentImage ? 'Change photo' : 'Choose photo'}
                </button>
                <p className="admin-help">A portrait photo with her face near the top works best. JPG, PNG or WebP.</p>
              </div>
            </div>
          </div>

          <Field id="model-name" label="Name" count={form.name.length} max={LIMITS.name} error={nameError}>
            <input id="model-name" className="admin-input" value={form.name} onChange={set('name')} autoComplete="off" aria-invalid={!!nameError} />
          </Field>

          <Field id="model-tagline" label="Tagline" count={form.tagline.length} max={LIMITS.tagline}
            help="A few words shown under her name, for example: Playful, flirty, bold.">
            <input id="model-tagline" className="admin-input" value={form.tagline} onChange={set('tagline')} autoComplete="off" />
          </Field>

          <Field id="model-description" label="About her" count={form.description.length} max={LIMITS.description}
            help="One or two sentences members read when deciding who to talk to.">
            <textarea id="model-description" rows={3} className="admin-input resize-y" value={form.description} onChange={set('description')} />
          </Field>

          <Field id="model-tone" label="Personality" count={form.tone.length} max={LIMITS.tone}
            help="Three or four words, for example: calm, thoughtful, curious.">
            <input id="model-tone" className="admin-input" value={form.tone} onChange={set('tone')} autoComplete="off" />
          </Field>

          <Field id="model-prompt" label="How she talks" count={form.prompt.length} max={LIMITS.prompt}
            help="Describe her the way you would brief an actress: who she is, how she speaks, what she cares about. The AI follows this in every reply. Short replies and tasteful language are always enforced, so you do not need to write that here.">
            <textarea id="model-prompt" rows={8} className="admin-input resize-y leading-relaxed" value={form.prompt} onChange={set('prompt')} />
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, prompt: draftPrompt(f) }))}
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-brand-pink hover:underline"
            >
              <Wand2 size={15} aria-hidden="true" />
              {form.prompt ? 'Replace with a starting draft' : 'Write a starting draft for me'}
            </button>
          </Field>

          <Field id="model-preview" label="First message" count={form.previewMessage.length} max={LIMITS.previewMessage}
            help="Shown on her photo before a chat starts.">
            <input id="model-preview" className="admin-input" value={form.previewMessage} onChange={set('previewMessage')} autoComplete="off" />
          </Field>

          {/* Colour */}
          <fieldset>
            <legend className="admin-label">Colour</legend>
            <div className="flex flex-wrap gap-2.5">
              {COLOURS.map(c => {
                const selected = c.from === form.gradientFrom && c.to === form.gradientTo
                return (
                  <label key={c.name} className="cursor-pointer" title={c.name}>
                    <input
                      type="radio" name="model-colour" className="peer sr-only" checked={selected}
                      onChange={() => setForm(f => ({ ...f, gradientFrom: c.from, gradientTo: c.to }))}
                    />
                    <span
                      className="block h-9 w-14 rounded-xl ring-offset-2 ring-offset-brand-dark peer-checked:ring-2 peer-checked:ring-white
                                 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-pink"
                      style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})` }}
                    />
                    <span className="sr-only">{c.name}</span>
                  </label>
                )
              })}
            </div>
            <p className="admin-help">Used for her accents in the chat.</p>
          </fieldset>

          {/* Visibility */}
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-brand-border p-4">
            <input
              type="checkbox" className="peer sr-only" checked={form.isActive}
              onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
            />
            <span className="relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-zinc-700 transition-colors peer-checked:bg-brand-pink
                             peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-pink
                             after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5" />
            <span>
              <span className="block text-sm font-bold text-white">Shown to members</span>
              <span className="block text-sm text-zinc-400">
                {form.isActive ? 'Members can find her and start chatting.' : 'Hidden. Chats that already exist keep working.'}
              </span>
            </span>
          </label>

          {saveError && (
            <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300" role="alert">
              {saveError}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 border-t border-brand-border pt-6">
            <button type="submit" disabled={saving} className="admin-btn-primary">
              {saving ? 'Saving…' : 'Save model'}
            </button>
            <button type="button" onClick={onClose} disabled={saving} className="admin-btn">Cancel</button>

            {!isNew && (
              <div className="ml-auto">
                {model.chats > 0 ? (
                  <span className="text-sm text-zinc-400">
                    She has {model.chats} {model.chats === 1 ? 'chat' : 'chats'}, so she can be hidden but not deleted.
                  </span>
                ) : confirmDelete ? (
                  <span className="flex items-center gap-2 text-sm text-white">
                    Delete {model.name} for good?
                    <button type="button" onClick={remove} disabled={saving} className="admin-btn border-red-500/50 text-red-300 py-1.5 px-3">Delete</button>
                    <button type="button" onClick={() => setConfirmDelete(false)} className="admin-btn py-1.5 px-3">Keep</button>
                  </span>
                ) : (
                  <button type="button" onClick={() => setConfirmDelete(true)} className="inline-flex items-center gap-1.5 text-sm font-bold text-red-400 hover:underline">
                    <Trash2 size={15} aria-hidden="true" /> Delete model
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Live preview: the exact tile members see */}
        <aside className="order-first lg:order-none">
          <div className="lg:sticky lg:top-8">
            <div className="mx-auto w-48 lg:w-full">
              <PersonaTile persona={preview} dimmed={!form.isActive} />
            </div>
            <p className="mt-3 text-center text-sm text-zinc-400">
              How members see her. It updates as you type.
            </p>
          </div>
        </aside>
      </div>
    </form>
  )
}
