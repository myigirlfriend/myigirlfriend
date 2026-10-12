import { useEffect, type ReactNode } from 'react'
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
  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={`fixed inset-0 z-50 flex justify-center p-4 ${position === 'sheet' ? 'items-end sm:items-center' : 'items-center'}`}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title ?? label}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`relative w-full ${SIZES[size]} rounded-3xl border border-brand-purple/30 bg-brand-surface p-6 shadow-brand-lg`}
          >
            <IconButton label="Close" onClick={onClose} className="absolute right-3 top-3">
              <X size={18} />
            </IconButton>
            {title && <h2 className="mb-2 pr-8 text-lg font-extrabold text-white">{title}</h2>}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
