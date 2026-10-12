import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, Plus } from 'lucide-react'
import Avatar from '@components/common/Avatar'
import Button from '@components/common/Button'
import EmptyState from '@components/common/EmptyState'
import IconButton from '@components/common/IconButton'
import MemberPage from '@components/layout/MemberPage'
import { getPersonaById } from '@config/personas'
import { usePersona } from '@hooks/usePersona'
import { chatApi } from '@services/api'
import { timeAgo } from '@utils/formatTime'
import { plural } from '@utils/text'
import type { ConversationSummary } from '@/types'

const lastActivity = (c: ConversationSummary) => new Date(c.lastMessageAt || c.createdAt).getTime()

export default function ChatListPage() {
  const navigate = useNavigate()
  // Also loads models added in the admin dashboard; `personas` changing re-renders the list with them
  const { openConversation } = usePersona()
  const [conversations, setConversations] = useState<ConversationSummary[] | null>(null)

  useEffect(() => {
    chatApi.conversations()
      .then((data) => setConversations([...data.conversations].sort((a, b) => lastActivity(b) - lastActivity(a))))
      .catch(() => setConversations([]))
  }, [])

  const count = conversations?.length ?? 0

  return (
    <MemberPage
      title="Messages"
      subtitle={conversations === null ? 'Loading…' : count > 0 ? plural(count, 'conversation') : 'No messages yet'}
      actions={
        <IconButton label="Start a new chat" variant="gradient" onClick={() => navigate('/personas')}>
          <Plus size={18} />
        </IconButton>
      }
    >
      {conversations === null ? (
        <div className="space-y-2" aria-busy="true">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-[4.5rem] rounded-2xl" />)}
        </div>
      ) : conversations.length === 0 ? (
        <EmptyState
          icon={MessageCircle}
          title="No messages yet"
          description="Start a conversation with one of the girls."
          action={<Button onClick={() => navigate('/personas')}>Meet the girls</Button>}
        />
      ) : (
        <ul className="surface divide-y divide-white/5 overflow-hidden">
          {conversations.map((conversation) => {
            const persona = getPersonaById(conversation.personaId)
            if (!persona) return null

            return (
              <li key={conversation.id}>
                <button
                  type="button"
                  onClick={() => openConversation(conversation.id, persona)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-white/5"
                >
                  <Avatar persona={persona} size="lg" online />
                  <span className="min-w-0 flex-1">
                    <span className="mb-0.5 flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-bold text-white">{persona.name}</span>
                      <span className="shrink-0 text-xs text-brand-muted">{timeAgo(conversation.lastMessageAt)}</span>
                    </span>
                    <span className={`block truncate text-xs leading-relaxed text-brand-muted ${conversation.lastMessage ? '' : 'italic'}`}>
                      {conversation.lastMessage || persona.previewMessage}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </MemberPage>
  )
}
