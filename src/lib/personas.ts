/**
 * Tumaini · TBHOS demo personas — CargoLink-style persona switcher.
 *
 * Each persona maps a stakeholder role to a curated mock data set,
 * a starting route, and a flag-coded avatar. Setting a persona writes
 * `tumaini.persona` to localStorage and marks Karibu complete (except
 * for the cold-start persona, which routes to /karibu).
 *
 * Used by: src/modules/personas/index.tsx, src/components/PersonaBanner.tsx,
 *          src/components/CommandPalette.tsx.
 */
import { useEffect, useState } from 'react'
import { BRAND } from './glass'

export type PersonaId =
  | 'maria'
  | 'asha'
  | 'salima'
  | 'kalumuna'
  | 'komba'
  | 'mtumbe'
  | 'ps_health'
  | 'nooher'
  | 'baloh'
  | 'mpya'

/**
 * Demo persona credentials. All chips use the same shared password —
 * Tumaini2026! — and email-confirmed accounts were seeded in
 * supabase/migrations/20260621000001_demo_personas.sql. Clicking a chip
 * performs a real signInWithPassword and lands the user inside their
 * persona's home with a full Supabase session.
 */
export const DEMO_PASSWORD = 'Tumaini2026!'

export const personaEmail: Record<PersonaId, string> = {
  maria:    'maria@tumaini.demo',
  asha:     'asha@tumaini.demo',
  salima:   'salima@tumaini.demo',
  kalumuna: 'kalumuna@tumaini.demo',
  komba:    'komba@tumaini.demo',
  mtumbe:   'mtumbe@tumaini.demo',
  ps_health:'ps.health@tumaini.demo',
  nooher:   'nooher@tumaini.demo',
  baloh:    'baloh@tumaini.demo',
  mpya:     'mpya@tumaini.demo',
}

export interface Persona {
  id: PersonaId
  name: string
  role: string         // Swahili role label
  english: string      // English role helper for screen readers
  description: string  // 1-line Swahili
  initials: string     // 2 letters for avatar disc
  accent: string       // flag-coded hex
  startRoute: string   // route to push after setting
  /** When true, this persona keeps Karibu unfinished — sends to wizard step 1. */
  coldStart?: boolean
}

const STORAGE_KEY = 'tumaini.persona'
const KARIBU_KEY = 'tumaini.karibu.v1.complete'

export const PERSONAS: readonly Persona[] = [
  {
    id: 'maria',
    name: 'Maria Mwakini',
    role: 'Mgonjwa',
    english: 'Patient',
    description: 'Dar, miaka 28 — anatumia mood tracker na ana miadi miwili.',
    initials: 'MM',
    accent: BRAND.green,
    startRoute: '/mimi',
  },
  {
    id: 'asha',
    name: 'Dr. Asha Mwema',
    role: 'Daktari · Psychiatrist',
    english: 'Psychiatrist',
    description: 'Wataalam workspace — wagonjwa 14, leo 3, telehealth tayari.',
    initials: 'AM',
    accent: BRAND.blue,
    startRoute: '/wataalam',
  },
  {
    id: 'salima',
    name: 'Bibi Salima Issa',
    role: 'Lay counsellor · Friendship Bench',
    english: 'Lay counsellor',
    description: 'Anasimamiwa na Dr. Mwema — wagonjwa 8 walio chini ya uangalizi.',
    initials: 'SI',
    accent: BRAND.yellow,
    startRoute: '/wataalam',
  },
  {
    id: 'kalumuna',
    name: 'Mr. Kalumuna',
    role: 'Mwajiri · HR',
    english: 'Employer HR',
    description: 'EAP — wafanyakazi 240 wamejiandikisha, matumizi 22%.',
    initials: 'MK',
    accent: BRAND.blue,
    startRoute: '/wafanyakazi',
  },
  {
    id: 'komba',
    name: 'Mama Asha Komba',
    role: 'Mshauri wa Shule',
    english: 'School counsellor',
    description: 'Shule+ — Kidato cha 4 na 6, wanafunzi 86 wamechunguzwa.',
    initials: 'AK',
    accent: BRAND.green,
    startRoute: '/shuleplus',
  },
  {
    id: 'mtumbe',
    name: 'Dr. Mtumbe',
    role: 'Mtafiti · MUHAS',
    english: 'Researcher',
    description: 'Utafiti console — CFIR sites 6, karatasi 3 zinaandaliwa.',
    initials: 'DM',
    accent: BRAND.yellow,
    startRoute: '/utafiti',
  },
  {
    id: 'ps_health',
    name: 'Hon. PS-Health',
    role: 'Mwakilishi wa Wizara',
    english: 'Permanent Secretary, MoH',
    description: 'Sera dashboard — mikoa yote 26, KPIs za wizara.',
    initials: 'PS',
    accent: BRAND.ink,
    startRoute: '/sera',
  },
  {
    id: 'nooher',
    name: 'Dr. Ally A. Nooher',
    role: 'Mwanzilishi',
    english: 'Founder',
    description: 'Ndani admin + Founder console + Principal view.',
    initials: 'AN',
    accent: BRAND.ink,
    startRoute: '/ndani',
  },
  {
    id: 'baloh',
    name: 'Dr. Jure Baloh',
    role: 'Msimamizi wa PhD · UAMS HSSR',
    english: 'PhD Supervisor',
    description: 'Utafiti console — CFIR · RE-AIM · CEA · Equity · Fidelity · IRB · karatasi.',
    initials: 'JB',
    accent: BRAND.blue,
    startRoute: '/utafiti',
  },
  {
    id: 'mpya',
    name: 'Mtumiaji Mpya',
    role: 'Cold start',
    english: 'New user',
    description: 'Hakuna data — anza kwa Karibu wizard kutoka hatua ya 1.',
    initials: 'MP',
    accent: BRAND.creamOrange,
    startRoute: '/karibu',
    coldStart: true,
  },
] as const

export function getPersonaId(): PersonaId | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (!v) return null
    if (PERSONAS.some((p) => p.id === v)) return v as PersonaId
  } catch {
    /* noop */
  }
  return null
}

export function getPersona(): Persona | null {
  const id = getPersonaId()
  return id ? PERSONAS.find((p) => p.id === id) ?? null : null
}

export function setPersona(id: PersonaId): Persona | null {
  const p = PERSONAS.find((x) => x.id === id)
  if (!p) return null
  try {
    localStorage.setItem(STORAGE_KEY, id)
    if (p.coldStart) {
      localStorage.removeItem(KARIBU_KEY)
    } else {
      localStorage.setItem(KARIBU_KEY, 'true')
    }
  } catch {
    /* noop */
  }
  window.dispatchEvent(new CustomEvent('tumaini:persona', { detail: id }))
  return p
}

export function clearPersona(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* noop */
  }
  window.dispatchEvent(new CustomEvent('tumaini:persona', { detail: null }))
}

export function usePersona(): Persona | null {
  const [persona, setState] = useState<Persona | null>(() => getPersona())
  useEffect(() => {
    const onChange = () => setState(getPersona())
    window.addEventListener('tumaini:persona', onChange)
    window.addEventListener('storage', onChange)
    return () => {
      window.removeEventListener('tumaini:persona', onChange)
      window.removeEventListener('storage', onChange)
    }
  }, [])
  return persona
}

/**
 * Curated mock data per persona — exposed so any module can pick up the
 * persona-specific demo content without re-querying the network.
 */
export interface PersonaMockData {
  upcomingAppointments?: number
  activePatients?: number
  todayPatients?: number
  enrolledEmployees?: number
  utilizationPct?: number
  studentsScreened?: number
  researchSites?: number
  papersInPipeline?: number
  regionsCovered?: number
  phq9History?: ReadonlyArray<{ date: string; score: number }>
  notes?: string
}

export const personaMockData: Record<PersonaId, PersonaMockData> = {
  maria: {
    upcomingAppointments: 2,
    phq9History: [
      { date: '2026-04-02', score: 17 },
      { date: '2026-04-30', score: 14 },
      { date: '2026-05-28', score: 11 },
      { date: '2026-06-18', score: 9 },
    ],
    notes: 'Karibu wizard imekamilika. Mood tracker amilifu.',
  },
  asha: {
    activePatients: 14,
    todayPatients: 3,
    notes: 'Telehealth (Jitsi) tayari. Inbox ya wagonjwa imepangwa.',
  },
  salima: {
    activePatients: 8,
    notes: 'Mfumo wa usimamizi — Dr. Asha Mwema anasimamia.',
  },
  kalumuna: {
    enrolledEmployees: 240,
    utilizationPct: 22,
    notes: 'EAP dashboard ya kampuni — ripoti za jumla bila majina.',
  },
  komba: {
    studentsScreened: 86,
    notes: 'Kidato 4 + 6. SDQ na PSC zinatumika.',
  },
  mtumbe: {
    researchSites: 6,
    papersInPipeline: 3,
    notes: 'CFIR scoring katika sites 6. IRB MUHAS imeidhinishwa.',
  },
  ps_health: {
    regionsCovered: 26,
    notes: 'Mikoa yote 26. KPIs za wizara zinaonekana wakati halisi.',
  },
  nooher: {
    notes: 'Ufikiaji kamili — Ndani · Founder · Principal view.',
  },
  baloh: {
    researchSites: 6,
    papersInPipeline: 3,
    notes: 'Msimamizi wa PhD — Utafiti console + RE-AIM + IRB + paper pipeline (read-only).',
  },
  mpya: {
    notes: 'Hakuna data. Karibu wizard itaanza kutoka hatua ya 1.',
  },
}
