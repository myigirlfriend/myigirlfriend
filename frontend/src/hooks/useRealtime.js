import { useEffect, useRef } from 'react'
import { supabase } from '@services/supabaseClient'

/**
 * useRealtime
 * Subscribes to new messages on a conversation in real time.
 * Used by the operator dashboard to get live updates.
 *
 * @param {string} conversationId
 * @param {function} onNewMessage - called with the new message row
 */
export function useRealtime(conversationId, onNewMessage) {
  const channelRef = useRef(null)

  useEffect(() => {
    if (!conversationId) return

    // Clean up any previous subscription
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
    }

    channelRef.current = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          if (payload.new) onNewMessage(payload.new)
        }
      )
      .subscribe()

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [conversationId])
}
