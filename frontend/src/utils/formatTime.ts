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
