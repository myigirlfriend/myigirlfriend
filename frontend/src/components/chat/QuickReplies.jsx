import { motion } from 'framer-motion'

const DEFAULT_REPLIES = [
  "Tell me more 😊",
  "That's so true!",
  "Haha really? 😂",
  "I miss you too 💜",
]

export default function QuickReplies({ replies = DEFAULT_REPLIES, onSelect }) {
  return (
    <div className="flex gap-2 px-4 pb-2 overflow-x-auto scrollbar-hide">
      {replies.map((reply, i) => (
        <motion.button
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(reply)}
          className="shrink-0 px-3 py-1.5 rounded-full border border-brand-border bg-brand-card text-brand-text text-xs font-semibold hover:border-brand-purple/60 transition-colors whitespace-nowrap"
        >
          {reply}
        </motion.button>
      ))}
    </div>
  )
}
