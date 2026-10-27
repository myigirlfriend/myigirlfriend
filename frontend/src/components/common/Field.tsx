import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react'

interface FieldProps {
  /** The id of the control inside. The label points at it. */
  id: string
  label: string
  /** What the field accepts. Shown under it until there is an error. */
  help?: ReactNode
  error?: string
  /** Shows a character count against this maximum */
  max?: number
  count?: number
  /** Content shown at the right of the label row, such as a "Forgot password?" link */
  aside?: ReactNode
  className?: string
  /** One input, select or textarea */
  children: ReactNode
}

/**
 * Label above, control, then help or error below. The control is wired to its help and error
 * with aria-describedby, and marked aria-invalid while there is an error.
 */
export default function Field({ id, label, help, error, max, count, aside, className = '', children }: FieldProps) {
  const helpId = `${id}-help`
  const errorId = `${id}-error`
  const describedBy = error ? errorId : help ? helpId : undefined

  const control = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
      })
    : children

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="field__label">{label}</label>
        {max !== undefined && <span className="text-sm tabular-nums text-brand-muted">{count ?? 0}/{max}</span>}
        {aside}
      </div>
      {control}
      {error
        ? <p id={errorId} className="field__error" role="alert">{error}</p>
        : help && <p id={helpId} className="field__help">{help}</p>}
    </div>
  )
}
