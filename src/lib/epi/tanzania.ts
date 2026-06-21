// Tanzania mental health epidemiology — REAL, cited stats.
//
// Rules for adding a stat to this file:
//   1. Must come from a public, citeable document (WHO Atlas, MoH HSSP,
//      peer-reviewed paper, TDHS, Mental Health Act).
//   2. `citation` is the human-readable source string surfaced in UI tooltips.
//   3. `citation_url` is the canonical URL (HSSP V / WHO / journal) if known.
//   4. `asOf` is the publication year as ISO ('2020', '2021-2026').
//   5. If you don't know the real value — OMIT. Do not guess.

export interface EpiStat {
  label_sw: string
  label_en: string
  value: number | string
  unit?: string
  citation: string
  citation_url?: string
  asOf: string
}

export const TZ_MENTAL_HEALTH: Record<string, EpiStat> = {
  // -- Workforce ------------------------------------------------------------
  psychiatrists_per_100k: {
    label_sw: 'Madaktari wa magonjwa ya akili kwa watu 100,000',
    label_en: 'Psychiatrists per 100,000 population',
    value: 0.06,
    citation: 'WHO Mental Health Atlas 2020 — United Republic of Tanzania country profile.',
    citation_url: 'https://www.who.int/publications/i/item/9789240036703',
    asOf: '2020',
  },
  mh_workers_per_100k: {
    label_sw: 'Wafanyakazi wote wa afya ya akili kwa watu 100,000',
    label_en: 'Total mental health workforce per 100,000',
    value: 1.7,
    citation: 'WHO Mental Health Atlas 2020 — Tanzania (all mental-health worker categories combined).',
    citation_url: 'https://www.who.int/publications/i/item/9789240036703',
    asOf: '2020',
  },

  // -- Beds & service coverage ---------------------------------------------
  mh_beds_per_100k: {
    label_sw: 'Vitanda vya wagonjwa wa akili kwa watu 100,000',
    label_en: 'Mental hospital beds per 100,000',
    value: 1.0,
    citation: 'WHO Mental Health Atlas 2020 — Tanzania (mental hospital beds).',
    citation_url: 'https://www.who.int/publications/i/item/9789240036703',
    asOf: '2020',
  },
  treatment_gap_qual: {
    label_sw: 'Pengo la matibabu — magonjwa makubwa ya akili',
    label_en: 'Treatment gap — severe mental disorders (sub-Saharan Africa)',
    value: '>75',
    unit: '%',
    citation: 'WHO mhGAP: Mental Health Gap Action Programme — sub-Saharan Africa treatment gap for severe mental disorders consistently reported above 75%.',
    citation_url: 'https://www.who.int/teams/mental-health-and-substance-use/treatment-care/mental-health-gap-action-programme',
    asOf: '2019',
  },

  // -- Policy & law --------------------------------------------------------
  mh_law_year: {
    label_sw: 'Sheria ya Afya ya Akili',
    label_en: 'Mental Health Act in force',
    value: 'Chapter 98 (2008)',
    citation: 'Mental Health Act, Chapter 98 of the Laws of Tanzania (enacted 2008).',
    citation_url: 'https://www.parliament.go.tz/',
    asOf: '2008',
  },
  hssp_period: {
    label_sw: 'Mpango Mkakati wa Sekta ya Afya',
    label_en: 'Health Sector Strategic Plan period',
    value: 'HSSP V',
    citation: 'Health Sector Strategic Plan V (HSSP V) — Tanzania Ministry of Health, period 2021/22–2025/26. Mental health is a flagged priority area.',
    citation_url: 'https://www.moh.go.tz/',
    asOf: '2021-2026',
  },

  // -- Burden of disease ---------------------------------------------------
  suicide_rate_per_100k: {
    label_sw: 'Kiwango cha kujidhuru (vifo) kwa watu 100,000',
    label_en: 'Age-standardised suicide rate per 100,000',
    value: 7.0,
    citation: 'WHO Suicide Worldwide in 2019 — Tanzania age-standardised suicide mortality (per 100,000); approx. 7 per 100k.',
    citation_url: 'https://www.who.int/publications/i/item/9789240026643',
    asOf: '2019',
  },

  // -- Facilities (count below is what TBHOS has SEEDED, not a national census)
  facilities_in_directory: {
    label_sw: 'Vituo vilivyomo katika orodha ya Tumaini',
    label_en: 'Facilities currently in Tumaini directory',
    value: 10,
    citation: 'Tumaini · TBHOS internal directory (tr_facilities). National census forthcoming via MoH MoU.',
    asOf: '2026',
  },
  national_hospitals_count: {
    label_sw: 'Hospitali kuu za kitaifa zinazotoa huduma ya akili',
    label_en: 'National-tier hospitals offering psychiatric services',
    value: 3,
    citation: 'Tanzania MoH hospital tier list — Mirembe, Muhimbili, Benjamin Mkapa.',
    citation_url: 'https://www.moh.go.tz/',
    asOf: '2024',
  },

  // -- Modules / product (non-epi but surfaced on Landing) -----------------
  modules_count: {
    label_sw: 'Moduli za kina katika TBHOS',
    label_en: 'TBHOS modules',
    value: 12,
    citation: 'Tumaini · TBHOS product spec (Laetoli, Sprint H).',
    asOf: '2026',
  },
  cost_to_user: {
    label_sw: 'Gharama kwa mtumiaji na mtoa-huduma',
    label_en: 'Cost to user / provider',
    value: 'Bure',
    citation: 'Laetoli (T) Ltd policy — TBHOS is free for all users and providers in perpetuity.',
    asOf: '2026',
  },
}

// Convenience accessor for UI cards.
export function epi(key: keyof typeof TZ_MENTAL_HEALTH): EpiStat {
  return TZ_MENTAL_HEALTH[key]
}

// Sub-Saharan / WHO Africa Region context (cited where shown alongside TZ).
export const TZ_CONTEXT_NOTES = {
  one_in_four_global: {
    label_sw: '1 kati ya 4 — mzigo wa magonjwa ya akili duniani',
    label_en: '1 in 4 — global lifetime prevalence of mental disorders',
    citation: 'WHO — Mental disorders affect roughly 1 in 4 people in their lifetime (longstanding WHO figure).',
    citation_url: 'https://www.who.int/news-room/fact-sheets/detail/mental-disorders',
    asOf: '2022',
  },
} as const
