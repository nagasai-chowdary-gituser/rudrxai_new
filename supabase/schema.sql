-- ============================================================================
-- Rudrova Labs — Client Portal, Admin Panel & Reviews
-- ============================================================================
-- Paste this whole file into the Supabase SQL Editor and run it once.
--
-- Security model: the website NEVER talks to Supabase from the browser. Every
-- read and write goes through a Next.js server route using the service role
-- key. RLS is therefore enabled with NO permissive policies — if the anon key
-- ever leaks, it can read nothing at all.
-- ============================================================================

-- ----------------------------------------------------------------- clients
create table if not exists public.clients (
  id              uuid primary key default gen_random_uuid(),
  username        text not null unique,
  password_hash   text not null,
  display_name    text not null,
  company         text,
  reviews_enabled boolean not null default false,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

-- Usernames are matched case-insensitively at login.
create unique index if not exists clients_username_lower_idx
  on public.clients (lower(username));

-- ---------------------------------------------------------------- projects
create table if not exists public.projects (
  id              uuid primary key default gen_random_uuid(),
  client_id       uuid not null references public.clients(id) on delete cascade,
  name            text not null,
  pdf_path        text,
  pdf_name        text,
  currency        text not null default 'INR' check (currency in ('INR', 'USD')),
  revisions_used  integer not null default 0 check (revisions_used >= 0),
  revisions_total integer not null default 0 check (revisions_total >= 0),
  advance_paid    numeric(12, 2) not null default 0 check (advance_paid >= 0),
  total_charge    numeric(12, 2) not null default 0 check (total_charge >= 0),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists projects_client_id_idx on public.projects (client_id);

-- ----------------------------------------------------------------- reviews
create table if not exists public.reviews (
  id           uuid primary key default gen_random_uuid(),
  client_id    uuid not null references public.clients(id) on delete cascade,
  rating       integer not null check (rating between 1 and 5),
  body         text not null,
  status       text not null default 'pending'
               check (status in ('pending', 'published', 'hidden')),
  submitted_at timestamptz not null default now(),
  reviewed_at  timestamptz
);

-- One review per client, ever.
create unique index if not exists reviews_one_per_client_idx
  on public.reviews (client_id);

create index if not exists reviews_status_idx on public.reviews (status);

-- ---------------------------------------------------------- admin settings
-- Single row. Seeded from environment variables on first use, after which the
-- admin panel can change the credentials without a redeploy.
create table if not exists public.admin_settings (
  id            integer primary key default 1 check (id = 1),
  username      text not null,
  -- Unused. The den has no password: the torch colour, the username and the
  -- pattern are the whole answer. Kept because dropping a column needs a
  -- migration; it is seeded with a random value that nobody holds.
  password_hash text not null,
  -- No defaults: these are seeded from environment variables on first use, so
  -- the real answers never appear in this file.
  gate_color    text not null,
  pattern       text not null,
  updated_at    timestamptz not null default now()
);

-- ------------------------------------------------------------ gate attempts
-- Failed admin-gate attempts, used for lockout. Stored in the database rather
-- than in memory because serverless instances do not share state.
create table if not exists public.gate_attempts (
  id         bigserial primary key,
  ip         text not null,
  step       text not null,
  created_at timestamptz not null default now()
);

create index if not exists gate_attempts_ip_created_idx
  on public.gate_attempts (ip, created_at desc);

-- ------------------------------------------------------------- audit trail
create table if not exists public.admin_audit (
  id         bigserial primary key,
  event      text not null,
  detail     text,
  ip         text,
  created_at timestamptz not null default now()
);

create index if not exists admin_audit_created_idx
  on public.admin_audit (created_at desc);

-- ============================================================================
-- Row Level Security: enabled everywhere, with no policies granted.
-- The service role key bypasses RLS; every other key is denied.
-- ============================================================================
alter table public.clients        enable row level security;
alter table public.projects       enable row level security;
alter table public.reviews        enable row level security;
alter table public.admin_settings enable row level security;
alter table public.gate_attempts  enable row level security;
alter table public.admin_audit    enable row level security;

-- ============================================================================
-- Storage: the private "project-files" bucket is created through the Storage
-- API (npm run verify:setup reports it), NOT here.
--
-- Inserting into storage.buckets from the SQL editor is rejected on some
-- projects, and because the editor runs this file as a single transaction that
-- one failure rolls back every table above it. If you ever need to recreate it,
-- use the dashboard: Storage > New bucket > name "project-files", Public OFF.
-- ============================================================================

-- ============================================================================
-- Housekeeping: keep the attempt log small on the free tier.
-- ============================================================================
create or replace function public.prune_gate_attempts()
returns void
language sql
as $$
  delete from public.gate_attempts where created_at < now() - interval '1 day';
$$;
