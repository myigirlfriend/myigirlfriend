import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useChat } from '@hooks/useChat'
import { usePersonaStore } from '@store/index'
import MessageBubble from '@components/chat/MessageBubble'
import TypingIndicator from '@components/chat/TypingIndicator'
import UpsellModal from '@components/chat/UpsellModal'

export default function ChatPage() {
  const { conversationId } = useParams()
  const navigate = useNavigate()
  const { activePersona } = usePersonaStore()
  const { messages, isTyping, sendMessage } = useChat(conversationId)
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  // Redirect if no persona
  useEffect(() => { if (!activePersona) navigate('/personas') }, [activePersona])

  // Auto-scroll
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping])

  const handleSend = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    sendMessage(input.trim())
    setInput('')
  }

  if (!activePersona) return null

  return (
    <div className="flex flex-col h-screen bg-brand-dark">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-brand-border bg-brand-surface shrink-0">
        <button onClick={() => navigate('/personas')} className="text-brand-muted hover:text-white transition-colors mr-1">‹</button>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-brand"
          style={{ background: `linear-gradient(135deg, ${activePersona.gradientFrom}, ${activePersona.gradientTo})` }}
        >
          {activePersona.emoji}
        </div>
        <div>
          <div className="font-bold text-white text-sm">{activePersona.name}</div>
          <div className="text-xs gradient-text">{activePersona.tagline}</div>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-slow" />
          <span className="text-xs text-brand-muted">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-brand-muted text-sm mt-10">
            <div className="text-3xl mb-3">{activePersona.emoji}</div>
            <p className="italic">"{activePersona.previewMessage}"</p>
            <p className="mt-2 text-xs">Say something to start the conversation…</p>
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} persona={activePersona} />
        ))}
        {isTyping && <TypingIndicator personaName={activePersona.name} />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="px-4 py-3 border-t border-brand-border bg-brand-surface shrink-0 flex gap-2">
        <input
          className="input-field flex-1"
          placeholder={`Message ${activePersona.name}…`}
          value={input}
          onChange={e => setInput(e.target.value)}
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
