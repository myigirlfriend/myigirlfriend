import { useMemo } from 'react'
import { motion } from 'framer-motion'

const COUNT = 20

/** Slow drifting dots behind the hero and the closing call to action. */
export default function Particles() {
  // Positions are picked once, so a re-render does not make the dots jump
  const dots = useMemo(
    () => Array.from({ length: COUNT }, () => ({
      size: Math.random() * 4 + 1,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 4,
    })),
    []
  )

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {dots.map((dot, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full opacity-30 ${i % 2 === 0 ? 'bg-brand-purple' : 'bg-brand-pink'}`}
          style={{ width: dot.size, height: dot.size, left: dot.left, top: dot.top }}
          animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3], scale: [1, 1.5, 1] }}
          transition={{ duration: dot.duration, repeat: Infinity, delay: dot.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}
