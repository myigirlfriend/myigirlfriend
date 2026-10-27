import { useMemo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, type LucideIcon } from 'lucide-react'
import Bubble from '@components/chat/Bubble'
import IconTile from '@components/common/IconTile'
import Logo from '@components/common/Logo'
import { PERSONAS, shufflePersonas } from '@config/personas'
import { usePageTitle } from '@hooks/usePageTitle'

interface AuthLayoutProps {
  title: string
  /** Browser tab title, when the on-page title is a greeting rather than the page's name */
  tabTitle?: string
  subtitle?: ReactNode
  /** Shown above the title, for status screens such as "Check your email" */
  icon?: LucideIcon
  /** Adds a back link at the top of the page */
  back?: { to: string; label: string }
  /** Shows a companion's portrait beside the form on wide screens. Off for the team sign in. */
  portrait?: boolean
  children: ReactNode
}

/** Shared by sign in, sign up, the password screens and the team sign in. */
export default function AuthLayout({ title, tabTitle, subtitle, icon, back, portrait = true, children }: AuthLayoutProps) {
  usePageTitle(tabTitle ?? title)
  // The same companion for the whole visit, so moving between sign in and sign up feels continuous
  const persona = useMemo(() => shufflePersonas(PERSONAS).find((p) => p.image), [])

  return (
    <div className={`page grid ${portrait ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]' : ''}`}>
      {portrait && persona?.image && (
        <aside className="relative hidden overflow-hidden bg-brand-plum lg:block" aria-hidden="true">
          <img src={persona.image} alt="" className="absolute inset-0 h-full w-full object-cover object-top" />
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/85 to-transparent" /> {/* taste-skill-ignore: neutral scrim over a photo */}
          <div className="absolute inset-x-10 bottom-10 space-y-3">
            <Bubble tone="received" size="lg">{persona.previewMessage}</Bubble>
            <p className="pl-2 text-[15px] font-bold text-white/85">{persona.name}, waiting for your reply</p>
          </div>
        </aside>
      )}

      <div className="flex min-h-[100dvh] flex-col px-[var(--gutter)]">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link to="/" className="rounded-full" aria-label="myigirlfriend home">
            <Logo />
          </Link>
          {back && (
            <Link to={back.to} className="link link--muted inline-flex items-center gap-1 text-[15px]">
              <ChevronLeft size={18} aria-hidden="true" />
              {back.label}
            </Link>
          )}
        </div>

        <main className="flex flex-1 items-center justify-center pb-16 pt-6">
          <div className="w-full max-w-[26rem]">
            <div className="mb-8">
              {icon && <IconTile icon={icon} size="lg" className="mb-6" />}
              <h1 className="heading text-4xl sm:text-5xl">{title}</h1>
              {subtitle && <p className="mt-3 text-[17px] leading-relaxed text-brand-muted">{subtitle}</p>}
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
