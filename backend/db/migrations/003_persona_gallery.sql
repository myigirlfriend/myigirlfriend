-- ============================================================
-- Photo gallery for each model: more pictures of her, shown on her profile.
-- Run in the Supabase SQL editor after 002_new_models.sql. Safe to run more than once.
-- The main photo stays in image_url; gallery holds the extra ones, in display order.
-- ============================================================

alter table personas add column if not exists gallery text[] not null default '{}';
