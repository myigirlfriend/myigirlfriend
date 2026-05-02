import { motion } from 'framer-motion'
import { formatTime } from '@utils/formatTime'

export default function MessageBubble({ message, persona }) {
  const isUser = message.sender === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar — AI only */}
      {!isUser && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
          style={{ background: `linear-gradient(135deg, ${persona?.gradientFrom ?? '#9B59B6'}, ${persona?.gradientTo ?? '#E91E8C'})` }}
        >
          {persona?.name?.[0] ?? 'A'}
        </div>
      )}

      <div className={`flex flex-col gap-1 max-w-[72%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? 'bg-brand-gradient text-white rounded-br-sm'
              : 'bg-brand-card border border-brand-border text-brand-text rounded-bl-sm'
          }`}
        >
          {message.content}
        </div>
        <span className="text-xs text-brand-muted px-1">
          {formatTime(message.created_at)}
        </span>
      </div>
    </motion.div>
  )
}
