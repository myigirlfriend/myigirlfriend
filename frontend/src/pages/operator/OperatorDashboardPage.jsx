import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@store/index'
import { supabase } from '@services/supabaseClient'
import api from '@services/api'
import toast from 'react-hot-toast'
import { formatTime } from '@utils/formatTime'
import AgentHours from '@components/operator/AgentHours'

export default function OperatorDashboardPage() {
  const operator = useAuthStore(s => s.operator)
  const clearAuth = useAuthStore(s => s.clearAuth)
  const navigate = useNavigate()
  const isAdmin = operator?.role === 'admin'

  const [queue, setQueue] = useState([])
  const [agents, setAgents] = useState([])
  const [activeConv, setActiveConv] = useState(null)
  const [messages, setMessages] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [input, setInput] = useState('')
  const [loadingSugg, setLoadingSugg] = useState(false)
  const [showAssign, setShowAssign] = useState(false)
  const bottomRef = useRef(null)
  const realtimeRef = useRef(null)
  const msgRealtimeRef = useRef(null)

  useEffect(() => {
    // Initial fetch
    fetchQueue()
    if (isAdmin) fetchAgents()

    // Subscribe to conversation changes via Supabase Realtime
    realtimeRef.current = supabase
      .channel('operator-queue')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'conversations',
      }, () => {
        // Refresh queue when any conversation changes
        fetchQueue()
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      }, () => {
        // Refresh queue counts when new message arrives
        fetchQueue()
      })
      .subscribe()

    return () => {
      if (realtimeRef.current) {
        supabase.removeChannel(realtimeRef.current)
      }
    }
  }, [isAdmin])

  // Subscribe to active conversation messages in realtime
  useEffect(() => {
    if (!activeConv) return

    if (msgRealtimeRef.current) {
      supabase.removeChannel(msgRealtimeRef.current)
    }

    msgRealtimeRef.current = supabase
      .channel(`messages-${activeConv.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${activeConv.id}`,
      }, (payload) => {
        if (payload.new) {
          setMessages(prev => {
            // Avoid duplicates
            const exists = prev.find(m => m.id === payload.new.id)
            if (exists) return prev
            return [...prev, payload.new]
          })
        }
      })
      .subscribe()

    return () => {
      if (msgRealtimeRef.current) {
        supabase.removeChannel(msgRealtimeRef.current)
      }
    }
  }, [activeConv?.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchQueue = async () => {
    try {
      const data = await api.get('/api/operator/queue')
      setQueue(data.conversations)
    } catch {}
  }

  const fetchAgents = async () => {
    try {
      const data = await api.get('/api/operator/agents')
      setAgents(data.agents)
    } catch {}
  }

  const openConversation = async (conv) => {
    setActiveConv(conv)
    setSuggestions([])
    setShowAssign(false)
    try {
      const data = await api.get(`/api/chat/history/${conv.id}`)
      setMessages(data.messages)
      fetchSuggestions(conv.id, data.messages)
    } catch { toast.error('Could not load chat') }
  }

  const fetchSuggestions = async (convId, msgs) => {
    setLoadingSugg(true)
    try {
      const data = await api.post('/api/operator/suggest', {
        conversationId: convId, messages: msgs
      })
      setSuggestions(data.suggestions)
    } catch {} finally { setLoadingSugg(false) }
  }

  const sendReply = async (content) => {
    if (!content.trim() || !activeConv) return
    try {
      await api.post('/api/operator/reply', {
        conversationId: activeConv.id, content
      })
      // Optimistic update — Realtime will also catch it
      setMessages(m => [...m, {
        id: `temp-${Date.now()}`,
        sender: 'operator',
        content,
        created_at: new Date().toISOString()
      }])
      setInput('')
      setSuggestions([])
    } catch { toast.error('Send failed') }
  }

  const assignConversation = async (operatorId) => {
    try {
      await api.post('/api/operator/assign', {
        conversationId: activeConv.id,
        operatorId: operatorId || null
      })
      const agentName = operatorId
        ? agents.find(a => a.id === operatorId)?.name
        : 'Unassigned'
      toast.success(`Assigned to ${agentName}`)
      setActiveConv(prev => ({ ...prev, assignedTo: operatorId }))
      setShowAssign(false)
      fetchQueue()
    } catch { toast.error('Assignment failed') }
  }

  return (
    <div className="flex h-screen bg-brand-dark text-white overflow-hidden">

      {/* Sidebar */}
      <div className="w-64 border-r border-brand-border flex flex-col shrink-0">

        {/* Agent info */}
        <div className="p-4 border-b border-brand-border shrink-0">
          <div className="gradient-text font-bold text-sm">
            Agent: {operator?.name}
          </div>
          <div className="flex items-center gap-3 mt-1">
            <button
              onClick={clearAuth}
              className="text-xs text-brand-muted hover:text-white transition-colors"
            >
              Sign out
            </button>
            {isAdmin && (
              <button
                onClick={() => navigate('/operator/hours')}
                className="text-xs text-brand-purple hover:text-brand-pink transition-colors font-semibold"
              >
                View Hours →
              </button>
            )}
          </div>
        </div>

        {/* Queue list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          <div className="flex items-center justify-between px-2 mb-1">
            <div className="text-xs text-brand-muted">
              {isAdmin ? `All Chats (${queue.length})` : `My Queue (${queue.length})`}
            </div>
            {/* Live indicator */}
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-400">Live</span>
            </div>
          </div>

          {queue.length === 0 && (
            <div className="text-xs text-brand-muted px-2">
              {isAdmin ? 'No active chats' : 'No chats assigned to you yet'}
            </div>
          )}

          {queue.map(conv => (
            <button
              key={conv.id}
              onClick={() => openConversation(conv)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all ${
                activeConv?.id === conv.id
                  ? 'bg-brand-purple/20 border border-brand-purple/40'
                  : 'hover:bg-brand-card'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-white">{conv.userName}</div>
                {!conv.assignedTo && isAdmin && (
                  <span className="text-xs text-yellow-400">Unassigned</span>
                )}
              </div>
              <div className="text-brand-muted text-xs">
                {conv.personaName} · {conv.messageCount} msgs
              </div>
            </button>
          ))}
        </div>

        {/* Agent hours */}
        <AgentHours />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {!activeConv ? (
          <div className="flex-1 flex items-center justify-center flex-col gap-3 text-brand-muted">
            <div className="text-4xl">💬</div>
            <div className="text-sm">Select a conversation from the queue</div>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="px-4 py-3 border-b border-brand-border flex items-center gap-3 shrink-0">
              <div className="font-bold">{activeConv.userName}</div>
              <div className="text-xs text-brand-muted">
                → chatting with {activeConv.personaName}
              </div>

              {/* Assign button — admin only */}
              {isAdmin && (
                <div className="ml-auto relative">
                  <button
                    onClick={() => setShowAssign(!showAssign)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-brand-card border border-brand-border hover:border-brand-purple/60 transition-all font-semibold"
                  >
                    {activeConv.assignedTo
                      ? `Assigned: ${agents.find(a => a.id === activeConv.assignedTo)?.name || 'Agent'}`
                      : '+ Assign Agent'
                    }
                  </button>

                  {showAssign && (
                    <div className="absolute right-0 top-9 w-52 bg-brand-card border border-brand-border rounded-xl shadow-brand-lg z-50 overflow-hidden">
                      <div className="text-xs text-brand-muted px-3 py-2 border-b border-brand-border">
                        Assign to agent
                      </div>
                      <button
                        onClick={() => assignConversation(null)}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-brand-surface text-brand-muted transition-colors"
                      >
                        Unassign
                      </button>
                      {agents.map(agent => (
                        <button
                          key={agent.id}
                          onClick={() => assignConversation(agent.id)}
                          className={`w-full text-left px-3 py-2 text-xs hover:bg-brand-surface transition-colors ${
                            activeConv.assignedTo === agent.id
                              ? 'gradient-text font-bold'
                              : 'text-white'
                          }`}
                        >
                          {agent.name}
                          {agent.role === 'admin' && (
                            <span className="text-brand-muted ml-1">(admin)</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs px-3 py-2 rounded-xl text-sm ${
                    msg.sender === 'user'
                      ? 'bg-brand-gradient text-white'
                      : msg.sender === 'operator'
                      ? 'bg-blue-600 text-white'
                      : 'bg-brand-card border border-brand-border text-brand-text'
                  }`}>
                    {msg.sender === 'operator' && (
                      <div className="text-xs opacity-70 mb-1">You (agent)</div>
                    )}
                    {msg.content}
                    <div className="text-xs opacity-50 mt-1">
                      {formatTime(msg.created_at)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* AI Suggestions + Input */}
            <div className="px-4 py-2 border-t border-brand-border bg-brand-surface shrink-0">
              <div className="text-xs text-brand-muted mb-2">
                {loadingSugg
                  ? 'Generating suggestions…'
                  : suggestions.length > 0
                  ? 'AI Suggestions (click to use):'
                  : ''}
              </div>
              <div className="flex flex-col gap-1.5 mb-3">
{suggestions.map((s, i) => (
  <button
    key={i}
    onClick={() => setInput(s)}  // ← change sendReply(s) to setInput(s)
    className="text-left text-xs px-3 py-2 rounded-lg bg-brand-card border border-brand-border hover:border-brand-purple/60 transition-all text-brand-text"
  >
    {s}
  </button>
))}
              </div>
              <div className="flex gap-2">
                <input
                  className="input-field flex-1 text-sm py-2"
                  placeholder="Or type a custom reply…"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendReply(input)}
                />
                <button
                  onClick={() => sendReply(input)}
                  className="px-4 py-2 bg-brand-gradient text-white text-sm font-bold rounded-xl hover:opacity-90 shrink-0"
                >
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