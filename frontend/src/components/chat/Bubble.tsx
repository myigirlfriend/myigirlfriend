import type { ReactNode } from 'react'

/**
 * Which way the message travelled, from the reader's point of view, which decides its colour and side.
 * In the member's chat her messages are `received` and theirs are `sent`. In the team console the member's
 * messages are `received`, her AI replies `sent`, and replies a team member wrote as her are `agent`.
 */
export type BubbleTone = 'received' | 'sent' | 'agent'

interface BubbleProps {
  tone: BubbleTone
  /** Which side of the thread it sits on */
  side?: 'start' | 'end'
  /** Small line under the bubble: a time, or who sent it */
  meta?: ReactNode
  /** Shown beside the bubble, usually her Avatar */
  avatar?: ReactNode
  /** Larger type, for showcase moments such as the landing page */
  size?: 'md' | 'lg'
  className?: string
  children: ReactNode
}

const TONES: Record<BubbleTone, string> = {
  received: 'bg-brand-card text-brand-text',
  sent: 'bg-brand-rose text-white',
  agent: 'bg-brand-plum-3 text-white',
}

/** One chat message. The single drawing of a message bubble across the app. */
export default function Bubble({ tone, side = tone === 'received' ? 'start' : 'end', meta, avatar, size = 'md', className = '', children }: BubbleProps) {
  const end = side === 'end'
  const tail = end ? 'rounded-br-md' : 'rounded-bl-md'
  const text = size === 'lg' ? 'px-5 py-3.5 text-lg' : 'px-4 py-2.5 text-base'

  return (
    <div className={`flex items-end gap-2 ${end ? 'flex-row-reverse' : 'flex-row'} ${className}`}>
      {avatar}
      <div className={`flex min-w-0 max-w-[78%] flex-col gap-1 sm:max-w-md ${end ? 'items-end' : 'items-start'}`}>
        <div className={`whitespace-pre-wrap break-words rounded-[1.4rem] leading-snug ${tail} ${text} ${TONES[tone]}`}>
          {children}
        </div>
        {meta && <span className="px-2 text-[13px] text-brand-muted">{meta}</span>}
      </div>
    </div>
  )
}
