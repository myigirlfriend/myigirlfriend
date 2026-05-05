import { useNavigate } from 'react-router-dom'
import Avatar from '@components/common/Avatar'
import Timer from '@components/common/Timer'

export default function PersonaHeader({ persona }) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-brand-border bg-brand-surface shrink-0">
      <button
        onClick={() => navigate('/personas')}
        className="text-brand-muted hover:text-white transition-colors text-xl leading-none mr-1"
      >
        ‹
      </button>

      <Avatar persona={persona} size="md" />

      <div className="flex-1 min-w-0">
        <div className="font-bold text-white text-sm">{persona.name}</div>
        <div className="gradient-text text-xs font-bold">{persona.tagline}</div>
      </div>

      <Timer />

      <div className="flex items-center gap-1.5 ml-2">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-slow" />
        <span className="text-xs text-brand-muted">Online</span>
      </div>
    </div>
  )
}
