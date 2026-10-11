export const formatTime = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export const formatDate = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric' })
}


// 135 -> "2h 15m"
export const formatDuration = (minutes) => {
  const total = Math.max(0, Math.floor(minutes || 0))
  const h = Math.floor(total / 60)
  const m = total % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

// "just now", "12 min ago", "3 hr ago", then a date
export const timeAgo = (iso) => {
  if (!iso) return ''
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  if (mins < 60 * 24) return `${Math.floor(mins / 60)} hr ago`
  return formatDate(iso)
}
