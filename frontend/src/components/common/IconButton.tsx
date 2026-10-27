import type { ButtonHTMLAttributes } from 'react'

type IconButtonVariant = 'plain' | 'surface' | 'accent'

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  /** What the button does. Read by screen readers and shown as a tooltip, since there is no visible text. */
  label: string
  variant?: IconButtonVariant
}

const VARIANTS: Record<IconButtonVariant, string> = {
  plain: 'h-10 w-10 rounded-full text-brand-muted hover:bg-white/[0.06] hover:text-brand-text',
  surface: 'h-10 w-10 rounded-full bg-brand-card text-brand-muted hover:bg-brand-raised hover:text-brand-text',
  accent: 'h-10 w-10 rounded-full bg-brand-rose text-white hover:bg-brand-pink',
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
      className={`inline-flex shrink-0 items-center justify-center transition-[background-color,color,transform] duration-150 active:scale-95 disabled:opacity-40 ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
