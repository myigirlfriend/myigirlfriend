// How a companion's reply is paced, so it feels like a person texting rather than a machine answering.
// Two phases, as with a real person: a pause before she starts typing (she has not picked up her phone yet),
// then "typing…" for about as long as her reply would take to write.

/** The longest she ever waits before starting to type. */
export const MAX_PAUSE_MS = 4500

/**
 * Milliseconds before "typing…" appears. Random each time:
 * often she starts straight away, usually within a couple of seconds, sometimes after a few.
 */
export const readingPause = (random: () => number = Math.random): number => {
  const roll = random()
  const within = (min: number, max: number) => Math.round(min + random() * (max - min))
  if (roll < 0.3) return within(0, 400)       // 30%: replies right away
  if (roll < 0.75) return within(800, 2200)   // 45%: a moment to read
  return within(2500, MAX_PAUSE_MS)           // 25%: was busy for a few seconds
}

const MS_PER_CHARACTER = 38 // a fast thumb typist, about 26 characters a second
const MIN_TYPING_MS = 1200  // even "lol" shows the dots long enough to notice
const MAX_TYPING_MS = 6000  // long replies cap here so nobody gets bored waiting
const JITTER = 0.2          // ±20%, so two replies of the same length do not take identical time

/** Milliseconds "typing…" stays on for a reply of this many characters. */
export const typingDuration = (replyLength: number, random: () => number = Math.random): number => {
  const base = 500 + replyLength * MS_PER_CHARACTER
  const varied = base * (1 + (random() * 2 - 1) * JITTER)
  return Math.round(Math.min(MAX_TYPING_MS, Math.max(MIN_TYPING_MS, varied)))
}

export const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))
