import { useState, useEffect, useRef } from 'react'
import { useAuthStore } from '@store/index'
import api from '@services/api'
import toast from 'react-hot-toast'
import { formatTime } from '@utils/formatTime'

export default function OperatorDashboardPage() {
  const operator = useAuthStore(s => s.operator)
  const clearAuth = useAuthStore(s => s.clearAuth)
  const [queue, setQueue] = useState([])
  const [activeConv, setActiveConv] = useState(null)
  const [messages, setMessages] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [input, setInput] = useState('')
  const [loadingSugg, setLoadingSugg] = useState(false)
  const bottomRef = useRef(null)

  // Poll queue every 5s
  useEffect(() => {
    fetchQueue()
    const t = setInterval(fetchQueue, 5000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchQueue = async () => {
    try {
      const data = await api.get('/api/operator/queue')
      setQueue(data.conversations)
    } catch {}
  }

  const openConversation = async (conv) => {
    setActiveConv(conv)
    setSuggestions([])
    try {
      const data = await api.get(`/api/chat/history/${conv.id}`)
      setMessages(data.messages)
      fetchSuggestions(conv.id, data.messages)
    } catch { toast.error('Could not load chat') }
  }

  const fetchSuggestions = async (convId, msgs) => {
    setLoadingSugg(true)
    try {
      const data = await api.post('/api/operator/suggest', { conversationId: convId, messages: msgs })
      setSuggestions(data.suggestions)
    } catch {} finally { setLoadingSugg(false) }
  }

  const sendReply = async (content) => {
    if (!content.trim() || !activeConv) return
    try {
      await api.post('/api/operator/reply', { conversationId: activeConv.id, content })
      setMessages(m => [...m, { id: Date.now(), sender: 'operator', content, created_at: new Date().toISOString() }])
      setInput('')
      setSuggestions([])
    } catch { toast.error('Send failed') }
  }

  return (
    <div className="flex h-screen bg-brand-dark text-white overflow-hidden">
      {/* Sidebar — queue */}
      <div className="w-64 border-r border-brand-border flex flex-col shrink-0">
        <div className="p-4 border-b border-brand-border">
          <div className="gradient-text font-bold text-sm">Agent: {operator?.name}</div>
          <button onClick={clearAuth} className="text-xs text-brand-muted hover:text-white mt-1">Sign out</button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          <div className="text-xs text-brand-muted px-2 mb-1">Live Queue ({queue.length})</div>
          {queue.length === 0 && <div className="text-xs text-brand-muted px-2">No active chats</div>}
          {queue.map(conv => (
            <button key={conv.id} onClick={() => openConversation(conv)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all ${activeConv?.id === conv.id ? 'bg-brand-purple/20 border border-brand-purple/40' : 'hover:bg-brand-card'}`}>
              <div className="font-semibold text-white">{conv.userName}</div>
              <div className="text-brand-muted text-xs">{conv.personaName} · {conv.messageCount} msgs</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {!activeConv ? (
          <div className="flex-1 flex items-center justify-center text-brand-muted text-sm">
            Select a conversation from the queue
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="px-4 py-3 border-b border-brand-border flex items-center gap-3 shrink-0">
              <div className="font-bold">{activeConv.userName}</div>
              <div className="text-xs text-brand-muted">→ chatting with {activeConv.personaName}</div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-3 py-2 rounded-xl text-sm ${
                    msg.sender === 'user' ? 'bg-brand-gradient text-white' :
                    msg.sender === 'operator' ? 'bg-blue-600 text-white' :
                    'bg-brand-card border border-brand-border text-brand-text'
                  }`}>
                    {msg.sender === 'operator' && <div className="text-xs opacity-70 mb-1">You (agent)</div>}
                    {msg.content}
                    <div className="text-xs opacity-50 mt-1">{formatTime(msg.created_at)}</div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* AI Suggestions */}
            <div className="px-4 py-2 border-t border-brand-border bg-brand-surface shrink-0">
              <div className="text-xs text-brand-muted mb-2">
                {loadingSugg ? 'Generating suggestions…' : 'AI Suggestions (click to use):'}
              </div>
              <div className="flex flex-col gap-1.5 mb-3">
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => sendReply(s)}
                    className="text-left text-xs px-3 py-2 rounded-lg bg-brand-card border border-brand-border hover:border-brand-purple/60 transition-all text-brand-text">
                    {s}
                  </button>
                ))}
              </div>
              {/* Manual input */}
              <div className="flex gap-2">
                <input className="input-field flex-1 text-sm py-2"
                  placeholder="Or type a custom reply…"
                  value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendReply(input)} />
                <button onClick={() => sendReply(input)}
                  className="px-4 py-2 bg-brand-gradient text-white text-sm font-bold rounded-xl hover:opacity-90 shrink-0">
                  Send
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
