/**
 * PROGRESS-Plus equity stratifiers (O'Neill et al. 2014).
 * Used for pre-specified equity analyses on PHQ-9 remission.
 */

export interface EquityVar {
  id: string
  name: string
  swahili: string
  levels: string[]
}

export const EQUITY_VARS: EquityVar[] = [
  {
    id: 'place',
    name: 'Place',
    swahili: 'Mahali',
    levels: ['Urban — Dar/Mwanza/Arusha', 'Peri-urban', 'Rural'],
  },
  {
    id: 'ethnicity',
    name: 'Race / Ethnicity',
    swahili: 'Kabila',
    levels: ['Bantu majority cluster', 'Nilotic cluster', 'Cushitic cluster', 'Other / mixed'],
  },
  {
    id: 'occupation',
    name: 'Occupation',
    swahili: 'Kazi',
    levels: ['Formal salaried', 'Informal trade', 'Subsistence farming', 'Student', 'Unemployed'],
  },
  {
    id: 'gender',
    name: 'Gender',
    swahili: 'Jinsia',
    levels: ['Female', 'Male', 'Non-binary / prefer not to say'],
  },
  {
    id: 'religion',
    name: 'Religion',
    swahili: 'Dini',
    levels: ['Christian', 'Muslim', 'Traditional / indigenous', 'None'],
  },
  {
    id: 'education',
    name: 'Education',
    swahili: 'Elimu',
    levels: ['None', 'Primary', 'O-level', 'A-level', 'Tertiary'],
  },
  {
    id: 'ses',
    name: 'Socioeconomic Status',
    swahili: 'Hali ya kiuchumi',
    levels: ['NHIF insured', 'CHF insured', 'Self-pay', 'Indigent / waiver'],
  },
  {
    id: 'social-capital',
    name: 'Social Capital',
    swahili: 'Mtaji wa kijamii',
    levels: ['Strong family + community', 'Moderate', 'Isolated'],
  },
  {
    id: 'age',
    name: 'Age',
    swahili: 'Umri',
    levels: ['18–24', '25–34', '35–44', '45–54', '55–64', '65+'],
  },
  {
    id: 'disability',
    name: 'Disability',
    swahili: 'Ulemavu',
    levels: ['None', 'Physical', 'Sensory', 'Cognitive', 'Multiple'],
  },
  {
    id: 'orientation',
    name: 'Sexual Orientation',
    swahili: 'Mwelekeo wa kijinsia',
    levels: ['Reported heterosexual', 'Reported sexual minority', 'Declined'],
  },
  {
    id: 'time-dep',
    name: 'Time-dependent Relationships',
    swahili: 'Mahusiano ya muda',
    levels: ['Pregnant / postpartum', 'Caregiver of young child', 'Caregiver of elder / chronically ill', 'None'],
  },
  {
    id: 'baseline-severity',
    name: 'Baseline Severity',
    swahili: 'Ukali wa awali',
    levels: ['Mild PHQ-9 10–14', 'Moderate 15–19', 'Severe 20–27'],
  },
]
