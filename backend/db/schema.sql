-- ============================================================
-- MyIGirlfriend — Supabase Schema
-- Run this entire file in your Supabase project SQL editor
-- ============================================================

-- Users
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  password_hash text not null,
  status text default 'active',
  created_at timestamptz default now()
);

-- Personas
create table if not exists personas (
  id text primary key,  -- 'zara', 'maya', etc.
  name text not null,
  tone text,
  tagline text,
  created_at timestamptz default now()
);

-- Conversations
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  persona_id text references personas(id),
  status text default 'active',
  created_at timestamptz default now()
);

-- Messages
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  sender text not null,  -- 'user' | 'ai' | 'operator'
  content text not null,
  created_at timestamptz default now()
);

-- User memory (key-value facts about each user)
create table if not exists user_memory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  key text not null,
  value text not null,
  created_at timestamptz default now(),
  unique(user_id, key)
);

-- Subscriptions
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references users(id) on delete cascade,
  plan text default 'free',
  status text default 'inactive',
  stripe_customer_id text,
  created_at timestamptz default now()
);

-- Usage tracking (free tier message count)
create table if not exists usage_tracking (
  user_id uuid primary key references users(id) on delete cascade,
  message_count int default 0,
  last_reset timestamptz default now()
);

-- Operators (human agents)
create table if not exists operators (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  password_hash text not null,
  role text default 'agent',
  created_at timestamptz default now()
);

-- Operator clock-in sessions
create table if not exists operator_sessions (
  id uuid primary key default gen_random_uuid(),
  operator_id uuid references operators(id) on delete cascade,
  clock_in timestamptz default now(),
  clock_out timestamptz
);

-- ─── Indexes for performance ──────────────────────────────────
create index if not exists idx_messages_conv on messages(conversation_id);
create index if not exists idx_conversations_user on conversations(user_id);
create index if not exists idx_memory_user on user_memory(user_id);

-- ─── Row Level Security (RLS) — enable per table ──────────────
-- NOTE: Since we use service role key on the backend, RLS is bypassed.
-- Enable it anyway as good practice if you ever add direct client access.
alter table users enable row level security;
alter table messages enable row level security;
alter table conversations enable row level security;

-- ─── Seed first operator account ─────────────────────────────
-- Password: Admin1234! (bcrypt hash below)
-- CHANGE THIS before going live.
insert into operators (name, email, password_hash, role)
values ('Admin', 'admin@myigirlfriend.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh7y', 'admin')
on conflict (email) do nothing;
