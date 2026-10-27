import { Plus } from 'lucide-react'
import { FAQ } from '@/content/faq'
import SectionHeading from './SectionHeading'

/** Frequently asked questions as an accordion. The first one starts open. */
export default function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-20 bg-brand-surface py-[clamp(88px,11vw,160px)]">
      <div className="frame grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <SectionHeading title="Questions? Answered." intro="Everything people ask before their first message." />

        <div className="space-y-2">
          {FAQ.map(({ q, a }, i) => (
            <details key={q} open={i === 0} className="group rounded-3xl bg-brand-card">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-3xl px-6 py-5 text-lg font-extrabold text-brand-text [&::-webkit-details-marker]:hidden">
                {q}
                <Plus size={22} strokeWidth={2.5} className="shrink-0 text-brand-blush transition-transform duration-200 group-open:rotate-45" aria-hidden="true" />
              </summary>
              <p className="max-w-[62ch] px-6 pb-6 text-[17px] leading-relaxed text-brand-muted">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
