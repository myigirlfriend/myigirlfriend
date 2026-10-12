import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, type LucideIcon } from 'lucide-react'
import IconTile from '@components/common/IconTile'
import Logo from '@components/common/Logo'

interface AuthLayoutProps {
  title: string
  subtitle?: ReactNode
  /** Shown above the title. Without it the logo is shown. */
  icon?: LucideIcon
  /** Adds a back link at the top of the page */
  back?: { to: string; label: string }
  children: ReactNode
}

/** Centred column shared by sign in, sign up and the password screens. */
export default function AuthLayout({ title, subtitle, icon, back, children }: AuthLayoutProps) {
  return (
    <div className="page flex flex-col px-4">
      {back && (
        <div className="pt-6">
          <Link
            to={back.to}
            className="inline-flex items-center gap-1 rounded-lg text-sm font-semibold text-brand-muted transition-colors hover:text-white"
          >
            <ChevronLeft size={18} aria-hidden="true" />
            {back.label}
          </Link>
        </div>
      )}

      <div className="flex flex-1 items-center justify-center py-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center">
            {icon ? <IconTile icon={icon} size="lg" className="mb-6" /> : <Logo className="mb-6" />}
            <h1 className="text-2xl font-extrabold text-white">{title}</h1>
            {subtitle && <p className="mt-2 text-sm leading-relaxed text-brand-muted">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
