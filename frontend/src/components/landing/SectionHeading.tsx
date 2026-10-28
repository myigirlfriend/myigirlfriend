import type { ReactNode } from 'react'
import { Reveal, RevealItem } from '@components/common/Reveal'

interface SectionHeadingProps {
  id?: string
  title: ReactNode
  intro?: ReactNode
  /** Centred for the sections that introduce a whole row of content */
  align?: 'start' | 'center'
  className?: string
}

/** The heading and one-line introduction that open every landing page section. */
export default function SectionHeading({ id, title, intro, align = 'start', className = '' }: SectionHeadingProps) {
  const centred = align === 'center'
  return (
    <Reveal className={`${centred ? 'mx-auto text-center' : ''} max-w-3xl ${className}`}>
      <RevealItem as="h2" className="heading text-[clamp(30px,4.6vw,64px)]">
        <span id={id}>{title}</span>
      </RevealItem>
      {intro && (
        <RevealItem as="p" className={`mt-4 max-w-[52ch] text-lg leading-relaxed text-brand-muted ${centred ? 'mx-auto' : ''}`}>
          {intro}
        </RevealItem>
      )}
    </Reveal>
  )
}
