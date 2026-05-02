import { useCallback, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { useChatStore, useSubStore } from '@store/index'
import { FREE_MESSAGE_LIMIT, FREE_SESSION_MS } from '@config/personas'
import api from '@services/api'

export function useChat(conversationId) {
  const {
    messages, isTyping, messageCount, sessionStart,
    addMessage, setMessages, setTyping, setActiveConversation,
  } = useChatStore()

  const { plan, setShowUpsell } = useSubStore()
  const upsellFired = useRef(false)

  // Load history when conversation changes
  useEffect(() => {
    if (!conversationId) return
    setActiveConversation(conversationId)

    api.get(`/api/chat/history/${conversationId}`)
      .then((data) => setMessages(data.messages))
      .catch(() => toast.error('Could not load messages'))
  }, [conversationId])

  // Upsell timer — fires at FREE_SESSION_MS
  useEffect(() => {
    if (plan !== 'free' || !sessionStart || upsellFired.current) return

    const remaining = FREE_SESSION_MS - (Date.now() - sessionStart)
    if (remaining <= 0) { triggerUpsell(); return }

    const timer = setTimeout(triggerUpsell, remaining)
    return () => clearTimeout(timer)
  }, [sessionStart, plan])

  const triggerUpsell = useCallback(() => {
    if (upsellFired.current || plan !== 'free') return
    upsellFired.current = true
    setShowUpsell(true)
  }, [plan, setShowUpsell])

  const sendMessage = useCallback(async (content) => {
    if (!content.trim() || !conversationId) return

    // Check free limits
    if (plan === 'free') {
      if (messageCount >= FREE_MESSAGE_LIMIT) {
        setShowUpsell(true)
        return
      }
    }

    // Optimistic user message
    const userMsg = {
      id: `temp-${Date.now()}`,
      sender: 'user',
      content,
      created_at: new Date().toISOString(),
    }
    addMessage(userMsg)
    setTyping(true)

    try {
      const data = await api.post('/api/chat/send', {
        conversationId,
        content,
      })

      setTyping(false)
      addMessage(data.message) // AI reply

      // Check if backend returned upsell flag
      if (data.triggerUpsell) triggerUpsell()
    } catch (err) {
      setTyping(false)
      toast.error(err.message || 'Message failed. Try again.')
    }
  }, [conversationId, messageCount, plan, addMessage, setTyping, setShowUpsell, triggerUpsell])

  return { messages, isTyping, messageCount, sendMessage }
}
