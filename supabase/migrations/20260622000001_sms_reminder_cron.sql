-- ============================================================================
-- 20260622000001_sms_reminder_cron.sql
--
-- Schedules a pg_cron job that, every 10 minutes, finds confirmed
-- appointments scheduled to start in 22-26 hours and inserts a reminder
-- task row. A separate edge function (`sms-send`) is triggered by the task
-- row via Supabase Channels, sending the SMS via the configured aggregator.
--
-- Two tables wired:
--   tr_reminder_tasks — work queue with status (queued|sent|failed)
--   pg_cron job 'tabhos_sms_reminder_24h' — enqueues tasks
--
-- Idempotency: the (appointment_id, kind) pair is UNIQUE so re-runs of the
-- cron don't duplicate the work.
-- ============================================================================

create table if not exists tr_reminder_tasks (
  id              uuid primary key default gen_random_uuid(),
  appointment_id  uuid not null references tr_appointments(id) on delete cascade,
  kind            text not null,                -- '24h_sms' | '1h_sms' | …
  patient_id      uuid references tr_users(id) on delete set null,
  provider_id     uuid references tr_providers(id) on delete set null,
  msisdn          text,
  body            text,
  scheduled_for   timestamptz not null,
  status          text not null default 'queued', -- queued|sent|failed|skipped
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
create or replace function tabhos_enqueue_sms_reminders() returns void as $$
begin
  insert into tr_reminder_tasks (appointment_id, kind, patient_id, provider_id, msisdn, body, scheduled_for)
  select
    a.id,
    '24h_sms',
    a.patient_id,
    a.provider_id,
    null,           -- msisdn resolved by the worker (patient or guardian phone)
    'Kumbusho: una miadi ya TABHOS kesho saa ' || to_char(a.scheduled_at at time zone 'Africa/Dar_es_Salaam', 'HH24:MI'),
    a.scheduled_at - interval '24 hours'
  from tr_appointments a
  where a.status in ('confirmed','requested')
    and a.scheduled_at between now() + interval '22 hours' and now() + interval '26 hours'
  on conflict (appointment_id, kind) do nothing;
end;
$$ language plpgsql security definer;

-- Only schedule the cron job if pg_cron is available (it's bundled with the
-- Supabase platform but might not be on local dev).
do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    perform cron.unschedule('tabhos_sms_reminder_24h')
      where exists (select 1 from cron.job where jobname = 'tabhos_sms_reminder_24h');
    perform cron.schedule(
      'tabhos_sms_reminder_24h',
      '*/10 * * * *',
      $$select tabhos_enqueue_sms_reminders();$$
    );
  end if;
end$$;
