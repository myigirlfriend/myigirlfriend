import { useEffect, useId, useRef, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import IconButton from './IconButton'

type ModalSize = 'sm' | 'md' | 'lg'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  /** Shown as the heading. Pass `label` instead when the content brings its own heading. */
  title?: string
  /** Accessible name when there is no `title` */
  label?: string
  size?: ModalSize
  /** `sheet` slides up from the bottom on phones and is centred on larger screens */
  position?: 'center' | 'sheet'
  children: ReactNode
}

const SIZES: Record<ModalSize, string> = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' }

export default function Modal({ isOpen, onClose, title, label, size = 'md', position = 'center', children }: ModalProps) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on Escape, and move focus into the dialog when it opens
  useEffect(() => {
    if (!isOpen) return
    const previous = document.activeElement as HTMLElement | null
    panelRef.current?.focus()
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handle)
    return () => {
      document.removeEventListener('keydown', handle)
      previous?.focus?.()
    }
  }, [isOpen, onClose])

  const sheet = position === 'sheet'

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={`fixed inset-0 z-50 flex justify-center ${sheet ? 'items-end sm:items-center sm:p-4' : 'items-center p-4'}`}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75"
          />

          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-label={title ? undefined : label}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className={/* taste-skill-ignore: a real overlay */ `relative w-full overscroll-contain bg-brand-surface p-6 shadow-2xl shadow-black/60 focus:outline-none ${SIZES[size]} ${
              sheet ? 'rounded-t-[2rem] pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:rounded-[2rem]' : 'rounded-[2rem]'
            }`}
          >
            <IconButton label="Close" onClick={onClose} className="absolute right-3 top-3">
              <X size={20} />
            </IconButton>
            {title && <h2 id={titleId} className="heading mb-3 pr-10 text-2xl">{title}</h2>}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
