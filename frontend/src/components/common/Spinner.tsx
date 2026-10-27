type SpinnerSize = 'sm' | 'md' | 'lg'

interface SpinnerProps {
  size?: SpinnerSize
  /** `onColor` is for use on a filled button; `brand` for use on the page */
  tone?: 'brand' | 'onColor'
  className?: string
}

const SIZES: Record<SpinnerSize, string> = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' }

export default function Spinner({ size = 'md', tone = 'brand', className = '' }: SpinnerProps) {
  const colors = tone === 'brand' ? 'border-white/10 border-t-brand-pink' : 'border-white/30 border-t-white'
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 animate-spin rounded-full border-2 ${colors} ${SIZES[size]} ${className}`}
    />
  )
}
