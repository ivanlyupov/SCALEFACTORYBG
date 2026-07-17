-- =============================================================
-- SCALEFACTORYBG — ONBOARDING SETUP
-- Where to run this: Supabase dashboard → your project →
-- "SQL Editor" → New query → paste ALL of this → Run.
-- Stores the questionnaire new clients fill in at /onboarding.
-- Locked down like everything else: RLS on, no public policies —
-- only your server (secret key) can read/write.
-- =============================================================

create table if not exists public.onboarding_submissions (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  brand        text not null,            -- brand name (for the admin list)
  contact_name text not null,
  email        text not null,
  website      text,
  answers      jsonb not null default '{}'::jsonb,  -- all questionnaire answers
  reviewed     boolean default false
);

alter table public.onboarding_submissions enable row level security;

-- (Intentionally no policies — server-only access via the secret key.)

create index if not exists onboarding_created_idx
  on public.onboarding_submissions (created_at desc);

-- Done. Submissions appear in your site at /admin → tab "Онбординг".
