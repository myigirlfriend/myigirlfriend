import { useId } from 'react'
import BrandGradient from './BrandGradient'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZES = {
  sm: { mark: 22, text: 'text-base' },
  md: { mark: 28, text: 'text-xl' },
  lg: { mark: 36, text: 'text-2xl' },
} as const

/** Speech-bubble mark and wordmark. The only place the purple → pink gradient appears. */
export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const gradientId = useId()
  const { mark, text } = SIZES[size]

  return (
    <span className={`flex items-center gap-2 ${className}`} translate="no">
      <svg viewBox="0 0 100 100" fill="none" width={mark} height={mark} aria-hidden="true">
        <BrandGradient id={gradientId} />
        <path d="M10 22 Q10 8 24 8 L76 8 Q90 8 90 22 L90 58 Q90 72 76 72 L56 72 L44 90 L44 72 L24 72 Q10 72 10 58 Z" fill={`url(#${gradientId})`} />
        {[35, 50, 65].map((cx) => <circle key={cx} cx={cx} cy="40" r="6" fill="white" />)}
      </svg>
      <span className={`font-black leading-none tracking-tight ${text}`}>
        <span className="text-brand-text">my</span>
        <span className="bg-brand-gradient bg-clip-text text-transparent">igirlfriend</span> {/* taste-skill-ignore: the brand wordmark */}
      </span>
    </span>
  )
}
