import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowLeft, MessagesSquare, RefreshCw, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import Bubble from '@components/chat/Bubble'
import EmojiButton from '@components/chat/EmojiButton'
import Avatar from '@components/common/Avatar'
import Badge from '@components/common/Badge'
import Button from '@components/common/Button'
import IconButton from '@components/common/IconButton'
import SegmentedControl from '@components/common/SegmentedControl'
import { getPersonaById } from '@config/personas'
import { chatApi, operatorApi } from '@services/api'
import { supabase } from '@services/supabaseClient'
import { useAuthStore } from '@store/index'
import { formatTime } from '@utils/formatTime'
import { insertAtCursor } from '@utils/insertAtCursor'
import { plural } from '@utils/text'
import type { Agent, AvatarPersona, Message, QueueConversation } from '@/types'

type Filter = 'all' | 'unassigned' | 'mine'

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'unassigned', label: 'Unassigned' },
  { id: 'mine', label: 'Mine' },
]

const personaFor = (conversation: QueueConversation): AvatarPersona =>
  getPersonaById(conversation.personaId) ?? { name: conversation.personaName }

// Rows arrive from Supabase Realtime untyped, so check the shape before trusting one
const isMessage = (row: unknown): row is Message =>
  typeof row === 'object' && row !== null && 'id' in row && 'sender' in row && 'content' in row

export default function ConversationsPage() {
  const operator = useAuthStore((s) => s.operator)
  const isAdmin = operator?.role === 'admin'
  const [params, setParams] = useSearchParams()

  const [queue, setQueue] = useState<QueueConversation[] | null>(null)
  const [agents, setAgents] = useState<Agent[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [live, setLive] = useState(false)
  const [activeConv, setActiveConv] = useState<QueueConversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loadingChat, setLoadingChat] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const replyRef = useRef<HTMLInputElement>(null)
  const openedFromLink = useRef(false)
  const activeId = activeConv?.id

  const fetchQueue = useCallback(async () => {
    try {
      const data = await operatorApi.queue()
      setQueue(data.conversations)
    } catch { setQueue((q) => q ?? []) }
  }, [])

  useEffect(() => {
    fetchQueue()
    if (isAdmin) operatorApi.agents().then((d) => setAgents(d.agents)).catch(() => {})

    // Refresh the list whenever a conversation changes or a new message arrives
    const channel = supabase
      .channel('operator-queue')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, fetchQueue)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, fetchQueue)
      .subscribe((status) => setLive(status === 'SUBSCRIBED'))

    return () => { supabase.removeChannel(channel) }
  }, [isAdmin, fetchQueue])

  // Live messages for the open conversation
  useEffect(() => {
    if (!activeId) return
    const channel = supabase
      .channel(`messages-${activeId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: `conversation_id=eq.${activeId}`,
      }, (payload) => {
        const incoming: unknown = payload.new
        if (!isMessage(incoming)) return
        setMessages((prev) => {
          if (prev.some((m) => m.id === incoming.id)) return prev
          // Replace the optimistic copy of a reply this agent just sent
          const withoutTemp = prev.filter((m) =>
            !(m.id.startsWith('temp-') && m.sender === incoming.sender && m.content === incoming.content))
          return [...withoutTemp, incoming]
        })
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [activeId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [messages])

  const fetchSuggestions = async (conversationId: string, history: Message[]) => {
    setLoadingSuggestions(true)
    try {
      const data = await operatorApi.suggest(conversationId, history)
      setSuggestions(Array.isArray(data.suggestions) ? data.suggestions : [])
    } catch { setSuggestions([]) } finally { setLoadingSuggestions(false) }
  }

  const openConversation = useCallback(async (conversation: QueueConversation) => {
    setActiveConv(conversation)
    setSuggestions([])
    setMessages([])
    setInput('')
    setLoadingChat(true)
    try {
      const data = await chatApi.history(conversation.id)
      setMessages(data.messages)
      fetchSuggestions(conversation.id, data.messages)
    } catch { toast.error('That chat could not be loaded') } finally { setLoadingChat(false) }
  }, [])

  // Open the chat named in the link (?c=...) once the list has loaded
  useEffect(() => {
    const id = params.get('c')
    if (!id || !queue || openedFromLink.current) return
    openedFromLink.current = true
    const conversation = queue.find((c) => c.id === id)
    if (conversation) openConversation(conversation)
    setParams({}, { replace: true })
  }, [queue, params, setParams, openConversation])

  const sendReply = async (e: FormEvent) => {
    e.preventDefault()
    const content = input.trim()
    if (!content || !activeConv || sending) return
    setSending(true)
    try {
      await operatorApi.reply(activeConv.id, content)
      // Optimistic update; the live feed swaps in the saved message
      setMessages((m) => [...m, { id: `temp-${Date.now()}`, sender: 'operator', content, created_at: new Date().toISOString() }])
      setInput('')
      setSuggestions([])
    } catch { toast.error('Your reply was not sent. Try again.') } finally { setSending(false) }
  }

  const assignConversation = async (operatorId: string) => {
    if (!activeConv) return
    const assignedTo = operatorId || null
    try {
      await operatorApi.assign(activeConv.id, assignedTo)
      const agentName = agents.find((a) => a.id === assignedTo)?.name
      toast.success(agentName ? `Assigned to ${agentName}` : 'Unassigned')
      setActiveConv((prev) => (prev ? { ...prev, assignedTo } : prev))
      fetchQueue()
    } catch { toast.error('The chat could not be assigned') }
  }

  const visible = useMemo(() => {
    const list = queue ?? []
    if (filter === 'unassigned') return list.filter((c) => !c.assignedTo)
    if (filter === 'mine') return list.filter((c) => c.assignedTo === operator?.id)
    return list
  }, [queue, filter, operator?.id])

  const emptyMessage = !isAdmin
    ? 'No chats are assigned to you yet. An admin assigns them.'
    : filter === 'unassigned' ? 'Every active chat has an agent.'
    : filter === 'mine' ? 'No chats are assigned to you.'
    : 'No active chats right now.'

  return (
    <div className="flex h-full">
      {/* Conversation list */}
      <div className={`${activeConv ? 'hidden md:flex' : 'flex'} w-full shrink-0 flex-col bg-brand-surface md:w-80`}>
        <div className="shrink-0 px-4 pb-3 pt-6">
          <div className="flex items-center justify-between gap-2">
            <h1 className="heading text-2xl">Conversations</h1>
            <span className={`inline-flex items-center gap-1.5 text-sm font-bold ${live ? 'text-emerald-300' : 'text-brand-muted'}`} role="status">
              <span className={`h-2 w-2 rounded-full ${live ? 'bg-emerald-400' : 'bg-zinc-600'}`} aria-hidden="true" />
              {live ? 'Live' : 'Connecting'}
            </span>
          </div>

          {isAdmin && (
            <SegmentedControl label="Filter conversations" options={FILTERS} value={filter} onChange={setFilter} className="mt-4 bg-brand-dark" />
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          {!queue ? (
            <div className="space-y-2 p-1" aria-busy="true">
              {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-14" />)}
            </div>
          ) : visible.length === 0 ? (
            <p className="px-3 py-6 text-base text-brand-muted">{emptyMessage}</p>
          ) : (
            <ul className="space-y-1">
              {visible.map((conversation) => {
                const selected = activeConv?.id === conversation.id
                return (
                  <li key={conversation.id}>
                    <button
                      type="button"
                      onClick={() => openConversation(conversation)}
                      aria-current={selected ? 'true' : undefined}
                      className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors
                        ${selected ? 'bg-brand-card' : 'hover:bg-white/[0.04]'}`}
                    >
                      <Avatar persona={personaFor(conversation)} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px] font-extrabold text-brand-text">{conversation.userName}</span>
                        <span className="block truncate text-sm text-brand-muted">
                          with {conversation.personaName}, {plural(conversation.messageCount, 'message')}
                        </span>
                      </span>
                      {isAdmin && !conversation.assignedTo && (
                        <Badge variant="warning">No agent</Badge>
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
            <MessagesSquare size={32} className="text-brand-muted" aria-hidden="true" />
            <p className="text-base text-brand-muted">Pick a conversation to read it and reply.</p>
          </div>
        ) : (
          <>
            <div className="flex shrink-0 flex-wrap items-center gap-3 px-4 py-3">
              <IconButton label="Back to conversations" onClick={() => setActiveConv(null)} className="text-brand-text md:hidden">
                <ArrowLeft size={18} aria-hidden="true" />
              </IconButton>
              <Avatar persona={personaFor(activeConv)} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-base font-extrabold text-brand-text">{activeConv.userName}</div>
                <div className="truncate text-sm text-brand-muted">chatting with {activeConv.personaName}</div>
              </div>

              {isAdmin && (
                <div className="flex items-center gap-2">
                  <label htmlFor="assign-agent" className="text-sm font-bold text-brand-muted">Agent</label>
                  <select
                    id="assign-agent"
                    value={activeConv.assignedTo || ''}
                    onChange={(e) => assignConversation(e.target.value)}
                    className="input input--compact w-auto py-2 pr-8 text-[15px]"
                  >
                    <option value="">Unassigned</option>
                    {agents.map((agent) => (
                      <option key={agent.id} value={agent.id}>{agent.name}{agent.role === 'admin' ? ' (admin)' : ''}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Member on the left; her side (AI or an agent writing as her) on the right */}
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              {loadingChat ? (
                <div className="space-y-3" aria-busy="true">
                  <div className="skeleton h-10 w-2/5" />
                  <div className="skeleton ml-auto h-10 w-1/2" />
                  <div className="skeleton h-10 w-1/3" />
                </div>
              ) : messages.length === 0 ? (
                <p className="py-10 text-center text-base text-brand-muted">No messages in this chat yet.</p>
              ) : (
                <div className="mx-auto max-w-3xl space-y-3">
                  {messages.map((message) => {
                    const fromMember = message.sender === 'user'
                    const fromAgent = message.sender === 'operator'
                    return (
                      <Bubble
                        key={message.id}
                        tone={fromMember ? 'received' : fromAgent ? 'agent' : 'sent'}
                        meta={`${fromMember ? activeConv.userName : fromAgent ? `Agent as ${activeConv.personaName}` : `AI as ${activeConv.personaName}`}, ${formatTime(message.created_at)}`}
                      >
                        {message.content}
                      </Bubble>
                    )
                  })}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggested replies + composer */}
            <div className="shrink-0 bg-brand-surface px-4 py-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-brand-muted">
                  {loadingSuggestions ? 'Writing suggestions…' : suggestions.length > 0 ? 'Suggested replies. Select one to edit it before sending.' : 'No suggestions yet'}
                </span>
                <button
                  type="button"
                  onClick={() => fetchSuggestions(activeConv.id, messages)}
                  disabled={loadingSuggestions}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold text-brand-muted transition-colors hover:bg-white/[0.06] hover:text-brand-text disabled:opacity-50"
                >
                  <RefreshCw size={13} className={loadingSuggestions ? 'motion-safe:animate-spin' : ''} aria-hidden="true" /> New suggestions
                </button>
              </div>

              {loadingSuggestions ? (
                <div className="mb-3 space-y-2"><div className="skeleton h-10" /><div className="skeleton h-10" /></div>
              ) : suggestions.length > 0 && (
                <div className="mb-3 flex flex-col gap-2">
                  {suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setInput(suggestion)}
                      className="rounded-2xl bg-brand-card px-4 py-2.5 text-left text-[15px] text-brand-text ring-1 ring-inset ring-transparent transition-colors hover:ring-brand-pink"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={sendReply} className="flex items-end gap-2">
                <EmojiButton onSelect={(emoji) => setInput((value) => insertAtCursor(replyRef.current, value, emoji))} />
                <div className="min-w-0 flex-1">
                  <label htmlFor="agent-reply" className="sr-only">Your reply as {activeConv.personaName}</label>
                  <input
                    ref={replyRef}
                    id="agent-reply"
                    className="input input--compact bg-brand-dark"
                    placeholder={`Reply as ${activeConv.personaName}`}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    autoComplete="off"
                  />
                </div>
                <Button type="submit" size="sm" disabled={!input.trim() || sending}>
                  <Send size={15} aria-hidden="true" /> Send
                </Button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
