export const formatTime = (iso: string | null | undefined): string => {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export const formatDate = (iso: string | null | undefined): string => {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric' })
}

// 135 -> "2h 15m"
export const formatDuration = (minutes: number | null | undefined): string => {
  const total = Math.max(0, Math.floor(minutes || 0))
  const h = Math.floor(total / 60)
  const m = total % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

// 3725 -> "01:02:05"
export const formatClock = (seconds: number): string => {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor((seconds % 3600) / 60))}:${pad(seconds % 60)}`
}

// "just now", "12 min ago", "3 hr ago", then a date
export const timeAgo = (iso: string | null | undefined): string => {
  if (!iso) return ''
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  if (mins < 60 * 24) return `${Math.floor(mins / 60)} hr ago`
  return formatDate(iso)
}

/** Today as YYYY-MM-DD in the viewer's own time zone (toISOString would give the UTC date). */
export const localDateISO = (d: Date = new Date()): string => {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** Midnight at the start of today, local time. */
export const startOfLocalDay = (d: Date = new Date()): Date => {
  const start = new Date(d)
  start.setHours(0, 0, 0, 0)
  return start
}

/** Start and end of a YYYY-MM-DD day in the viewer's time zone. */
export const localDayBounds = (date: string): { from: Date; to: Date } => {
  const [y, m, d] = date.split('-').map(Number)
  const from = new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1)
  const to = new Date(from)
  to.setDate(to.getDate() + 1)
  return { from, to }
}
