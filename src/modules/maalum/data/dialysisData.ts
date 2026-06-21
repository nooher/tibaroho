/**
 * Dialysis (ESRD) sub-track data.
 * EBM: CBT for ESRD (Cukor protocol), behavioral activation during 4-hour
 * dialysis sessions, MBCT for chronic-illness rumination.
 */
import { TZ_FLAG } from '../../../lib/glass'

export interface Hotline { name: string; number: string; verified: boolean; note?: string }
export interface TrackProgram { name: string; brief: string; ebm: string }
export interface TrackData {
  id: string
  slug: string
  titleSw: string
  titleEn: string
  accent: string
  prevalence: string
  ebmIntro: string
  programs: TrackProgram[]
  peerSupport: string
  hotlines: Hotline[]
  providerReferral: string
  rohoMode: 'mwenza' | 'mfunzi' | 'mlinzi' | 'mwandishi' | 'mhakiki' | 'mkumbusha'
  rafikiHook: string
  highlights?: { title: string; body: string }[]
}

export const dialysisData: TrackData = {
  id: 'dialysis',
  slug: 'dialysis',
  titleSw: 'WAGONJWA WA FIGO — KUOSHWA DAMU',
  titleEn: 'Dialysis (end-stage renal disease)',
  accent: TZ_FLAG.blue,
  prevalence:
    'Unyogovu hujitokeza kwa 30–50% ya wagonjwa wa kuoshwa damu — kiwango cha juu zaidi kati ya magonjwa yote sugu. Wasiwasi 25–40%. Mawazo ya kujidhuru ni mara 3 zaidi ya watu wengine.',
  ebmIntro:
    'Tunatumia itifaki ya CBT-ESRD ya Cukor (vipindi 10, vinavyofanyika wakati wa kuoshwa damu chumbani), Behavioral Activation iliyofanyiwa kazi kwa vikao vya saa 4, na MBCT kwa mawazo ya kujirudia kuhusu ugonjwa. Tunaunganisha kabisa na TibaFigo kwa data ya labu na dawa.',
  programs: [
    {
      name: 'Vipindi vya CBT chumbani mwa dialysis',
      brief:
        'Kila kipindi cha saa 4 kinajumuisha: kuandika hisia (dakika 10), CBT fupi (dakika 25 — moduli za kufuata), na mazungumzo ya rika (dakika 20).',
      ebm: 'Cukor et al. — CBT-ESRD',
    },
    {
      name: 'Muunganiko wa TibaFigo',
      brief:
        'Rafiki hupokea GFR, Kt/V, hemoglobin na phosphate moja kwa moja. Mwenza hujibu kwa muktadha — k.m. "Tumeona Kt/V yako imepanda; hii ni habari njema."',
      ebm: 'Integrated care — KDOQI 2020',
    },
    {
      name: 'Utayari wa kupandikiziwa figo (transplant readiness)',
      brief:
        'Tathmini ya kisaikolojia ya wagombea: PHQ-9, GAD-7, msaada wa familia, ufuasi wa dawa. Mpango wa miezi 6 kabla ya tathmini ya kituo.',
      ebm: 'ISPN transplant guidelines',
    },
    {
      name: 'Afya ya kingono na ESRD',
      brief:
        'Moduli ya faragha — uchovu, libido, dawa za BP, ED, ukame. Sahihi kwa wanawake na wanaume. Inaweza kufunguliwa au kufichwa.',
      ebm: 'NKF sexual-health practice points',
    },
  ],
  peerSupport:
    'Vikundi vya rika vinaongozwa na waliopona kupandikiziwa au waliotumia dialysis zaidi ya miaka 3. Kikao kimoja kwa wiki kwenye ratiba ya kituo cha Muhimbili na Bugando. Mtandao wa WhatsApp wa siri kati ya vikao.',
  hotlines: [
    { name: 'Lifeline Tanzania', number: '0800110116', verified: false },
    { name: 'Muhimbili Dialysis Unit', number: '+255222151591', verified: false, note: 'Saa za kazi' },
    { name: 'Dharura ya jumla', number: '112', verified: true },
  ],
  providerReferral:
    'Rufaa za moja kwa moja: Muhimbili (Dar), Bugando (Mwanza), KCMC (Moshi), Mbeya Referral. Tunashirikiana na vitengo vyao vya kisaikolojia.',
  rohoMode: 'mwenza',
  rafikiHook:
    'Mwenza huingia hali ya "mwenza" wakati wa dialysis: sauti ya chini, ujumbe mfupi, hakuna kazi za muda mrefu. Hujibu maswali kuhusu dawa kwa kushirikiana na TibaFigo bila kuvuruga kupumzika.',
  highlights: [
    {
      title: 'Saa 4 zinapogeuka tiba',
      body:
        'Wagonjwa wengi husema dialysis ni "saa 4 zilizopotea." TBHOS hugeuza saa hizo kuwa fursa ya tiba ya kisaikolojia, bila kuongeza muda wala safari.',
    },
  ],
}
