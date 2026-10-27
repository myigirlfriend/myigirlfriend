import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { fetchPriority } from '@utils/dom'

interface PhotoGalleryProps {
  /** Her main photo first, then the rest */
  images: string[]
  /** Her name, for the alt text */
  name: string
  /** Load the first photo eagerly, when the gallery is the page's main picture */
  priority?: boolean
  className?: string
}

/** A companion's photos: one large frame with arrows, and a row of thumbnails when there is more than one. */
export default function PhotoGallery({ images, name, priority = false, className = '' }: PhotoGalleryProps) {
  const [index, setIndex] = useState(0)
  if (images.length === 0) return null

  const count = images.length
  const go = (step: number) => setIndex((i) => (i + step + count) % count)

  return (
    <div className={className}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-brand-card">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.img
            key={images[index]}
            src={images[index]}
            alt={`${name}, photo ${index + 1} of ${count}`}
            width={800}
            height={1000}
            loading={priority && index === 0 ? 'eager' : 'lazy'}
            {...fetchPriority(priority && index === 0 ? 'high' : undefined)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        </AnimatePresence>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white transition-colors hover:bg-black/75"
            >
              <ChevronLeft size={22} strokeWidth={2.5} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white transition-colors hover:bg-black/75"
            >
              <ChevronRight size={22} strokeWidth={2.5} aria-hidden="true" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-sm font-bold tabular-nums text-white" aria-hidden="true">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {count > 1 && (
        <ul className="mt-3 grid grid-cols-5 gap-2" aria-label={`${name}'s photos`}>
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index || undefined}
                className={`block aspect-square w-full overflow-hidden rounded-2xl transition-opacity ${i === index ? 'ring-2 ring-brand-pink' : 'opacity-60 hover:opacity-100'}`}
              >
                <img src={src} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
