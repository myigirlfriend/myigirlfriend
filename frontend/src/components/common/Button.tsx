import type { ButtonHTMLAttributes } from 'react'
import Spinner from './Spinner'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Disables the button and shows a spinner */
  loading?: boolean
  /** Text shown next to the spinner while loading. Without it the spinner replaces the label. */
  loadingText?: string
  fullWidth?: boolean
}

// Written out in full: Tailwind only keeps classes it can find as whole strings in the source
const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'btn--primary',
  secondary: 'btn--secondary',
  ghost: 'btn--ghost',
  danger: 'btn--danger',
}

const SIZES: Record<ButtonSize, string> = {
  xs: 'btn--xs',
  sm: 'btn--sm',
  md: '',
  lg: 'btn--lg',
}

/** The classes of a button, for anything that must look like one (see ButtonLink). */
export const buttonClasses = (
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  fullWidth = false,
  className = '',
) => ['btn', VARIANTS[variant], SIZES[size], fullWidth && 'btn--block', className].filter(Boolean).join(' ')

/** The one button. Styles live in the `.btn` family in index.css. */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText,
  fullWidth = false,
  disabled = false,
  type = 'button',
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClasses(variant, size, fullWidth, className)}
      {...rest}
    >
      {loading ? (
        <>
          <Spinner size="sm" tone="onColor" />
          {loadingText ?? <span className="sr-only">Loading</span>}
        </>
      ) : children}
    </button>
  )
}
