import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Smile } from 'lucide-react'
import IconButton from '@components/common/IconButton'
import Spinner from '@components/common/Spinner'

// The picker and its emoji data (a few hundred KB) load the first time it is opened, not with the chat
const Picker = lazy(async () => {
  const [{ default: EmojiMart }, { default: data }] = await Promise.all([import('@emoji-mart/react'), import('@emoji-mart/data')])
  return {
    default: ({ onSelect }: { onSelect: (emoji: string) => void }) => (
      <EmojiMart
        data={data}
        theme="dark"
        previewPosition="none"
        skinTonePosition="search"
        navPosition="bottom"
        perLine={8}
        maxFrequentRows={2}
        autoFocus
        onEmojiSelect={(e: { native: string }) => onSelect(e.native)}
      />
    ),
  }
})

interface EmojiButtonProps {
  /** Called with the emoji, e.g. "😂" */
  onSelect: (emoji: string) => void
  /** Where the picker opens, relative to the button */
  align?: 'start' | 'end'
}

/** A smiley button that opens a searchable emoji picker above it. */
export default function EmojiButton({ onSelect, align = 'start' }: EmojiButtonProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on a click outside or on Escape
  useEffect(() => {
    if (!open) return
    const onPointer = (e: PointerEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative shrink-0">
      <IconButton
        label={open ? 'Close emoji picker' : 'Add an emoji'}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((o) => !o)}
        className={`h-12 w-12 ${open ? 'text-brand-text' : ''}`}
      >
        <Smile size={24} strokeWidth={2.2} />
      </IconButton>

      {open && (
        <div
          role="dialog"
          aria-label="Emoji picker"
          className={`absolute bottom-full z-30 mb-2 overflow-hidden rounded-3xl shadow-2xl shadow-black/60 ${align === 'end' ? 'right-0' : 'left-0'}`} // taste-skill-ignore: a real popover
        >
          <Suspense fallback={<div className="flex h-[420px] w-[352px] max-w-[calc(100vw-2rem)] items-center justify-center bg-brand-surface"><Spinner /></div>}>
            {/* The picker stays open so several emoji can be added in a row */}
            <Picker onSelect={onSelect} />
          </Suspense>
        </div>
      )}
    </div>
  )
}
