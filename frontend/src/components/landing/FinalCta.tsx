import ButtonLink from '@components/common/ButtonLink'
import { Reveal, RevealItem } from '@components/common/Reveal'
import { FREE_MESSAGE_LIMIT } from '@config/limits'
import bedsideImage from '@/assets/landing/cta-bedside.webp'

/** The closing call to action over a phone lighting up on a bedside table. */
export default function FinalCta() {
  return (
    <section className="relative isolate overflow-hidden" aria-labelledby="final-title">
      <img src={bedsideImage} alt="" width={1600} height={896} loading="lazy" className="absolute inset-0 -z-10 h-full w-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-dark/95 via-brand-dark/75 to-brand-dark/20" /> {/* taste-skill-ignore: neutral scrim over a photo */}

      <Reveal className="frame flex min-h-[70svh] flex-col justify-center py-24">
        <RevealItem as="h2" className="heading max-w-[14ch] text-[clamp(40px,5.6vw,80px)]">
          <span id="final-title">Your phone could light up tonight.</span>
        </RevealItem>
        <RevealItem as="p" className="mt-5 max-w-[40ch] text-xl leading-relaxed text-brand-text/90">
          Find your match and send the first message. The first {FREE_MESSAGE_LIMIT} are free.
        </RevealItem>
        <RevealItem className="mt-9">
          <ButtonLink to="/register" size="lg">Find your match</ButtonLink>
        </RevealItem>
      </Reveal>
    </section>
  )
}
