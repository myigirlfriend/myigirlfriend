/**
 * Group messages by date for chat display
 * Returns array of { date, messages }
 */
export const groupMessagesByDate = (messages) => {
  const groups = {}
  messages.forEach((msg) => {
    const date = new Date(msg.created_at).toLocaleDateString([], {
      weekday: 'long', month: 'short', day: 'numeric',
    })
    if (!groups[date]) groups[date] = []
    groups[date].push(msg)
  })
  return Object.entries(groups).map(([date, messages]) => ({ date, messages }))
}

/**
 * Check if a message is from the AI or operator (not user)
 */
export const isAIMessage = (msg) => msg.sender === 'ai' || msg.sender === 'operator'

/**
 * Generate a temporary ID for optimistic UI updates
 */
export const tempId = () => `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`
