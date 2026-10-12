import { motion } from 'framer-motion'
import Avatar from '@components/common/Avatar'
import type { Persona } from '@/types'

interface TypingIndicatorProps {
  persona: Persona
}

export default function TypingIndicator({ persona }: TypingIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-end gap-2"
      role="status"
    >
      <Avatar persona={persona} size="sm" />
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-brand-border bg-brand-card px-4 py-3">
        <span className="typing-dot h-2 w-2 rounded-full bg-brand-purple" />
        <span className="typing-dot h-2 w-2 rounded-full bg-brand-purple" />
        <span className="typing-dot h-2 w-2 rounded-full bg-brand-purple" />
      </div>
      <span className="sr-only">{persona.name} is typing</span>
    </motion.div>
  )
}
