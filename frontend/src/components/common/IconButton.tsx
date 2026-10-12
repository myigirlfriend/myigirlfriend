import type { ButtonHTMLAttributes } from 'react'

type IconButtonVariant = 'plain' | 'surface' | 'gradient'

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  /** What the button does. Read by screen readers and shown as a tooltip, since there is no visible text. */
  label: string
  variant?: IconButtonVariant
}

const VARIANTS: Record<IconButtonVariant, string> = {
  plain: 'rounded-lg p-1.5 text-brand-muted hover:bg-white/5 hover:text-white',
  surface: 'h-9 w-9 rounded-xl bg-white/[0.06] text-brand-muted hover:bg-white/10 hover:text-white',
  gradient: 'h-9 w-9 rounded-full bg-brand-gradient text-white shadow-brand hover:opacity-90',
}

/** A button that shows only an icon. */
export default function IconButton({
  label,
  variant = 'plain',
  type = 'button',
  className = '',
  children,
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={`inline-flex shrink-0 items-center justify-center transition-colors duration-150 disabled:opacity-40 ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
