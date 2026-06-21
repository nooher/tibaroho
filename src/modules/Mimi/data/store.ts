/**
 * MIMI — patient data persistence.
 *
 * Wire-up:
 *   - Authed (Supabase): canonical persistence in the `tr_*` tables. Writes
 *     also mirror into localStorage so reloads paint instantly while the
 *     async upgrade runs.
 *   - Unauth/offline: localStorage only. Same shape, same keys.
 *
 * The legacy sync `listX()` / `saveX()` API is preserved so existing screens
 * keep their instant paint via `useState(() => listX())`. New async variants
 * (`listXAsync` / `saveXAsync`) fetch/persist canonically; screens upgrade in
 * useEffect, matching the canonical Wataalam pattern.
 */
import { db } from '../../../lib/db'
import type { TrJournalEntry, TrScreenResult, TrCarePlan } from '../../../lib/db'
import { getMeId } from '../../../lib/me'

const NS = 'tibaroho:mimi:'

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(NS + key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(NS + key, JSON.stringify(value))
  } catch {
    /* quota — silently drop */
  }
}

/* ------------------------------------------------------------------ */
/* assessments                                                         */
/* ------------------------------------------------------------------ */
export type AssessmentResult = {
  id: string
  instrumentId: string
  takenAt: string // ISO
  answers: number[]
  score: number
  severity: string
  label_sw: string
  redFlag?: boolean
  consent: boolean
}

export function listResults(): AssessmentResult[] {
  return read<AssessmentResult[]>('results', [])
}
export function saveResult(r: AssessmentResult): void {
  const cur = listResults()
  write('results', [r, ...cur].slice(0, 500))
  // Fire-and-forget remote persist when authed.
  void saveResultAsync(r).catch(() => { /* offline — local cache holds */ })
}

export async function listResultsAsync(): Promise<AssessmentResult[]> {
  if (!db.supabase) return listResults()
  try {
    const me = await getMeId()
    const rows = await db.list('tr_screen_results', { user_id: me })
    const mapped = rows
      .map(mapScreenRowToResult)
      .sort((a, b) => b.takenAt.localeCompare(a.takenAt))
    write('results', mapped.slice(0, 500))
    return mapped
  } catch {
    return listResults()
  }
}

export async function saveResultAsync(r: AssessmentResult): Promise<void> {
  if (!db.supabase) return
  try {
    const me = await getMeId()
    await db.insert('tr_screen_results', {
      user_id: me,
      instrument: r.instrumentId,
      score: r.score,
      severity: r.severity,
      raw: {
        answers: r.answers,
        label_sw: r.label_sw,
        redFlag: r.redFlag ?? false,
        consent: r.consent,
        client_id: r.id,
      },
      taken_at: r.takenAt,
    } as Omit<TrScreenResult, 'id'>)
    void db.audit('screen.submit', 'tr_screen_results', undefined, {
      instrument: r.instrumentId, score: r.score, severity: r.severity,
    })
  } catch { /* swallow — local cache is source of truth offline */ }
}

function mapScreenRowToResult(row: TrScreenResult): AssessmentResult {
  const raw = (row.raw ?? {}) as Record<string, unknown>
  return {
    id: row.id,
    instrumentId: row.instrument,
    takenAt: row.taken_at ?? new Date().toISOString(),
    answers: Array.isArray(raw.answers) ? (raw.answers as number[]) : [],
    score: row.score,
    severity: row.severity ?? (typeof raw.severity === 'string' ? raw.severity : ''),
    label_sw: typeof raw.label_sw === 'string' ? raw.label_sw : '',
    redFlag: typeof raw.redFlag === 'boolean' ? raw.redFlag : undefined,
    consent: typeof raw.consent === 'boolean' ? raw.consent : true,
  }
}

/* ------------------------------------------------------------------ */
/* moods — backed by tr_journal_entries with tags ['tracker:mood']     */
/* ------------------------------------------------------------------ */
export type MoodEntry = {
  id: string
  takenAt: string
  score: number // 0–10
  emotions: string[]
  note?: string
}
export function listMoods(): MoodEntry[] {
  return read<MoodEntry[]>('moods', [])
}
export function saveMood(m: MoodEntry): void {
  write('moods', [m, ...listMoods()].slice(0, 1000))
  void saveMoodAsync(m).catch(() => undefined)
}

export async function listMoodsAsync(): Promise<MoodEntry[]> {
  if (!db.supabase) return listMoods()
  try {
    const me = await getMeId()
    const rows = await db.list('tr_journal_entries', { user_id: me })
    const moods = rows
      .filter((r) => Array.isArray(r.tags) && r.tags?.includes('tracker:mood'))
      .map(mapJournalRowToMood)
      .sort((a, b) => b.takenAt.localeCompare(a.takenAt))
    write('moods', moods.slice(0, 1000))
    return moods
  } catch {
    return listMoods()
  }
}

export async function saveMoodAsync(m: MoodEntry): Promise<void> {
  if (!db.supabase) return
  try {
    const me = await getMeId()
    await db.insert('tr_journal_entries', {
      user_id: me,
      body: JSON.stringify({ emotions: m.emotions, note: m.note, client_id: m.id }),
      mood: m.score,
      tags: ['tracker:mood'],
      created_at: m.takenAt,
    } as Omit<TrJournalEntry, 'id'>)
  } catch { /* offline */ }
}

function mapJournalRowToMood(row: TrJournalEntry): MoodEntry {
  let parsed: { emotions?: string[]; note?: string; client_id?: string } = {}
  try { parsed = JSON.parse(row.body) as typeof parsed } catch { /* legacy free-text */ }
  return {
    id: parsed.client_id ?? row.id,
    takenAt: row.created_at ?? new Date().toISOString(),
    score: row.mood ?? 5,
    emotions: parsed.emotions ?? [],
    note: parsed.note,
  }
}

/* ------------------------------------------------------------------ */
/* journal — text/voice/picture entries → tr_journal_entries           */
/* ------------------------------------------------------------------ */
export type JournalEntry = {
  id: string
  takenAt: string
  text?: string
  audioDataUrl?: string
  imageDataUrl?: string
  voiceTranscript?: string
  mood?: number
  topics: string[]
}
export function listJournal(): JournalEntry[] {
  return read<JournalEntry[]>('journal', [])
}
export function saveJournal(e: JournalEntry): void {
  write('journal', [e, ...listJournal()].slice(0, 500))
  void saveJournalAsync(e).catch(() => undefined)
}

export async function listJournalAsync(): Promise<JournalEntry[]> {
  if (!db.supabase) return listJournal()
  try {
    const me = await getMeId()
    const rows = await db.list('tr_journal_entries', { user_id: me })
    const entries = rows
      .filter((r) => Array.isArray(r.tags) && r.tags?.includes('journal:entry'))
      .map(mapJournalRowToEntry)
      .sort((a, b) => b.takenAt.localeCompare(a.takenAt))
    write('journal', entries.slice(0, 500))
    return entries
  } catch {
    return listJournal()
  }
}

export async function saveJournalAsync(e: JournalEntry): Promise<void> {
  if (!db.supabase) return
  try {
    const me = await getMeId()
    const payload = {
      text: e.text,
      voiceTranscript: e.voiceTranscript,
      audioDataUrl: e.audioDataUrl,
      imageDataUrl: e.imageDataUrl,
      topics: e.topics,
      client_id: e.id,
    }
    await db.insert('tr_journal_entries', {
      user_id: me,
      body: JSON.stringify(payload),
      mood: e.mood,
      tags: ['journal:entry', ...e.topics.map((t) => `topic:${t}`)],
      created_at: e.takenAt,
    } as Omit<TrJournalEntry, 'id'>)
  } catch { /* offline */ }
}

function mapJournalRowToEntry(row: TrJournalEntry): JournalEntry {
  let p: {
    text?: string; voiceTranscript?: string; audioDataUrl?: string
    imageDataUrl?: string; topics?: string[]; client_id?: string
  } = {}
  try { p = JSON.parse(row.body) as typeof p } catch { p = { text: row.body } }
  return {
    id: p.client_id ?? row.id,
    takenAt: row.created_at ?? new Date().toISOString(),
    text: p.text,
    voiceTranscript: p.voiceTranscript,
    audioDataUrl: p.audioDataUrl,
    imageDataUrl: p.imageDataUrl,
    mood: row.mood,
    topics: p.topics ?? [],
  }
}

/* ------------------------------------------------------------------ */
/* calendar — local only (no tr_calendar table; appointments handled   */
/* separately by scheduling/Book + scheduling/MyCalendar)              */
/* ------------------------------------------------------------------ */
export type CalEvent = {
  id: string
  startsAt: string
  durationMin: number
  title_sw: string
  title_en?: string
  kind: 'session' | 'medication' | 'checkin' | 'lab' | 'other'
  notes?: string
  reminder?: boolean
}
export function listEvents(): CalEvent[] {
  return read<CalEvent[]>('events', [])
}
export function saveEvent(e: CalEvent): void {
  const cur = listEvents().filter((x) => x.id !== e.id)
  write('events', [...cur, e].sort((a, b) => a.startsAt.localeCompare(b.startsAt)))
}
export function deleteEvent(id: string): void {
  write('events', listEvents().filter((e) => e.id !== id))
}

/* ------------------------------------------------------------------ */
/* circle — local only for now (consent semantics need bespoke schema) */
/* ------------------------------------------------------------------ */
export type CircleMember = {
  id: string
  name: string
  relation_sw: string
  phone?: string
  email?: string
  consents: {
    viewMoods: boolean
    viewAssessments: boolean
    viewCarePlan: boolean
    notifyCrisis: boolean
  }
  invitedAt: string
}
export function listCircle(): CircleMember[] {
  return read<CircleMember[]>('circle', [])
}
export function saveMember(m: CircleMember): void {
  const cur = listCircle().filter((x) => x.id !== m.id)
  write('circle', [...cur, m])
}
export function removeMember(id: string): void {
  write('circle', listCircle().filter((m) => m.id !== id))
}

/* ------------------------------------------------------------------ */
/* docs — local only (binary blobs; bucket upload is a future task)    */
/* ------------------------------------------------------------------ */
export type DocItem = {
  id: string
  uploadedAt: string
  title: string
  kind: 'referral' | 'prescription' | 'lab' | 'note' | 'other'
  dataUrl: string
  mime: string
  sharedWith: string[]
}
export function listDocs(): DocItem[] {
  return read<DocItem[]>('docs', [])
}
export function saveDoc(d: DocItem): void {
  const cur = listDocs().filter((x) => x.id !== d.id)
  write('docs', [d, ...cur])
}
export function deleteDoc(id: string): void {
  write('docs', listDocs().filter((d) => d.id !== id))
}

/* ------------------------------------------------------------------ */
/* care plan — single per patient → tr_care_plans                      */
/* ------------------------------------------------------------------ */
export type CarePlan = {
  programs: { id: string; name_sw: string; startedAt: string; status: 'active' | 'paused' | 'completed' }[]
  providers: { id: string; name: string; role_sw: string; org?: string }[]
  nextSteps: { id: string; text_sw: string; due?: string; done: boolean }[]
  milestones: { id: string; text_sw: string; achievedAt?: string }[]
}
const EMPTY_PLAN: CarePlan = { programs: [], providers: [], nextSteps: [], milestones: [] }
export function getCarePlan(): CarePlan {
  return read<CarePlan>('careplan', EMPTY_PLAN)
}
export function saveCarePlan(p: CarePlan): void {
  write('careplan', p)
  void saveCarePlanAsync(p).catch(() => undefined)
}

// We treat one tr_care_plans row per patient as the canonical store. The
// CarePlan shape is JSON-packed into the `steps` jsonb column so we don't
// need extra tables for milestones / providers / programs. `goals` mirrors
// `nextSteps` for provider-side compatibility.
const CARE_PLAN_TITLE = 'Mimi · self-curated plan'

export async function getCarePlanAsync(): Promise<CarePlan> {
  if (!db.supabase) return getCarePlan()
  try {
    const me = await getMeId()
    const rows = await db.list('tr_care_plans', { patient_id: me })
    const mine = rows.find((r) => r.title === CARE_PLAN_TITLE) ?? rows[0]
    if (!mine) return getCarePlan()
    const packed = (mine.steps as { plan?: CarePlan } | undefined)?.plan
    if (packed) {
      write('careplan', packed)
      return packed
    }
    return getCarePlan()
  } catch {
    return getCarePlan()
  }
}

export async function saveCarePlanAsync(p: CarePlan): Promise<void> {
  if (!db.supabase) return
  try {
    const me = await getMeId()
    const rows = await db.list('tr_care_plans', { patient_id: me })
    const mine = rows.find((r) => r.title === CARE_PLAN_TITLE) ?? rows[0]
    if (mine) {
      await db.update('tr_care_plans', mine.id, {
        steps: { plan: p } as unknown as TrCarePlan['steps'],
        goals: p.nextSteps as unknown as TrCarePlan['goals'],
      })
    } else {
      await db.insert('tr_care_plans', {
        patient_id: me,
        title: CARE_PLAN_TITLE,
        goals: p.nextSteps as unknown as TrCarePlan['goals'],
        steps: { plan: p } as unknown as TrCarePlan['steps'],
      } as Omit<TrCarePlan, 'id'>)
    }
  } catch { /* offline */ }
}

/* ------------------------------------------------------------------ */
/* tiny id helper                                                      */
/* ------------------------------------------------------------------ */
export const uid = (): string =>
  Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
