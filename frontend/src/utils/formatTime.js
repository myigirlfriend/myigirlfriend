export const formatTime = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export const formatDate = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric' })
}
