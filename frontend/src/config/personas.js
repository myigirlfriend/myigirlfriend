/**
 * PERSONAS CONFIG
 * Single source of truth for all persona metadata used across the app.
 * Backend system prompts live in backend/services/ai.service.js
 */

export const PERSONAS = [
  {
    id: 'zara',
    name: 'Zara',
    tagline: 'The Playful Flirt',
    description: 'Bold, witty, and a little cheeky. She keeps things exciting.',
    tone: 'playful, teasing, confident',
    emoji: '💜',
    gradientFrom: '#9B59B6',
    gradientTo: '#E91E8C',
    accentColor: '#E91E8C',
    previewMessage: "Oh, you came to chat with me? Good choice 😏",
  },
  {
    id: 'maya',
    name: 'Maya',
    tagline: 'The Supportive Listener',
    description: 'Warm, patient, and genuinely interested in your world.',
    tone: 'warm, empathetic, caring',
    emoji: '🌸',
    gradientFrom: '#8B5CF6',
    gradientTo: '#EC4899',
    accentColor: '#EC4899',
    previewMessage: "Hey, I was hoping you'd message me today 💕",
  },
  {
    id: 'elena',
    name: 'Elena',
    tagline: 'The Deep Thinker',
    description: 'Calm, philosophical, and always says something that makes you think.',
    tone: 'calm, intellectual, thoughtful',
    emoji: '✨',
    gradientFrom: '#6366F1',
    gradientTo: '#A855F7',
    accentColor: '#A855F7',
    previewMessage: "What's been on your mind lately? I actually want to know.",
  },
  {
    id: 'mariah',
    name: 'Mariah',
    tagline: 'The Sweet Romantic',
    description: 'Gentle, affectionate, and makes you feel genuinely cared for.',
    tone: 'soft, romantic, affectionate',
    emoji: '🌹',
    gradientFrom: '#EC4899',
    gradientTo: '#F43F5E',
    accentColor: '#F43F5E',
    previewMessage: "I was just thinking about you, isn't that funny? 🌹",
  },
  {
    id: 'hannah',
    name: 'Hannah',
    tagline: 'The Easygoing Friend',
    description: 'Casual, funny, and zero pressure. Like texting your best friend.',
    tone: 'casual, funny, chill',
    emoji: '😄',
    gradientFrom: '#F59E0B',
    gradientTo: '#EF4444',
    accentColor: '#F59E0B',
    previewMessage: "okay so I need to tell you something hilarious that just happened 😂",
  },
]

export const getPersonaById = (id) => PERSONAS.find((p) => p.id === id) ?? null

export const FREE_MESSAGE_LIMIT = 10       // messages before upsell
export const FREE_SESSION_MINUTES = 10     // minutes before upsell
export const FREE_SESSION_MS = FREE_SESSION_MINUTES * 60 * 1000
