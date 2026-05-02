# MyIGirlfriend — Full Project Reference

> **Read this first in any new chat session** — it has everything needed to continue development.

---

## What This Project Is

A paid AI companion/dating practice web app. Users chat with one of 5 AI personas.
The platform has a user-facing chat UI, a Stripe subscription system, and an operator dashboard for up to 8 human agents who can monitor and respond to chats with AI suggestions.

**Client:** Bree | **Developer:** Joe | **Budget:** $1,600 | **Timeline:** 30 days from May 1 2026

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React + Vite | Fast, component-based, mobile-first |
| Styling | TailwindCSS | Utility-first, easy dark theme |
| State | Zustand | Lightweight, no boilerplate |
| Backend | Node.js + Express | Matches docs, great SDK support |
| Database | Supabase (PostgreSQL) | Auth + Realtime built-in |
| AI | OpenAI API (GPT-4o) | Persona responses |
| Payments | Stripe | Subscriptions + webhooks |
| Hosting | Railway (backend) + Vercel (frontend) | Easy deploys |

---

## Brand / Theme

- **Background:** `#0a0a0a` (near black)
- **Primary gradient:** `#9B59B6` (purple) → `#E91E8C` (pink) — used on logo, buttons, active elements
- **Text:** white on dark, muted gray for secondary
- **Font:** Nunito (Google Fonts) — rounded, bubbly, matches logo
- **Logo tagline:** "conversation. connection. something real."
- **Accent:** gradient border on chat bubbles, glowing purple shadow on inputs

Apply this consistently across all pages and components.

---

## The 5 AI Personas

| Name | Personality | Best for |
|---|---|---|
| Zara | Playful Flirt — witty, teasing, bold | Hook new users |
| Maya | Supportive Listener — warm, empathetic | Retention |
| Elena | Deep Thinker — calm, philosophical | Intellectual users |
| Mariah | Sweet Romantic — affectionate, gentle | Emotional bonding |
| Hannah | Easygoing Friend — casual, funny, relatable | Broad appeal |

Each has a distinct system prompt in `backend/services/ai.service.js`.

---

## Database Tables (Supabase)

```
users             — id, name, email, status, created_at
personas          — id, name, prompt, tone, example_messages
conversations     — id, user_id, persona_id, status, created_at
messages          — id, conversation_id, sender, content, created_at
user_memory       — id, user_id, key, value
subscriptions     — id, user_id, plan, status, stripe_customer_id
usage_tracking    — user_id, message_count, last_reset
operators         — id, name, email, password_hash, role
operator_sessions — id, operator_id, clock_in, clock_out
```

---

## Key Business Rules

- Free users: 10 messages OR 10 minutes → upsell modal fires
- Upsell: AI-generated message with Stripe payment link embedded
- Operators: up to 8 agents, each gets assigned chats from a queue
- Operator sees 3 AI reply suggestions per message, can edit or write custom
- AI replies: always 1–2 sentences, human-like pacing with typing delay
- No explicit content — keep all personas tasteful

---

## Build Phases

| Phase | Days | Deliverable | Payment |
|---|---|---|---|
| 1 | 1–12 | Chat + AI + Personas + Auth + DB | $800 |
| 2 | 13–25 | Stripe + Memory + Operator Dashboard | $800 |
| 3 | 26–30 | Testing + Deploy + Handover | included |

---

## Environment Variables Needed

```bash
# frontend/.env
VITE_API_URL=http://localhost:4000
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_STRIPE_PUBLISHABLE_KEY=

# backend/.env
PORT=4000
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
JWT_SECRET=
```

---

## Next Steps (in order)

1. `cd myigirlfriend && npm install` in both `frontend/` and `backend/`
2. Create Supabase project → copy URL + keys into `.env`
3. Run the SQL in `backend/db/schema.sql` in Supabase SQL editor
4. Add OpenAI API key
5. `npm run dev` in both folders — app runs on localhost:5173 (FE) and :4000 (BE)
6. Start with Phase 1: Chat UI → persona select → AI response working end-to-end
7. Then add auth (Supabase Auth)
8. Then Stripe (Phase 2)
9. Then operator dashboard (Phase 2)

---

## Folder Layout

```
myigirlfriend/
├── README.md                  ← YOU ARE HERE — read in every new session
├── frontend/                  ← React + Vite app
└── backend/                   ← Node.js + Express API
```

See `frontend/src/` and `backend/` folders for full structure.
