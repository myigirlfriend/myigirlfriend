import { useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useTransform, type PanInfo, type Variants } from 'framer-motion'
import { Heart, RotateCcw, X } from 'lucide-react'
import Avatar from '@components/common/Avatar'
import ButtonLink from '@components/common/ButtonLink'
import Bubble from '@components/chat/Bubble'
import { traitSentence } from '@utils/text'
import type { Persona } from '@/types'

type Choice = 'like' | 'pass'

// How far a card must be dragged before it counts as a choice
const SWIPE_DISTANCE = 110

// The card leaves towards the side that was chosen
const cardVariants: Variants = {
  exit: (choice: Choice) => ({
    x: choice === 'like' ? 480 : -480,
    rotate: choice === 'like' ? 18 : -18,
    opacity: 0,
    transition: { duration: 0.35 },
  }),
}

interface CardProps {
  persona: Persona
  onChoose: (choice: Choice) => void
}

/** The top card: drag it right to like, left to pass. */
function TopCard({ persona, onChoose }: CardProps) {
  const [dragging, setDragging] = useState(false)
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-220, 220], [-12, 12])
  const likeOpacity = useTransform(x, [20, SWIPE_DISTANCE], [0, 1])
  const passOpacity = useTransform(x, [-SWIPE_DISTANCE, -20], [1, 0])

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    setDragging(false)
    if (info.offset.x > SWIPE_DISTANCE) onChoose('like')
    else if (info.offset.x < -SWIPE_DISTANCE) onChoose('pass')
  }

  return (
    <motion.article
      className="absolute inset-0 cursor-grab touch-pan-y overflow-hidden rounded-[2rem] bg-brand-card active:cursor-grabbing"
      style={{ x, rotate }}
      drag="x"
      dragSnapToOrigin
      dragElastic={0.6}
      onDragStart={() => setDragging(true)}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, y: 16, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      variants={cardVariants}
      exit="exit"
      aria-label={`${persona.name}'s profile`}
    >
      {persona.image ? (
        <img src={persona.image} alt="" draggable={false} className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-top" />
      ) : (
        <div className="absolute inset-0" style={{ backgroundColor: persona.accentColor }} aria-hidden="true" />
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/90 via-black/50 to-transparent" /> {/* taste-skill-ignore: neutral scrim over a photo */}

      {dragging && <motion.span style={{ opacity: likeOpacity }} className="pointer-events-none absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-brand-rose px-4 py-2 text-base font-black text-white">
        <Heart size={18} fill="currentColor" aria-hidden="true" /> Like
      </motion.span>}
      {dragging && <motion.span style={{ opacity: passOpacity }} className="pointer-events-none absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-brand-raised px-4 py-2 text-base font-black text-white">
        <X size={18} strokeWidth={3} aria-hidden="true" /> Pass
      </motion.span>}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6">
        <p className="heading text-4xl text-white">{persona.name}</p>
        {persona.tagline && <p className="mt-1.5 text-base font-bold text-white/90">{traitSentence(persona.tagline)}</p>}
        {persona.description && <p className="mt-3 line-clamp-2 text-[15px] leading-snug text-white/85">{persona.description}</p>}
      </div>
    </motion.article>
  )
}

/**
 * A dating-app style stack of the live companions. Pass or like with the buttons or by dragging;
 * a like opens the match card with her first message and the way into the chat.
 */
export default function SwipeDeck({ personas }: { personas: Persona[] }) {
  const deck = personas.filter((p) => p.image).length > 0 ? personas.filter((p) => p.image) : personas
  const [index, setIndex] = useState(0)
  const [lastChoice, setLastChoice] = useState<Choice>('pass')
  const [match, setMatch] = useState<Persona | null>(null)

  if (deck.length === 0) return null

  const at = (offset: number) => deck[(index + offset) % deck.length]!
  const top = at(0)

  const choose = (choice: Choice) => {
    setLastChoice(choice)
    if (choice === 'like') setMatch(top)
    setIndex((i) => i + 1)
  }

  return (
    <div className="mx-auto w-full max-w-[400px]">
      <div className="relative aspect-[4/5]">
        {/* The next two cards peek out from behind */}
        {deck.length > 2 && (
          <div aria-hidden="true" className="absolute inset-0 translate-y-6 scale-[0.88] overflow-hidden rounded-[2rem] bg-brand-card opacity-60">
            {at(2).image && <img src={at(2).image!} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />}
          </div>
        )}
        {deck.length > 1 && (
          <div aria-hidden="true" className="absolute inset-0 translate-y-3 scale-[0.94] overflow-hidden rounded-[2rem] bg-brand-card opacity-80">
            {at(1).image && <img src={at(1).image!} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />}
          </div>
        )}

        <AnimatePresence custom={lastChoice} initial={false}>
          <TopCard key={`${top.id}-${index}`} persona={top} onChoose={choose} />
        </AnimatePresence>

        {/* The match */}
        <AnimatePresence>
          {match && (
            <motion.div
              key="match"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 rounded-[2rem] bg-brand-plum/95 p-6 text-center"
              role="dialog"
              aria-label={`You matched with ${match.name}`}
            >
              <p className="heading text-5xl text-white">It's a match</p>
              <Avatar persona={match} size="xl" className="!h-28 !w-28" />
              {match.previewMessage && (
                <Bubble tone="received" size="lg" className="justify-center [&>div]:max-w-full">{match.previewMessage}</Bubble>
              )}
              <div className="flex w-full flex-col gap-2">
                <ButtonLink to="/register" size="lg" fullWidth>Chat with {match.name}</ButtonLink>
                <button type="button" onClick={() => setMatch(null)} className="link link--muted py-2 text-base text-white/80">
                  Keep swiping
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Buttons for everyone who does not drag */}
      <div className="mt-6 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => choose('pass')}
          disabled={!!match}
          aria-label={`Pass on ${top.name}`}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-card text-brand-text transition-[transform,background-color] duration-150 hover:bg-brand-raised active:scale-90 disabled:opacity-40"
        >
          <X size={28} strokeWidth={2.75} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => { setIndex(0); setMatch(null) }}
          aria-label="Start the stack again"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-card text-brand-muted transition-colors duration-150 hover:text-brand-text"
        >
          <RotateCcw size={18} strokeWidth={2.5} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => choose('like')}
          disabled={!!match}
          aria-label={`Like ${top.name}`}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-rose text-white transition-[transform,background-color] duration-150 hover:bg-brand-pink active:scale-90 disabled:opacity-40"
        >
          <Heart size={28} fill="currentColor" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
