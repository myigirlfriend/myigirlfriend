/** Request bodies are untrusted: returns the value when it is a string, otherwise an empty string. */
export const text = (value: unknown): string => (typeof value === 'string' ? value : '')

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
