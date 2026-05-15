import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, MessageCircle } from 'lucide-react'
import { usePersonaStore } from '@store/index'
import { getPersonaById } from '@config/personas'
import api from '@services/api'

// Simple time formatter
const timeAgo = (dateStr) => {
  if (!dateStr) return ''
  const now = new Date()
  const date = new Date(dateStr)
  const diff = Math.floor((now - date) / 1000)

  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return date.toLocaleDateString([], { weekday: 'short' })
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

export default function ChatListPage() {
  const navigate = useNavigate()
  const { setActivePersona } = usePersonaStore()
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/chat/conversations')
      .then(data => {
        // Sort newest first
        const sorted = (data.conversations || []).sort((a, b) =>
          new Date(b.lastMessageAt || b.createdAt) - new Date(a.lastMessageAt || a.createdAt)
        )
        setConversations(sorted)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const openChat = (conv) => {
    const persona = getPersonaById(conv.personaId)
    if (persona) setActivePersona(persona)
    navigate(`/chat/${conv.id}`)
  }

  return (
    <div className="min-h-screen bg-brand-dark pb-24">

      {/* Header */}
      <div className="px-4 pt-14 pb-4 border-b border-brand-border sticky top-0 bg-brand-dark z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-white">Messages</h1>
            <p className="text-brand-muted text-xs mt-0.5">
              {conversations.length > 0
                ? `${conversations.length} conversation${conversations.length > 1 ? 's' : ''}`
                : 'No messages yet'}
            </p>
          </div>
          <button
            onClick={() => navigate('/personas')}
            className="w-9 h-9 rounded-full bg-brand-gradient flex items-center justify-center shadow-brand"
          >
            <Plus size={18} className="text-white" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-brand-border">
        {loading ? (
          // Skeleton
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3.5 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-brand-card shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-24 bg-brand-card rounded" />
                <div className="h-3 w-40 bg-brand-card rounded" />
              </div>
              <div className="h-3 w-10 bg-brand-card rounded" />
            </div>
          ))
        ) : conversations.length === 0 ? (
          // Empty state
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 px-8 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-brand-gradient flex items-center justify-center mb-4 shadow-brand">
              <MessageCircle size={26} className="text-white" />
            </div>
            <h2 className="text-white font-bold text-base mb-1">No messages yet</h2>
            <p className="text-brand-muted text-sm mb-6 leading-relaxed">
              Start a conversation with one of the girls
            </p>
            <button
              onClick={() => navigate('/personas')}
              className="bg-brand-gradient text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-brand"
            >
              Meet the girls
            </button>
          </motion.div>
        ) : (
          conversations.map((conv, i) => {
            const persona = getPersonaById(conv.personaId)
            if (!persona) return null

            return (
              <motion.button
                key={conv.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => openChat(conv)}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-brand-card/40 active:bg-brand-card transition-colors text-left"
              >
                {/* Photo */}
                <div className="relative shrink-0">
                  <div
                    className="w-12 h-12 rounded-full overflow-hidden"
                    style={{ border: `1.5px solid ${persona.accentColor}40` }}
                  >
                    {persona.image ? (
                      <img
                        src={persona.image}
                        alt={persona.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-white font-bold"
                        style={{ background: `linear-gradient(135deg, ${persona.gradientFrom}, ${persona.gradientTo})` }}
                      >
                        {persona.name[0]}
                      </div>
                    )}
                  </div>
                  {/* Online dot */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-brand-dark" />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-white text-sm">{persona.name}</span>
                    <span className="text-brand-muted text-xs shrink-0 ml-2">
                      {timeAgo(conv.lastMessageAt || conv.createdAt)}
                    </span>
                  </div>
                  <p className="text-brand-muted text-xs truncate leading-relaxed">
                    {conv.lastMessage
                      ? conv.lastMessage
                      : <span className="italic">{persona.previewMessage}</span>
                    }
                  </p>
                </div>
              </motion.button>
            )
          })
        )}
      </div>
    </div>
  )
}