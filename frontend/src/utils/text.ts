/** "Jane Doe" -> "JD". Falls back to "?" when there is no name. */
export const initials = (name: string | null | undefined): string =>
  name?.trim()
    ? name.trim().split(/\s+/).map((part) => part[0]).join('').toUpperCase().slice(0, 2)
    : '?'

/** 1 -> "1 message", 3 -> "3 messages" */
export const plural = (count: number, word: string): string => `${count} ${word}${count === 1 ? '' : 's'}`

/** The message to show for something caught in a `catch`. */
export const errorMessage = (error: unknown, fallback = 'Something went wrong'): string =>
  error instanceof Error && error.message ? error.message : fallback

/** "Playful · Flirty · Bold" -> ["Playful", "Flirty", "Bold"]. Accepts dots, commas, slashes or bars between traits. */
export const traits = (tagline: string | null | undefined): string[] =>
  (tagline ?? '').split(/\s*[·•,/|]\s*/).map((t) => t.trim()).filter(Boolean)

/** ["Playful", "Flirty", "Bold"] -> "Playful, flirty and bold" */
export const traitSentence = (tagline: string | null | undefined): string => {
  const list = traits(tagline).map((t, i) => (i === 0 ? t : t.toLowerCase()))
  if (list.length < 2) return list[0] ?? ''
  return `${list.slice(0, -1).join(', ')} and ${list[list.length - 1]}`
}

const EMOJI_ONLY = /^(?:\p{Extended_Pictographic}|\p{Emoji_Modifier}|\p{Regional_Indicator}|‍|️|⃣|\s)+$/u

/**
 * True for a message that is only 1 to `max` emoji, like "😂" or "❤️🔥". Chat apps show these large, without a bubble.
 * Compound emoji (👨‍👩‍👧, 👍🏽, flags) count as one.
 */
export const isEmojiOnly = (text: string, max = 3): boolean => {
  const trimmed = text.trim()
  if (!trimmed || !EMOJI_ONLY.test(trimmed) || !/\p{Extended_Pictographic}|\p{Regional_Indicator}/u.test(trimmed)) return false
  const graphemes = [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(trimmed.replace(/\s+/g, ''))]
  return graphemes.length <= max
}
