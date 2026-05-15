import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { usePersona } from '@hooks/usePersona'
import { PERSONAS } from '@config/personas'
import { SkeletonPersonaCard } from '@components/common/Skeleton'

export default function PersonaSelectPage() {
  const { selectPersona } = usePersona()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden" style={{
      background: 'radial-gradient(ellipse at top, #1a0a2e 0%, #0a0a0a 60%)',
    }}>

      {/* Ambient glow blobs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #9B59B6, transparent)' }} />
      <div className="absolute top-20 right-0 w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #E91E8C, transparent)' }} />

      {/* Header */}
      <div className="px-4 pt-12 pb-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400 font-semibold">5 companions online</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">
            Who do you want to{' '}
            <span style={{
              background: 'linear-gradient(135deg, #9B59B6, #E91E8C)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>talk to?</span>
          </h1>
          <p className="text-brand-muted text-sm">
           Each one is different. Find your connection.
          </p>
        </motion.div>
      </div>

      {/* Grid */}
      <div className="px-4 relative z-10">
        {loading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonPersonaCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {PERSONAS.map((p, i) => {
              const isLast = i === PERSONAS.length - 1
              const isOdd = PERSONAS.length % 2 !== 0

              return (
                <motion.button
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => selectPersona(p)}
                  className={`relative rounded-2xl overflow-hidden text-left group ${
                    isLast && isOdd ? 'col-span-2' : ''
                  }`}
                  style={{
                    height: isLast && isOdd ? '200px' : '260px',
                  }}
                >
                  {/* Photo */}
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div
                      className="absolute inset-0"
                      style={{ background: `linear-gradient(135deg, ${p.gradientFrom}, ${p.gradientTo})` }}
                    />
                  )}

                  {/* Gradient overlay — bottom to top */}
                  <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)' }}
                  />

                  {/* Gradient border glow */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      boxShadow: `inset 0 0 0 1.5px ${p.accentColor || '#9B59B6'}, 0 0 20px ${p.accentColor || '#9B59B6'}40`
                    }}
                  />

                  {/* Online badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-green-400 text-xs font-semibold">Online</span>
                  </div>

                  {/* Text content */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="font-extrabold text-white text-lg leading-tight">{p.name}</div>
                    <div
                      className="text-xs font-semibold mt-0.5"
                      style={{
                        background: `linear-gradient(135deg, ${p.gradientFrom}, ${p.gradientTo})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {p.tagline}
                    </div>

                    {/* Preview message */}
                    <div className="mt-2 bg-white/10 backdrop-blur-sm rounded-xl px-2.5 py-1.5">
                      <p className="text-white/80 text-xs leading-snug italic line-clamp-2">
                        "{p.previewMessage}"
                      </p>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        )}
      </div>

      {/* Bottom hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-6 pb-2 relative z-10"
      >
        <p className="text-brand-muted text-xs">
          Tap to start a conversation · Free to try
        </p>
      </motion.div>
    </div>
  )
}