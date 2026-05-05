import { motion } from 'framer-motion'
import Avatar from '@components/common/Avatar'

export default function PersonaCard({ persona, onClick, index = 0 }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(persona)}
      className="card flex items-center gap-4 text-left hover:border-brand-purple/60 hover:shadow-brand transition-all duration-200 w-full"
    >
      <Avatar persona={persona} size="lg" />
      <div className="flex-1 min-w-0">
        <div className="font-bold text-white text-lg">{persona.name}</div>
        <div className="gradient-text text-sm font-bold">{persona.tagline}</div>
        <div className="text-brand-muted text-xs mt-0.5 truncate">{persona.description}</div>
      </div>
      <div className="text-brand-muted text-xl shrink-0">›</div>
    </motion.button>
  )
}
