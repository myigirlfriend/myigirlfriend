import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp, ChevronLeft } from 'lucide-react'
import MessageBubble from '@components/chat/MessageBubble'
import TypingIndicator from '@components/chat/TypingIndicator'
import UpsellModal from '@components/chat/UpsellModal'
import Avatar from '@components/common/Avatar'
import IconButton from '@components/common/IconButton'
import CompanionSheet from '@components/persona/CompanionSheet'
import Timer from '@components/common/Timer'
import { useChat } from '@hooks/useChat'
import { usePageTitle } from '@hooks/usePageTitle'
import { usePersonaStore } from '@store/index'
import { traitSentence } from '@utils/text'

export default function ChatPage() {
  const { conversationId } = useParams()
  const navigate = useNavigate()
  const activePersona = usePersonaStore((s) => s.activePersona)
  const { messages, isTyping, sendMessage } = useChat(conversationId)
  const [input, setInput] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  usePageTitle(activePersona ? `Chat with ${activePersona.name}` : 'Chat')

  useEffect(() => { if (!activePersona) navigate('/personas') }, [activePersona, navigate])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [messages, isTyping])

  // The composer grows with the message, up to a few lines
  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [input])

  const send = () => {
    const text = input.trim()
    if (!text) return
    sendMessage(text)
    setInput('')
    inputRef.current?.focus()
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    send()
  }

  // Enter sends; Shift+Enter starts a new line
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      send()
    }
  }

  if (!activePersona) return null

  const canSend = input.trim().length > 0

  return (
    <div className="flex h-[100dvh] flex-col bg-brand-dark">
      {/* ── Header ── */}
      <header className="shrink-0 bg-brand-dark pt-[env(safe-area-inset-top,0px)]">
        <h1 className="sr-only">Chat with {activePersona.name}</h1>
        <div className="mx-auto flex h-16 max-w-3xl items-center gap-3 px-3 sm:px-5">
          <IconButton label="Back to chats" onClick={() => navigate('/chat')}>
            <ChevronLeft size={24} />
          </IconButton>

          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            className="flex min-w-0 flex-1 items-center gap-3 rounded-full py-1 pr-3 text-left transition-colors hover:bg-white/[0.04]"
            aria-haspopup="dialog"
          >
            <Avatar persona={activePersona} online />
            <span className="min-w-0">
              <span className="block truncate text-lg font-extrabold leading-tight text-brand-text">{activePersona.name}</span>
              <span className="block text-sm font-semibold text-emerald-300">Online <span className="font-normal text-brand-muted">· View profile</span></span>
            </span>
          </button>

          <Timer />
        </div>
      </header>

      {/* ── Messages ── */}
      <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto max-w-3xl space-y-3 px-4 pb-6 pt-2 sm:px-6" role="log" aria-live="polite" aria-label={`Conversation with ${activePersona.name}`}>
          {/* Her profile opens every conversation */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center pb-6 pt-8 text-center"
          >
            <Avatar persona={activePersona} size="xl" />
            <h2 className="heading mt-4 text-3xl">{activePersona.name}</h2>
            {activePersona.tagline && <p className="mt-1.5 text-base text-brand-muted">{traitSentence(activePersona.tagline)}</p>}
            {activePersona.previewMessage && (
              <p className="mt-4 max-w-sm text-lg font-semibold leading-snug text-brand-text">“{activePersona.previewMessage}”</p>
            )}
            {messages.length === 0 && <p className="mt-3 text-sm text-brand-muted">Send a message to start the conversation.</p>}
          </motion.div>

          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} persona={activePersona} />
            ))}
          </AnimatePresence>

          {isTyping && <TypingIndicator persona={activePersona} />}
          <div ref={bottomRef} />
        </div>
      </main>

      {/* ── Composer ── */}
      <div className="shrink-0 bg-brand-dark pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-3xl items-end gap-2 px-3 sm:px-5">
          <label htmlFor="chat-message" className="sr-only">Message {activePersona.name}</label>
          <textarea
            id="chat-message"
            ref={inputRef}
            rows={1}
            className="input min-h-[3rem] flex-1 resize-none rounded-[1.5rem] py-3 leading-snug"
            placeholder={`Message ${activePersona.name}…`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            enterKeyHint="send"
            autoComplete="off"
            autoFocus
          />

          <button
            type="submit"
            disabled={!canSend}
            aria-label="Send message"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-rose text-white transition-[transform,background-color,opacity] duration-150 hover:bg-brand-pink active:scale-95 disabled:bg-brand-card disabled:text-brand-subtle"
          >
            <ArrowUp size={22} strokeWidth={2.75} aria-hidden="true" />
          </button>
        </form>
      </div>

      <UpsellModal />
      <CompanionSheet persona={activePersona} isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  )
}
