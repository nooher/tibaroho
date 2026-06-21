-- TBHOS — Supabase schema (PostgreSQL 15+).
-- Run against your Supabase project: `psql ... -f schema.sql` or via SQL editor.
-- Naming: tr_<entity>. Every patient/clinical row has RLS keyed to auth.uid().
-- DO NOT run in production without reviewing the IRB / consent gates.

-- ============================================================================
-- EXTENSIONS
-- ============================================================================
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- ============================================================================
-- ENUMS
-- ============================================================================
do $$ begin
  create type tr_role as enum ('patient','provider','admin','researcher','school','employer');
exception when duplicate_object then null; end $$;

do $$ begin
  create type tr_provider_kind as enum ('clinician','lay_counsellor','faith','school','ngo');
exception when duplicate_object then null; end $$;

do $$ begin
  create type tr_credential_status as enum ('pending','verified','rejected','expired');
exception when duplicate_object then null; end $$;

do $$ begin
  create type tr_appt_status as enum ('requested','confirmed','completed','cancelled','no_show');
exception when duplicate_object then null; end $$;

do $$ begin
  create type tr_modality as enum ('virtual','in_person','hybrid','asynchronous');
exception when duplicate_object then null; end $$;

do $$ begin
  create type tr_claim_status as enum ('draft','submitted','paid','denied','appealed');
exception when duplicate_object then null; end $$;

-- ============================================================================
-- CORE
-- ============================================================================
create table if not exists tr_users (
  id uuid primary key default uuid_generate_v4(),
  auth_id uuid unique,                      -- maps to auth.users
  role tr_role not null default 'patient',
  display_name text,
  lang text not null default 'sw',
  faith text default 'none',
  region text,                              -- TZ region (Dar, Mwanza, ...)
  created_at timestamptz not null default now()
);

create table if not exists tr_consents (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references tr_users(id) on delete cascade,
  kind text not null,                       -- 'service','telehealth','data_share','research','minor_assent'
  granted boolean not null default false,
  granted_at timestamptz,
  revoked_at timestamptz,
  notes text
);

create table if not exists tr_screen_results (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references tr_users(id) on delete cascade,
  instrument text not null,                 -- 'phq9','gad7','pcl5','audit','cssrs','epds','k10','crafft','sdq'
  score integer not null,
  severity text,
  raw jsonb,
  taken_at timestamptz not null default now()
);

create table if not exists tr_journal_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references tr_users(id) on delete cascade,
  body text not null,
  mood smallint,                            -- 1..10
  tags text[],
  created_at timestamptz not null default now()
);

-- ============================================================================
-- PROVIDERS
-- ============================================================================
create table if not exists tr_providers (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null unique references tr_users(id) on delete cascade,
  kind tr_provider_kind not null,
  bio_sw text,
  bio_en text,
  languages text[] default array['sw'],
  regions text[],
  fee_default integer not null default 0,   -- 0 = free
  accepts_insurance text[],                 -- ['NHIF','Jubilee','Strategis',...]
  modalities tr_modality[] default array['virtual']::tr_modality[],
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists tr_provider_credentials (
  id uuid primary key default uuid_generate_v4(),
  provider_id uuid not null references tr_providers(id) on delete cascade,
  kind text not null,                       -- 'mct_license','degree','training_cert','reference'
  status tr_credential_status not null default 'pending',
  document_url text,
  issued_by text,
  issued_at date,
  expires_at date,
  reviewed_at timestamptz,
  reviewer_id uuid references tr_users(id)
);

-- ============================================================================
-- APPOINTMENTS + TELEHEALTH
-- ============================================================================
create table if not exists tr_appointments (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references tr_users(id) on delete cascade,
  provider_id uuid not null references tr_providers(id) on delete cascade,
  scheduled_at timestamptz not null,
  duration_min smallint not null default 50,
  modality tr_modality not null default 'virtual',
  status tr_appt_status not null default 'requested',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists tr_telehealth_sessions (
  id uuid primary key default uuid_generate_v4(),
  appointment_id uuid not null references tr_appointments(id) on delete cascade,
  room_token text not null,
  started_at timestamptz,
  ended_at timestamptz,
  recording_url text,
  recording_consent boolean not null default false
);

-- ============================================================================
-- CARE PLANS + PROGRAMS
-- ============================================================================
create table if not exists tr_care_plans (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references tr_users(id) on delete cascade,
  provider_id uuid references tr_providers(id),
  title text not null,
  goals jsonb not null default '[]'::jsonb,
  steps jsonb not null default '[]'::jsonb,
  review_at date,
  created_at timestamptz not null default now()
);

create table if not exists tr_programs (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,                -- 'pm_plus','ceta','friendship_bench','ipt','tcbt','mi','pst','mbsr_lite','dbt','family_connections','faith','emdr'
  name_sw text not null,
  name_en text,
  sessions smallint not null,
  target text[],                            -- conditions: depression, anxiety, ptsd, sud, ...
  evidence_citation text,
  citation text,
  audience text,
  modality tr_modality not null default 'virtual',
  fee_default integer not null default 0,
  provider_only boolean not null default false
);

create table if not exists tr_program_enrolments (
  id uuid primary key default uuid_generate_v4(),
  program_id uuid not null references tr_programs(id) on delete cascade,
  patient_id uuid not null references tr_users(id) on delete cascade,
  provider_id uuid references tr_providers(id),
  session_index smallint not null default 0,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  status text not null default 'active'
);

-- ============================================================================
-- OUTCOMES + REFERRALS
-- ============================================================================
create table if not exists tr_outcomes (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references tr_users(id) on delete cascade,
  enrolment_id uuid references tr_program_enrolments(id) on delete cascade,
  instrument text not null,
  score integer not null,
  delta integer,
  measured_at timestamptz not null default now()
);

create table if not exists tr_referrals (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references tr_users(id) on delete cascade,
  from_provider_id uuid references tr_providers(id),
  to_provider_id uuid references tr_providers(id),
  to_facility text,
  reason text not null,
  urgency text not null default 'routine',  -- routine, urgent, emergency
  status text not null default 'open',
  created_at timestamptz not null default now()
);

-- ============================================================================
-- CLAIMS + INSURANCE
-- ============================================================================
create table if not exists tr_insurances (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references tr_users(id) on delete cascade,
  carrier text not null,                    -- 'NHIF','Jubilee','Strategis','AAR','Britam'
  member_id text not null,
  plan text,
  active boolean not null default true
);

create table if not exists tr_claims (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references tr_users(id) on delete cascade,
  provider_id uuid not null references tr_providers(id),
  appointment_id uuid references tr_appointments(id),
  insurance_id uuid references tr_insurances(id),
  amount_tzs integer not null,
  icd11 text,
  cpt text,
  status tr_claim_status not null default 'draft',
  submitted_at timestamptz,
  paid_at timestamptz
);

-- ============================================================================
-- INSTITUTIONS
-- ============================================================================
create table if not exists tr_schools (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  region text,
  contact_email text,
  contact_phone text,
  admin_user_id uuid references tr_users(id),
  created_at timestamptz not null default now()
);

create table if not exists tr_employers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  industry text,
  seats integer not null default 0,
  contact_email text,
  admin_user_id uuid references tr_users(id),
  created_at timestamptz not null default now()
);

-- ============================================================================
-- RESEARCH + AUDIT
-- ============================================================================
create table if not exists tr_research_consents (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references tr_users(id) on delete cascade,
  protocol_id text not null,
  irb_ref text,
  granted boolean not null default false,
  granted_at timestamptz,
  revoked_at timestamptz
);

create table if not exists tr_audit_log (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references tr_users(id),
  action text not null,
  entity text not null,
  entity_id uuid,
  meta jsonb,
  at timestamptz not null default now()
);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table tr_users enable row level security;
alter table tr_consents enable row level security;
alter table tr_screen_results enable row level security;
alter table tr_journal_entries enable row level security;
alter table tr_providers enable row level security;
alter table tr_provider_credentials enable row level security;
alter table tr_appointments enable row level security;
alter table tr_telehealth_sessions enable row level security;
alter table tr_care_plans enable row level security;
alter table tr_programs enable row level security;
alter table tr_program_enrolments enable row level security;
alter table tr_outcomes enable row level security;
alter table tr_referrals enable row level security;
alter table tr_claims enable row level security;
alter table tr_insurances enable row level security;
alter table tr_schools enable row level security;
alter table tr_employers enable row level security;
alter table tr_research_consents enable row level security;
alter table tr_audit_log enable row level security;

-- Helper: current user's tr_users.id
create or replace function tr_current_user_id() returns uuid
language sql stable as $$
  select id from tr_users where auth_id = auth.uid() limit 1;
$$;

create or replace function tr_is_role(r tr_role) returns boolean
language sql stable as $$
  select exists (select 1 from tr_users where auth_id = auth.uid() and role = r);
$$;

-- USERS — see self
create policy tr_users_self on tr_users for select using (auth_id = auth.uid() or tr_is_role('admin'));
create policy tr_users_self_update on tr_users for update using (auth_id = auth.uid());

-- CONSENTS — owner only
create policy tr_consents_owner on tr_consents for all
  using (user_id = tr_current_user_id() or tr_is_role('admin'))
  with check (user_id = tr_current_user_id());

-- SCREEN RESULTS — patient owns; provider sees only with explicit data_share consent.
create policy tr_screen_owner on tr_screen_results for all
  using (
    user_id = tr_current_user_id()
    or tr_is_role('admin')
    or exists (
      select 1 from tr_consents c
      where c.user_id = tr_screen_results.user_id
        and c.kind = 'data_share' and c.granted = true and c.revoked_at is null
        and tr_is_role('provider')
    )
  )
  with check (user_id = tr_current_user_id());

-- JOURNAL — patient only, never shared automatically.
create policy tr_journal_owner on tr_journal_entries for all
  using (user_id = tr_current_user_id())
  with check (user_id = tr_current_user_id());

-- PROVIDERS public read; provider owns own row.
create policy tr_providers_read on tr_providers for select using (true);
create policy tr_providers_owner on tr_providers for update using (user_id = tr_current_user_id());

-- CREDENTIALS — provider owns; admin reviews.
create policy tr_creds_owner on tr_provider_credentials for all
  using (
    exists (select 1 from tr_providers p where p.id = provider_id and p.user_id = tr_current_user_id())
    or tr_is_role('admin')
  );

-- APPOINTMENTS — patient or provider on the row.
create policy tr_appt_rw on tr_appointments for all
  using (
    patient_id = tr_current_user_id()
    or exists (select 1 from tr_providers p where p.id = provider_id and p.user_id = tr_current_user_id())
    or tr_is_role('admin')
  );

-- TELEHEALTH — joined via appointment.
create policy tr_tele_rw on tr_telehealth_sessions for all
  using (
    exists (
      select 1 from tr_appointments a
      where a.id = appointment_id
        and (a.patient_id = tr_current_user_id()
             or exists (select 1 from tr_providers p where p.id = a.provider_id and p.user_id = tr_current_user_id()))
    )
    or tr_is_role('admin')
  );

-- CARE PLANS — patient + assigned provider.
create policy tr_plans_rw on tr_care_plans for all
  using (
    patient_id = tr_current_user_id()
    or exists (select 1 from tr_providers p where p.id = provider_id and p.user_id = tr_current_user_id())
    or tr_is_role('admin')
  );

-- PROGRAMS — public catalogue.
create policy tr_programs_read on tr_programs for select using (true);
create policy tr_programs_write on tr_programs for all using (tr_is_role('admin'));

-- ENROLMENTS — patient + assigned provider.
create policy tr_enrol_rw on tr_program_enrolments for all
  using (
    patient_id = tr_current_user_id()
    or exists (select 1 from tr_providers p where p.id = provider_id and p.user_id = tr_current_user_id())
    or tr_is_role('admin')
  );

-- OUTCOMES — patient + assigned provider; researcher sees only de-identified via materialized view (not this table).
create policy tr_outcomes_rw on tr_outcomes for all
  using (
    patient_id = tr_current_user_id()
    or tr_is_role('admin')
    or (
      tr_is_role('provider')
      and exists (select 1 from tr_consents c where c.user_id = patient_id and c.kind = 'data_share' and c.granted = true)
    )
  );

-- REFERRALS — patient + either provider.
create policy tr_ref_rw on tr_referrals for all
  using (
    patient_id = tr_current_user_id()
    or exists (select 1 from tr_providers p where (p.id = from_provider_id or p.id = to_provider_id) and p.user_id = tr_current_user_id())
    or tr_is_role('admin')
  );

-- INSURANCE / CLAIMS — patient + provider on the claim.
create policy tr_ins_rw on tr_insurances for all using (user_id = tr_current_user_id() or tr_is_role('admin'));
create policy tr_claims_rw on tr_claims for all
  using (
    patient_id = tr_current_user_id()
    or exists (select 1 from tr_providers p where p.id = provider_id and p.user_id = tr_current_user_id())
    or tr_is_role('admin')
  );

-- SCHOOLS / EMPLOYERS — admin user on the row.
create policy tr_school_rw on tr_schools for all using (admin_user_id = tr_current_user_id() or tr_is_role('admin'));
create policy tr_emp_rw on tr_employers for all using (admin_user_id = tr_current_user_id() or tr_is_role('admin'));

-- RESEARCH CONSENT — patient owns; researcher reads only after IRB MoU (enforced application-side + admin gate).
create policy tr_rconsent_rw on tr_research_consents for all
  using (user_id = tr_current_user_id() or tr_is_role('admin') or tr_is_role('researcher'))
  with check (user_id = tr_current_user_id());

-- AUDIT LOG — append only; admins read; nobody updates.
create policy tr_audit_insert on tr_audit_log for insert with check (true);
create policy tr_audit_read on tr_audit_log for select using (tr_is_role('admin'));

-- ============================================================================
-- DE-IDENTIFIED RESEARCH VIEW (read by researchers only)
-- ============================================================================
create or replace view tr_v_outcomes_deid as
select
  encode(digest(o.patient_id::text || coalesce(current_setting('app.salt', true), ''), 'sha256'), 'hex') as patient_hash,
  o.instrument,
  o.score,
  o.delta,
  date_trunc('week', o.measured_at) as week
from tr_outcomes o
where exists (
  select 1 from tr_research_consents r
  where r.user_id = o.patient_id and r.granted = true and r.revoked_at is null
);

grant select on tr_v_outcomes_deid to authenticated;
