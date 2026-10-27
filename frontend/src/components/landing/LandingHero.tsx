import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ButtonLink from '@components/common/ButtonLink'
import { FREE_MESSAGE_LIMIT } from '@config/limits'
import heroImage from '@/assets/landing/hero-night.webp'
import type { Persona } from '@/types'
import SwipeDeck from './SwipeDeck'

const EASE = [0.16, 1, 0.3, 1] as const
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: EASE },
})

/** Full-bleed photo of someone smiling at a message, the promise on the left and the swipe deck on the right. */
export default function LandingHero({ personas }: { personas: Persona[] }) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-dark" aria-labelledby="hero-title">
      <motion.img
        src={heroImage}
        alt=""
        width={1600}
        height={992}
        fetchPriority="high"
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: EASE }}
        className="absolute inset-0 -z-10 h-full w-full object-cover object-[30%_30%]"
      />
      {/* Neutral scrims so the words read on the photo */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-dark via-brand-dark/85 to-brand-dark/30" /> {/* taste-skill-ignore: neutral scrim over a photo */}
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-brand-dark to-transparent" /> {/* taste-skill-ignore: neutral scrim over a photo */}

      <div className="frame grid min-h-[calc(100dvh-4.5rem)] items-center gap-12 py-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:py-20">
        <div className="max-w-2xl">
          <motion.h1 {...rise(0.1)} id="hero-title" className="display text-[clamp(44px,12vw,64px)] md:text-[clamp(64px,7vw,108px)] text-brand-text">
            Meet your AI girlfriend.
          </motion.h1>
          <motion.p {...rise(0.25)} className="mt-6 max-w-[34ch] text-xl leading-relaxed text-brand-text/90">
            She always texts back. Swipe, match and start chatting in seconds. Your first {FREE_MESSAGE_LIMIT} messages are free.
          </motion.p>
          <motion.div {...rise(0.4)} className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <ButtonLink to="/register" size="lg">Find your match</ButtonLink>
            <Link to="/login" className="link text-lg">I have an account</Link>
          </motion.div>
        </div>

        <motion.div {...rise(0.35)}>
          <SwipeDeck personas={personas} />
        </motion.div>
      </div>
    </section>
  )
}
