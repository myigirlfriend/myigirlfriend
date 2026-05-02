import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

// ─── Auth Slice ──────────────────────────────────────────────
const createAuthSlice = (set) => ({
  user: null,
  operator: null,
  setUser: (user) => set({ user }, false, 'auth/setUser'),
  setOperator: (operator) => set({ operator }, false, 'auth/setOperator'),
  clearAuth: () => set({ user: null, operator: null }, false, 'auth/clear'),
})

// ─── Chat Slice ───────────────────────────────────────────────
const createChatSlice = (set, get) => ({
  activeConversationId: null,
  messages: [],           // [{ id, sender, content, created_at }]
  isTyping: false,
  messageCount: 0,
  sessionStart: null,

  setActiveConversation: (id) =>
    set({ activeConversationId: id, messages: [], messageCount: 0, sessionStart: Date.now() },
      false, 'chat/setConversation'),

  addMessage: (msg) =>
    set((s) => ({
      messages: [...s.messages, msg],
      messageCount: s.messageCount + 1,
    }), false, 'chat/addMessage'),

  setMessages: (messages) => set({ messages }, false, 'chat/setMessages'),
  setTyping: (isTyping) => set({ isTyping }, false, 'chat/setTyping'),
  resetChat: () =>
    set({ messages: [], messageCount: 0, sessionStart: null, activeConversationId: null },
      false, 'chat/reset'),
})

// ─── Persona Slice ────────────────────────────────────────────
const createPersonaSlice = (set) => ({
  personas: [],
  activePersona: null,
  setPersonas: (personas) => set({ personas }, false, 'persona/setAll'),
  setActivePersona: (persona) => set({ activePersona: persona }, false, 'persona/setActive'),
})

// ─── Subscription Slice ───────────────────────────────────────
const createSubSlice = (set) => ({
  plan: 'free',           // 'free' | 'basic' | 'premium'
  subStatus: 'inactive',  // 'active' | 'inactive' | 'cancelled'
  showUpsell: false,
  setPlan: (plan) => set({ plan }, false, 'sub/setPlan'),
  setSubStatus: (subStatus) => set({ subStatus }, false, 'sub/setStatus'),
  setShowUpsell: (show) => set({ showUpsell: show }, false, 'sub/setUpsell'),
})

// ─── Root Store ───────────────────────────────────────────────
// Auth state is persisted; chat/persona/sub are session-only
export const useAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        ...createAuthSlice(set),
      }),
      { name: 'igf-auth' }
    ),
    { name: 'AuthStore' }
  )
)

export const useChatStore = create(
  devtools(
    (set, get) => createChatSlice(set, get),
    { name: 'ChatStore' }
  )
)

export const usePersonaStore = create(
  devtools(
    (set) => createPersonaSlice(set),
    { name: 'PersonaStore' }
  )
)

export const useSubStore = create(
  devtools(
    persist(
      (set) => createSubSlice(set),
      { name: 'igf-sub' }
    ),
    { name: 'SubStore' }
  )
)
