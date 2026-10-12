// How long a companion appears to take over a reply, so it reads like a person typing rather than
// an instant machine answer. Longer replies take longer.
const THINKING_MS = 900     // pause before she "starts typing"
const MS_PER_CHARACTER = 45 // typing speed, roughly 22 characters a second
const MIN_MS = 1500
const MAX_MS = 8000         // nobody should wait longer than this, however long the reply
const JITTER = 0.15         // ±15%, so two replies of the same length do not take identical time

/** Milliseconds between sending a message and seeing a reply of this length. */
export const typingDelay = (replyLength: number): number => {
  const base = THINKING_MS + replyLength * MS_PER_CHARACTER
  const varied = base * (1 + (Math.random() * 2 - 1) * JITTER)
  return Math.round(Math.min(MAX_MS, Math.max(MIN_MS, varied)))
}

export const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))
