/**
 * localStorage-backed persistence for the WATAALAM module. v1 — to be
 * replaced by Supabase tables once the schema is finalized.
 *
 * Every key is namespaced under `tibaroho.v1.wataalam.*`.
 */

const NS = 'tibaroho.v1.wataalam.'

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(NS + key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write<T>(key: string, v: T): void {
  try {
    localStorage.setItem(NS + key, JSON.stringify(v))
  } catch {
    /* quota or private mode — silent fail */
  }
}

// ─── Provider profile ──────────────────────────────────────────────────
export interface ProviderProfileDraft {
  step: number
  fullName: string
  honorific: string
  licenseNumber: string
  specialty: string
  languages: string[]
  city: string
  region: string
  feeTzs: number
  insurances: string[]
  mode: 'virtual' | 'in_person' | 'both'
  diplomaUploaded: boolean
  bioSw: string
  bioEn: string
}

export const EMPTY_PROFILE: ProviderProfileDraft = {
  step: 0,
  fullName: '',
  honorific: 'Dr.',
  licenseNumber: '',
  specialty: '',
  languages: ['sw'],
  city: '',
  region: 'Dar es Salaam',
  feeTzs: 50_000,
  insurances: ['nhif', 'cash'],
  mode: 'both',
  diplomaUploaded: false,
  bioSw: '',
  bioEn: '',
}

export const loadProfile = () => read<ProviderProfileDraft>('profile', EMPTY_PROFILE)
export const saveProfile = (p: ProviderProfileDraft) => write('profile', p)

// ─── Appointments ──────────────────────────────────────────────────────
export interface Appointment {
  id: string
  patientPseudonym: string
  startISO: string
  durationMin: number
  mode: 'virtual' | 'in_person'
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  reasonSw?: string
}

const seed = (): Appointment[] => {
  const t = new Date()
  t.setHours(9, 0, 0, 0)
  return [
    {
      id: 'a-001',
      patientPseudonym: 'Mteja A',
      startISO: t.toISOString(),
      durationMin: 45,
      mode: 'in_person',
      status: 'scheduled',
      reasonSw: 'Sonona — ufuatiliaji',
    },
    {
      id: 'a-002',
      patientPseudonym: 'Mteja B',
      startISO: new Date(t.getTime() + 60 * 60 * 1000).toISOString(),
      durationMin: 45,
      mode: 'virtual',
      status: 'scheduled',
      reasonSw: 'Tathmini ya kwanza',
    },
    {
      id: 'a-003',
      patientPseudonym: 'Mteja C',
      startISO: new Date(t.getTime() + 2.5 * 60 * 60 * 1000).toISOString(),
      durationMin: 30,
      mode: 'virtual',
      status: 'scheduled',
      reasonSw: 'CBT kipindi cha 4',
    },
  ]
}

export const loadAppointments = (): Appointment[] => {
  const v = read<Appointment[] | null>('appointments', null)
  if (v && v.length) return v
  const s = seed()
  write('appointments', s)
  return s
}
export const saveAppointments = (a: Appointment[]) => write('appointments', a)

// ─── Slots (schedule rules) ────────────────────────────────────────────
export interface SlotRule {
  id: string
  dayOfWeek: number // 0 Sun … 6 Sat
  startHHMM: string
  endHHMM: string
  mode: 'virtual' | 'in_person' | 'both'
}

const SEED_SLOTS: SlotRule[] = [
  { id: 's-1', dayOfWeek: 1, startHHMM: '09:00', endHHMM: '12:00', mode: 'both' },
  { id: 's-2', dayOfWeek: 3, startHHMM: '14:00', endHHMM: '17:00', mode: 'virtual' },
  { id: 's-3', dayOfWeek: 5, startHHMM: '09:00', endHHMM: '13:00', mode: 'in_person' },
]

export const loadSlots = (): SlotRule[] => {
  const v = read<SlotRule[] | null>('slots', null)
  if (v && v.length) return v
  write('slots', SEED_SLOTS)
  return SEED_SLOTS
}
export const saveSlots = (s: SlotRule[]) => write('slots', s)

// ─── Notes ─────────────────────────────────────────────────────────────
export interface SessionNote {
  id: string
  appointmentId: string
  patientPseudonym: string
  template: 'SOAP' | 'DAP'
  fields: Record<string, string>
  createdAt: number
}
export const loadNotes = (): SessionNote[] => read<SessionNote[]>('notes', [])
export const saveNotes = (n: SessionNote[]) => write('notes', n)

// ─── Outcomes ──────────────────────────────────────────────────────────
export interface OutcomeEntry {
  id: string
  patientPseudonym: string
  instrument: 'PHQ-9' | 'GAD-7' | 'PCL-5' | 'AUDIT'
  score: number
  dateISO: string
}

const seedOutcomes: OutcomeEntry[] = [
  { id: 'o-1', patientPseudonym: 'Mteja A', instrument: 'PHQ-9', score: 18, dateISO: daysAgo(60) },
  { id: 'o-2', patientPseudonym: 'Mteja A', instrument: 'PHQ-9', score: 14, dateISO: daysAgo(45) },
  { id: 'o-3', patientPseudonym: 'Mteja A', instrument: 'PHQ-9', score: 9, dateISO: daysAgo(30) },
  { id: 'o-4', patientPseudonym: 'Mteja A', instrument: 'PHQ-9', score: 6, dateISO: daysAgo(15) },
  { id: 'o-5', patientPseudonym: 'Mteja B', instrument: 'GAD-7', score: 16, dateISO: daysAgo(50) },
  { id: 'o-6', patientPseudonym: 'Mteja B', instrument: 'GAD-7', score: 11, dateISO: daysAgo(25) },
  { id: 'o-7', patientPseudonym: 'Mteja B', instrument: 'GAD-7', score: 7, dateISO: daysAgo(10) },
  { id: 'o-8', patientPseudonym: 'Mteja C', instrument: 'PHQ-9', score: 22, dateISO: daysAgo(40) },
  { id: 'o-9', patientPseudonym: 'Mteja C', instrument: 'PHQ-9', score: 17, dateISO: daysAgo(20) },
]

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

export const loadOutcomes = (): OutcomeEntry[] => {
  const v = read<OutcomeEntry[] | null>('outcomes', null)
  if (v && v.length) return v
  write('outcomes', seedOutcomes)
  return seedOutcomes
}
export const saveOutcomes = (o: OutcomeEntry[]) => write('outcomes', o)

// ─── Referrals ─────────────────────────────────────────────────────────
export interface Referral {
  id: string
  direction: 'sent' | 'received'
  patientPseudonym: string
  counterpartyName: string
  reasonSw: string
  status: 'pending' | 'accepted' | 'declined' | 'completed'
  dateISO: string
}

const seedReferrals: Referral[] = [
  {
    id: 'r-1',
    direction: 'sent',
    patientPseudonym: 'Mteja D',
    counterpartyName: 'Dr. Mwakasege (Psychiatry)',
    reasonSw: 'Tathmini ya dawa — sonona kali',
    status: 'accepted',
    dateISO: daysAgo(7),
  },
  {
    id: 'r-2',
    direction: 'received',
    patientPseudonym: 'Mteja E',
    counterpartyName: 'Mch. Daudi Mushi',
    reasonSw: 'Huzuni baada ya msiba',
    status: 'pending',
    dateISO: daysAgo(2),
  },
]

export const loadReferrals = (): Referral[] => {
  const v = read<Referral[] | null>('referrals', null)
  if (v && v.length) return v
  write('referrals', seedReferrals)
  return seedReferrals
}
export const saveReferrals = (r: Referral[]) => write('referrals', r)

// ─── Supervision cases ─────────────────────────────────────────────────
export interface SupervisionCase {
  id: string
  supervisee: string
  patientPseudonym: string
  summarySw: string
  submittedISO: string
  status: 'pending' | 'reviewed' | 'signed_off'
  feedbackSw?: string
}

const seedSup: SupervisionCase[] = [
  {
    id: 'sv-1',
    supervisee: 'Bw. Salim Bakari',
    patientPseudonym: 'Mteja F',
    summarySw: 'Vipindi 3 vya PM+. PHQ-9 imeshuka kutoka 16 hadi 11.',
    submittedISO: daysAgo(3),
    status: 'pending',
  },
  {
    id: 'sv-2',
    supervisee: 'Bi. Mariam Chande',
    patientPseudonym: 'Mteja G',
    summarySw: 'Kipindi cha lugha ya alama — wasiwasi mkubwa.',
    submittedISO: daysAgo(10),
    status: 'pending',
  },
]

export const loadSupervision = (): SupervisionCase[] => {
  const v = read<SupervisionCase[] | null>('supervision', null)
  if (v && v.length) return v
  write('supervision', seedSup)
  return seedSup
}
export const saveSupervision = (c: SupervisionCase[]) => write('supervision', c)

// ─── CEU tracking ──────────────────────────────────────────────────────
export interface CEUEntry {
  id: string
  titleSw: string
  hours: number
  completedISO: string
}

const seedCEU: CEUEntry[] = [
  { id: 'c-1', titleSw: 'CBT kwa Kiswahili — Moduli 1', hours: 6, completedISO: daysAgo(120) },
  { id: 'c-2', titleSw: 'Motivational Interviewing (MI)', hours: 4, completedISO: daysAgo(60) },
]

export const loadCEU = (): CEUEntry[] => {
  const v = read<CEUEntry[] | null>('ceu', null)
  if (v && v.length) return v
  write('ceu', seedCEU)
  return seedCEU
}
export const saveCEU = (e: CEUEntry[]) => write('ceu', e)
