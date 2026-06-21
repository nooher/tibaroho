/**
 * Watoa Huduma za Afya — healthcare workers + medical students.
 * MOST IMPORTANT track. Walled, confidential entry separate from any
 * provider/employer workspace. Anti-stigma. Schwartz Rounds. Peer-clinician
 * matching.
 */
import { TZ_FLAG } from '../../../lib/glass'
import type { TrackData } from './dialysisData'

export const watoaHudumaData: TrackData = {
  id: 'watoa-huduma',
  slug: 'watoa-huduma',
  titleSw: 'WATOA HUDUMA ZA AFYA',
  titleEn: 'Healthcare workers & medical students',
  accent: TZ_FLAG.black,
  prevalence:
    'Burnout 50–60% miongoni mwa madaktari na wauguzi. Kujiua 1.5–2x zaidi ya umma. Wanafunzi wa tiba: unyogovu 28%, mawazo ya kujiua 11%. Sababu kuu inayozuia kuomba msaada: hofu ya kupoteza leseni.',
  ebmIntro:
    'Tunatumia mfumo wa peer-clinician counsellors (wakushauri ni daktari/muuguzi mwenye mafunzo, sio nje), MBSR iliyofanyiwa kazi kwa muktadha wa kazi za saa nyingi, Schwartz Rounds (vikao vya kushiriki uzoefu wa kihisia kazini), na — muhimu zaidi — faragha kamili na bodi za usajili.',
  programs: [
    {
      name: 'Faragha kamili kutoka bodi za usajili',
      brief:
        'Akaunti yako ya Watoa-Huduma ni TOFAUTI na akaunti yako ya kawaida ya Tumaini au TBHOS provider workspace. Hakuna meli, hakuna NACTE/MCT/AKT, hakuna mwajiri anaweza kuomba data hii.',
      ebm: 'Confidentiality firewall — UK Practitioner Health, Physician Health Programs (US)',
    },
    {
      name: 'Schwartz Rounds Tanzania',
      brief:
        'Vikao vya kila mwezi (saa 1) — daktari/muuguzi anashiriki kisa kimoja kilichomgusa. Wengine wanasikiliza tu, halafu wanashiriki uzoefu wao. Bila ushauri, bila kutatua. Imethibitishwa kupunguza burnout.',
      ebm: 'Schwartz Rounds — Maben et al. NIHR 2018',
    },
    {
      name: 'Mafunzo ya MBSR yaliyofanyiwa kazi',
      brief:
        'Wiki 8 za mazoezi ya akili-makini iliyofanyiwa kazi kwa zamu za saa 12, dharura, na kifo cha mgonjwa.',
      ebm: 'Kabat-Zinn MBSR — healthcare adaptation',
    },
    {
      name: 'Ushirikiano na hospitali — wakati uliolindwa',
      brief:
        'Tunashirikiana na Muhimbili, Bugando, KCMC, Mbeya kupanga "protected time" ya saa 1 kwa wiki kwa watumishi kupata huduma — bila kupungua mshahara.',
      ebm: 'Stanford WellMD — institutional partnerships',
    },
    {
      name: 'Wanafunzi wa tiba: MUHAS, CUHAS, KCMC, HKMU, KIU-CSI',
      brief:
        'Moduli maalum kwa wanafunzi. Mfumo wa "mentor wa siri" — daktari aliyepita kwenye kile unachopitia. Kuanzia mwaka wa kwanza.',
      ebm: 'AAMC student wellness framework',
    },
    {
      name: 'Mlinganisho wa rika kwa utaalamu na hatua',
      brief:
        'Daktari wa upasuaji anaungana na mwingine wa upasuaji. Mwanafunzi wa mwaka wa 3 anaungana na wa mwaka wa 5. Mama-mtumishi anaungana na mama-mtumishi.',
      ebm: 'Peer-matching outcomes — Shanafelt JAMA',
    },
  ],
  peerSupport:
    'Wakushauri wote ni madaktari/wauguzi waliopita mafunzo ya saa 60. Wanafunga ahadi ya faragha. Hupatikana saa 24. Hakuna kumbukumbu inayoenda kwa bodi yoyote.',
  hotlines: [
    {
      name: 'Simu ya rika-mtaalam (TBHOS)',
      number: '0800330220',
      verified: false,
      note: 'Daktari/muuguzi mwingine ndio anayejibu',
    },
    { name: 'Lifeline Tanzania', number: '0800110116', verified: false },
    { name: 'Dharura ya jumla', number: '112', verified: true },
  ],
  providerReferral:
    'Iwapo unahitaji tiba ya kina, tunarejea kwa wataalam wa kibinafsi waliokubali kufanya kazi nje ya mfumo wa kawaida wa hospitali — bila kumbukumbu kwa mwajiri.',
  rohoMode: 'mwenza',
  rafikiHook:
    'Mwenza anajua kuwa wewe unajua tiba — hakurudii teknik. Anauliza tu: "Leo umejilisha vipi?" Anakubali ukosefu wa muda. Hapasi kuandika kumbukumbu, hapendi kuhukumu.',
  highlights: [
    {
      title: 'FARAGHA KAMILI — chombo cha kwanza',
      body:
        'Tunaelewa kwa nini hujaomba msaada: unaogopa kupoteza leseni, sifa, au kuonekana mvyofaa. Akaunti yako hapa haijaunganishwa na MCT, NMC-T, OCT au bodi yoyote ya usajili. Haijaunganishwa na TBHOS provider workspace yako. Haijaunganishwa na mwajiri wako. Hata ukitumia barua-pepe ya hospitali, tunatumia identifier tofauti. Hii ni ahadi ya kiufundi, sio sera tu.',
    },
    {
      title: 'Kazi yako sio wewe',
      body:
        'Wewe ulikuwa mtu kabla ya kuwa daktari/muuguzi/mwanafunzi. Bado uko. Tunakukumbusha hayo.',
    },
  ],
}
