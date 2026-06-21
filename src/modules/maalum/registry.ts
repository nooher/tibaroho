/**
 * Maalum sub-track registry.
 * Single source of truth for the 15 special-population tracks.
 * Tanzania-flag accents prioritized (green / yellow / black / blue),
 * jewel accents only where flag colors would not read well.
 */
import { TZ_FLAG, JEWEL } from '../../lib/glass'

export interface MaalumTrack {
  id: string
  slug: string
  label_sw: string
  label_en: string
  accent_color: string
  prevalence_note: string
  route: string
}

export const MAALUM_TRACKS: MaalumTrack[] = [
  {
    id: 'hiv',
    slug: 'mimi-na-hiv',
    label_sw: 'Mimi na HIV',
    label_en: 'Living with HIV',
    accent_color: TZ_FLAG.green,
    prevalence_note: 'Unyogovu 30–40% miongoni mwa watu wanaoishi na HIV.',
    route: '/maalum/mimi-na-hiv',
  },
  {
    id: 'kansa',
    slug: 'mimi-na-kansa',
    label_sw: 'Mimi na Kansa',
    label_en: 'Living with cancer',
    accent_color: TZ_FLAG.yellow,
    prevalence_note: 'Distress 35–45% wakati wa matibabu ya kansa.',
    route: '/maalum/mimi-na-kansa',
  },
  {
    id: 'mimba',
    slug: 'mimi-na-mimba',
    label_sw: 'Mimba na Uzazi',
    label_en: 'Perinatal mental health',
    accent_color: TZ_FLAG.blue,
    prevalence_note: 'Perinatal depression 15–22% Tanzania; baba/mzazi-mwenza 8–12%.',
    route: '/maalum/mimi-na-mimba',
  },
  {
    id: 'mtoto',
    slug: 'mimi-na-mtoto',
    label_sw: 'Mtoto (4–17)',
    label_en: 'Child mental health',
    accent_color: TZ_FLAG.yellow,
    prevalence_note: 'Matatizo ya kihisia 10–15% kwa watoto wa shule.',
    route: '/maalum/mimi-na-mtoto',
  },
  {
    id: 'wazazi',
    slug: 'wazazi',
    label_sw: 'Wazazi',
    label_en: 'Parents & caregivers',
    accent_color: TZ_FLAG.green,
    prevalence_note: 'Msongo wa malezi unaongeza unyogovu mara 1.8.',
    route: '/maalum/wazazi',
  },
  {
    id: 'wazee',
    slug: 'wazee',
    label_sw: 'Wazee',
    label_en: 'Older adults',
    accent_color: JEWEL.goldHope,
    prevalence_note: 'Unyogovu 10–20%; mara nyingi haujatambuliwa.',
    route: '/maalum/wazee',
  },
  {
    id: 'wanafunzi',
    slug: 'wanafunzi',
    label_sw: 'Wanafunzi',
    label_en: 'Students (secondary + university)',
    accent_color: TZ_FLAG.blue,
    prevalence_note: 'Wasiwasi 25–35% vyuo vikuu; mawazo ya kujidhuru 8–12%.',
    route: '/maalum/wanafunzi',
  },
  {
    id: 'uponyaji',
    slug: 'uponyaji',
    label_sw: 'Uponyaji',
    label_en: 'Addiction recovery',
    accent_color: TZ_FLAG.green,
    prevalence_note: 'Co-occurring MH/SUD 50–60%.',
    route: '/maalum/uponyaji',
  },
  {
    id: 'wakimbizi',
    slug: 'wakimbizi',
    label_sw: 'Wakimbizi',
    label_en: 'Refugees / displaced',
    accent_color: TZ_FLAG.blue,
    prevalence_note: 'PTSD 25–40%; unyogovu 30%+ kambini Nyarugusu/Nduta.',
    route: '/maalum/wakimbizi',
  },
  {
    id: 'magereza',
    slug: 'magereza',
    label_sw: 'Magereza',
    label_en: 'Incarcerated / re-entry',
    accent_color: TZ_FLAG.black,
    prevalence_note: 'Unyogovu 30–50% magerezani; relapse 60% miezi 6 baada.',
    route: '/maalum/magereza',
  },
  {
    id: 'dialysis',
    slug: 'dialysis',
    label_sw: 'Kuoshwa Damu',
    label_en: 'Dialysis (ESRD)',
    accent_color: TZ_FLAG.blue,
    prevalence_note: 'Unyogovu 30–50% — kiwango cha juu zaidi cha magonjwa sugu.',
    route: '/maalum/dialysis',
  },
  {
    id: 'wanajeshi',
    slug: 'wanajeshi',
    label_sw: 'Wanajeshi & Maveterani',
    label_en: 'Military & veterans',
    accent_color: TZ_FLAG.green,
    prevalence_note: 'PTSD 12–20%; unyogovu 15%+; pombe-tatizo 25%.',
    route: '/maalum/wanajeshi',
  },
  {
    id: 'wasioajiriwa',
    slug: 'wasioajiriwa',
    label_sw: 'Watafutaji Kazi',
    label_en: 'Unemployed (job-seekers)',
    accent_color: TZ_FLAG.yellow,
    prevalence_note: 'Unyogovu mkubwa 2–3x; hatari ya kujiua inaongezeka; umri 18–35.',
    route: '/maalum/wasioajiriwa',
  },
  {
    id: 'watoa-huduma',
    slug: 'watoa-huduma',
    label_sw: 'Watoa Huduma za Afya',
    label_en: 'Healthcare workers & medical students',
    accent_color: TZ_FLAG.black,
    prevalence_note: 'Burnout 50–60%; kujiua 1.5–2x; unyanyapaa wa leseni.',
    route: '/maalum/watoa-huduma',
  },
  {
    id: 'magonjwa-sugu',
    slug: 'magonjwa-sugu',
    label_sw: 'Magonjwa Sugu Mengineyo',
    label_en: 'Other chronic conditions',
    accent_color: TZ_FLAG.green,
    prevalence_note: 'HTN/DM/asthma/COPD/kifafa: unyogovu 2x; caregiver burnout 40%.',
    route: '/maalum/magonjwa-sugu',
  },
]
