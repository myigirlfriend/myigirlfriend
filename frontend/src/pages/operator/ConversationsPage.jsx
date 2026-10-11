import { useState, useEffect, useRef, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowLeft, MessagesSquare, RefreshCw, Send } from 'lucide-react'
import { useAuthStore } from '@store/index'
import { supabase } from '@services/supabaseClient'
import api from '@services/api'
import toast from 'react-hot-toast'
import { formatTime } from '@utils/formatTime'
import Avatar from '@components/common/Avatar'
import { getPersonaById } from '@config/personas'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'unassigned', label: 'Unassigned' },
  { id: 'mine', label: 'Mine' },
]

export default function ConversationsPage() {
  const operator = useAuthStore(s => s.operator)
  const isAdmin = operator?.role === 'admin'
  const [params, setParams] = useSearchParams()

  const [queue, setQueue] = useState(null)
  const [agents, setAgents] = useState([])
  const [filter, setFilter] = useState('all')
  const [live, setLive] = useState(false)
  const [activeConv, setActiveConv] = useState(null)
  const [messages, setMessages] = useState([])
  const [loadingChat, setLoadingChat] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [loadingSugg, setLoadingSugg] = useState(false)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)
  const openedFromLink = useRef(false)

  const fetchQueue = async () => {
    try {
      const data = await api.get('/api/operator/queue')
      setQueue(data.conversations)
    } catch { setQueue(q => q || []) }
  }

  useEffect(() => {
    fetchQueue()
    if (isAdmin) api.get('/api/operator/agents').then(d => setAgents(d.agents)).catch(() => {})

    // Refresh the list whenever a conversation changes or a new message arrives
    const channel = supabase
      .channel('operator-queue')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, fetchQueue)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, fetchQueue)
      .subscribe(status => setLive(status === 'SUBSCRIBED'))

    return () => { supabase.removeChannel(channel) }
  }, [isAdmin])

  // Live messages for the open conversation
  useEffect(() => {
    if (!activeConv) return
    const channel = supabase
      .channel(`messages-${activeConv.id}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: `conversation_id=eq.${activeConv.id}`,
      }, (payload) => {
        if (!payload.new) return
        setMessages(prev => {
          if (prev.some(m => m.id === payload.new.id)) return prev
          // Replace the optimistic copy of a reply this agent just sent
          const withoutTemp = prev.filter(m =>
            !(String(m.id).startsWith('temp-') && m.sender === payload.new.sender && m.content === payload.new.content))
          return [...withoutTemp, payload.new]
        })
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [activeConv?.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [messages])

  const fetchSuggestions = async (convId, msgs) => {
    setLoadingSugg(true)
    try {
      const data = await api.post('/api/operator/suggest', { conversationId: convId, messages: msgs })
      setSuggestions(Array.isArray(data.suggestions) ? data.suggestions : [])
    } catch { setSuggestions([]) } finally { setLoadingSugg(false) }
  }

  const openConversation = async (conv) => {
    setActiveConv(conv)
    setSuggestions([])
    setMessages([])
    setInput('')
    setLoadingChat(true)
    try {
      const data = await api.get(`/api/chat/history/${conv.id}`)
      setMessages(data.messages)
      fetchSuggestions(conv.id, data.messages)
    } catch { toast.error('That chat could not be loaded') } finally { setLoadingChat(false) }
  }

  // Open the chat named in the link (?c=...) once the list has loaded
  useEffect(() => {
    const id = params.get('c')
    if (!id || !queue || openedFromLink.current) return
    openedFromLink.current = true
    const conv = queue.find(c => c.id === id)
    if (conv) openConversation(conv)
    setParams({}, { replace: true })
  }, [queue])

  const sendReply = async (e) => {
    e?.preventDefault()
    const content = input.trim()
    if (!content || !activeConv || sending) return
    setSending(true)
    try {
      await api.post('/api/operator/reply', { conversationId: activeConv.id, content })
      // Optimistic update; the live feed swaps in the saved message
      setMessages(m => [...m, { id: `temp-${Date.now()}`, sender: 'operator', content, created_at: new Date().toISOString() }])
      setInput('')
      setSuggestions([])
    } catch { toast.error('Your reply was not sent. Try again.') } finally { setSending(false) }
  }

  const assignConversation = async (operatorId) => {
    try {
      await api.post('/api/operator/assign', { conversationId: activeConv.id, operatorId: operatorId || null })
      const agentName = agents.find(a => a.id === operatorId)?.name
      toast.success(agentName ? `Assigned to ${agentName}` : 'Unassigned')
      setActiveConv(prev => ({ ...prev, assignedTo: operatorId || null }))
      fetchQueue()
    } catch { toast.error('The chat could not be assigned') }
  }

  const visible = useMemo(() => {
    const list = queue || []
    if (filter === 'unassigned') return list.filter(c => !c.assignedTo)
    if (filter === 'mine') return list.filter(c => c.assignedTo === operator?.id)
    return list
  }, [queue, filter, operator?.id])

  const personaFor = (conv) => getPersonaById(conv.personaId) || { name: conv.personaName }

  return (
    <div className="flex h-full">
      {/* Conversation list */}
      <div className={`${activeConv ? 'hidden md:flex' : 'flex'} w-full md:w-80 shrink-0 flex-col border-r border-brand-border`}>
        <div className="shrink-0 border-b border-brand-border px-4 pt-5 pb-3">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-xl font-extrabold text-white">Conversations</h1>
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${live ? 'text-emerald-300' : 'text-zinc-400'}`}>
              <span className={`h-2 w-2 rounded-full ${live ? 'bg-emerald-400' : 'bg-zinc-600'}`} aria-hidden="true" />
              {live ? 'Live' : 'Connecting'}
            </span>
          </div>

          {isAdmin && (
            <div className="mt-3 flex gap-1 rounded-xl bg-brand-surface p-1" role="group" aria-label="Filter conversations">
              {FILTERS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  aria-pressed={filter === f.id}
                  className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-bold transition-colors
                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-pink
                    ${filter === f.id ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white'}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          {!queue ? (
            <div className="space-y-2 p-1" aria-busy="true">
              {Array.from({ length: 5 }).map((_, i) => <div key={i} className="admin-skeleton h-14" />)}
            </div>
          ) : visible.length === 0 ? (
            <p className="px-3 py-6 text-sm text-zinc-400">
              {!isAdmin
                ? 'No chats are assigned to you yet. An admin assigns them.'
                : filter === 'unassigned' ? 'Every active chat has an agent.'
                : filter === 'mine' ? 'No chats are assigned to you.'
                : 'No active chats right now.'}
            </p>
          ) : (
            <ul className="space-y-1">
              {visible.map(conv => {
                const selected = activeConv?.id === conv.id
                return (
                  <li key={conv.id}>
                    <button
                      onClick={() => openConversation(conv)}
                      aria-current={selected ? 'true' : undefined}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors
                        focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-pink
                        ${selected ? 'bg-white/[0.07]' : 'hover:bg-white/[0.03]'}`}
                    >
                      <Avatar persona={personaFor(conv)} size="md" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-white">{conv.userName}</span>
                        <span className="block truncate text-xs text-zinc-400">
                          with {conv.personaName}, {conv.messageCount} {conv.messageCount === 1 ? 'message' : 'messages'}
                        </span>
                      </span>
                      {isAdmin && !conv.assignedTo && (
                        <span className="shrink-0 text-xs font-bold text-amber-300">No agent</span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Chat */}
      <div className={`${activeConv ? 'flex' : 'hidden md:flex'} min-w-0 flex-1 flex-col`}>
        {!activeConv ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <MessagesSquare size={32} className="text-zinc-400" aria-hidden="true" />
            <p className="text-sm text-zinc-400">Pick a conversation to read it and reply.</p>
          </div>
        ) : (
          <>
            <div className="flex shrink-0 flex-wrap items-center gap-3 border-b border-brand-border px-4 py-3">
              <button
                onClick={() => setActiveConv(null)}
                aria-label="Back to conversations"
                className="md:hidden rounded-lg p-1.5 text-white hover:bg-white/5"
              >
                <ArrowLeft size={18} aria-hidden="true" />
              </button>
              <Avatar persona={personaFor(activeConv)} size="md" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold text-white">{activeConv.userName}</div>
                <div className="truncate text-xs text-zinc-400">chatting with {activeConv.personaName}</div>
              </div>

              {isAdmin && (
                <div className="flex items-center gap-2">
                  <label htmlFor="assign-agent" className="text-xs font-bold text-zinc-400">Agent</label>
                  <select
                    id="assign-agent"
                    value={activeConv.assignedTo || ''}
                    onChange={e => assignConversation(e.target.value)}
                    className="admin-input w-auto py-1.5 pr-8 text-sm"
                  >
                    <option value="">Unassigned</option>
                    {agents.map(a => (
                      <option key={a.id} value={a.id}>{a.name}{a.role === 'admin' ? ' (admin)' : ''}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Member on the left; her side (AI or an agent writing as her) on the right */}
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              {loadingChat ? (
                <div className="space-y-3" aria-busy="true">
                  <div className="admin-skeleton h-10 w-2/5" />
                  <div className="admin-skeleton ml-auto h-10 w-1/2" />
                  <div className="admin-skeleton h-10 w-1/3" />
                </div>
              ) : messages.length === 0 ? (
                <p className="py-10 text-center text-sm text-zinc-400">No messages in this chat yet.</p>
              ) : (
                <div className="space-y-2">
                  {messages.map(msg => {
                    const fromMember = msg.sender === 'user'
                    const fromAgent = msg.sender === 'operator'
                    return (
                      <div key={msg.id} className={`flex ${fromMember ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[80%] sm:max-w-md rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                          fromMember ? 'border border-brand-border bg-brand-card text-brand-text'
                          : fromAgent ? 'bg-brand-purple text-white'
                          : 'border border-brand-purple/40 bg-brand-purple/15 text-brand-text'
                        }`}>
                          <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                          <div className={`mt-1 text-xs ${fromAgent ? 'text-white/75' : 'text-zinc-400'}`}>
                            {fromMember ? activeConv.userName : fromAgent ? 'Agent' : 'AI'}, {formatTime(msg.created_at)}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggested replies + composer */}
            <div className="shrink-0 border-t border-brand-border bg-brand-surface px-4 py-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-zinc-400">
                  {loadingSugg ? 'Writing suggestions…' : suggestions.length > 0 ? 'Suggested replies. Select one to edit it before sending.' : 'No suggestions yet'}
                </span>
                <button
                  type="button"
                  onClick={() => fetchSuggestions(activeConv.id, messages)}
                  disabled={loadingSugg}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-bold text-zinc-400 hover:bg-white/5 hover:text-white disabled:opacity-50"
                >
                  <RefreshCw size={13} className={loadingSugg ? 'motion-safe:animate-spin' : ''} aria-hidden="true" /> New suggestions
                </button>
              </div>

              {loadingSugg ? (
                <div className="mb-3 space-y-1.5"><div className="admin-skeleton h-8" /><div className="admin-skeleton h-8" /></div>
              ) : suggestions.length > 0 && (
                <div className="mb-3 flex flex-col gap-1.5">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setInput(s)}
                      className="rounded-xl border border-brand-border bg-brand-card px-3 py-2 text-left text-sm text-brand-text
                                 hover:border-brand-purple/60 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-pink"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={sendReply} className="flex items-end gap-2">
                <div className="min-w-0 flex-1">
                  <label htmlFor="agent-reply" className="sr-only">Your reply as {activeConv.personaName}</label>
                  <input
                    id="agent-reply"
                    className="admin-input bg-brand-dark"
                    placeholder={`Reply as ${activeConv.personaName}`}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    autoComplete="off"
                  />
                </div>
                <button type="submit" disabled={!input.trim() || sending} className="admin-btn-primary">
                  <Send size={15} aria-hidden="true" /> Send
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
