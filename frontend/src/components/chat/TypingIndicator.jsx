import { motion, AnimatePresence } from 'framer-motion'

export default function TypingIndicator({ personaName }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="flex items-end gap-2"
      >
        <div className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center text-xs font-bold text-white shrink-0">
          {personaName?.[0] ?? '?'}
        </div>
        <div className="bg-brand-card border border-brand-border rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
          <span className="typing-dot w-2 h-2 rounded-full bg-brand-purple" />
          <span className="typing-dot w-2 h-2 rounded-full bg-brand-purple" />
          <span className="typing-dot w-2 h-2 rounded-full bg-brand-purple" />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
