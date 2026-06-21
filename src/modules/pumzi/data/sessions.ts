// pumzi/data/sessions.ts — 8 evidence-based breathing sessions.

export type PumziPhase = 'inhale' | 'hold' | 'exhale' | 'hold'

export interface PumziPattern {
  phases: PumziPhase[]
  seconds: number[]
  rounds: number
}

export interface PumziSession {
  id: string
  name_sw: string
  name_en: string
  duration_s: number
  pattern: PumziPattern
  target: string[]
  evidence_citation: string
}

export const PUMZI_SESSIONS: PumziSession[] = [
  {
    id: '478',
    name_sw: 'Pumzi 4-7-8',
    name_en: '4-7-8 Relaxing Breath',
    duration_s: 4 * 19,
    pattern: {
      phases: ['inhale', 'hold', 'exhale'],
      seconds: [4, 7, 8],
      rounds: 4,
    },
    target: ['anxiety', 'insomnia', 'stress'],
    evidence_citation: 'Weil A. (2015). Breathing: Three Exercises. Andrew Weil MD / University of Arizona.',
  },
  {
    id: 'box',
    name_sw: 'Pumzi ya Sanduku 4-4-4-4',
    name_en: 'Box Breathing 4-4-4-4',
    duration_s: 16 * 8,
    pattern: {
      phases: ['inhale', 'hold', 'exhale', 'hold'],
      seconds: [4, 4, 4, 4],
      rounds: 8,
    },
    target: ['focus', 'stress', 'performance'],
    evidence_citation: 'Roma M. et al. (2017). Box-breathing in Navy SEAL training. Military Medicine.',
  },
  {
    id: 'coherence',
    name_sw: 'Mlinganisho 5-5',
    name_en: 'Resonance / Coherence 5-5',
    duration_s: 10 * 30,
    pattern: {
      phases: ['inhale', 'exhale'],
      seconds: [5, 5],
      rounds: 30,
    },
    target: ['hrv', 'anxiety', 'mood'],
    evidence_citation: 'Lehrer P. & Gevirtz R. (2014). Heart-rate variability biofeedback. Frontiers in Psychology.',
  },
  {
    id: 'nadi',
    name_sw: 'Nadi Shodhana — Pua mbili',
    name_en: 'Nadi Shodhana — Alternate Nostril',
    duration_s: 16 * 10,
    pattern: {
      phases: ['inhale', 'hold', 'exhale', 'hold'],
      seconds: [4, 4, 4, 4],
      rounds: 10,
    },
    target: ['anxiety', 'focus', 'balance'],
    evidence_citation: 'Telles S. et al. (2014). Alternate-nostril yoga breathing. Med Sci Monit Basic Res.',
  },
  {
    id: 'ujjayi',
    name_sw: 'Ujjayi — Pumzi ya Bahari',
    name_en: 'Ujjayi — Ocean Breath',
    duration_s: 12 * 12,
    pattern: {
      phases: ['inhale', 'exhale'],
      seconds: [6, 6],
      rounds: 12,
    },
    target: ['calm', 'meditation', 'pranayama'],
    evidence_citation: 'Brown R.P. & Gerbarg P.L. (2005). Sudarshan Kriya yogic breathing. J Altern Complement Med.',
  },
  {
    id: 'bhastrika',
    name_sw: 'Bhastrika — Pumzi ya Nguvu',
    name_en: 'Bhastrika — Bellows Breath',
    duration_s: 2 * 30,
    pattern: {
      phases: ['inhale', 'exhale'],
      seconds: [1, 1],
      rounds: 30,
    },
    target: ['energy', 'morning', 'pranayama'],
    evidence_citation: 'Telles S. et al. (2011). Energizing effect of bhastrika pranayama. Indian J Physiol Pharmacol.',
  },
  {
    id: 'wimhof',
    name_sw: 'Wim Hof — Mzunguko mmoja',
    name_en: 'Wim Hof — One Cycle',
    duration_s: 30 * 2 + 60,
    pattern: {
      phases: ['inhale', 'exhale', 'hold'],
      seconds: [2, 2, 60],
      rounds: 30,
    },
    target: ['energy', 'inflammation', 'cold-tolerance'],
    evidence_citation: 'Kox M. et al. (2014). Voluntary activation of the sympathetic nervous system. PNAS 111(20).',
  },
  {
    id: 'pursedlip',
    name_sw: 'Pumzi ya Midomo — 4-6',
    name_en: 'Pursed-lip Breathing 4-6',
    duration_s: 10 * 15,
    pattern: {
      phases: ['inhale', 'exhale'],
      seconds: [4, 6],
      rounds: 15,
    },
    target: ['copd', 'shortness-of-breath', 'asthma'],
    evidence_citation: 'American Thoracic Society (2020). Pursed-lip breathing — COPD clinical guidelines.',
  },
]

export function getSessionById(id: string): PumziSession | undefined {
  return PUMZI_SESSIONS.find((s) => s.id === id)
}
