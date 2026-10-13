export const startOfToday = (): Date => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

/** Whole minutes between two ISO timestamps. */
export const minutesBetween = (fromIso: string, toIso: string): number =>
  Math.floor((new Date(toIso).getTime() - new Date(fromIso).getTime()) / 60000)

/** Parses an ISO timestamp from a request. Returns null when it is missing or not a valid date. */
export const parseInstant = (value: unknown): Date | null => {
  if (typeof value !== 'string' || !value) return null
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

interface Span {
  clock_in: string
  clock_out: string | null
}

/**
 * Whole minutes the sessions spent inside [from, to]. A session that is still running counts up to now
 * when `includeRunning` is set and is skipped otherwise. Seconds are summed before rounding down,
 * so several short sessions are not each rounded away.
 */
export const minutesInside = (sessions: Span[], from: Date, to: Date, includeRunning: boolean): number => {
  const now = Date.now()
  const ms = sessions.reduce((sum, s) => {
    if (!s.clock_out && !includeRunning) return sum
    const start = Math.max(new Date(s.clock_in).getTime(), from.getTime())
    const end = Math.min(s.clock_out ? new Date(s.clock_out).getTime() : now, to.getTime())
    return end > start ? sum + (end - start) : sum
  }, 0)
  return Math.floor(ms / 60000)
}
