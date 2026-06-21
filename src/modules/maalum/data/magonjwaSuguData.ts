/**
 * Magonjwa sugu mengineyo — HTN, DM, asthma, COPD, epilepsy, autoimmune.
 * EBM: CBT for chronic disease, MBCT, self-compassion.
 */
import { TZ_FLAG } from '../../../lib/glass'
import type { TrackData } from './dialysisData'

export const magonjwaSuguData: TrackData = {
  id: 'magonjwa-sugu',
  slug: 'magonjwa-sugu',
  titleSw: 'MAGONJWA SUGU MENGINEYO',
  titleEn: 'Other chronic conditions (HTN, DM, asthma, COPD, epilepsy, autoimmune)',
  accent: TZ_FLAG.green,
  prevalence:
    'Magonjwa sugu huongeza unyogovu mara 2. HTN: 25%. Kisukari: 30%. Pumu/COPD: 30–40%. Kifafa: 30%. Magonjwa ya autoimmune (lupus, RA): 35%+. Caregivers wa mgonjwa sugu: burnout 40%.',
  ebmIntro:
    'Tunatumia CBT iliyofanyiwa kazi kwa magonjwa sugu (CBT-CD), MBCT kwa kupunguza kujirudia kwa mawazo ya ugonjwa, na mafunzo ya self-compassion. Kila moduli inaunganishwa moja kwa moja na TibaAfya kwa data ya BP, sukari, n.k.',
  programs: [
    {
      name: 'CBT kwa ugonjwa sugu',
      brief:
        'Vipindi 8 — kukubali ugonjwa, kupanga kujifuatilia, kushughulikia hofu ya kuzidiwa, kuendelea kuishi maisha yenye maana.',
      ebm: 'White CBT-CD; Sharpe CBT-IBD',
    },
    {
      name: 'Muunganiko wa cross-platform TibaAfya',
      brief:
        'Rafiki hupokea BP, glucose, HbA1c, peak flow, frequency ya kifafa. Mwenza husikiliza muktadha. Si "mood + symptoms" tofauti — ni kitu kimoja.',
      ebm: 'Integrated behavioral health — Collaborative Care',
    },
    {
      name: 'Vikundi vya rika kwa ugonjwa',
      brief:
        'Watu wenye lupus huungana. Watu wenye kifafa wenyewe — bila kuhukumiwa. Watu wenye COPD wanaopumua ngumu — pamoja.',
      ebm: 'Disease-specific peer support — Cochrane review',
    },
    {
      name: 'Hali ya Mlezi (caregiver toggle)',
      brief:
        'Switch moja: "Mimi nina ugonjwa" au "Ninamlea mwenye ugonjwa." Maudhui yanabadilika. Burnout ya mlezi ni halisi na inahitaji huduma yake.',
      ebm: 'REACH caregiver intervention',
    },
    {
      name: 'MBCT na self-compassion',
      brief:
        'Mawazo ya "kwa nini mimi?" yanajirudia. Tunajifunza kuyaona, kuyaacha yapite, kujihurumia bila kujidanganya.',
      ebm: 'Segal MBCT; Neff self-compassion',
    },
  ],
  peerSupport:
    'Vikundi vya ugonjwa-mahususi vinaongozwa na waliopata maisha na ugonjwa zaidi ya miaka 5. Mtandao wa WhatsApp kwa kila kundi. Mikutano ya ana kwa ana Dar, Mwanza, Mbeya.',
  hotlines: [
    { name: 'Lifeline Tanzania', number: '0800110116', verified: false },
    { name: 'Kifafa: TEA Tanzania', number: '+255222112233', verified: false },
    { name: 'Kisukari: TDA', number: '+255713000000', verified: false },
    { name: 'Dharura ya jumla', number: '112', verified: true },
  ],
  providerReferral:
    'Wataalam wa magonjwa sugu (endocrinology, pulmonology, neurology, rheumatology) wanaofanya kazi pamoja na wataalam wa afya ya akili katika model ya collaborative care.',
  rohoMode: 'mwenza',
  rafikiHook:
    'Mwenza huelewa kuwa kila siku ni mizania ya nguvu. Hapasi kuuliza "umechukua dawa?" — anajua. Anauliza: "Leo siku ni ya rangi gani?" — kupima bila kushinikiza.',
  highlights: [
    {
      title: 'Ugonjwa wako sio adhabu',
      body:
        'Lugha yetu: "unaishi na" sio "unasumbuka na." Tunaepuka maneno ya vita (mapambano, kushinda). Tunatumia maneno ya kuishi (kubeba, kuruhusu, kuendelea).',
    },
  ],
}
