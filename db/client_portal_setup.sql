-- =============================================================
-- SCALEFACTORYBG — CLIENT PORTAL SETUP (Stage 1)
-- Where to run this: Supabase dashboard → your project →
-- "SQL Editor" → New query → paste ALL of this → Run.
-- Creates the tables for the private per-client dashboard at /client.
-- Like the leads table, everything is locked down (RLS on, no public
-- policies) — only your server (secret key) can read/write it.
-- =============================================================

-- 1) CLIENTS — one row per customer
create table if not exists public.clients (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  name            text not null,                 -- contact / company name
  brand           text not null,                 -- brand shown at the top
  role            text,                           -- e.g. "Компресивен наколенник · DTC"
  plan            text default 'CreativeOS™',
  assets_used     int  default 0,
  assets_total    int  default 20,
  pipeline_stage  text default 'production',      -- research|scripts|production|review|delivered
  access_code     text not null unique,           -- the client's private login code
  last_updated_at timestamptz default now(),      -- shown to client as "last updated"
  archived        boolean default false
);

-- 2) DELIVERABLES — the creatives; section = "this_week" or "upcoming"
create table if not exists public.deliverables (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid not null references public.clients(id) on delete cascade,
  section     text not null default 'this_week',  -- this_week | upcoming
  title       text not null,
  kind        text,                                -- small label e.g. "VSL · 1:40"
  status      text default 'in_progress',          -- in_progress | review | delivered
  due_date    date,
  preview_url text,                                -- optional link to the creative
  sort        int default 0,
  created_at  timestamptz not null default now()
);

-- 3) METRICS — the client's results (from → to)
create table if not exists public.metrics (
  id         uuid primary key default gen_random_uuid(),
  client_id  uuid not null references public.clients(id) on delete cascade,
  label      text not null,                        -- e.g. "ROAS · 30 дни"
  from_value text,
  to_value   text,
  sort       int default 0
);

-- 4) CLIENT REQUESTS — messages a client sends you from their portal
create table if not exists public.client_requests (
  id         uuid primary key default gen_random_uuid(),
  client_id  uuid not null references public.clients(id) on delete cascade,
  message    text not null,
  created_at timestamptz not null default now(),
  resolved   boolean default false
);

-- 5) Lock everything down (only the server's secret key can touch these)
alter table public.clients         enable row level security;
alter table public.deliverables    enable row level security;
alter table public.metrics         enable row level security;
alter table public.client_requests enable row level security;

-- 6) Helpful indexes
create index if not exists deliverables_client_idx     on public.deliverables (client_id);
create index if not exists metrics_client_idx          on public.metrics (client_id);
create index if not exists client_requests_client_idx  on public.client_requests (client_id, created_at desc);
create index if not exists clients_access_code_idx     on public.clients (access_code);

-- Done. Manage clients from your site at /admin → tab "Клиенти".
