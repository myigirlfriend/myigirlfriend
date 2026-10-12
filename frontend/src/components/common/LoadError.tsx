import Button from './Button'

interface LoadErrorProps {
  title: string
  description?: string
  onRetry: () => void
}

/** Shown in place of content that failed to load. */
export default function LoadError({ title, description, onRetry }: LoadErrorProps) {
  return (
    <div className="rounded-2xl border border-brand-border p-6" role="alert">
      <p className="font-bold text-white">{title}</p>
      {description && <p className="mt-1 text-sm text-brand-muted">{description}</p>}
      <Button variant="ghost" size="sm" onClick={onRetry} className="mt-4">Try again</Button>
    </div>
  )
}
