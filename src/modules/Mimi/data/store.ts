/**
 * MIMI — v1 local persistence layer. Supabase swap-in is planned for v2.
 * All values namespace under `tibaroho:mimi:*` so other modules don't collide.
 */

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

/* assessments */
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
}

/* moods */
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
}

/* journal */
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
}

/* calendar */
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

/* circle */
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

/* docs */
export type DocItem = {
  id: string
  uploadedAt: string
  title: string
  kind: 'referral' | 'prescription' | 'lab' | 'note' | 'other'
  dataUrl: string
  mime: string
  sharedWith: string[] // CircleMember ids
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

/* care plan */
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
}

/* tiny id helper */
export const uid = (): string =>
  Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
