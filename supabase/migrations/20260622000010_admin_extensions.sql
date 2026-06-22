-- Admin extensions for @laetoli/admin canonical shell.
-- Six tables backing the modules that don't have a domain home:
--   api_keys                — programmatic access tokens
--   broadcasts              — in-product and email blasts
--   export_jobs             — bulk data exports
--   impersonation_sessions  — support-tool impersonations (audited)
--   tenant_branding         — per-tenant logo / colour / domain
--   admin_audit             — write-once audit log for admin mutations
--
-- RLS: every table restricted to the admin-role predicate per this app.
-- Edge functions write to admin_audit via the service role.

create extension if not exists pgcrypto;

-- ── api_keys ────────────────────────────────────────────────────────────
create table if not exists api_keys (
  id          uuid primary key default gen_random_uuid(),
  label       text not null,
  prefix      text not null,
  hash        text not null,                  -- never store secret in clear
  scopes      text[] not null default '{}',
  created_at  timestamptz not null default now(),
  created_by  uuid,
  last_used_at timestamptz,
  expires_at  timestamptz,
  revoked_at  timestamptz
);
create index if not exists api_keys_prefix_idx on api_keys (prefix);

-- ── broadcasts ──────────────────────────────────────────────────────────
create table if not exists broadcasts (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  body          text not null,
  audience      text not null check (audience in ('all','admins','tenant')),
  tenant_id     uuid,
  scheduled_for timestamptz,
  sent_at       timestamptz,
  status        text not null default 'draft' check (status in ('draft','scheduled','sent')),
  created_by    uuid,
  created_at    timestamptz not null default now()
);

-- ── export_jobs ─────────────────────────────────────────────────────────
create table if not exists export_jobs (
  id            uuid primary key default gen_random_uuid(),
  kind          text not null,
  requested_at  timestamptz not null default now(),
  requested_by  uuid,
  status        text not null default 'queued' check (status in ('queued','running','ready','failed')),
  download_url  text,
  bytes         bigint
);

-- ── impersonation_sessions ──────────────────────────────────────────────
create table if not exists impersonation_sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null,
  actor_id    uuid not null,
  reason      text not null,
  started_at  timestamptz not null default now(),
  expires_at  timestamptz not null,
  ended_at    timestamptz
);

-- ── tenant_branding ─────────────────────────────────────────────────────
create table if not exists tenant_branding (
  tenant_id     uuid primary key,
  logo_url      text,
  primary_color text,
  login_splash  text,
  custom_domain text,
  updated_at    timestamptz not null default now()
);

-- ── admin_audit ─────────────────────────────────────────────────────────
-- Append-only record of every admin mutation. Written by edge functions
-- using the service role; readable by admin-role users only.
create table if not exists admin_audit (
  id          uuid primary key default gen_random_uuid(),
  at          timestamptz not null default now(),
  actor_id    uuid,                       -- auth.uid() of the admin
  actor_label text,                       -- display label captured at the time
  action      text not null,              -- 'user.invite' | 'user.suspend' | etc.
  target_id   text,                       -- subject of the action
  meta        jsonb,                      -- structured args / outcome
  outcome     text not null default 'success' check (outcome in ('success','denied','error'))
);
create index if not exists admin_audit_at_idx on admin_audit (at desc);
create index if not exists admin_audit_actor_idx on admin_audit (actor_id);

-- Tamper-evident: admin_audit is append-only (no UPDATE / DELETE).
create or replace function admin_audit_immutable() returns trigger
  language plpgsql as $$
begin
  raise exception 'admin_audit is append-only';
end $$;

drop trigger if exists admin_audit_immutable on admin_audit;
create trigger admin_audit_immutable before update or delete on admin_audit
  for each row execute function admin_audit_immutable();

-- ── RLS ─────────────────────────────────────────────────────────────────
alter table api_keys                enable row level security;
alter table broadcasts              enable row level security;
alter table export_jobs             enable row level security;
alter table impersonation_sessions  enable row level security;
alter table tenant_branding         enable row level security;
alter table admin_audit             enable row level security;

-- Admin-role predicate: only users whose row in tr_users matches the
-- admin-role check for THIS app may read or write these tables. Edge functions
-- bypass RLS via the service-role key.
create or replace function admin_is_admin() returns boolean
  language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from tr_users
    where auth_id = auth.uid()
      and (role::text in ('admin','executive','provider'))
  )
$$;

drop policy if exists api_keys_admin on api_keys;
create policy api_keys_admin on api_keys for all to authenticated using (admin_is_admin()) with check (admin_is_admin());

drop policy if exists broadcasts_admin on broadcasts;
create policy broadcasts_admin on broadcasts for all to authenticated using (admin_is_admin()) with check (admin_is_admin());

drop policy if exists export_jobs_admin on export_jobs;
create policy export_jobs_admin on export_jobs for all to authenticated using (admin_is_admin()) with check (admin_is_admin());

drop policy if exists impersonation_admin on impersonation_sessions;
create policy impersonation_admin on impersonation_sessions for all to authenticated using (admin_is_admin()) with check (admin_is_admin());

drop policy if exists branding_admin on tenant_branding;
create policy branding_admin on tenant_branding for all to authenticated using (admin_is_admin()) with check (admin_is_admin());

drop policy if exists admin_audit_read on admin_audit;
create policy admin_audit_read on admin_audit for select to authenticated using (admin_is_admin());
-- admin_audit writes happen via service role only (edge functions), never from the browser.
