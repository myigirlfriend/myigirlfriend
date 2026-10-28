import { Check } from 'lucide-react'
import Avatar from '@components/common/Avatar'
import ButtonLink from '@components/common/ButtonLink'
import { Reveal, RevealItem } from '@components/common/Reveal'
import Bubble from '@components/chat/Bubble'
import TypingIndicator from '@components/chat/TypingIndicator'
import type { Persona } from '@/types'

const POINTS = [
  'Short, natural replies, never a wall of text',
  'Flirty, funny or caring, depending on who you choose',
  'Remembers what matters to you',
  'Tasteful, always',
]

/** A phone showing what a conversation looks like, built from the real chat components. */
export default function ChatPreview({ persona }: { persona: Persona | undefined }) {
  if (!persona) return null

  return (
    <section className="bg-brand-plum py-[clamp(88px,11vw,160px)]" aria-labelledby="preview-title">
      <div className="frame grid items-center gap-14 lg:grid-cols-2">
        <Reveal className="order-2 lg:order-1">
          {/* Sample conversation, written to show the format */}
          <RevealItem className="mx-auto w-full max-w-[380px]">
            <div data-ui className="rounded-[2.75rem] bg-brand-dark p-3 ring-1 ring-white/10">
            <div className="overflow-hidden rounded-[2.25rem] bg-brand-surface">
              <div className="flex items-center gap-3 bg-brand-dark px-5 py-4">
                <Avatar persona={persona} online />
                <div>
                  <div className="text-base font-extrabold text-brand-text">{persona.name}</div>
                  <div className="text-sm font-semibold text-emerald-300">Online</div>
                </div>
              </div>
              <div className="space-y-3 px-4 py-5">
                <Bubble tone="received" avatar={<Avatar persona={persona} size="sm" />}>{persona.previewMessage || 'Hey you. How was your day?'}</Bubble>
                <Bubble tone="sent">honestly? kind of rough</Bubble>
                <Bubble tone="received" avatar={<Avatar persona={persona} size="sm" />}>Then you came to the right place. Tell me everything.</Bubble>
                <Bubble tone="sent">my boss moved the deadline up again</Bubble>
                <TypingIndicator persona={persona} />
              </div>
            </div>
            </div>
          </RevealItem>
        </Reveal>

        <Reveal className="order-1 lg:order-2">
          <RevealItem as="h2" className="heading text-[clamp(30px,4.6vw,64px)] text-white">
            <span id="preview-title">Chats that go somewhere</span>
          </RevealItem>
          <RevealItem as="p" className="mt-5 max-w-[46ch] text-lg leading-relaxed text-white/90">
            No scripts and no canned answers. She asks about your day, teases you a little and keeps the chat going.
          </RevealItem>
          <RevealItem as="div" className="mt-8">
            <ul className="space-y-3">
              {POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3 text-lg text-white">
                  <Check size={22} strokeWidth={3} className="mt-0.5 shrink-0 text-brand-blush" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </RevealItem>
          <RevealItem className="mt-10">
            <ButtonLink to="/register" size="lg">Start chatting free</ButtonLink>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  )
}
