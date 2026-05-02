import { motion } from 'framer-motion'

/**
 * Button — primary | ghost | danger
 * All variants follow the brand theme.
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none'

  const variants = {
    primary: 'bg-brand-gradient text-white shadow-brand hover:opacity-90',
    ghost: 'border border-brand-border text-brand-text hover:border-brand-purple',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }

  const sizes = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-lg',
  }

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : children}
    </motion.button>
  )
}
