import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, Plus } from 'lucide-react'
import ConversationRow from '@components/chat/ConversationRow'
import ButtonLink from '@components/common/ButtonLink'
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
      title="Chats"
      subtitle={conversations === null ? 'Loading your conversations…' : count > 0 ? plural(count, 'conversation') : undefined}
      actions={
        <IconButton label="Start a new chat" variant="accent" onClick={() => navigate('/personas')}>
          <Plus size={20} strokeWidth={2.5} />
        </IconButton>
      }
    >
      {conversations === null ? (
        <div className="space-y-2" aria-busy="true">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-[5.25rem]" />)}
        </div>
      ) : conversations.length === 0 ? (
        <EmptyState
          icon={MessageCircle}
          title="No chats yet"
          description="Pick a companion and send her the first message. Your conversations will be waiting here."
          action={<ButtonLink to="/personas">Choose a companion</ButtonLink>}
        />
      ) : (
        <ul className="space-y-2">
          {conversations.map((conversation) => {
            const persona = getPersonaById(conversation.personaId)
            if (!persona) return null

            return (
              <li key={conversation.id}>
                <ConversationRow
                  persona={persona}
                  preview={conversation.lastMessage || persona.previewMessage}
                  quiet={!conversation.lastMessage}
                  meta={timeAgo(conversation.lastMessageAt)}
                  onClick={() => openConversation(conversation.id, persona)}
                />
              </li>
            )
          })}
        </ul>
      )}
    </MemberPage>
  )
}
