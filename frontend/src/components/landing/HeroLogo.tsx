import { useId } from 'react'
import { motion } from 'framer-motion'
import BrandGradient from '@components/common/BrandGradient'

type HeroLogoSize = 'md' | 'lg'

const SIZES: Record<HeroLogoSize, { bubble: number; dot: number; text: string }> = {
  md: { bubble: 56, dot: 7, text: 'text-3xl' },
  lg: { bubble: 100, dot: 11, text: 'text-6xl' },
}

/** The large animated logo: a speech bubble with typing dots above a shimmering wordmark. */
export default function HeroLogo({ size = 'md' }: { size?: HeroLogoSize }) {
  const gradientId = useId()
  const { bubble, dot, text } = SIZES[size]

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: bubble, height: bubble }}>
        <svg viewBox="0 0 100 100" fill="none" width={bubble} height={bubble} className="drop-shadow-[0_0_16px_rgb(var(--color-brand-purple)/0.6)]" aria-hidden="true">
          <BrandGradient id={gradientId} />
          <path d="M10 22 Q10 8 24 8 L76 8 Q90 8 90 22 L90 58 Q90 72 76 72 L56 72 L44 90 L44 72 L24 72 Q10 72 10 58 Z" fill={`url(#${gradientId})`} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center gap-1.5 pb-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -5, 0], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
              style={{ width: dot, height: dot }}
              className="rounded-full bg-white"
            />
          ))}
        </div>
      </div>

      <div className={`font-extrabold leading-none tracking-tight ${text}`}>
        <span className="text-white">my</span>
        <motion.span
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="bg-clip-text text-transparent"
          style={{
            // Wider than the brand gradient so there is something to slide: purple → pink → light pink → purple
            backgroundImage: 'linear-gradient(90deg, rgb(var(--color-brand-purple)), rgb(var(--color-brand-pink)), #ff6eb4, rgb(var(--color-brand-purple)))',
            backgroundSize: '300% auto',
          }}
        >
          igirlfriend
        </motion.span>
      </div>
    </div>
  )
}
