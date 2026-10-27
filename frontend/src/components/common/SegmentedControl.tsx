interface SegmentedControlProps<T extends string> {
  /** Accessible name of the group */
  label: string
  options: { id: T; label: string }[]
  value: T
  onChange: (value: T) => void
  className?: string
}

/** A row of mutually exclusive choices, such as list filters. */
export default function SegmentedControl<T extends string>({ label, options, value, onChange, className = '' }: SegmentedControlProps<T>) {
  return (
    <div role="group" aria-label={label} className={`flex gap-1 rounded-full bg-brand-surface p-1 ${className}`}>
      {options.map((option) => {
        const selected = option.id === value
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            aria-pressed={selected}
            className={`flex-1 rounded-full px-3 py-1.5 text-sm font-bold transition-colors duration-150 ${
              selected ? 'bg-brand-raised text-brand-text' : 'text-brand-muted hover:text-brand-text'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
