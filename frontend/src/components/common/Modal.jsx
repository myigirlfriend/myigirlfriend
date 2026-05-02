import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  // Close on Escape
  useEffect(() => {
    const handle = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [onClose])

  const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-2xl' }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`relative w-full ${sizes[size]} bg-brand-card border border-brand-border rounded-2xl p-6 shadow-brand-lg`}
          >
            {title && (
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold gradient-text">{title}</h2>
                {onClose && (
                  <button
                    onClick={onClose}
                    className="text-brand-muted hover:text-white transition-colors text-xl leading-none"
                  >
                    ×
                  </button>
                )}
              </div>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
