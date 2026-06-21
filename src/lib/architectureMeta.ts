/**
 * Architecture metadata for every Tumaini / TBHOS module.
 *
 * Powers the <ArchitectureBadge> reveal panel — sub-engines used, EBM
 * citations (with verified flags), mock SQL / FHIR / Rafiki routing samples,
 * and the shared tech-stack list.
 *
 * Citations are real and labelled `verified: true` when the founder has
 * personally checked the source against the platform behavior. Set
 * `verified: false` for items that need a second pass before press release.
 */

export interface Citation {
  /** Short label shown in the panel. */
  label: string
  /** Where it came from (journal, body, guideline). */
  source: string
  /** Year of the cited resource. */
  year?: number
  /** Has the founder personally checked this maps to platform behavior? */
  verified: boolean
}

export interface ArchitectureMeta {
  engines: string[]
  citations: Citation[]
  mockSQL: string
  mockFHIR: string
  mockRouting: string
}

const TECH_STACK_SHARED = [
  'React 19 + Vite + TypeScript strict',
  'Supabase Pro (Tanzania VPS option via Laetoli Data)',
  'Akili-pattern router · no external LLM',
  'PWA · offline-first · Raspberry-Pi-ready',
] as const

export function getSharedTechStack(): readonly string[] {
  return TECH_STACK_SHARED
}

/* ──────────────────────────── per-module meta ─────────────────────────── */

export const ARCHITECTURE: Record<string, ArchitectureMeta> = {
  mimi: {
    engines: [
      'TibaAI clinical reasoner (vendored)',
      'Rafiki / Mwenza router (sovereign)',
      'Kasuku Lugha TTS · Sikiliza ASR',
      'C-SSRS crisis path (in-process)',
    ],
    citations: [
      { label: 'PHQ-9 — Kroenke, Spitzer & Williams', source: 'J Gen Intern Med', year: 2001, verified: true },
      { label: 'GAD-7 — Spitzer et al.', source: 'Arch Intern Med', year: 2006, verified: true },
      { label: 'PCL-5 — Weathers et al. (NCPTSD)', source: 'National Center for PTSD', year: 2013, verified: true },
      { label: 'C-SSRS — Posner et al.', source: 'Am J Psychiatry', year: 2011, verified: true },
      { label: 'WHO mhGAP Intervention Guide 2.0', source: 'WHO', year: 2016, verified: true },
    ],
    mockSQL: `-- Recent assessment results for the signed-in patient
SELECT id, instrument_id, score, severity, taken_at
FROM tr_screen_results
WHERE patient_id = $1
ORDER BY taken_at DESC
LIMIT 10;`,
    mockFHIR: `{
  "resourceType": "Observation",
  "status": "final",
  "category": [{ "coding": [{
    "system": "http://terminology.hl7.org/CodeSystem/observation-category",
    "code": "survey"
  }]}],
  "code": { "coding": [{
    "system": "http://loinc.org",
    "code": "44261-6",
    "display": "PHQ-9 total score"
  }]},
  "subject": { "reference": "Patient/maria-mgonjwa" },
  "effectiveDateTime": "2026-06-20T08:14:00+03:00",
  "valueInteger": 11,
  "interpretation": [{ "text": "moderate" }]
}`,
    mockRouting: `{
  "query": "Nina maumivu ya kichwa na sijapata usingizi",
  "lang": "sw",
  "expert": "clinicalReasoner",
  "confidence": 0.84,
  "citations": ["mhGAP 2.0 · DEP module", "PHQ-9 sleep item"],
  "safety": { "redFlags": [], "csrsLevel": 0 }
}`,
  },

  wataalam: {
    engines: [
      'TibaAI clinical reasoner',
      'TibaFigo renal interactions engine',
      'Jitsi self-hosted telehealth bridge',
      'NHIF claim formatter',
    ],
    citations: [
      { label: 'Tanzania STG (Standard Treatment Guidelines) 2023', source: 'MoH Tanzania', year: 2023, verified: true },
      { label: 'mhGAP-IG 2.0', source: 'WHO', year: 2016, verified: true },
      { label: 'APA Practice Guideline for MDD, 3rd ed.', source: 'American Psychiatric Association', year: 2010, verified: true },
      { label: 'NICE CG90 — Depression in adults', source: 'NICE', year: 2022, verified: true },
      { label: 'Cukor et al. — CBT for depression in dialysis', source: 'JASN', year: 2014, verified: true },
    ],
    mockSQL: `-- Today's caseload for a provider
SELECT p.id, p.display_name, e.starts_at, e.kind, p.last_phq9_score
FROM tr_provider_caseload pc
JOIN tr_patients p ON p.id = pc.patient_id
LEFT JOIN tr_encounters e ON e.patient_id = p.id AND e.starts_at::date = current_date
WHERE pc.provider_id = $1
ORDER BY e.starts_at NULLS LAST;`,
    mockFHIR: `{
  "resourceType": "Encounter",
  "status": "in-progress",
  "class": { "code": "VR", "display": "virtual" },
  "subject": { "reference": "Patient/maria-mgonjwa" },
  "participant": [{ "individual": { "reference": "Practitioner/asha-mwema" } }],
  "period": { "start": "2026-06-21T10:00:00+03:00" },
  "reasonCode": [{ "text": "Follow-up: PHQ-9 re-screen" }]
}`,
    mockRouting: `{
  "query": "Mgonjwa ana eGFR 38 — sertraline salama?",
  "expert": "renalSafety",
  "confidence": 0.91,
  "citations": ["TibaFigo · sertraline renal adjust", "Tanzania STG 2023 §14"],
  "decision": "OK — no dose change required at CKD G3b"
}`,
  },

  gundua: {
    engines: [
      'Provider directory index',
      'Geospatial filter (TZ regions x wards)',
      'Rafiki routing for help-finder',
    ],
    citations: [
      { label: 'Tanzania Health Facility Registry', source: 'MoH HFR', year: 2024, verified: false },
      { label: 'Friendship Bench RCT — lay counsellor effectiveness', source: 'JAMA', year: 2016, verified: true },
      { label: 'WHO QualityRights toolkit', source: 'WHO', year: 2019, verified: true },
    ],
    mockSQL: `-- Nearest providers, language-filtered
SELECT id, display_name, modality, languages, region, ward, distance_km
FROM tr_provider_directory
WHERE 'sw' = ANY(languages)
  AND region = $1
ORDER BY distance_km ASC
LIMIT 25;`,
    mockFHIR: `{
  "resourceType": "Practitioner",
  "id": "asha-mwema",
  "name": [{ "family": "Mwema", "given": ["Asha"] }],
  "qualification": [{ "code": { "text": "MD · Psychiatry · MUHAS" } }],
  "communication": [{ "coding": [{ "code": "sw" }] }, { "coding": [{ "code": "en" }] }]
}`,
    mockRouting: `{
  "query": "mtaalam wa familia karibu na Mwanza",
  "expert": "directorySearch",
  "confidence": 0.78,
  "filters": { "region": "Mwanza", "modality": "in-person|virtual" }
}`,
  },

  huduma: {
    engines: [
      'Catalogue index (instruments · plans · ICD-11 · insurers)',
      'Rafiki concierge router',
    ],
    citations: [
      { label: 'ICD-11 — Chapter 6 Mental, behavioural', source: 'WHO', year: 2022, verified: true },
      { label: 'WHO PM+ Individual', source: 'WHO', year: 2016, verified: true },
      { label: 'Tanzania STG 2023', source: 'MoH Tanzania', year: 2023, verified: true },
      { label: 'NHIF Benefit Package', source: 'NHIF Tanzania', year: 2024, verified: false },
    ],
    mockSQL: `-- Search the catalogue across all artifacts
SELECT kind, slug, label_sw, label_en
FROM tr_catalogue
WHERE label_sw ILIKE '%' || $1 || '%'
   OR label_en ILIKE '%' || $1 || '%'
ORDER BY kind, slug
LIMIT 50;`,
    mockFHIR: `{
  "resourceType": "Questionnaire",
  "id": "phq9-sw",
  "status": "active",
  "language": "sw",
  "title": "Hojaji ya Afya ya Mgonjwa-9 (PHQ-9)"
}`,
    mockRouting: `{
  "query": "ni kipimo gani kwa wasiwasi?",
  "expert": "catalogueRouter",
  "match": "GAD-7",
  "confidence": 0.88
}`,
  },

  miradi: {
    engines: [
      'Program runner (PM+ · CETA · IPT · t-CBT · MI · PST · DBT-lite · MBSR · Faith)',
      'Session tracker · adherence ledger',
    ],
    citations: [
      { label: 'WHO Problem Management Plus (PM+)', source: 'WHO', year: 2016, verified: true },
      { label: 'CETA — Common Elements Treatment Approach', source: 'Murray et al., Cogn Behav Pract', year: 2014, verified: true },
      { label: 'IPT for Depression in Uganda RCT', source: 'Bolton et al., JAMA', year: 2003, verified: true },
      { label: 't-CBT — Manualized Brief CBT', source: 'NICE CG90', year: 2022, verified: true },
      { label: 'Friendship Bench (PST) RCT', source: 'JAMA', year: 2016, verified: true },
    ],
    mockSQL: `-- Active programs and next session
SELECT pe.program_slug, pe.started_at, pe.status, s.next_session_at
FROM tr_program_enrolment pe
LEFT JOIN tr_program_sessions s ON s.enrolment_id = pe.id
WHERE pe.patient_id = $1
  AND pe.status = 'active'
ORDER BY pe.started_at DESC;`,
    mockFHIR: `{
  "resourceType": "CarePlan",
  "status": "active",
  "intent": "plan",
  "title": "PM+ · 5 vikao",
  "subject": { "reference": "Patient/maria-mgonjwa" },
  "activity": [{ "detail": { "code": { "text": "Behavioural activation · Session 2" } } }]
}`,
    mockRouting: `{
  "query": "anza PM+",
  "expert": "programEnrolment",
  "program": "pmplus",
  "confidence": 0.97
}`,
  },

  maalum: {
    engines: [
      'Population-specific protocols (HIV · oncology · perinatal · pediatric · geriatric · SUD · refugees · prison)',
      'TibaAI clinical reasoner',
      'TibaFigo renal engine (oncology overlap)',
    ],
    citations: [
      { label: 'WHO mhGAP for HIV co-morbidity', source: 'WHO', year: 2016, verified: true },
      { label: 'NCCN Distress Thermometer', source: 'NCCN', year: 2024, verified: true },
      { label: 'EPDS — Edinburgh Postnatal Depression Scale', source: 'Cox, Holden & Sagovsky', year: 1987, verified: true },
      { label: 'PM+ for refugees — WHO 2016', source: 'WHO', year: 2016, verified: true },
      { label: 'WHO/UNODC Standards on Drug Use Prevention', source: 'WHO/UNODC', year: 2018, verified: true },
    ],
    mockSQL: `-- Specialized cohort: perinatal patients with EPDS >= 10
SELECT p.id, p.display_name, r.score, r.taken_at
FROM tr_patients p
JOIN tr_screen_results r ON r.patient_id = p.id
WHERE p.cohort = 'perinatal'
  AND r.instrument_id = 'epds'
  AND r.score >= 10
ORDER BY r.taken_at DESC;`,
    mockFHIR: `{
  "resourceType": "Condition",
  "code": { "coding": [{ "system": "http://id.who.int/icd/release/11/mms", "code": "6E20", "display": "Postpartum depression" }] },
  "subject": { "reference": "Patient/mama-asha" }
}`,
    mockRouting: `{
  "query": "mama amejifungua wiki 2 zilizopita, hisia mbaya",
  "expert": "perinatalProtocol",
  "instrument": "EPDS",
  "confidence": 0.92
}`,
  },

  shuleplus: {
    engines: [
      'School-cohort screener (SDQ · PSC)',
      'Teacher / parent / student tri-view',
      'Rafiki educator coach',
    ],
    citations: [
      { label: 'SDQ — Goodman', source: 'J Child Psychol Psychiatry', year: 1997, verified: true },
      { label: 'PSC-17 — Pediatric Symptom Checklist', source: 'Jellinek et al.', year: 1988, verified: true },
      { label: 'WHO School Mental Health Manual', source: 'WHO', year: 2021, verified: true },
      { label: 'JASPER / classroom CBT trials', source: 'Various', year: 2020, verified: false },
    ],
    mockSQL: `-- Class roster SDQ averages
SELECT class_id, AVG(score) AS sdq_avg, COUNT(*) AS n
FROM tr_school_screens
WHERE instrument_id = 'sdq' AND school_id = $1
GROUP BY class_id
ORDER BY sdq_avg DESC;`,
    mockFHIR: `{
  "resourceType": "QuestionnaireResponse",
  "questionnaire": "Questionnaire/sdq-sw",
  "status": "completed",
  "source": { "reference": "RelatedPerson/teacher-mama-asha" },
  "subject": { "reference": "Patient/student-001" }
}`,
    mockRouting: `{
  "query": "mwanafunzi anaonekana mwenye huzuni darasani",
  "expert": "schoolPathway",
  "next": "SDQ + parent consent",
  "confidence": 0.81
}`,
  },

  wafanyakazi: {
    engines: [
      'Employer EAP cohort engine',
      'De-identified aggregate reporter',
      'Rafiki workplace coach',
    ],
    citations: [
      { label: 'WHO Guidelines on Mental Health at Work', source: 'WHO', year: 2022, verified: true },
      { label: 'PSS-10 — Cohen et al.', source: 'J Health Soc Behav', year: 1983, verified: true },
      { label: 'Maslach Burnout Inventory', source: 'Maslach & Jackson', year: 1981, verified: true },
      { label: 'WHO HEAT — Healthy Workplaces', source: 'WHO', year: 2010, verified: false },
    ],
    mockSQL: `-- De-identified workplace cohort report
SELECT department, AVG(score) AS pss_avg, COUNT(*) AS n
FROM tr_eap_screens
WHERE employer_id = $1 AND instrument_id = 'pss10'
GROUP BY department
HAVING COUNT(*) >= 5
ORDER BY pss_avg DESC;`,
    mockFHIR: `{
  "resourceType": "MeasureReport",
  "status": "complete",
  "type": "summary",
  "measure": "Measure/pss10-aggregate",
  "subject": { "reference": "Organization/employer-001" }
}`,
    mockRouting: `{
  "query": "ripoti ya idara — mafadhaiko",
  "expert": "eapReport",
  "aggregation": "department",
  "kAnonymity": 5
}`,
  },

  mashirika: {
    engines: [
      'SMART-on-FHIR bridge (THOS interop)',
      'NHIF claims formatter',
      'M-Pesa Daraja 2 connector',
      'ICD-11 / SNOMED mapper',
    ],
    citations: [
      { label: 'HL7 FHIR R4 spec', source: 'HL7', year: 2019, verified: true },
      { label: 'SMART App Launch 2.0', source: 'SMART Health IT', year: 2022, verified: true },
      { label: 'ICD-11 MMS', source: 'WHO', year: 2022, verified: true },
      { label: 'M-Pesa Daraja API', source: 'Vodacom / Safaricom', year: 2024, verified: false },
    ],
    mockSQL: `-- Pending outbound interop events
SELECT id, target_system, resource_type, status, created_at
FROM tr_interop_outbox
WHERE status IN ('queued', 'retrying')
ORDER BY created_at ASC
LIMIT 50;`,
    mockFHIR: `{
  "resourceType": "Bundle",
  "type": "transaction",
  "entry": [
    { "resource": { "resourceType": "Patient", "id": "maria-mgonjwa" } },
    { "resource": { "resourceType": "Encounter", "subject": { "reference": "Patient/maria-mgonjwa" } } }
  ]
}`,
    mockRouting: `{
  "query": "send PHQ-9 to THOS",
  "expert": "interopGateway",
  "target": "thos.smart-on-fhir",
  "auth": "OAuth2 · client_credentials"
}`,
  },

  pumzi: {
    engines: [
      'Breathing pacer (8 protocols)',
      'HRV-aware coherence engine',
      'Bilingual cue voice (Kasuku Lugha)',
    ],
    citations: [
      { label: '4-7-8 breathing — Andrew Weil', source: 'Weil', year: 2015, verified: true },
      { label: 'Box breathing — Naval Special Warfare', source: 'NSW training literature', year: 2014, verified: false },
      { label: '5-5 coherence breathing & HRV', source: 'Lehrer & Gevirtz, Front Psychol', year: 2014, verified: true },
      { label: 'Nadi Shodhana — pranayama review', source: 'Telles et al., J Clin Diagn Res', year: 2014, verified: true },
      { label: 'Wim Hof method — controlled hyperventilation', source: 'Kox et al., PNAS', year: 2014, verified: true },
    ],
    mockSQL: `-- Recent breathing sessions
SELECT id, protocol, duration_seconds, started_at
FROM tr_pumzi_sessions
WHERE user_id = $1
ORDER BY started_at DESC
LIMIT 20;`,
    mockFHIR: `{
  "resourceType": "Procedure",
  "status": "completed",
  "category": { "text": "Self-management" },
  "code": { "text": "4-7-8 breathing · 6 min" },
  "subject": { "reference": "Patient/maria-mgonjwa" }
}`,
    mockRouting: `{
  "query": "sikiwasi — nisaidie nipumue",
  "expert": "pumziProtocol",
  "select": "478",
  "confidence": 0.86
}`,
  },

  utafiti: {
    engines: [
      'IRB-gated study runner',
      'CFIR / RE-AIM framework templates',
      'e-Consent recorder',
    ],
    citations: [
      { label: 'CFIR — Damschroder et al.', source: 'Implement Sci', year: 2009, verified: true },
      { label: 'RE-AIM — Glasgow, Vogt & Boles', source: 'Am J Public Health', year: 1999, verified: true },
      { label: 'Declaration of Helsinki', source: 'WMA', year: 2013, verified: true },
      { label: 'NIMR / MUHAS IRB guidance', source: 'Tanzania', year: 2023, verified: false },
    ],
    mockSQL: `-- Study enrolment and consent ledger
SELECT s.id, s.title, e.subject_id, e.consent_signed_at, e.withdrawn
FROM tr_studies s
JOIN tr_study_enrolments e ON e.study_id = s.id
WHERE s.pi_id = $1
ORDER BY e.consent_signed_at DESC;`,
    mockFHIR: `{
  "resourceType": "Consent",
  "status": "active",
  "scope": { "coding": [{ "code": "research" }] },
  "category": [{ "coding": [{ "code": "INFAo" }] }],
  "patient": { "reference": "Patient/study-subject-042" }
}`,
    mockRouting: `{
  "query": "anza enrolment ya PHQ-9 RCT",
  "expert": "studyRunner",
  "framework": "RE-AIM",
  "confidence": 0.94
}`,
  },

  sera: {
    engines: [
      'Regional analytics (26 mikoa)',
      'MoH MoU tracker',
      'Bunge quarterly report generator',
    ],
    citations: [
      { label: 'Tanzania National Mental Health Strategy 2021-2026', source: 'MoH Tanzania', year: 2021, verified: true },
      { label: 'WHO Mental Health Atlas', source: 'WHO', year: 2020, verified: true },
      { label: 'Lancet Commission on Global MH', source: 'Lancet', year: 2018, verified: true },
    ],
    mockSQL: `-- Regional PHQ-9 access summary
SELECT region, AVG(score) AS phq9_avg, COUNT(DISTINCT patient_id) AS reached
FROM tr_screen_results
WHERE instrument_id = 'phq9'
GROUP BY region
ORDER BY reached DESC;`,
    mockFHIR: `{
  "resourceType": "MeasureReport",
  "status": "complete",
  "type": "summary",
  "measure": "Measure/phq9-regional-access",
  "subject": { "reference": "Location/region-mwanza" }
}`,
    mockRouting: `{
  "query": "ripoti ya robo-mwaka kwa Bunge",
  "expert": "policyReporter",
  "format": "DOCX + PDF",
  "confidence": 0.99
}`,
  },

  ndani: {
    engines: [
      'RBAC + audit ledger',
      'Tenant manager',
      'System health monitor',
    ],
    citations: [
      { label: 'NIST SP 800-53 access controls', source: 'NIST', year: 2020, verified: true },
      { label: 'HIPAA Security Rule', source: 'HHS', year: 2003, verified: true },
      { label: 'Tanzania Personal Data Protection Act', source: 'URT', year: 2022, verified: true },
    ],
    mockSQL: `-- Recent admin actions
SELECT actor_id, action, target, occurred_at
FROM tr_audit_log
ORDER BY occurred_at DESC
LIMIT 100;`,
    mockFHIR: `{
  "resourceType": "AuditEvent",
  "type": { "code": "rest" },
  "action": "R",
  "recorded": "2026-06-21T07:42:00+03:00",
  "agent": [{ "who": { "reference": "Practitioner/admin-001" } }]
}`,
    mockRouting: `{
  "query": "ongeza mtumiaji mpya",
  "expert": "rbacManager",
  "permission": "tenant.users.create",
  "confidence": 1.0
}`,
  },
}

export function getArchitecture(slug: string): ArchitectureMeta | null {
  return ARCHITECTURE[slug] ?? null
}
