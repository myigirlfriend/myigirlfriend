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
