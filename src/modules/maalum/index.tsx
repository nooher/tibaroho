import type React from 'react'
import { Route, Routes, Link } from 'react-router-dom'
import { Card, ModuleShell, type SubNav } from '../_shared/Layout'
import { JEWEL, CREAM, NEUTRAL, TEXT, hexToRgba, RADII, TYPE, TZ_FLAG, glass } from '../../lib/glass'
import { MAALUM_TRACKS } from './registry'
import { dialysisData } from './data/dialysisData'
import { wanajeshiData } from './data/wanajeshiData'
import { wasioajiriwaData } from './data/wasioajiriwaData'
import { watoaHudumaData } from './data/watoaHudumaData'
import { magonjwaSuguData } from './data/magonjwaSuguData'
import type { TrackData } from './data/dialysisData'
import { useLang } from '../../lib/i18n/Provider'

interface Population {
  slug: string; label: string; titleSw: string; titleEn: string; overview: string
  assessments: string[]; programs: string[]; providers: string
  rohoMode: 'mwenza' | 'mfunzi' | 'mlinzi' | 'mwandishi' | 'mhakiki' | 'mkumbusha'
  hotlines: { name: string; number: string }[]
  /** Expansion blocks rendered after the standard sections. */
  expansions?: { title: string; body: string }[]
  /** Optional language-chip row (wakimbizi). */
  languageChips?: string[]
  /** Optional split-into-subtrack sections (wanafunzi). */
  sections?: { heading: string; body: string }[]
  /** Optional methadone-network table (uponyaji). */
  network?: { center: string; city: string; verified: boolean }[]
}

const NATIONAL = [
  { name: 'Dharura ya jumla', number: '112' },
  { name: 'Dharura ya afya', number: '199' },
]

const POPULATIONS: Population[] = [
  { slug: 'mimi-na-hiv', label: 'Mimi & HIV', titleSw: 'MIMI NA HIV', titleEn: 'Living with HIV',
    overview: 'Maisha na HIV yana mizigo ya kihisia — unyanyapaa, kufichuka, kufuata ART, na kupanga maisha mengine. TABHOS ina nafasi salama ya kuongea, kupanga, na kupata mtu wa kuaminika bila hofu ya kuhukumiwa.',
    assessments: ['PHQ-9', 'GAD-7', 'AUDIT', 'C-SSRS'],
    programs: ['PM+ Kiswahili', 'CETA', 'IPT (kwa unyogovu wa muda mrefu)', 'MI (kwa ART adherence)'],
    providers: 'Tunashirikiana na vituo vya CTC (Care & Treatment) na TACAIDS.',
    rohoMode: 'mwenza', hotlines: [{ name: 'TACAIDS', number: '0800110123' }, ...NATIONAL] },
  { slug: 'mimi-na-kansa', label: 'Mimi & Kansa', titleSw: 'MIMI NA KANSA', titleEn: 'Living with cancer',
    overview: 'Utambuzi wa kansa hubadilisha kila kitu — mwili, mahusiano, matumaini. TABHOS inafanya kazi pamoja na ORCI (Ocean Road Cancer Institute) kuendeleza usaidizi wa kihisia wakati wa matibabu na baada ya matibabu.',
    assessments: ['PHQ-9', 'GAD-7', 'EPDS (kwa mama)', 'K10'],
    programs: ['PM+ Kiswahili', 'MBSR-Lite', 'IPT (kwa huzuni za kupotea)'],
    providers: 'Vituo: ORCI Dar, KCMC Moshi, Bugando Mwanza.',
    rohoMode: 'mwenza', hotlines: [{ name: 'ORCI', number: '+255222151591' }, ...NATIONAL] },
  { slug: 'mimi-na-mimba', label: 'Mimba', titleSw: 'MIMI NA MIMBA', titleEn: 'Perinatal mental health',
    overview: 'Kabla ya kujifungua na baada yake ni kipindi cha mabadiliko makubwa. TABHOS hutoa tathmini ya EPDS kila trimester, IPT iliyofanyiwa kazi kwa Tanzania, na rufaa ya haraka kwenda kliniki za RCH zinazoshirikiana.',
    assessments: ['EPDS', 'PHQ-9', 'GAD-7'],
    programs: ['IPT (perinatal adaptation)', 'PM+ Kiswahili', 'Mindfulness — wajawazito'],
    providers: 'Kliniki za RCH (Reproductive & Child Health) za umma na CCBRT.',
    rohoMode: 'mwenza', hotlines: [{ name: 'CCBRT', number: '+255222802000' }, ...NATIONAL],
    expansions: [
      {
        title: 'Baba na Mzazi-mwenza — perinatal MH',
        body:
          'Karibu 8–12% ya baba/wazazi-wenza hupata unyogovu wa kabla/baada ya kuzaa. Mara nyingi hujificha nyuma ya "lazima niwe imara." TABHOS ina moduli maalum: tathmini ya EPDS-P (paternal), vipindi vya IPT kwa wanandoa, na mazungumzo ya jinsi mabadiliko ya familia yamekuwa kwako wewe pia.',
      },
    ],
  },
  { slug: 'mimi-na-mtoto', label: 'Mtoto', titleSw: 'MIMI NA MTOTO', titleEn: 'Child mental health (4-17)',
    overview: 'Watoto wanaonyesha dhiki tofauti na watu wazima — kupitia tabia, mwili, na shule. TABHOS hutumia SDQ na huleta familia ndani ya tiba.',
    assessments: ['SDQ (mzazi/mwalimu/mtoto)', 'PHQ-A (vijana)', 'CRAFFT'],
    programs: ['DBT-skills (kwa vijana ≥12)', 'Family Connections', 'PM+ kwa mlezi'],
    providers: 'Wataalamu wa watoto + Muhimbili Paediatric MH unit.',
    rohoMode: 'mwenza', hotlines: [{ name: 'Mtoto Hotline', number: '116' }, ...NATIONAL] },
  { slug: 'wazazi', label: 'Wazazi', titleSw: 'WAZAZI', titleEn: 'Parents & caregivers',
    overview: 'Kazi ya uzazi ni nzito — hasa pasipo na msaada. TABHOS ina mipango ya kuongeza ustadi wa malezi, kupunguza msongo, na kujenga jumuiya ya wazazi.',
    assessments: ['PHQ-9', 'GAD-7', 'K10', 'Parental Stress Scale'],
    programs: ['PM+ Kiswahili', 'Family Connections', 'MBSR-Lite'],
    providers: 'Vikundi vya wazazi (online + Dar/Mwanza).',
    rohoMode: 'mfunzi', hotlines: NATIONAL },
  { slug: 'wazee', label: 'Wazee', titleSw: 'WAZEE', titleEn: 'Older adults',
    overview: 'Wazee mara nyingi husahaulika katika huduma za afya ya akili. TABHOS ina mfumo wa heshima — sauti polepole, herufi kubwa, na ushirikiano na vyama vya wazee na mtoto/mjukuu kama mlezi wa pamoja.',
    assessments: ['GDS-15 (Geriatric Depression Scale)', 'PHQ-9', 'Mini-Cog'],
    programs: ['IPT — huzuni & mabadiliko ya maisha', 'PM+ — adaptation kwa wazee'],
    providers: 'Vituo vya wazee + watumishi wa nyumba kwa nyumba.',
    rohoMode: 'mwenza', hotlines: NATIONAL },
  { slug: 'wanafunzi', label: 'Wanafunzi', titleSw: 'WANAFUNZI', titleEn: 'Students',
    overview: 'Shule na chuo ni mahali pa shinikizo kubwa: mitihani, mahusiano, ndoa za utotoni, matumizi ya madawa. TABHOS ShulePlus inafanya kazi na shule zenyewe; wanafunzi binafsi pia wanapata sehemu hii.',
    assessments: ['PHQ-A', 'GAD-7', 'CRAFFT', 'SDQ'],
    programs: ['t-CBT — wasiwasi wa mitihani', 'PST — kutatua matatizo', 'MI — substance'],
    providers: 'School counsellors waliosajiliwa TABHOS ShulePlus.',
    rohoMode: 'mfunzi', hotlines: [{ name: 'Mtoto Hotline', number: '116' }, { name: 'Simu ya wanafunzi (24/7)', number: '0800118118' }, ...NATIONAL],
    sections: [
      {
        heading: 'Vyuo Vikuu',
        body:
          'Wasiwasi wa mitihani, ukosefu wa usingizi, matumizi ya pombe/madawa, mahusiano, kujitenga na familia. Moduli: t-CBT ya wasiwasi wa mitihani, MI kwa pombe, IPT kwa upweke. Ushirikiano na vyuo (UDSM, SUA, NM-AIST, MUHAS, CUHAS) kwa "protected counselling time."',
      },
      {
        heading: 'Shule za Sekondari (O & A-Level)',
        body:
          'Ndoa za utotoni, mimba zisizotarajiwa, unyanyasaji, mitihani ya NECTA, kuchaguliwa shule mbali na nyumbani. Moduli: SDQ ya wanafunzi/walimu/wazazi, vikundi vya rika, kushirikiana na walimu wa malezi.',
      },
      {
        heading: 'Mazingira salama ya LGBTQ+',
        body:
          'Tunatambua kuwa wanafunzi wengine wanapata shinikizo maalum la utambulisho na mwelekeo. Lugha yetu ni ya heshima na isiyolaani. Hatukuhukumi, hatukurekebishi. Tunakuangalia kama mwanafunzi anayehitaji msaada — kama wengine.',
      },
    ],
  },
  { slug: 'uponyaji', label: 'Uponyaji', titleSw: 'UPONYAJI', titleEn: 'Addiction recovery',
    overview: 'Uponyaji ni safari, sio tukio. TABHOS inashirikiana na NGO za Tanzania za uponyaji (TASUWA, Sober Houses) na hutoa MI + relapse prevention + jumuiya ya rika.',
    assessments: ['AUDIT', 'ASSIST', 'CRAFFT', 'PHQ-9', 'GAD-7'],
    programs: ['MI — mahojiano ya kuhamasisha', 'Faith-informed (opt-in)', 'DBT — uvumilivu wa dhiki'],
    providers: 'Sober Houses Tanzania, TASUWA, MEWATA (kwa wanawake).',
    rohoMode: 'mfunzi', hotlines: [{ name: 'Sober Houses', number: '0688000000' }, ...NATIONAL],
    network: [
      { center: 'Muhimbili Methadone Clinic', city: 'Dar es Salaam', verified: false },
      { center: 'Mwananyamala Methadone Clinic', city: 'Dar es Salaam', verified: false },
      { center: 'Mbeya Referral Hospital — MAT Unit', city: 'Mbeya', verified: false },
      { center: 'KCMC — MAT Unit', city: 'Moshi', verified: false },
    ],
    expansions: [
      {
        title: 'Moduli ya Familia',
        body:
          'Uponyaji wa mtu mmoja ni uponyaji wa familia nzima. Vipindi 6 vya familia: kuelewa uraibu, kuepuka kuwezesha (enabling), kujenga mipaka kwa upendo, kushughulikia majeraha ya zamani, kupanga rejea, na kuendelea pamoja.',
      },
    ],
  },
  { slug: 'wakimbizi', label: 'Wakimbizi', titleSw: 'WAKIMBIZI', titleEn: 'Refugees / displaced',
    overview: 'Wakimbizi katika Nyarugusu na Nduta wamebeba majeraha ya kiakili kutoka nchi za asili. TABHOS hufanya kazi na UNHCR + IRC kuendeleza CETA iliyotafsiriwa katika lugha za asili (Kirundi, Kongo) na Kiswahili.',
    assessments: ['PCL-5', 'PHQ-9', 'GAD-7', 'K10'],
    programs: ['CETA Kiswahili', 'PM+ Kiswahili', 'Imani — Kikristo/Kiislamu (opt-in)'],
    providers: 'UNHCR mental health desk, IRC, JRS.',
    rohoMode: 'mwenza', hotlines: [{ name: 'UNHCR Tanzania', number: '+255222197200' }, ...NATIONAL],
    languageChips: ['Kiswahili', 'Kirundi', 'Lingala', 'English', 'العربية'],
  },
  { slug: 'magereza', label: 'Magereza', titleSw: 'MAGEREZA', titleEn: 'Incarcerated / post-release',
    overview: 'Mfumo wa magereza Tanzania hauna huduma za kawaida za afya ya akili. TABHOS hutoa moduli rasmi kwa Magereza Tanzania (training ya wapelelezi) na inawasaidia waliotoka tu kuwa na mpango wa kuingia tena kwenye jamii.',
    assessments: ['PHQ-9', 'GAD-7', 'PCL-5', 'AUDIT', 'C-SSRS'],
    programs: ['CETA', 'MI', 'DBT-skills', 'Family Connections (re-entry)'],
    providers: 'Tanzania Prisons Service (mafunzo), CHRAGG (haki za wafungwa).',
    rohoMode: 'mwenza', hotlines: [{ name: 'CHRAGG', number: '+255222135747' }, ...NATIONAL],
    expansions: [
      {
        title: 'Kabla ya kutoka — wiki 8 kabla',
        body:
          'Mpango wa kutoka huanza wiki 8 kabla ya tarehe ya kutoka. Tunashughulikia: hofu ya kufutwa, kujenga upya familia, kupanga makazi ya kwanza, kazi ya kwanza, na mipaka ya kihisia.',
      },
      {
        title: 'Baada ya kutoka — miezi 12',
        body:
          'Mfumo wa miezi 12 wa kufuatilia: makazi (kwa idhini yako), kazi (kupitia VETA na TaESA), familia (kurudi pole pole), na probation. Tunashirikiana na ofisa wa probation TU kwa idhini yako iliyoandikwa.',
      },
    ],
  },
]

/* -------------------------------------------------------------------------- */
/*  Adapter — render new TrackData files using existing chrome.               */
/* -------------------------------------------------------------------------- */

function TrackPage({ t }: { t: TrackData }): React.JSX.Element {
  const { t: tr } = useLang()
  const ink = TEXT.body
  const subtle = TEXT.muted
  return (
    <>
      <Card title={t.titleSw} accent={t.accent}>
        <div style={{ fontSize: 13, color: subtle, marginBottom: 8 }}>{t.titleEn}</div>
        <p>{t.prevalence}</p>
      </Card>

      {t.highlights?.map((h) => (
        <Card key={h.title} title={h.title} accent={t.accent}>
          <p>{h.body}</p>
        </Card>
      ))}

      <Card title={tr('maalum.track.ebm', 'Mbinu zilizothibitishwa (EBM)')}>
        <p>{t.ebmIntro}</p>
      </Card>

      <Card title={tr('maalum.track.programs', 'Mipango')}>
        <div style={{ display: 'grid', gap: 14 }}>
          {t.programs.map((p) => (
            <div
              key={p.name}
              style={{
                padding: '14px 16px',
                background: CREAM.ivory,
                border: `1px solid ${hexToRgba(ink, 0.08)}`,
                borderLeft: `3px solid ${t.accent}`,
                borderRadius: RADII.card,
              }}
            >
              <div style={{ fontFamily: TYPE.serif, fontSize: 16, color: TEXT.heading, marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 14, color: TEXT.body, lineHeight: 1.5, marginBottom: 6 }}>{p.brief}</div>
              <div style={{ fontSize: 11, color: subtle, letterSpacing: 0.4, textTransform: 'uppercase' }}>{p.ebm}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title={tr('maalum.track.peer', 'Msaada wa rika')}>
        <p>{t.peerSupport}</p>
      </Card>

      <Card title={tr('maalum.track.hotlines', 'Simu za Dharura')} accent={JEWEL.maroonCrisis}>
        {t.hotlines.map((h) => (
          <div
            key={h.number}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 0',
              borderBottom: `1px solid ${hexToRgba(ink, 0.08)}`,
            }}
          >
            <span>
              {h.name}
              {!h.verified ? (
                <span style={{
                  marginLeft: 8, fontSize: 10, padding: '2px 6px',
                  borderRadius: 4, background: hexToRgba(JEWEL.goldHope, 0.18),
                  color: TEXT.heading, letterSpacing: 0.4,
                }}>
                  {tr('maalum.unverified', 'HAIJATHIBITISHWA')}
                </span>
              ) : null}
              {h.note ? <div style={{ fontSize: 12, color: subtle }}>{h.note}</div> : null}
            </span>
            <a href={`tel:${h.number}`} style={{ color: TEXT.link, fontFamily: TYPE.serif }}>{h.number}</a>
          </div>
        ))}
      </Card>

      <Card title={tr('maalum.track.referral', 'Rufaa za wahudumu')}>
        <p>{t.providerReferral}</p>
      </Card>

      <Card title={tr('maalum.track.mwenza-help', 'Mwenza anavyokusaidia')}>
        <div
          style={{
            display: 'inline-block', padding: '8px 16px', borderRadius: RADII.chip,
            background: t.accent, color: TEXT.onJewel,
            letterSpacing: TYPE.tightTrack, fontFamily: TYPE.serif, marginBottom: 12,
          }}
        >
          {t.rohoMode}
        </div>
        <p>{t.rafikiHook}</p>
      </Card>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*  Legacy population-page renderer, with expansion support.                  */
/* -------------------------------------------------------------------------- */

function PopPage({ p }: { p: Population }): React.JSX.Element {
  const { t } = useLang()
  const ink = TEXT.body
  const subtle = TEXT.muted
  return (
    <>
      <Card title={p.titleSw}>
        <div style={{ fontSize: 13, color: subtle, marginBottom: 8 }}>{p.titleEn}</div>
        <p>{p.overview}</p>
        {p.languageChips ? (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
            {p.languageChips.map((lang) => (
              <span
                key={lang}
                style={{
                  padding: '6px 12px',
                  borderRadius: RADII.chip,
                  background: CREAM.ivory,
                  border: `1px solid ${hexToRgba(ink, 0.12)}`,
                  fontSize: 12,
                  color: ink,
                  letterSpacing: 0.3,
                }}
              >
                {lang}
              </span>
            ))}
          </div>
        ) : null}
      </Card>

      {p.sections?.map((s) => (
        <Card key={s.heading} title={s.heading}>
          <p>{s.body}</p>
        </Card>
      ))}

      <Card title={t('maalum.pop.assessments', 'Tathmini Zilizopendekezwa')}><ul>{p.assessments.map((a) => <li key={a}>{a}</li>)}</ul></Card>
      <Card title={t('maalum.pop.programs', 'Mipango Iliyochaguliwa')}><ul>{p.programs.map((x) => <li key={x}>{x}</li>)}</ul></Card>
      <Card title={t('maalum.pop.providers', 'Wahudumu')}><p>{p.providers}</p></Card>

      {p.network ? (
        <Card title={t('maalum.pop.methadone', 'Mtandao wa Methadone')}>
          <div style={{ display: 'grid', gap: 10 }}>
            {p.network.map((n) => (
              <div key={n.center} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 14px', background: CREAM.ivory,
                border: `1px solid ${hexToRgba(ink, 0.08)}`, borderRadius: RADII.card,
              }}>
                <div>
                  <div style={{ fontFamily: TYPE.serif, color: ink }}>{n.center}</div>
                  <div style={{ fontSize: 12, color: subtle }}>{n.city}</div>
                </div>
                {!n.verified ? (
                  <span style={{
                    fontSize: 10, padding: '3px 8px', borderRadius: 4,
                    background: hexToRgba(JEWEL.goldHope, 0.18),
                    color: TEXT.heading, letterSpacing: 0.4,
                  }}>
                    {t('maalum.unverified', 'HAIJATHIBITISHWA')}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {p.expansions?.map((e) => (
        <Card key={e.title} title={e.title}>
          <p>{e.body}</p>
        </Card>
      ))}

      <Card title={t('maalum.pop.mwenza-mode', 'Mwenza — Mode iliyopangwa')}>
        <div style={{ display: 'inline-block', padding: '8px 16px', borderRadius: RADII.chip, background: JEWEL.tealRoho, color: TEXT.onJewel, letterSpacing: TYPE.tightTrack, fontFamily: TYPE.serif }}>
          {p.rohoMode}
        </div>
        <p style={{ marginTop: 12, fontSize: 13, color: subtle }}>
          {t('maalum.pop.mwenza-note', 'Mwenza atajibu kwa mtindo huu wakati unapata huduma hii.')}
        </p>
      </Card>
      <Card title={t('maalum.pop.hotlines', 'Simu za Dharura')} accent={JEWEL.maroonCrisis}>
        {p.hotlines.map((h) => (
          <div key={h.number} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid rgba(11,9,8,0.10)` }}>
            <span>{h.name}</span>
            <a href={`tel:${h.number}`} style={{ color: TEXT.link, fontFamily: TYPE.serif }}>{h.number}</a>
          </div>
        ))}
      </Card>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*  Landing — cream-card grid of 15 tracks.                                   */
/* -------------------------------------------------------------------------- */

function Overview(): React.JSX.Element {
  const { t } = useLang()
  const ink = TEXT.body
  return (
    <Card title={t('maalum.overview.title', 'Makundi maalum')}>
      <p style={{ marginBottom: 18 }}>
        {t('maalum.overview.body', 'Tunatambua kuwa baadhi ya hali za maisha zinahitaji huduma iliyofanyiwa kazi maalum — sio kanuni moja kwa wote. Chagua kundi ulilo nalo au unalitumikia.')}
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 14,
        }}
      >
        {MAALUM_TRACKS.map((t) => (
          <Link
            key={t.id}
            to={t.slug}
            style={{
              ...glass(t.accent_color, 0.08),
              padding: 18,
              textDecoration: 'none',
              color: ink,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              minHeight: 140,
              borderLeft: `3px solid ${t.accent_color}`,
            }}
          >
            <div
              style={{
                fontFamily: TYPE.serif,
                fontSize: 18,
                letterSpacing: TYPE.tightTrack,
                color: ink,
                lineHeight: 1.15,
              }}
            >
              {t.label_sw}
            </div>
            <div style={{ fontSize: 11, color: hexToRgba(ink, 0.55), letterSpacing: 0.5, textTransform: 'uppercase' }}>
              {t.label_en}
            </div>
            <div style={{ fontSize: 12, color: hexToRgba(ink, 0.72), lineHeight: 1.45, marginTop: 'auto' }}>
              {t.prevalence_note}
            </div>
          </Link>
        ))}
      </div>
      <div
        style={{
          marginTop: 22,
          padding: '12px 16px',
          background: CREAM.ivory,
          border: `1px solid ${hexToRgba(ink, 0.08)}`,
          borderRadius: RADII.card,
          fontSize: 12,
          color: hexToRgba(ink, 0.7),
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span
          aria-hidden
          style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 999, background: TZ_FLAG.green }}
        />
        {t('maalum.overview.flag-note', 'Rangi za bendera ya Tanzania zinaongoza msisitizo wa kila kundi.')}
      </div>
    </Card>
  )
}

export default function Maalum(): React.JSX.Element {
  const { t } = useLang()
  const SUBS: SubNav[] = [
    { to: '.', label: t('maalum.sub.guide', 'Mwongozo') },
    ...POPULATIONS.map((p) => ({ to: p.slug, label: p.label })),
    { to: 'dialysis', label: t('maalum.sub.dialysis', 'Kuoshwa Damu') },
    { to: 'wanajeshi', label: t('maalum.sub.wanajeshi', 'Wanajeshi') },
    { to: 'wasioajiriwa', label: t('maalum.sub.wasioajiriwa', 'Watafutaji Kazi') },
    { to: 'watoa-huduma', label: t('maalum.sub.watoa-huduma', 'Watoa Huduma') },
    { to: 'magonjwa-sugu', label: t('maalum.sub.magonjwa-sugu', 'Magonjwa Sugu') },
  ]
  return (
    <ModuleShell slug="maalum" subs={SUBS}>
      <Routes>
        <Route path="/" element={<Overview />} />
        {POPULATIONS.map((p) => <Route key={p.slug} path={p.slug} element={<PopPage p={p} />} />)}
        <Route path="dialysis" element={<TrackPage t={dialysisData} />} />
        <Route path="wanajeshi" element={<TrackPage t={wanajeshiData} />} />
        <Route path="wasioajiriwa" element={<TrackPage t={wasioajiriwaData} />} />
        <Route path="watoa-huduma" element={<TrackPage t={watoaHudumaData} />} />
        <Route path="magonjwa-sugu" element={<TrackPage t={magonjwaSuguData} />} />
      </Routes>
    </ModuleShell>
  )
}
