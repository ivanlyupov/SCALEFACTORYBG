-- =============================================================
-- MOTIONCRAFTBG — add the phone number to the leads table
-- Where to run this: Supabase dashboard → your project →
-- "SQL Editor" → New query → paste this → Run.
-- Safe to run more than once.
-- =============================================================

alter table public.leads
  add column if not exists phone text;

-- refresh Supabase's schema cache so the API sees the new column immediately
notify pgrst, 'reload schema';
