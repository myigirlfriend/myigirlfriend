import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { ArrowLeft, ImagePlus, Trash2, Wand2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@components/common/Button'
import Field from '@components/common/Field'
import GalleryEditor from '@components/operator/GalleryEditor'
import PersonaTile from '@components/persona/PersonaTile'
import { resolvePersona } from '@config/personas'
import { modelApi } from '@services/api'
import { PHOTO_TYPES, photoProblem, readPhoto } from '@utils/image'
import { errorMessage, plural } from '@utils/text'
import type { Model, ModelFormValues, ModelPayload } from '@/types'

const COLOURS = [
  { name: 'Orchid', from: '#9B59B6', to: '#E91E8C' }, // taste-skill-ignore: companion colours admins choose from
  { name: 'Violet', from: '#8B5CF6', to: '#EC4899' }, // taste-skill-ignore: companion colours admins choose from
  { name: 'Indigo', from: '#6366F1', to: '#A855F7' }, // taste-skill-ignore: companion colours admins choose from
  { name: 'Rose', from: '#EC4899', to: '#F43F5E' }, // taste-skill-ignore: companion colours admins choose from
  { name: 'Sunset', from: '#F59E0B', to: '#EF4444' }, // taste-skill-ignore: companion colours admins choose from
  { name: 'Lagoon', from: '#06B6D4', to: '#6366F1' }, // taste-skill-ignore: companion colours admins choose from
] as const

type TextField = 'name' | 'tagline' | 'description' | 'tone' | 'prompt' | 'previewMessage'

const LIMITS: Record<TextField, number> = {
  name: 40, tagline: 80, description: 300, tone: 120, prompt: 4000, previewMessage: 200,
}

const draftPrompt = ({ name, tone, description }: ModelFormValues): string =>
  `You are ${name || 'her'}, an AI companion. Your personality is ${tone || 'warm, curious and a little playful'}.
${description ? `${description}\n` : ''}You are genuinely interested in the person you are talking to and you remember what they tell you.
You never say you're an AI unless directly pressed.`

interface ModelEditorProps {
  /** The model being edited, or null when adding one */
  model: Model | null
  /** Returns to the list */
  onClose: () => void
  onSaved: (model: Model) => void
  onDeleted: (id: string) => void
}

/** Add or edit one model. */
export default function ModelEditor({ model, onClose, onSaved, onDeleted }: ModelEditorProps) {
  const fallback = model ? resolvePersona(model) : null
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<ModelFormValues>({
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
  const [photo, setPhoto] = useState<string | null>(null) // new photo as a data URL, if one was chosen
  const [gallery, setGallery] = useState<string[]>(model?.gallery ?? [])
  // Only sent when it changed, so other edits still save on a database that has not added the gallery column yet
  const galleryChanged = JSON.stringify(gallery) !== JSON.stringify(model?.gallery ?? [])
  const [nameError, setNameError] = useState('')
  const [saveError, setSaveError] = useState('')
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const set = (key: TextField) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value.slice(0, LIMITS[key])
    setForm((f) => ({ ...f, [key]: value }))
    if (key === 'name') setNameError('')
  }

  const choosePhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const problem = photoProblem(file)
    if (problem) return void toast.error(problem)
    try { setPhoto(await readPhoto(file)) } catch (err) { toast.error(errorMessage(err)) }
  }

  const save = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setNameError('Give her a name before saving')
      document.getElementById('model-name')?.focus()
      return
    }
    setSaving(true)
    setSaveError('')
    try {
      const body: ModelPayload = { ...form, ...(photo ? { image: photo } : {}), ...(galleryChanged ? { gallery } : {}) }
      const data = model ? await modelApi.update(model.id, body) : await modelApi.create(body)
      toast.success('Model saved')
      onSaved(data.model)
    } catch (err) {
      setSaveError(errorMessage(err))
    } finally { setSaving(false) }
  }

  const remove = async () => {
    if (!model) return
    setSaving(true)
    try {
      await modelApi.remove(model.id)
      toast.success('Model deleted')
      onDeleted(model.id)
    } catch (err) {
      setSaveError(errorMessage(err))
      setConfirmDelete(false)
    } finally { setSaving(false) }
  }

  const currentImage = photo || fallback?.image || null

  return (
    <form onSubmit={save} className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12" noValidate>
      <button type="button" onClick={onClose} className="link link--muted inline-flex items-center gap-1.5 text-[15px]">
        <ArrowLeft size={16} aria-hidden="true" /> Models
      </button>
      <h1 className="heading mt-4 text-3xl sm:text-4xl">{model ? `Edit ${model.name}` : 'Add model'}</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-7 lg:max-w-2xl">
          {/* Photo */}
          <div>
            <span className="field__label">Photo</span>
            <div className="flex items-center gap-4">
              <div className="relative h-28 w-[84px] shrink-0 overflow-hidden rounded-2xl bg-brand-surface">
                {currentImage
                  ? <img src={currentImage} alt="" className="h-full w-full object-cover object-top" />
                  : <div className="flex h-full w-full items-center justify-center text-brand-muted"><ImagePlus size={22} aria-hidden="true" /></div>}
              </div>
              <div>
                <input ref={fileRef} type="file" accept={PHOTO_TYPES.join(',')} onChange={choosePhoto} className="sr-only" id="model-photo" tabIndex={-1} />
                <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>
                  <ImagePlus size={16} aria-hidden="true" /> {currentImage ? 'Change photo' : 'Choose photo'}
                </Button>
                <p className="field__help">A portrait photo with her face near the top works best. JPG, PNG or WebP.</p>
              </div>
            </div>
          </div>

          <GalleryEditor value={gallery} onChange={setGallery} name={form.name} />

          <Field id="model-name" label="Name" count={form.name.length} max={LIMITS.name} error={nameError}>
            <input id="model-name" className="input input--compact input--sunken" value={form.name} onChange={set('name')} autoComplete="off" aria-invalid={!!nameError} />
          </Field>

          <Field id="model-tagline" label="Tagline" count={form.tagline.length} max={LIMITS.tagline}
            help="A few words shown under her name, for example: Playful, flirty, bold.">
            <input id="model-tagline" className="input input--compact input--sunken" value={form.tagline} onChange={set('tagline')} autoComplete="off" />
          </Field>

          <Field id="model-description" label="About her" count={form.description.length} max={LIMITS.description}
            help="One or two sentences members read when deciding who to talk to.">
            <textarea id="model-description" rows={3} className="input input--compact input--sunken resize-y" value={form.description} onChange={set('description')} />
          </Field>

          <Field id="model-tone" label="Personality" count={form.tone.length} max={LIMITS.tone}
            help="Three or four words, for example: calm, thoughtful, curious.">
            <input id="model-tone" className="input input--compact input--sunken" value={form.tone} onChange={set('tone')} autoComplete="off" />
          </Field>

          <Field id="model-prompt" label="How she talks" count={form.prompt.length} max={LIMITS.prompt}
            help="Describe her the way you would brief an actress: who she is, how she speaks, what she cares about. The AI follows this in every reply. Short replies and tasteful language are always enforced, so you do not need to write that here.">
            <textarea id="model-prompt" rows={8} className="input input--compact input--sunken resize-y leading-relaxed" value={form.prompt} onChange={set('prompt')} />
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, prompt: draftPrompt(f) }))}
              className="link link--accent mt-2 inline-flex items-center gap-1.5 text-sm"
            >
              <Wand2 size={15} aria-hidden="true" />
              {form.prompt ? 'Replace with a starting draft' : 'Write a starting draft for me'}
            </button>
          </Field>

          <Field id="model-preview" label="First message" count={form.previewMessage.length} max={LIMITS.previewMessage}
            help="Shown on her photo before a chat starts.">
            <input id="model-preview" className="input input--compact input--sunken" value={form.previewMessage} onChange={set('previewMessage')} autoComplete="off" />
          </Field>

          {/* Colour */}
          <fieldset>
            <legend className="field__label">Colour</legend>
            <div className="flex flex-wrap gap-2.5">
              {COLOURS.map((c) => (
                <label key={c.name} className="cursor-pointer" title={c.name}>
                  <input
                    type="radio" name="model-colour" className="peer sr-only"
                    checked={c.from === form.gradientFrom && c.to === form.gradientTo}
                    onChange={() => setForm((f) => ({ ...f, gradientFrom: c.from, gradientTo: c.to }))}
                  />
                  <span
                    className="block h-10 w-14 rounded-full ring-offset-2 ring-offset-brand-dark peer-checked:ring-2 peer-checked:ring-brand-text
                               peer-focus-visible:ring-2 peer-focus-visible:ring-brand-pink"
                    style={{ backgroundColor: c.to }}
                  />
                  <span className="sr-only">{c.name}</span>
                </label>
              ))}
            </div>
            <p className="field__help">Used for her accents in the chat.</p>
          </fieldset>

          {/* Visibility */}
          <label className="surface flex cursor-pointer items-start gap-3 p-5">
            <input
              type="checkbox" className="peer sr-only" checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
            />
            <span className="relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-brand-raised transition-colors peer-checked:bg-brand-rose
                             peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-pink
                             after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5" />
            <span>
              <span className="block text-base font-bold text-brand-text">Shown to members</span>
              <span className="block text-sm text-brand-muted">
                {form.isActive ? 'Members can find her and start chatting.' : 'Hidden. Chats that already exist keep working.'}
              </span>
            </span>
          </label>

          {saveError && (
            <p className="rounded-2xl bg-red-400/15 px-4 py-3 text-base font-semibold text-red-300" role="alert">
              {saveError}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-4">
            <Button type="submit" size="sm" disabled={saving}>{saving ? 'Saving…' : 'Save model'}</Button>
            <Button variant="secondary" size="sm" onClick={onClose} disabled={saving}>Cancel</Button>

            {model && (
              <div className="ml-auto">
                {model.chats > 0 ? (
                  <span className="text-sm text-brand-muted">
                    She has {plural(model.chats, 'chat')}, so she can be hidden but not deleted.
                  </span>
                ) : confirmDelete ? (
                  <span className="flex items-center gap-2 text-sm text-brand-text">
                    Delete {model.name} for good?
                    <Button variant="danger" size="xs" onClick={remove} disabled={saving}>Delete</Button>
                    <Button variant="secondary" size="xs" onClick={() => setConfirmDelete(false)}>Keep</Button>
                  </span>
                ) : (
                  <button type="button" onClick={() => setConfirmDelete(true)} className="inline-flex items-center gap-1.5 rounded text-sm font-bold text-red-300 underline-offset-4 hover:underline">
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
              <PersonaTile persona={{ ...form, image: currentImage }} dimmed={!form.isActive} />
            </div>
            <p className="mt-3 text-center text-sm text-brand-muted">
              How members see her. It updates as you type.
            </p>
          </div>
        </aside>
      </div>
    </form>
  )
}
