-- =============================================================
-- SCALEFACTORYBG — SUPABASE SETUP
-- Where to run this: Supabase dashboard → your project →
-- left menu "SQL Editor" → New query → paste ALL of this → Run.
-- =============================================================

-- 1) The table that stores every contact-form submission (lead)
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  brand       text not null,
  email       text not null,
  message     text,
  source      text default 'website'
);

-- 2) Turn on Row Level Security.
-- With RLS ON and NO public policies, the browser/anon key CANNOT
-- read or write this table. Your Vercel serverless function uses the
-- SERVICE ROLE key, which bypasses RLS — so only your server can insert.
-- This is what keeps your leads private and blocks spam bots.
alter table public.leads enable row level security;

-- (Intentionally no policies here. Do NOT add an "anon insert" policy
--  unless you know why — it would let anyone write to your table.)

-- 3) Helpful index for sorting newest-first in the dashboard
create index if not exists leads_created_at_idx
  on public.leads (created_at desc);

-- Done. View your leads anytime under: Table Editor → leads
