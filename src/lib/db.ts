/**
 * TBHOS DB layer — typed CRUD helpers over Supabase with localStorage fallback.
 *
 * Reuses the shared client from `./supabase` (hasBackend + supabase).
 * If hasBackend is false we transparently shim to localStorage so the app runs
 * offline-first and dev/demo flows always work.
 */
import { hasBackend, supabase } from './supabase'

// ─────────────────────────── types ────────────────────────────────────────────
export type Role = 'patient' | 'provider' | 'admin' | 'researcher' | 'school' | 'employer'
export type ProviderKind = 'clinician' | 'lay_counsellor' | 'faith' | 'school' | 'ngo'
export type Modality = 'virtual' | 'in_person' | 'hybrid' | 'asynchronous'
export type ApptStatus = 'requested' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
export type ClaimStatus = 'draft' | 'submitted' | 'paid' | 'denied' | 'appealed'

export interface TrUser {
  id: string; auth_id?: string; role: Role
  display_name?: string; lang: string; faith?: string; region?: string
  created_at?: string
}
export interface TrConsent {
  id: string; user_id: string; kind: string
  granted: boolean; granted_at?: string; revoked_at?: string; notes?: string
}
export interface TrScreenResult {
  id: string; user_id: string; instrument: string
  score: number; severity?: string; raw?: unknown; taken_at?: string
}
export interface TrJournalEntry {
  id: string; user_id: string; body: string
  mood?: number; tags?: string[]; created_at?: string
}
export interface TrProvider {
  id: string; user_id: string; kind: ProviderKind
  bio_sw?: string; bio_en?: string; languages?: string[]; regions?: string[]
  fee_default: number; accepts_insurance?: string[]
  modalities?: Modality[]; verified: boolean
}
export interface TrProviderCredential {
  id: string; provider_id: string; kind: string
  status: 'pending' | 'verified' | 'rejected' | 'expired'
  document_url?: string; issued_by?: string; issued_at?: string; expires_at?: string
}
export interface TrAppointment {
  id: string; patient_id: string; provider_id: string
  scheduled_at: string; duration_min: number; modality: Modality
  status: ApptStatus; notes?: string
}
export interface TrTelehealthSession {
  id: string; appointment_id: string; room_token: string
  started_at?: string; ended_at?: string; recording_url?: string; recording_consent: boolean
}
export interface TrCarePlan {
  id: string; patient_id: string; provider_id?: string
  title: string; goals: unknown[]; steps: unknown[]; review_at?: string
}
export interface TrProgram {
  id: string; slug: string; name_sw: string; name_en?: string
  sessions: number; target?: string[]
  evidence_citation?: string; citation?: string
  audience?: string; modality: Modality
  fee_default: number; provider_only: boolean
}
export interface TrProgramEnrolment {
  id: string; program_id: string; patient_id: string; provider_id?: string
  session_index: number; started_at?: string; completed_at?: string; status: string
}
export interface TrOutcome {
  id: string; patient_id: string; enrolment_id?: string
  instrument: string; score: number; delta?: number; measured_at?: string
}
export interface TrReferral {
  id: string; patient_id: string
  from_provider_id?: string; to_provider_id?: string; to_facility?: string
  reason: string; urgency: 'routine' | 'urgent' | 'emergency'; status: string
}
export interface TrInsurance {
  id: string; user_id: string; carrier: string; member_id: string; plan?: string; active: boolean
}
export interface TrClaim {
  id: string; patient_id: string; provider_id: string
  appointment_id?: string; insurance_id?: string
  amount_tzs: number; icd11?: string; cpt?: string; status: ClaimStatus
  submitted_at?: string; paid_at?: string
}
export interface TrSchool {
  id: string; name: string; region?: string
  contact_email?: string; contact_phone?: string; admin_user_id?: string
}
export interface TrEmployer {
  id: string; name: string; industry?: string; seats: number
  contact_email?: string; admin_user_id?: string
}
export interface TrResearchConsent {
  id: string; user_id: string; protocol_id: string
  irb_ref?: string; granted: boolean; granted_at?: string; revoked_at?: string
}
export interface TrAuditLog {
  id: string; actor_id?: string; action: string
  entity: string; entity_id?: string; meta?: unknown; at?: string
}

export type TableMap = {
  tr_users: TrUser
  tr_consents: TrConsent
  tr_screen_results: TrScreenResult
  tr_journal_entries: TrJournalEntry
  tr_providers: TrProvider
  tr_provider_credentials: TrProviderCredential
  tr_appointments: TrAppointment
  tr_telehealth_sessions: TrTelehealthSession
  tr_care_plans: TrCarePlan
  tr_programs: TrProgram
  tr_program_enrolments: TrProgramEnrolment
  tr_outcomes: TrOutcome
  tr_referrals: TrReferral
  tr_claims: TrClaim
  tr_insurances: TrInsurance
  tr_schools: TrSchool
  tr_employers: TrEmployer
  tr_research_consents: TrResearchConsent
  tr_audit_log: TrAuditLog
}

export type TrTable = keyof TableMap

// re-export for callers
export { hasBackend, supabase }

// ─────────────────────────── localStorage shim ────────────────────────────────
const LS_PREFIX = 'tr:'

function lsRead<T>(table: TrTable): T[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(LS_PREFIX + table)
    return raw ? (JSON.parse(raw) as T[]) : []
  } catch { return [] }
}

function lsWrite<T>(table: TrTable, rows: T[]): void {
  if (typeof window === 'undefined') return
  try { window.localStorage.setItem(LS_PREFIX + table, JSON.stringify(rows)) } catch { /* quota */ }
}

function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}

// ─────────────────────────── CRUD ─────────────────────────────────────────────
export async function list<K extends TrTable>(
  table: K,
  where?: Partial<TableMap[K]>,
): Promise<TableMap[K][]> {
  if (supabase) {
    let q = supabase.from(table).select('*')
    if (where) for (const [k, v] of Object.entries(where)) q = q.eq(k, v as never)
    const { data, error } = await q
    if (error) throw error
    return (data ?? []) as TableMap[K][]
  }
  const rows = lsRead<TableMap[K]>(table)
  if (!where) return rows
  return rows.filter((r) =>
    Object.entries(where).every(([k, v]) => (r as unknown as Record<string, unknown>)[k] === v),
  )
}

export async function get<K extends TrTable>(table: K, id: string): Promise<TableMap[K] | null> {
  if (supabase) {
    const { data, error } = await supabase.from(table).select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return (data ?? null) as TableMap[K] | null
  }
  return lsRead<TableMap[K]>(table).find((r) => (r as { id: string }).id === id) ?? null
}

export async function insert<K extends TrTable>(
  table: K,
  row: Omit<TableMap[K], 'id'> & { id?: string },
): Promise<TableMap[K]> {
  const withId = { ...row, id: row.id ?? uid() } as TableMap[K]
  if (supabase) {
    const { data, error } = await supabase.from(table).insert(withId as never).select().single()
    if (error) throw error
    return data as TableMap[K]
  }
  const rows = lsRead<TableMap[K]>(table)
  rows.push(withId)
  lsWrite(table, rows)
  return withId
}

export async function update<K extends TrTable>(
  table: K,
  id: string,
  patch: Partial<TableMap[K]>,
): Promise<TableMap[K] | null> {
  if (supabase) {
    const { data, error } = await supabase.from(table).update(patch as never).eq('id', id).select().single()
    if (error) throw error
    return data as TableMap[K]
  }
  const rows = lsRead<TableMap[K]>(table)
  const i = rows.findIndex((r) => (r as { id: string }).id === id)
  if (i < 0) return null
  rows[i] = { ...rows[i], ...patch }
  lsWrite(table, rows)
  return rows[i]
}

export async function remove<K extends TrTable>(table: K, id: string): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) throw error
    return
  }
  const rows = lsRead<TableMap[K]>(table).filter((r) => (r as { id: string }).id !== id)
  lsWrite(table, rows)
}

export async function audit(action: string, entity: string, entity_id?: string, meta?: unknown): Promise<void> {
  await insert('tr_audit_log', { action, entity, entity_id, meta, at: new Date().toISOString() })
}

export const db = { list, get, insert, update, remove, audit, hasBackend, supabase }
export default db
