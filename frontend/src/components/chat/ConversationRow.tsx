import type { ReactNode } from 'react'
import Avatar from '@components/common/Avatar'
import type { AvatarPersona } from '@/types'

interface ConversationRowProps {
  persona: AvatarPersona
  /** Defaults to her name */
  title?: string
  /** The last message, or a summary */
  preview: ReactNode
  /** Usually when it happened */
  meta?: ReactNode
  /** Shown in italics, for a preview that is not a real message */
  quiet?: boolean
  onClick: () => void
}

/** One conversation in a list: avatar, name, a line of preview, and when. */
export default function ConversationRow({ persona, title, preview, meta, quiet = false, onClick }: ConversationRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="surface flex w-full items-center gap-4 p-4 text-left transition-colors duration-150 hover:bg-brand-card"
    >
      <Avatar persona={persona} size="lg" online />
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-3">
          <span className="truncate text-lg font-extrabold text-brand-text">{title ?? persona.name}</span>
          {meta && <span className="shrink-0 text-sm text-brand-muted">{meta}</span>}
        </span>
        <span className={`mt-0.5 block truncate text-base text-brand-muted ${quiet ? 'italic' : ''}`}>{preview}</span>
      </span>
    </button>
  )
}
