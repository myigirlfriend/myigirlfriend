interface BrandGradientProps {
  /** Referenced by the shapes that use it: fill="url(#id)". Must be unique on the page. */
  id: string
}

/** The brand purple → pink gradient for use inside an <svg>. Reads the same tokens as the rest of the UI. */
export default function BrandGradient({ id }: BrandGradientProps) {
  return (
    <defs>
      <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: 'rgb(var(--color-brand-purple))' }} />
        <stop offset="100%" style={{ stopColor: 'rgb(var(--color-brand-pink))' }} />
      </linearGradient>
    </defs>
  )
}
