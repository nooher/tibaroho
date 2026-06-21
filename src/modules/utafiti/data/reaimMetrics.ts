/**
 * RE-AIM — Glasgow, Vogt & Boles 1999; Glasgow et al. 2019 (Frontiers).
 * 5 dimensions tracked across the 12-week PhD effectiveness-implementation
 * cohort (N=600 enrolled target).
 */

export interface ReaimHistoryPoint {
  week: number
  value: number
}

export interface ReaimMetric {
  id: 'reach' | 'effectiveness' | 'adoption' | 'implementation' | 'maintenance'
  name: string
  swahili: string
  definition: string
  calculation: string
  currentValue: number
  target: number
  unit: string
  history: ReaimHistoryPoint[]
}

export const REAIM_METRICS: ReaimMetric[] = [
  {
    id: 'reach',
    name: 'Reach',
    swahili: 'Kufikia',
    definition: 'Proportion and representativeness of individuals from the target population who participate in the intervention.',
    calculation: '(enrolled_with_consent) / (eligible_screened) × 100',
    currentValue: 70.2,
    target: 75,
    unit: '%',
    history: [
      { week: 0, value: 0 },
      { week: 2, value: 18 },
      { week: 4, value: 34 },
      { week: 6, value: 49 },
      { week: 8, value: 58 },
      { week: 10, value: 64 },
      { week: 12, value: 70.2 },
    ],
  },
  {
    id: 'effectiveness',
    name: 'Effectiveness',
    swahili: 'Ufanisi',
    definition: 'Impact of the intervention on important outcomes — primary outcome here is PHQ-9 remission (score < 5) at 12 weeks.',
    calculation: '(participants with PHQ-9<5 at wk12) / (participants assessed at wk12) × 100',
    currentValue: 42.1,
    target: 45,
    unit: '% remission',
    history: [
      { week: 0, value: 0 },
      { week: 4, value: 12 },
      { week: 8, value: 28 },
      { week: 12, value: 42.1 },
    ],
  },
  {
    id: 'adoption',
    name: 'Adoption',
    swahili: 'Kukubaliwa',
    definition: 'Proportion and representativeness of settings and staff (providers, sites) that adopt the intervention.',
    calculation: '(facilities launching) / (facilities invited) × 100',
    currentValue: 60,
    target: 100,
    unit: '% facilities',
    history: [
      { week: 0, value: 20 },
      { week: 4, value: 40 },
      { week: 8, value: 50 },
      { week: 12, value: 60 },
    ],
  },
  {
    id: 'implementation',
    name: 'Implementation',
    swahili: 'Utekelezaji',
    definition: 'Fidelity of the intervention as delivered, including consistency and cost.',
    calculation: 'mean(provider session adherence %) weighted by sessions delivered',
    currentValue: 81.4,
    target: 85,
    unit: '% fidelity',
    history: [
      { week: 2, value: 68 },
      { week: 4, value: 73 },
      { week: 6, value: 76 },
      { week: 8, value: 79 },
      { week: 10, value: 80 },
      { week: 12, value: 81.4 },
    ],
  },
  {
    id: 'maintenance',
    name: 'Maintenance',
    swahili: 'Uendelevu',
    definition: 'Extent to which the intervention becomes institutionalized and individual-level effects are sustained over 6–12 months.',
    calculation: '(remission sustained at 6mo follow-up) / (remitters at 12wk) × 100',
    currentValue: 0,
    target: 70,
    unit: '% sustained',
    history: [
      { week: 12, value: 0 },
    ],
  },
]
