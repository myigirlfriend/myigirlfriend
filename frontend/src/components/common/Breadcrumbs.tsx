import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

interface Crumb {
  name: string
  /** Omitted for the current page */
  to?: string
}

/** Where this page sits in the site. Matches the BreadcrumbList structured data. */
export default function Breadcrumbs({ items, className = '' }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-[15px] font-semibold text-brand-muted">
        {items.map((item, i) => (
          <li key={item.name} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={15} aria-hidden="true" className="shrink-0" />}
            {item.to
              ? <Link to={item.to} className="link link--muted">{item.name}</Link>
              : <span aria-current="page" className="text-brand-text">{item.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}
