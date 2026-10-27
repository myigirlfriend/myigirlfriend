import { motion } from 'framer-motion'
import Avatar from '@components/common/Avatar'
import { formatTime } from '@utils/formatTime'
import type { Message, Persona } from '@/types'
import Bubble from './Bubble'

interface MessageBubbleProps {
  message: Message
  persona: Persona
}

/** A message in the member's chat. Her replies carry her avatar; the member's sit on the right. */
export default function MessageBubble({ message, persona }: MessageBubbleProps) {
  const isUser = message.sender === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Bubble
        tone={isUser ? 'sent' : 'received'}
        avatar={isUser ? undefined : <Avatar persona={persona} size="sm" />}
        meta={formatTime(message.created_at)}
      >
        {message.content}
      </Bubble>
    </motion.div>
  )
}
