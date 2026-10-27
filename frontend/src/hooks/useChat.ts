import { useCallback, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { FREE_MESSAGE_LIMIT, FREE_SESSION_MS } from '@config/limits'
import { chatApi } from '@services/api'
import { useChatStore, useSubStore } from '@store/index'
import { errorMessage } from '@utils/text'
import { readingPause, typingDuration, wait } from '@utils/typingDelay'
import type { Message } from '@/types'

export function useChat(conversationId: string | undefined) {
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

    chatApi.history(conversationId)
      .then((data) => setMessages(data.messages))
      .catch(() => toast.error('Could not load messages'))
  }, [conversationId, setActiveConversation, setMessages])

  const triggerUpsell = useCallback(() => {
    if (upsellFired.current || plan !== 'free') return
    upsellFired.current = true
    setShowUpsell(true)
  }, [plan, setShowUpsell])

  // Upsell timer — fires at FREE_SESSION_MS
  useEffect(() => {
    if (plan !== 'free' || !sessionStart || upsellFired.current) return

    const remaining = FREE_SESSION_MS - (Date.now() - sessionStart)
    if (remaining <= 0) { triggerUpsell(); return }

    const timer = setTimeout(triggerUpsell, remaining)
    return () => clearTimeout(timer)
  }, [sessionStart, plan, triggerUpsell])

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !conversationId) return

    // Check free limits
    if (plan === 'free' && messageCount >= FREE_MESSAGE_LIMIT) {
      setShowUpsell(true)
      return
    }

    // Optimistic user message
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      sender: 'user',
      content,
      created_at: new Date().toISOString(),
    }
    addMessage(userMessage)

    // Phase 1: a random pause before she starts typing. The request is already on its way meanwhile.
    const sentAt = Date.now()
    const pause = readingPause()
    let typingSince: number | null = null
    const startTyping = () => {
      if (typingSince !== null) return
      typingSince = Date.now()
      setTyping(true)
    }
    const pauseTimer = setTimeout(startTyping, pause)
    const stillHere = () => useChatStore.getState().activeConversationId === conversationId

    try {
      const data = await chatApi.send(conversationId, content)

      if (data.message) {
        // A fast server does not cut her pause short
        const pauseLeft = pause - (Date.now() - sentAt)
        if (pauseLeft > 0) await wait(pauseLeft)
        clearTimeout(pauseTimer)
        startTyping()

        // Phase 2: "typing…" for about as long as this reply takes to write. A slow server counts towards it.
        const typingLeft = typingDuration(data.message.content.length) - (Date.now() - (typingSince ?? Date.now()))
        if (typingLeft > 0) await wait(typingLeft)
      } else {
        clearTimeout(pauseTimer)
      }

      // The member may have opened another chat while she was "typing"
      if (!stillHere()) return
      setTyping(false)

      // There is no reply when the server blocked the message at the free limit
      if (data.message) addMessage(data.message)
      if (data.triggerUpsell) triggerUpsell()
    } catch (err) {
      clearTimeout(pauseTimer)
      setTyping(false)
      toast.error(errorMessage(err, 'Message failed. Try again.'))
    }
  }, [conversationId, messageCount, plan, addMessage, setTyping, setShowUpsell, triggerUpsell])

  return { messages, isTyping, messageCount, sendMessage }
}
