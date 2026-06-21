-- Real Tanzania mental-health directory: facilities + crisis hotlines.
-- Source citations are PUBLIC documents (MoH HSSP V 2021-2026, WHO Mental
-- Health Atlas 2020 Tanzania profile, Mental Health Act Chapter 98 of 2008,
-- WHO Suicide worldwide 2019, MCT registry, public hospital websites).
-- We DO NOT seed individual psychiatrist names here — the public MCT registry
-- is not redistributable as a flat list without consent, and seeding names
-- from memory risks fabrication. Names will be added through the verified
-- onboarding flow after MCT data-share MoU lands.
--
-- Idempotent: ON CONFLICT DO NOTHING on deterministic uuid keys.

-- ============================================================================
-- TABLES
-- ============================================================================
create table if not exists tr_facilities (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  category text not null,                  -- 'national','zonal','regional','district','private','faith'
  region text not null,
  district text,
  lat numeric,
  lng numeric,
  beds int,
  specialties text[] default array[]::text[],
  phone text,
  hotline_24h boolean default false,
  source_citation text,
  source_url text,
  created_at timestamptz default now()
);

create table if not exists tr_hotlines (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  number text not null,
  short_code text,
  category text not null,                  -- 'crisis','gbv','child','police','faith','general','medical'
  hours text default '24/7',
  region text default 'national',
  language text[] default array['sw'],
  cost text default 'free',
  source_citation text,
  source_url text,
  active boolean default true,
  created_at timestamptz default now()
);

-- Public catalog tables — readable by everyone, writable only by admins.
alter table tr_facilities enable row level security;
alter table tr_hotlines enable row level security;

do $$ begin
  create policy tr_facilities_read on tr_facilities for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy tr_facilities_admin on tr_facilities for all using (tr_is_role('admin'));
exception when duplicate_object then null; end $$;
do $$ begin
  create policy tr_hotlines_read on tr_hotlines for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy tr_hotlines_admin on tr_hotlines for all using (tr_is_role('admin'));
exception when duplicate_object then null; end $$;

-- ============================================================================
-- SEED — FACILITIES
-- ============================================================================
-- All listed facilities are public-sector hospitals widely documented in
-- the Ministry of Health Health Sector Strategic Plan V (HSSP V 2021-2026),
-- the WHO Mental Health Atlas 2020 Tanzania country profile, and the
-- respective hospitals' official websites / official MoH facility directories.
-- Bed counts and coordinates are conservative public estimates; exact figures
-- should be re-confirmed before any state-grade publication.

insert into tr_facilities (id, name, category, region, district, lat, lng, beds, specialties, hotline_24h, source_citation, source_url) values
  ('aaaaaaa1-0000-4000-8000-000000000001'::uuid,
   'Mirembe National Mental Health Hospital',
   'national', 'Dodoma', 'Dodoma Urban', -6.1735, 35.7416, 600,
   array['psychiatry','forensic_psychiatry','addiction','inpatient'], true,
   'Tanzania MoH — Mirembe is the national psychiatric referral hospital (est. 1929). HSSP V 2021-2026 sec. 4 (Mental Health).',
   'https://www.moh.go.tz/'),
  ('aaaaaaa1-0000-4000-8000-000000000002'::uuid,
   'Muhimbili National Hospital — Department of Psychiatry & Mental Health',
   'national', 'Dar es Salaam', 'Ilala', -6.8001, 39.2692, null,
   array['psychiatry','child_psychiatry','consultation_liaison','inpatient','outpatient'], false,
   'Muhimbili National Hospital — Department of Psychiatry & Mental Health (MUHAS-affiliated). WHO Mental Health Atlas 2020, Tanzania.',
   'https://mnh.or.tz/'),
  ('aaaaaaa1-0000-4000-8000-000000000003'::uuid,
   'Benjamin Mkapa Hospital',
   'national', 'Dodoma', 'Dodoma Urban', -6.1611, 35.7515, null,
   array['psychiatry_outpatient','consultation_liaison'], false,
   'Benjamin Mkapa Hospital — national hospital, Dodoma (Tanzania MoH zonal/national tier).',
   'https://bmh.or.tz/'),
  ('aaaaaaa1-0000-4000-8000-000000000004'::uuid,
   'Kilimanjaro Christian Medical Centre (KCMC)',
   'zonal', 'Kilimanjaro', 'Moshi', -3.3617, 37.3294, null,
   array['psychiatry','child_psychiatry','training','research'], false,
   'KCMC — Northern Zone consultant referral hospital; psychiatry department documented in MoH zonal hospital list.',
   'https://www.kcmc.ac.tz/'),
  ('aaaaaaa1-0000-4000-8000-000000000005'::uuid,
   'Bugando Medical Centre',
   'zonal', 'Mwanza', 'Nyamagana', -2.5167, 32.9000, null,
   array['psychiatry','consultation_liaison','training'], false,
   'Bugando Medical Centre — Lake Zone consultant referral hospital; CUHAS-affiliated psychiatry training.',
   'https://www.bugandomedicalcentre.go.tz/'),
  ('aaaaaaa1-0000-4000-8000-000000000006'::uuid,
   'Mbeya Zonal Referral Hospital',
   'zonal', 'Mbeya', 'Mbeya Urban', -8.9094, 33.4607, null,
   array['psychiatry_unit','outpatient'], false,
   'Mbeya Zonal Referral Hospital — Southern Highlands Zone (MoH zonal tier).',
   'https://www.mzrh.go.tz/'),
  ('aaaaaaa1-0000-4000-8000-000000000007'::uuid,
   'Bombo Regional Referral Hospital',
   'regional', 'Tanga', 'Tanga Urban', -5.0667, 39.1000, null,
   array['psychiatry_outpatient'], false,
   'Bombo RRH — Tanga regional referral hospital (MoH regional referral list).',
   'https://www.moh.go.tz/'),
  ('aaaaaaa1-0000-4000-8000-000000000008'::uuid,
   'Iringa Regional Referral Hospital',
   'regional', 'Iringa', 'Iringa Urban', -7.7700, 35.6900, null,
   array['psychiatry_unit','outpatient'], false,
   'Iringa RRH — regional referral hospital (MoH regional referral list).',
   'https://www.moh.go.tz/'),
  ('aaaaaaa1-0000-4000-8000-000000000009'::uuid,
   'Sokoine Regional Referral Hospital',
   'regional', 'Lindi', 'Lindi Urban', -10.0000, 39.7167, null,
   array['psychiatry_outpatient'], false,
   'Sokoine RRH (Lindi) — regional referral hospital (MoH regional referral list).',
   'https://www.moh.go.tz/'),
  ('aaaaaaa1-0000-4000-8000-00000000000a'::uuid,
   'Mnazi Mmoja Hospital',
   'regional', 'Zanzibar', 'Mjini', -6.1659, 39.1989, null,
   array['psychiatry_unit','outpatient'], false,
   'Mnazi Mmoja Hospital — Zanzibar referral hospital (Zanzibar MoH; Jenkins et al. BMC Int J Ment Health Syst 2011, Zanzibar mental-health case).',
   'https://www.mnh.or.tz/')
on conflict (id) do nothing;

-- ============================================================================
-- SEED — HOTLINES
-- ============================================================================
-- Only numbers with public, verifiable sources are included.
-- Short emergency codes 112 / 114 / 116 are gazetted by TCRA (Tanzania
-- Communications Regulatory Authority) National Numbering Plan.
-- If the operator/owner of a private NGO line cannot be verified from a
-- public source, the line is OMITTED rather than guessed.

insert into tr_hotlines (id, name, number, short_code, category, hours, region, language, cost, source_citation, source_url) values
  ('bbbbbbb1-0000-4000-8000-000000000001'::uuid,
   'Tanzania Police Emergency',
   '112', '112', 'police', '24/7', 'national',
   array['sw','en'], 'free',
   'TCRA National Numbering Plan — 112 is the gazetted national emergency short code (police, fire, ambulance dispatch).',
   'https://www.tcra.go.tz/'),
  ('bbbbbbb1-0000-4000-8000-000000000002'::uuid,
   'Ambulance / Medical Emergency',
   '114', '114', 'medical', '24/7', 'national',
   array['sw','en'], 'free',
   'TCRA National Numbering Plan — 114 medical emergency short code.',
   'https://www.tcra.go.tz/'),
  ('bbbbbbb1-0000-4000-8000-000000000003'::uuid,
   'Child Helpline Tanzania (Sema)',
   '116', '116', 'child', '24/7', 'national',
   array['sw','en'], 'free',
   'C-Sema / Child Helpline International — 116 is the gazetted child helpline short code operated by C-Sema in Tanzania.',
   'https://www.sematanzania.org/')
on conflict (id) do nothing;

-- NOTE: Intentionally omitted (insufficient verification at seed time):
--   * "Lifeline Tanzania 0800 110 909" — could not verify a publicly-listed
--     active toll-free number under that exact name; will add once verified
--     against TCRA toll-free directory.
--   * Faith-based counsel lines (BAKWATA / TEC / ELCT) — no public single
--     gazetted number; varies per diocese.
--   * NGO-specific lines (TaWLA GBV, WAMA, Sahara Sparks) — main switchboard
--     numbers are public but not 24/7 crisis hotlines; will be added through
--     an NGO partner intake form, not as crisis-grade hotlines.
