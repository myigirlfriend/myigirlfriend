import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { usePersona } from '@hooks/usePersona'
import { PERSONAS } from '@config/personas'
import { SkeletonPersonaCard } from '@components/common/Skeleton'
import Avatar from '@components/common/Avatar'

export default function PersonaSelectPage() {
  const { selectPersona } = usePersona()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen bg-brand-dark px-4 py-12 pb-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-center mb-1 gradient-text">
          Choose your companion
        </h1>
        <p className="text-brand-muted text-center text-sm mb-10">
          Each one is unique. Find your vibe.
        </p>

        <div className="flex flex-col gap-4">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonPersonaCard key={i} />)
            : PERSONAS.map((p, i) => (
              <motion.button
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => selectPersona(p)}
                className="card flex items-center gap-4 text-left hover:border-brand-purple/60 hover:shadow-brand transition-all duration-200 w-full"
              >
                {/* ← Now uses Avatar with real image */}
                <Avatar persona={p} size="lg" />

                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white text-lg">{p.name}</div>
                  <div className="gradient-text text-sm font-semibold">{p.tagline}</div>
                  <div className="text-brand-muted text-xs mt-0.5 truncate">{p.description}</div>
                </div>
                <div className="text-brand-muted text-xl">›</div>
              </motion.button>
            ))
          }
        </div>
      </div>
    </div>
  )
}