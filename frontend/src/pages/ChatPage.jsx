import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Send, MoreVertical, Phone, Video } from 'lucide-react'
import { useChat } from '@hooks/useChat'
import { usePersonaStore } from '@store/index'
import MessageBubble from '@components/chat/MessageBubble'
import TypingIndicator from '@components/chat/TypingIndicator'
import UpsellModal from '@components/chat/UpsellModal'
import Timer from '@components/common/Timer'

export default function ChatPage() {
  const { conversationId } = useParams()
  const navigate = useNavigate()
  const { activePersona } = usePersonaStore()
  const { messages, isTyping, sendMessage } = useChat(conversationId)
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => { if (!activePersona) navigate('/personas') }, [activePersona])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping])

  const handleSend = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    sendMessage(input.trim())
    setInput('')
    inputRef.current?.focus()
  }

  if (!activePersona) return null

  return (
    <div className="flex flex-col h-screen bg-brand-dark">

      {/* ── Header ── */}
      <div
        className="shrink-0 border-b border-brand-border"
        style={{ background: 'linear-gradient(180deg, #111111 0%, #0a0a0a 100%)' }}
      >
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 pt-3 pb-2">
          <button
            onClick={() => navigate('/personas')}
            className="text-brand-muted hover:text-white transition-colors p-1 -ml-1"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Persona photo + info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Photo */}
            <div className="relative shrink-0">
              <div
                className="w-10 h-10 rounded-full overflow-hidden"
                style={{ border: `2px solid ${activePersona.accentColor || '#9B59B6'}` }}
              >
                {activePersona.image ? (
                  <img
                    src={activePersona.image}
                    alt={activePersona.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-white font-bold"
                    style={{ background: `linear-gradient(135deg, ${activePersona.gradientFrom}, ${activePersona.gradientTo})` }}
                  >
                    {activePersona.name[0]}
                  </div>
                )}
              </div>
              {/* Online dot */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-brand-dark" />
            </div>

            {/* Name + status */}
            <div className="min-w-0">
              <div className="font-bold text-white text-sm leading-tight">{activePersona.name}</div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400 font-medium">Online now</span>
              </div>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 shrink-0">
            <Timer />
          </div>
        </div>

        {/* Persona banner — full width photo strip */}
        {activePersona.image && (
          <div className="relative h-32 overflow-hidden">
            <img
              src={activePersona.image}
              alt={activePersona.name}
              className="w-full h-full object-cover object-top"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent" />
            {/* Text over image */}
            <div className="absolute bottom-3 left-4 right-4">
              <div className="font-extrabold text-white text-xl">{activePersona.name}</div>
              <div
                className="text-sm font-semibold"
                style={{
                  background: `linear-gradient(135deg, ${activePersona.gradientFrom}, ${activePersona.gradientTo})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {activePersona.tagline}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-6 space-y-3">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center pt-8"
          >
            {/* Persona photo in empty state */}
            <div
              className="w-20 h-20 rounded-full overflow-hidden mb-4 shadow-brand-lg"
              style={{ border: `3px solid ${activePersona.accentColor || '#9B59B6'}` }}
            >
              {activePersona.image ? (
                <img src={activePersona.image} alt={activePersona.name} className="w-full h-full object-cover" />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-white font-bold text-2xl"
                  style={{ background: `linear-gradient(135deg, ${activePersona.gradientFrom}, ${activePersona.gradientTo})` }}
                >
                  {activePersona.name[0]}
                </div>
              )}
            </div>
            <div className="font-bold text-white text-lg mb-1">{activePersona.name}</div>
            <p className="text-brand-muted text-sm italic max-w-xs">
              "{activePersona.previewMessage}"
            </p>
            <p className="text-brand-muted text-xs mt-3">
              Say something to start the conversation
            </p>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} persona={activePersona} />
          ))}
        </AnimatePresence>

        {isTyping && <TypingIndicator personaName={activePersona.name} />}
        <div ref={bottomRef} />
      </div>

      {/* ── Input bar ── */}
      <div className="shrink-0 border-t border-brand-border bg-brand-surface px-4 py-3 pb-20">
        <form onSubmit={handleSend} className="flex items-center gap-3">
          {/* Persona mini avatar */}
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
            {activePersona.image ? (
              <img src={activePersona.image} alt={activePersona.name} className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: `linear-gradient(135deg, ${activePersona.gradientFrom}, ${activePersona.gradientTo})` }}
              />
            )}
          </div>

          <input
            ref={inputRef}
            className="flex-1 bg-brand-card border border-brand-border rounded-2xl px-4 py-2.5 text-sm text-white placeholder-brand-muted focus:outline-none focus:border-brand-purple focus:shadow-brand transition-all"
            placeholder={`Message ${activePersona.name}…`}
            value={input}
            onChange={e => setInput(e.target.value)}
            autoFocus
          />

          <motion.button
            type="submit"
            disabled={!input.trim()}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white disabled:opacity-30 shrink-0 transition-opacity shadow-brand"
            style={{
              background: input.trim()
                ? `linear-gradient(135deg, ${activePersona.gradientFrom}, ${activePersona.gradientTo})`
                : '#2a2a2a'
            }}
          >
            <Send size={16} />
          </motion.button>
        </form>
      </div>

      <UpsellModal />
    </div>
  )
}