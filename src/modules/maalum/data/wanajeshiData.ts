/**
 * Wanajeshi & Maveterani sub-track data.
 * Confidential, military-only entry. EBM: TF-CBT, EMDR (provider-only),
 * couples therapy, peer-buddy systems.
 */
import { TZ_FLAG } from '../../../lib/glass'
import type { TrackData } from './dialysisData'

export const wanajeshiData: TrackData = {
  id: 'wanajeshi',
  slug: 'wanajeshi',
  titleSw: 'WANAJESHI NA MAVETERANI',
  titleEn: 'Military service-members & veterans',
  accent: TZ_FLAG.green,
  prevalence:
    'PTSD 12–20% (operesheni za mapigano huongeza hadi 30%+). Unyogovu mkubwa 15%+. Tatizo la pombe 25%. Unyanyapaa wa "udhaifu" huzuia kuomba msaada — TABHOS huvunja huo unyanyapaa.',
  ebmIntro:
    'Tunatumia Trauma-Focused CBT (TF-CBT) kama itifaki ya kwanza, EMDR (kwa watoa huduma waliotunzwa pekee), tiba ya wanandoa kwa mizozo ya familia baada ya rejeo, na mfumo wa rafiki-rika (peer-buddy) ulionakiliwa kutoka US VA na UK Combat Stress.',
  programs: [
    {
      name: 'Mlango wa siri wa kijeshi',
      brief:
        'Kuingia kunatumia kitambulisho cha jeshi tu. Akaunti haijaunganishwa na kumbukumbu za kazi; afisa wako wa amri HAONI chochote isipokuwa ukimpa ruhusa kwa maandishi.',
      ebm: 'Confidentiality firewall — UK Combat Stress model',
    },
    {
      name: 'Mafunzo ya maafisa: "Tambua + Rejea"',
      brief:
        'Kozi ya saa 4 kwa maafisa wakuu — kutambua dalili za mapema (kulala, kunywa, hasira), kuongea bila kuhukumu, kurejea kwa kufaa bila kuvunja faragha.',
      ebm: 'Military Mental Health First Aid',
    },
    {
      name: 'Msaada wa familia za wanajeshi',
      brief:
        'Mke/mume, watoto, wazazi. Moduli za "Ametoka, ni mwingine" — kuelewa mabadiliko baada ya rejeo, kuepuka mzozo wa kwanza, kujenga njia ya kuongea tena.',
      ebm: 'Strong Bonds curriculum',
    },
    {
      name: 'Mpito wa veteran',
      brief:
        'Wanaomaliza utumishi: kazi, utambulisho, jamii, malipo. Kipindi cha miezi 12 cha kufuatilia. Mtandao wa maveterani.',
      ebm: 'Transition Assistance Program adaptation',
    },
    {
      name: 'Mapigano vs. utumishi wa kawaida',
      brief:
        'Njia mbili tofauti: combat-exposed (TF-CBT kamili + EMDR + dawa) na non-combat (kuzuia, kuongoza ustawi, mahusiano).',
      ebm: 'IOM combat vs garrison framework',
    },
  ],
  peerSupport:
    'Rafiki-rika: kila mwanajeshi anapata "buddy" — mwingine wa cheo sawa au veteran. Mfumo wa kuangalia kila wiki. Vikundi vya maveterani Dar, Dodoma, Mbeya, Mwanza.',
  hotlines: [
    { name: 'Simu ya kijeshi (TABHOS)', number: '0800220110', verified: false, note: 'Siri kabisa' },
    { name: 'Lifeline Tanzania', number: '0800110116', verified: false },
    { name: 'IPV / unyanyasaji wa nyumbani', number: '116', verified: false },
    { name: 'Dharura ya jumla', number: '112', verified: true },
  ],
  providerReferral:
    'Wataalam waliosajiliwa na vetted kwa muktadha wa kijeshi. Hospitali ya Lugalo (Dar) na vitengo vya kisaikolojia vya JKT.',
  rohoMode: 'mlinzi',
  rafikiHook:
    'Mwenza huingia hali ya "mlinzi" — kavu, ya heshima, isiyolaumu. Hutoa mazoezi mafupi (sekunde 60) ya kupumua na grounding ya 5-4-3-2-1 baada ya ndoto za usiku.',
  highlights: [
    {
      title: 'Faragha kabla ya yote',
      body:
        'Hakuna afisa wa amri, hakuna fail ya kazi, hakuna jeshi linaloweza kuomba data yako. Kuomba msaada SIO ushahidi wa udhaifu — ni hatua ya kijeshi.',
    },
  ],
}
