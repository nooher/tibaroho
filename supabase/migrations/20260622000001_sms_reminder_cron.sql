-- ============================================================================
-- 20260622000001_sms_reminder_cron.sql
--
-- Schedules a pg_cron job that, every 10 minutes, finds confirmed
-- appointments scheduled to start in 22-26 hours and inserts a reminder
-- task row. A separate edge function (`sms-send`) is triggered by the task
-- row via Supabase Channels, sending the SMS via the configured aggregator.
--
-- Tables:
--   tr_reminder_tasks — work queue with status (queued|sent|failed|skipped)
--
-- Cron job:
--   tabhos_sms_reminder_24h — runs every 10 min, enqueues 24h tasks
--
-- Idempotent: re-running this migration is safe (drop+recreate semantics).
-- ============================================================================

create table if not exists tr_reminder_tasks (
  id              uuid primary key default gen_random_uuid(),
  appointment_id  uuid not null references tr_appointments(id) on delete cascade,
  kind            text not null,
  patient_id      uuid references tr_users(id) on delete set null,
  provider_id     uuid references tr_providers(id) on delete set null,
  msisdn          text,
  body            text,
  scheduled_for   timestamptz not null,
  status          text not null default 'queued',
  rail_ref        text,
  attempts        int  not null default 0,
  last_error      text,
  created_at      timestamptz not null default now(),
  sent_at         timestamptz,
  unique (appointment_id, kind)
);
create index if not exists ix_tr_reminder_tasks_status on tr_reminder_tasks(status, scheduled_for);

-- The enqueue function: scans tr_appointments for upcoming sessions and
-- inserts reminder tasks where they don't already exist.
-- Use a unique dollar-quote tag ($body$) so we can wrap the whole thing
-- inside a DO block later without dollar-quote collision.
create or replace function tabhos_enqueue_sms_reminders() returns void
language plpgsql security definer
as $body$
begin
  insert into tr_reminder_tasks (appointment_id, kind, patient_id, provider_id, msisdn, body, scheduled_for)
  select
    a.id,
    '24h_sms',
    a.patient_id,
    a.provider_id,
    null,
    'Kumbusho: una miadi ya TABHOS kesho saa ' || to_char(a.scheduled_at at time zone 'Africa/Dar_es_Salaam', 'HH24:MI'),
    a.scheduled_at - interval '24 hours'
  from tr_appointments a
  where a.status in ('confirmed','requested')
    and a.scheduled_at between now() + interval '22 hours' and now() + interval '26 hours'
  on conflict (appointment_id, kind) do nothing;
end;
$body$;

-- Schedule the cron job only when pg_cron is available (Supabase platform
-- has it; local self-hosted dev usually does not). Use a unique tag
-- ($plpgsql$) for the DO body so the inner cron.schedule call statement
-- (which itself is a plain string, not a dollar-quoted block) doesn't
-- collide.
do $plpgsql$
declare
  cron_present boolean;
  job_exists   boolean;
begin
  select exists (select 1 from pg_extension where extname = 'pg_cron')
    into cron_present;

  if not cron_present then
    raise notice 'pg_cron not installed; skipping schedule of tabhos_sms_reminder_24h';
    return;
  end if;

  select exists (select 1 from cron.job where jobname = 'tabhos_sms_reminder_24h')
    into job_exists;

  if job_exists then
    perform cron.unschedule('tabhos_sms_reminder_24h');
  end if;

  perform cron.schedule(
    'tabhos_sms_reminder_24h',
    '*/10 * * * *',
    'select tabhos_enqueue_sms_reminders();'
  );
end
$plpgsql$;
