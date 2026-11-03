-- =============================================================================
-- STEWARD ADMIN & INSIGHTS — PHASE 1: FOUNDATION, RLS & AUDIT LOGS
-- Run this migration in the Supabase SQL Editor.
-- =============================================================================

create extension if not exists "pgcrypto";

-- 1. Admin Allowlist Table (mirrors ADMIN_EMAILS for database-level RLS checks)
create table if not exists public.admin_allowlist (
  email text primary key,
  name text not null check (name in ('Ashish', 'Ruchi')),
  created_at timestamptz not null default now()
);

alter table public.admin_allowlist enable row level security;

-- Replace the placeholder emails below with Ashish and Ruchi's exact emails
insert into public.admin_allowlist (email, name)
values
  ('connect@hellosteward.agency', 'Ashish'),
  ('ashish@hellosteward.agency', 'Ashish'),
  ('ruchi@hellosteward.agency', 'Ruchi'),
  ('ashish@steward.agency', 'Ashish'),
  ('ruchi@steward.agency', 'Ruchi')
on conflict (email) do update set name = excluded.name;

-- 2. Database-level helper: requires authenticated session + verified TOTP MFA (aal2) + allowlisted email
create or replace function public.is_authenticated_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select
    auth.role() = 'authenticated'
    and coalesce(auth.jwt() ->> 'aal', '') = 'aal2'
    and exists (
      select 1
      from public.admin_allowlist a
      where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    );
$$;

create policy "Admins can view allowlist"
  on public.admin_allowlist
  for select
  to authenticated
  using (public.is_authenticated_admin());

-- 3. Admin Sign-In & Security Audit Logs
create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  email text,
  event_type text not null check (
    event_type in (
      'login_success',
      'login_failed',
      'login_locked',
      'unauthorized_email_blocked',
      'mfa_enrolled',
      'mfa_verified',
      'mfa_failed',
      'sign_out',
      'sign_out_everywhere'
    )
  ),
  ip_address text,
  user_agent text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_admin_audit_logs_created_at
  on public.admin_audit_logs (created_at desc);

alter table public.admin_audit_logs enable row level security;

create policy "Admins can read audit logs"
  on public.admin_audit_logs
  for select
  to authenticated
  using (public.is_authenticated_admin());

-- 4. Login Rate Limiting Table (Server-only access via service_role key)
create table if not exists public.admin_rate_limits (
  key text primary key,
  attempts int not null default 0,
  first_attempt_at timestamptz not null default now(),
  locked_until timestamptz
);

alter table public.admin_rate_limits enable row level security;
-- No public/authenticated policies on admin_rate_limits: only accessible via server service_role

-- 5. Leads Tables (Phase 1 RLS foundation + Phase 2 schema ready)
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  intent text not null check (intent in ('audit', 'conversation')),
  name text not null,
  email text not null,
  product_link text,
  stage text check (stage in ('Idea', 'Live product', 'Not sure') or stage is null),
  message text not null,
  source_button text,
  source_page text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referrer text,
  status text not null default 'new' check (
    status in ('new', 'replied', 'audit_sent', 'call_booked', 'won', 'lost')
  ),
  assigned_to text check (assigned_to in ('Ashish', 'Ruchi') or assigned_to is null)
);

create index if not exists idx_leads_created_at on public.leads (created_at desc);
create index if not exists idx_leads_status on public.leads (status);

alter table public.leads enable row level security;

-- Public visitors can ONLY insert leads (never read, update, or delete)
create policy "Public visitors can insert leads"
  on public.leads
  for insert
  to anon, authenticated
  with check (
    intent in ('audit', 'conversation')
    and status = 'new'
    and assigned_to is null
  );

-- Authenticated MFA-verified admins can read, update, and delete leads
create policy "Admins have full access to leads"
  on public.leads
  for all
  to authenticated
  using (public.is_authenticated_admin())
  with check (public.is_authenticated_admin());

create table if not exists public.lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  author text not null check (author in ('Ashish', 'Ruchi')),
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_lead_notes_lead_id on public.lead_notes (lead_id, created_at desc);

alter table public.lead_notes enable row level security;

create policy "Admins have full access to lead_notes"
  on public.lead_notes
  for all
  to authenticated
  using (public.is_authenticated_admin())
  with check (public.is_authenticated_admin());

create table if not exists public.lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  type text not null check (type in ('status_change', 'note', 'email_sent')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_lead_events_lead_id on public.lead_events (lead_id, created_at desc);

alter table public.lead_events enable row level security;

create policy "Admins have full access to lead_events"
  on public.lead_events
  for all
  to authenticated
  using (public.is_authenticated_admin())
  with check (public.is_authenticated_admin());

-- 6. Blog Posts Table (Phase 1 RLS foundation + Phase 3/4 schema ready)
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text not null default '' check (char_length(summary) <= 160),
  category text not null check (category in ('Revenue', 'Product', 'Growth', 'Pricing', 'Launch')),
  author text not null check (author in ('Ashish', 'Ruchi')),
  cover_image_url text,
  cover_image_alt text not null default '',
  body jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'published')),
  publish_at timestamptz,
  featured boolean not null default false,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by text check (updated_by in ('Ashish', 'Ruchi') or updated_by is null)
);

-- Enforce that only ONE post can be featured at a time
create unique index if not exists idx_posts_single_featured
  on public.posts (featured)
  where featured = true;

create index if not exists idx_posts_public_listing
  on public.posts (status, publish_at desc);

alter table public.posts enable row level security;

-- Public visitors can ONLY read published posts whose publish_at is in the past
create policy "Public visitors can read published posts"
  on public.posts
  for select
  to anon, authenticated
  using (
    status = 'published'
    and (publish_at is null or publish_at <= now())
  );

-- Authenticated MFA-verified admins have full access to all posts
create policy "Admins have full access to posts"
  on public.posts
  for all
  to authenticated
  using (public.is_authenticated_admin())
  with check (public.is_authenticated_admin());

-- 7. 24-Month Lead Retention Cleanup Function (deletes leads > 24 months unless status = 'won')
create or replace function public.cleanup_expired_leads()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count integer;
begin
  with deleted as (
    delete from public.leads
    where created_at < (now() - interval '24 months')
      and status <> 'won'
    returning id
  )
  select count(*) into deleted_count from deleted;

  return deleted_count;
end;
$$;
