import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, Send } from 'lucide-react'
import MessageBubble from '@components/chat/MessageBubble'
import TypingIndicator from '@components/chat/TypingIndicator'
import UpsellModal from '@components/chat/UpsellModal'
import Avatar from '@components/common/Avatar'
import IconButton from '@components/common/IconButton'
import Timer from '@components/common/Timer'
import { useChat } from '@hooks/useChat'
import { usePageTitle } from '@hooks/usePageTitle'
import { usePersonaStore } from '@store/index'

export default function ChatPage() {
  const { conversationId } = useParams()
  const navigate = useNavigate()
  const activePersona = usePersonaStore((s) => s.activePersona)
  const { messages, isTyping, sendMessage } = useChat(conversationId)
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  usePageTitle(activePersona ? `Chat with ${activePersona.name}` : 'Chat')

  useEffect(() => { if (!activePersona) navigate('/personas') }, [activePersona, navigate])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping])

  const handleSend = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    sendMessage(input.trim())
    setInput('')
    inputRef.current?.focus()
  }

  if (!activePersona) return null

  // Her own colours tint the banner tagline and the send button
  const personaGradient = `linear-gradient(135deg, ${activePersona.gradientFrom}, ${activePersona.gradientTo})`
  const canSend = input.trim().length > 0

  return (
    <div className="flex h-[100dvh] flex-col bg-brand-dark">
      {/* ── Header ── */}
      <header className="shrink-0 border-b border-brand-border bg-brand-surface">
        <div className="flex items-center gap-3 px-4 py-2.5">
          <IconButton label="Back to companions" onClick={() => navigate('/personas')} className="-ml-1.5">
            <ChevronLeft size={22} />
          </IconButton>

          <Avatar persona={activePersona} online />

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-bold leading-tight text-white">{activePersona.name}</h1>
            <p className="text-xs font-medium text-emerald-300">Online now</p>
          </div>

          <Timer />
        </div>

        {/* Persona banner — full width photo strip */}
        {activePersona.image && (
          <div className="relative h-32 overflow-hidden">
            <img src={activePersona.image} alt="" className="h-full w-full object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent" />
            <div className="absolute inset-x-4 bottom-3">
              <div className="text-xl font-extrabold text-white">{activePersona.name}</div>
              <div className="bg-clip-text text-sm font-semibold text-transparent" style={{ backgroundImage: personaGradient }}>
                {activePersona.tagline}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── Messages ── */}
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 pb-6">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center pt-8 text-center"
          >
            <Avatar persona={activePersona} size="xl" className="mb-4" />
            <div className="mb-1 text-lg font-bold text-white">{activePersona.name}</div>
            {activePersona.previewMessage && (
              <p className="max-w-xs text-sm italic text-brand-muted">"{activePersona.previewMessage}"</p>
            )}
            <p className="mt-3 text-xs text-brand-muted">Say something to start the conversation</p>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} persona={activePersona} />
          ))}
        </AnimatePresence>

        {isTyping && <TypingIndicator persona={activePersona} />}
        <div ref={bottomRef} />
      </div>

      {/* ── Input bar. The bottom padding keeps it clear of the tab bar. ── */}
      <div className="shrink-0 border-t border-brand-border bg-brand-surface px-4 pb-20 pt-3">
        <form onSubmit={handleSend} className="flex items-center gap-3">
          <label htmlFor="chat-message" className="sr-only">Message {activePersona.name}</label>
          <input
            id="chat-message"
            ref={inputRef}
            className="input input--compact flex-1 text-sm"
            placeholder={`Message ${activePersona.name}…`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete="off"
            autoFocus
          />

          <button
            type="submit"
            disabled={!canSend}
            aria-label="Send message"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-border text-white transition active:scale-95 disabled:opacity-40"
            style={canSend ? { backgroundImage: personaGradient } : undefined}
          >
            <Send size={16} aria-hidden="true" />
          </button>
        </form>
      </div>

      <UpsellModal />
    </div>
  )
}
