# Next Steps — Start Here

## 1. Install dependencies (do both)
```bash
cd frontend && npm install
cd ../backend && npm install
```

## 2. Set up Supabase
1. Go to https://supabase.com → New project
2. Copy your Project URL and anon key → paste into `frontend/.env`
3. Copy your service role key → paste into `backend/.env`
4. Go to SQL Editor → paste entire contents of `backend/db/schema.sql` → Run

## 3. Set env vars
```bash
# frontend/.env  (copy from .env.example)
VITE_API_URL=http://localhost:4000
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_STRIPE_PUBLISHABLE_KEY=...

# backend/.env  (copy from .env.example)
PORT=4000
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
JWT_SECRET=any_long_random_string_here
FRONTEND_URL=http://localhost:5173
```

## 4. Run both servers
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

App runs at: http://localhost:5173
API runs at: http://localhost:4000

## 5. Test the happy path
1. Go to http://localhost:5173
2. Register an account
3. Pick a persona
4. Send 10 messages — upsell modal should appear
5. Go to /operator/login → email: admin@myigirlfriend.com → password: Admin1234!

## 6. Stripe setup (Phase 2 — do after Phase 1 works)
1. Create 2 products in Stripe dashboard: Basic ($9.99/mo) and Premium ($19.99/mo)
2. Copy their Price IDs → add to `backend/.env`:
   STRIPE_BASIC_PRICE_ID=price_...
   STRIPE_PREMIUM_PRICE_ID=price_...
3. Set up webhook: stripe listen --forward-to localhost:4000/api/subscription/webhook

## Phase 1 Build Order (Days 1–12)
- [x] Project structure ← YOU ARE HERE
- [ ] Verify auth works (register → login → redirect)
- [ ] Verify persona select → chat flow works end to end
- [ ] Verify AI reply comes back from OpenAI
- [ ] Verify upsell fires at 10 messages
- [ ] Operator login + queue + suggestions working

## Phase 2 Build Order (Days 13–25)
- [ ] Stripe checkout + webhook → update subscriptions table
- [ ] Memory system: extract facts from chat, store in user_memory
- [ ] Operator agent hours clock-in/out
- [ ] Polish UI — animations, loading states

## Phase 3 (Days 26–30)
- [ ] Deploy backend to Railway
- [ ] Deploy frontend to Vercel
- [ ] Set production env vars
- [ ] End-to-end test on production
- [ ] Handover to client

---

## Key files to know

| File | What it does |
|---|---|
| `frontend/src/config/personas.js` | All persona metadata (names, colors, taglines) |
| `backend/services/ai.service.js` | All OpenAI prompts — tune persona voices here |
| `backend/db/schema.sql` | Full DB schema — run once in Supabase |
| `backend/routes/subscription.routes.js` | Stripe checkout + webhook handler |
| `frontend/src/hooks/useChat.js` | Free limit logic + upsell trigger |
