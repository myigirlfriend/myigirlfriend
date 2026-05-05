import { useState, useEffect } from 'react'
import { FREE_SESSION_MS } from '@utils/constants'
import { useSubStore } from '@store/index'
import { useChatStore } from '@store/index'

export default function Timer() {
  const { plan, setShowUpsell } = useSubStore()
  const { sessionStart } = useChatStore()
  const [remaining, setRemaining] = useState(null)

  useEffect(() => {
    if (plan !== 'free' || !sessionStart) return

    const tick = () => {
      const elapsed = Date.now() - sessionStart
      const left = Math.max(0, FREE_SESSION_MS - elapsed)
      setRemaining(left)
      if (left === 0) setShowUpsell(true)
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [sessionStart, plan])

  if (plan !== 'free' || remaining === null) return null

  const minutes = Math.floor(remaining / 60000)
  const seconds = Math.floor((remaining % 60000) / 1000)
  const isLow = remaining < 60000 // under 1 min

  return (
    <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${
      isLow
        ? 'text-red-400 border-red-400/30 bg-red-400/10'
        : 'text-brand-muted border-brand-border'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isLow ? 'bg-red-400 animate-pulse' : 'bg-brand-purple'}`} />
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  )
}
