import { useId } from 'react'
import BrandGradient from './BrandGradient'

interface LogoProps {
  size?: 'sm' | 'md'
  className?: string
}

const SIZES = {
  sm: { mark: 22, text: 'text-base' },
  md: { mark: 28, text: 'text-lg' },
} as const

/** Speech-bubble mark and wordmark. */
export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const gradientId = useId()
  const { mark, text } = SIZES[size]

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 100 100" fill="none" width={mark} height={mark} aria-hidden="true">
        <BrandGradient id={gradientId} />
        <path d="M10 22 Q10 8 24 8 L76 8 Q90 8 90 22 L90 58 Q90 72 76 72 L56 72 L44 90 L44 72 L24 72 Q10 72 10 58 Z" fill={`url(#${gradientId})`} />
        <circle cx="35" cy="40" r="6" fill="white" opacity="0.9" />
        <circle cx="50" cy="40" r="6" fill="white" opacity="0.9" />
        <circle cx="65" cy="40" r="6" fill="white" opacity="0.9" />
      </svg>
      <span className={`font-extrabold leading-none ${text}`}>
        <span className="text-white">my</span>
        <span className="gradient-text">igirlfriend</span>
      </span>
    </div>
  )
}
