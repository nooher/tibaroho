/**
 * Wasioajiriwa (job-seekers) sub-track data.
 * EBM: Behavioral Activation, job-search CBT (Proudfoot), group programs.
 */
import { TZ_FLAG } from '../../../lib/glass'
import type { TrackData } from './dialysisData'

export const wasioajiriwaData: TrackData = {
  id: 'wasioajiriwa',
  slug: 'wasioajiriwa',
  titleSw: 'WATAFUTAJI KAZI',
  titleEn: 'Job-seekers & unemployed',
  accent: TZ_FLAG.yellow,
  prevalence:
    'Unyogovu mkubwa mara 2–3 zaidi ya wenye ajira. Hatari ya kujiua huongezeka kadri muda wa kukosa kazi unavyoongezeka. Umri ulio hatarini zaidi: 18–35.',
  ebmIntro:
    'Tunatumia Behavioral Activation (BA) iliyofanyiwa kazi kwa kutafuta kazi, job-search CBT ya Proudfoot (iliyothibitishwa kupunguza unyogovu na kuongeza kazi), na vikundi vya msaada vinavyoshirikiana. Huduma yote ni BURE kabisa.',
  programs: [
    {
      name: 'BA kwa kutafuta kazi',
      brief:
        'Ratiba ya kila siku: shughuli 3 za maana (kutafuta kazi, mazoezi, kijamii). Kufuatilia hisia. Kuvunja mzunguko wa kulala-kukata tamaa-kulala.',
      ebm: 'Lejuez BATD adaptation',
    },
    {
      name: 'Job-search CBT',
      brief:
        'Vipindi 7 vya kikundi: kupinga mawazo ya "sifai," kujenga CV, kufanya mahojiano, kushughulikia kukataliwa. Imethibitishwa kupunguza unyogovu na kuongeza ajira.',
      ebm: 'Proudfoot JOBS II — RCT evidence',
    },
    {
      name: 'Muunganiko wa kazi',
      brief:
        'Viungo vya moja kwa moja na VETA (mafunzo ya ujuzi), TaESA (kazi), na Smart Tanzania (kazi za kidijitali). Si tu tiba — pia njia.',
      ebm: 'IPS-Lite (Individual Placement & Support)',
    },
    {
      name: 'Bila unyanyapaa',
      brief:
        'Lugha yetu: "Unatafuta kazi" sio "wewe ni mvivu." Hakuna kipimo cha thamani yako kinacholingana na ajira yako.',
      ebm: 'Anti-stigma framing — WHO mhGAP',
    },
    {
      name: 'Ushauri wa fedha',
      brief:
        'Bajeti ya kuwa hauna mshahara, namna ya kuongea na familia inayokutegemea, kuepuka mikopo ya gharama kubwa.',
      ebm: 'Financial counselling integration',
    },
  ],
  peerSupport:
    'Vikundi vya kila wiki vya watu 6–10 — wengine wamepata kazi, wengine bado wanatafuta. Mtandao wa fursa. Hauko peke yako.',
  hotlines: [
    { name: 'Lifeline Tanzania', number: '0800110116', verified: false },
    { name: 'TaESA — Wakala wa Ajira', number: '+255222110049', verified: false, note: 'Saa za kazi' },
    { name: 'Dharura ya jumla', number: '112', verified: true },
  ],
  providerReferral:
    'Washauri wa kazi na wataalam wa afya ya akili wanaofanya kazi pamoja. Muunganiko wa VETA na vyuo vya ufundi.',
  rohoMode: 'mfunzi',
  rafikiHook:
    'Mwenza huingia hali ya "mfunzi" — anajenga muundo wa siku, anasaidia kuandika kuomba kazi, anakubali kukataliwa bila kuongeza ujumbe wa thamani.',
  highlights: [
    {
      title: 'BURE — bila masharti',
      body:
        'Hakuna kulipa, hakuna usajili wa kazi, hakuna ushahidi. Kama unahitaji msaada na haupokei mshahara, TBHOS ipo.',
    },
  ],
}
