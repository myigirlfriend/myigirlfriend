import { motion } from 'framer-motion'
import Avatar from '@components/common/Avatar'
import { formatTime } from '@utils/formatTime'
import type { Message, Persona } from '@/types'

interface MessageBubbleProps {
  message: Message
  persona: Persona
}

export default function MessageBubble({ message, persona }: MessageBubbleProps) {
  const isUser = message.sender === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar — AI/operator only */}
      {!isUser && <Avatar persona={persona} size="sm" />}

      <div className={`flex max-w-[72%] flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isUser
              ? 'rounded-br-sm text-white'
              : 'rounded-bl-sm border border-brand-border bg-brand-card text-brand-text'
          }`}
          // The member's own bubbles take the colours of the companion they are talking to
          style={isUser
            ? { backgroundImage: `linear-gradient(135deg, ${persona.gradientFrom}, ${persona.gradientTo})` }
            : undefined}
        >
          {message.content}
        </div>
        <span className="px-1 text-xs text-brand-muted">{formatTime(message.created_at)}</span>
      </div>
    </motion.div>
  )
}
