import { useRef, type ChangeEvent } from 'react'
import { ChevronLeft, ChevronRight, ImagePlus, X } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@components/common/Button'
import { PHOTO_TYPES, photoProblem, readPhoto } from '@utils/image'
import { errorMessage } from '@utils/text'

export const MAX_GALLERY = 8

interface GalleryEditorProps {
  /** Photos in order: URLs of saved ones, data URLs of new ones */
  value: string[]
  onChange: (photos: string[]) => void
  /** Her name, for the alt text */
  name: string
}

/** The extra photos on a model's profile: add several at once, reorder, remove. */
export default function GalleryEditor({ value, onChange, name }: GalleryEditorProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const room = MAX_GALLERY - value.length

  const addPhotos = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = [...(e.target.files ?? [])]
    e.target.value = ''
    if (files.length > room) toast.error(`Only ${room} more photo${room === 1 ? '' : 's'} fit. The first ${room} were added.`)
    const added: string[] = []
    for (const file of files.slice(0, room)) {
      const problem = photoProblem(file)
      if (problem) { toast.error(`${file.name}: ${problem}`); continue }
      try { added.push(await readPhoto(file)) } catch (err) { toast.error(errorMessage(err)) }
    }
    if (added.length) onChange([...value, ...added])
  }

  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return
    const next = [...value]
    const [photo] = next.splice(from, 1)
    next.splice(to, 0, photo!)
    onChange(next)
  }

  return (
    <fieldset className="relative">
      <legend className="field__label">More photos</legend>
      <p className="field__help mt-0">
        Shown on her public profile after the main photo. Up to {MAX_GALLERY}; the order here is the order members see.
      </p>

      {value.length > 0 && (
        <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {value.map((src, i) => (
            <li key={src.slice(-40) + i} className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-brand-surface">
              <img src={src} alt={`${name || 'Model'}, photo ${i + 2}`} className="h-full w-full object-cover object-top" />
              <div className="absolute inset-x-1.5 bottom-1.5 flex justify-between gap-1">
                <span className="flex gap-1">
                  <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} aria-label={`Move photo ${i + 1} earlier`}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-black/65 text-white disabled:opacity-30">
                    <ChevronLeft size={16} aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => move(i, i + 1)} disabled={i === value.length - 1} aria-label={`Move photo ${i + 1} later`}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-black/65 text-white disabled:opacity-30">
                    <ChevronRight size={16} aria-hidden="true" />
                  </button>
                </span>
                <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label={`Remove photo ${i + 1}`}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black/65 text-white hover:bg-red-500">
                  <X size={16} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <input ref={fileRef} type="file" multiple accept={PHOTO_TYPES.join(',')} onChange={addPhotos} className="sr-only" id="model-gallery" tabIndex={-1} />
      <Button variant="secondary" size="sm" className="mt-3" disabled={room === 0} onClick={() => fileRef.current?.click()}>
        <ImagePlus size={16} aria-hidden="true" /> {room === 0 ? 'Gallery is full' : 'Add photos'}
      </Button>
    </fieldset>
  )
}
