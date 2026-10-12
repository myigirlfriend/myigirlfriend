import { useEffect, useState } from 'react'
import { FREE_SESSION_MS } from '@config/limits'
import { useChatStore, useSubStore } from '@store/index'

/** Countdown of the free session. Hidden for paying members. */
export default function Timer() {
  const { plan, setShowUpsell } = useSubStore()
  const sessionStart = useChatStore((s) => s.sessionStart)
  const [remaining, setRemaining] = useState<number | null>(null)

  useEffect(() => {
    if (plan !== 'free' || !sessionStart) return

    const tick = () => {
      const left = Math.max(0, FREE_SESSION_MS - (Date.now() - sessionStart))
      setRemaining(left)
      if (left === 0) setShowUpsell(true)
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [sessionStart, plan, setShowUpsell])

  if (plan !== 'free' || remaining === null) return null

  const minutes = Math.floor(remaining / 60000)
  const seconds = Math.floor((remaining % 60000) / 1000)
  const isLow = remaining < 60000 // under 1 min

  return (
    <div
      role="timer"
      aria-label="Free time left"
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold tabular-nums ${
        isLow ? 'border-red-400/30 bg-red-400/10 text-red-400' : 'border-brand-border text-brand-muted'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isLow ? 'animate-pulse bg-red-400' : 'bg-brand-purple'}`} />
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  )
}
