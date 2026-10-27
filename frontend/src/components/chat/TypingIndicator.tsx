import { motion } from 'framer-motion'
import Avatar from '@components/common/Avatar'
import type { AvatarPersona } from '@/types'
import Bubble from './Bubble'

interface TypingIndicatorProps {
  persona: AvatarPersona
  /** Leave out the avatar, e.g. when she is already pictured beside it */
  bare?: boolean
}

/** Three bouncing dots in her bubble while she writes. */
export default function TypingIndicator({ persona, bare = false }: TypingIndicatorProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} role="status">
      <Bubble tone="received" avatar={bare ? undefined : <Avatar persona={persona} size="sm" />}>
        <span className="flex h-[1.375rem] items-center gap-1" aria-hidden="true">
          <span className="typing-dot h-2 w-2 rounded-full bg-brand-muted" />
          <span className="typing-dot h-2 w-2 rounded-full bg-brand-muted" />
          <span className="typing-dot h-2 w-2 rounded-full bg-brand-muted" />
        </span>
        <span className="sr-only">{persona.name} is typing</span>
      </Bubble>
    </motion.div>
  )
}
