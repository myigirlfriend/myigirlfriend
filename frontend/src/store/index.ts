import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { AuthUser, Message, Operator, Persona, PlanId, SubscriptionStatus } from '@/types'

// ─── Auth ────────────────────────────────────────────────────
interface AuthState {
  user: AuthUser | null
  operator: Operator | null
  setUser: (user: AuthUser | null) => void
  setOperator: (operator: Operator | null) => void
  clearAuth: () => void
}

// ─── Chat ─────────────────────────────────────────────────────
interface ChatState {
  activeConversationId: string | null
  messages: Message[]
  isTyping: boolean
  /** Messages added during this session, counted towards the free limit */
  messageCount: number
  sessionStart: number | null
  setActiveConversation: (id: string) => void
  addMessage: (message: Message) => void
  setMessages: (messages: Message[]) => void
  setTyping: (isTyping: boolean) => void
  resetChat: () => void
}

// ─── Persona ──────────────────────────────────────────────────
interface PersonaState {
  personas: Persona[]
  activePersona: Persona | null
  setPersonas: (personas: Persona[]) => void
  setActivePersona: (persona: Persona | null) => void
}

// ─── Subscription ─────────────────────────────────────────────
interface SubscriptionState {
  plan: PlanId
  subStatus: SubscriptionStatus
  showUpsell: boolean
  setPlan: (plan: PlanId) => void
  setSubStatus: (subStatus: SubscriptionStatus) => void
  setShowUpsell: (show: boolean) => void
}

// ─── Stores ───────────────────────────────────────────────────
// Auth and subscription state are persisted; chat and persona are session-only

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        operator: null,
        setUser: (user) => set({ user }, false, 'auth/setUser'),
        setOperator: (operator) => set({ operator }, false, 'auth/setOperator'),
        clearAuth: () => set({ user: null, operator: null }, false, 'auth/clear'),
      }),
      { name: 'igf-auth' }
    ),
    { name: 'AuthStore' }
  )
)

export const useChatStore = create<ChatState>()(
  devtools(
    (set) => ({
      activeConversationId: null,
      messages: [],
      isTyping: false,
      messageCount: 0,
      sessionStart: null,

      setActiveConversation: (id) =>
        set({ activeConversationId: id, messages: [], isTyping: false, messageCount: 0, sessionStart: Date.now() },
          false, 'chat/setConversation'),

      addMessage: (message) =>
        set((s) => ({
          messages: [...s.messages, message],
          messageCount: s.messageCount + 1,
        }), false, 'chat/addMessage'),

      setMessages: (messages) => set({ messages }, false, 'chat/setMessages'),
      setTyping: (isTyping) => set({ isTyping }, false, 'chat/setTyping'),
      resetChat: () =>
        set({ messages: [], messageCount: 0, sessionStart: null, activeConversationId: null },
          false, 'chat/reset'),
    }),
    { name: 'ChatStore' }
  )
)

export const usePersonaStore = create<PersonaState>()(
  devtools(
    (set) => ({
      personas: [],
      activePersona: null,
      setPersonas: (personas) => set({ personas }, false, 'persona/setAll'),
      setActivePersona: (persona) => set({ activePersona: persona }, false, 'persona/setActive'),
    }),
    { name: 'PersonaStore' }
  )
)

export const useSubStore = create<SubscriptionState>()(
  devtools(
    persist(
      (set) => ({
        plan: 'free',
        subStatus: 'inactive',
        showUpsell: false,
        setPlan: (plan) => set({ plan }, false, 'sub/setPlan'),
        setSubStatus: (subStatus) => set({ subStatus }, false, 'sub/setStatus'),
        setShowUpsell: (show) => set({ showUpsell: show }, false, 'sub/setUpsell'),
      }),
      { name: 'igf-sub' }
    ),
    { name: 'SubStore' }
  )
)
