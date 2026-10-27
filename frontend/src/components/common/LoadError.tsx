import Button from './Button'

interface LoadErrorProps {
  title: string
  description?: string
  onRetry: () => void
}

/** Shown in place of content that failed to load. */
export default function LoadError({ title, description, onRetry }: LoadErrorProps) {
  return (
    <div className="surface p-6" role="alert">
      <p className="text-lg font-extrabold text-brand-text">{title}</p>
      {description && <p className="mt-1 text-base text-brand-muted">{description}</p>}
      <Button variant="secondary" size="sm" onClick={onRetry} className="mt-5">Try again</Button>
    </div>
  )
}
