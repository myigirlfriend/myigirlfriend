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
