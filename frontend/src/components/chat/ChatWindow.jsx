import { useState, useRef, useEffect } from 'react'
import { useChat } from '@hooks/useChat'
import { usePersonaStore } from '@store/index'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import UpsellModal from './UpsellModal'
import PersonaHeader from './PersonaHeader'
import QuickReplies from './QuickReplies'

export default function ChatWindow({ conversationId }) {
  const { activePersona } = usePersonaStore()
  const { messages, isTyping, sendMessage } = useChat(conversationId)
  const [input, setInput] = useState('')
  const [showQuickReplies, setShowQuickReplies] = useState(true)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Hide quick replies once user has sent 3+ messages
  useEffect(() => {
    const userMsgs = messages.filter(m => m.sender === 'user').length
    if (userMsgs >= 3) setShowQuickReplies(false)
  }, [messages])

  const handleSend = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    sendMessage(input.trim())
    setInput('')
  }

  const handleQuickReply = (text) => {
    sendMessage(text)
    setShowQuickReplies(false)
  }

  if (!activePersona) return null

  return (
    <div className="flex flex-col h-screen bg-brand-dark">
      <PersonaHeader persona={activePersona} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-brand-muted text-sm mt-16">
            <div className="text-4xl mb-3">{activePersona.emoji}</div>
            <p className="italic text-brand-text/70">"{activePersona.previewMessage}"</p>
            <p className="mt-2 text-xs">Say something to start the conversation…</p>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} persona={activePersona} />
        ))}

        {isTyping && <TypingIndicator personaName={activePersona.name} />}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      {showQuickReplies && messages.length > 0 && !isTyping && (
        <QuickReplies onSelect={handleQuickReply} />
      )}

      {/* Input bar */}
      <form
        onSubmit={handleSend}
        className="px-4 py-3 border-t border-brand-border bg-brand-surface shrink-0 flex gap-2"
      >
        <input
          className="input-field flex-1"
          placeholder={`Message ${activePersona.name}…`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="w-11 h-11 rounded-xl bg-brand-gradient flex items-center justify-center text-white disabled:opacity-40 shadow-brand shrink-0 transition-opacity"
        >
          ➤
        </button>
      </form>

      <UpsellModal />
    </div>
  )
}
