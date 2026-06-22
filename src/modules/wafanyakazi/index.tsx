import type React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Card, ModuleShell, Table, Td, type SubNav } from '../_shared/Layout'
import { JEWEL, TEXT, hexToRgba, RADII } from '../../lib/glass'
import { useLang } from '../../lib/i18n/Provider'

const HR_AGG = {
  seats: 320, active_30d: 184, utilization_pct: 58,
  nps: 47, top_programs: ['PM+', 't-CBT', 'MBSR-Lite'],
  by_modality: { virtual: 71, in_person: 18, hybrid: 11 },
}

const MGR_MODULES = [
  { id: 'm1', key: 'waf.mgr.m1', name: 'Kutambua dalili za dhiki kazini', mins: 20 },
  { id: 'm2', key: 'waf.mgr.m2', name: 'Mazungumzo magumu — namna ya kuanza', mins: 25 },
  { id: 'm3', key: 'waf.mgr.m3', name: 'Kuongoza timu inayopona', mins: 30 },
  { id: 'm4', key: 'waf.mgr.m4', name: 'Mipaka — kazi vs maisha binafsi', mins: 15 },
  { id: 'm5', key: 'waf.mgr.m5', name: 'Kupunguza unyanyapaa wa afya ya akili', mins: 20 },
]

function Stat({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div style={{ padding: 16, borderRadius: RADII.card, background: hexToRgba(JEWEL.indigoWisdom, 0.18) }}>
      <div style={{ fontSize: 26, fontFamily: "'Tinos', serif", color: TEXT.heading }}>{value}</div>
      <div style={{ fontSize: 12, color: TEXT.muted, marginTop: 4 }}>{label}</div>
    </div>
  )
}

function Overview(): React.JSX.Element {
  const { t } = useLang()
  return (
    <Card title={t('waf.overview.title', 'EAP ya TABHOS')}>
      <p>
        {t('waf.overview.body', 'Kampuni hulipia usajili; mfanyakazi anapata huduma bila malipo na bila kufichuliwa. Kampuni haoni data binafsi — inaona vipimo vya jumla pekee (utilization, NPS, mada kuu). Hii ndiyo inayofanya watu kweli watumie.')}
      </p>
    </Card>
  )
}

function EmpAccess(): React.JSX.Element {
  const { t } = useLang()
  return (
    <Card title={t('waf.emp.title', 'Kifaa cha mfanyakazi')}>
      <p>{t('waf.emp.body', 'Mfanyakazi anaingia kwa kutumia barua-pepe ya kampuni au msimbo wa kampuni — bila jina la mfanyakazi kuingia kwenye log ya HR.')}</p>
      <ul>
        <li>{t('waf.emp.li1', 'Tathmini binafsi (PHQ-9, GAD-7, AUDIT)')}</li>
        <li>{t('waf.emp.li2', 'Vikao na mhudumu wa siri (virtual au ana kwa ana)')}</li>
        <li>{t('waf.emp.li3', 'Mipango: PM+, t-CBT, MI, MBSR-Lite')}</li>
        <li>{t('waf.emp.li4', 'Mwenza — mwenza wa AI wa Kiswahili')}</li>
        <li>{t('waf.emp.li5', 'Hakuna data binafsi inayoonyeshwa kwa kampuni')}</li>
      </ul>
    </Card>
  )
}

function HrDash(): React.JSX.Element {
  const { t } = useLang()
  return (
    <>
      <Card title={t('waf.hr.title', 'Dashboard ya HR (jumla pekee)')}>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
          <Stat label={t('waf.hr.seats', 'Viti vya usajili')} value={HR_AGG.seats.toString()} />
          <Stat label={t('waf.hr.active', 'Wanaotumia (siku 30)')} value={HR_AGG.active_30d.toString()} />
          <Stat label={t('waf.hr.utilization', 'Utilization')} value={`${HR_AGG.utilization_pct}%`} />
          <Stat label="NPS" value={`+${HR_AGG.nps}`} />
        </div>
      </Card>
      <Card title={t('waf.hr.top_programs', 'Mipango maarufu')}>
        <ol>{HR_AGG.top_programs.map((p) => <li key={p}>{p}</li>)}</ol>
      </Card>
      <Card title={t('waf.hr.modality', 'Modaliti')}>
        <p>{t('waf.hr.modality.virtual', 'Virtual')}: {HR_AGG.by_modality.virtual}% · {t('waf.hr.modality.in_person', 'Ana kwa ana')}: {HR_AGG.by_modality.in_person}% · {t('waf.hr.modality.hybrid', 'Mchanganyiko')}: {HR_AGG.by_modality.hybrid}%</p>
      </Card>
      <Card title={t('waf.hr.privacy', 'Faragha')}>
        <p>{t('waf.hr.privacy_body', 'HR haioni jina, idara, au yoyote ya mfanyakazi binafsi. Mwajiri akiomba data ya mtu binafsi, ombi linakataliwa kiotomatiki.')}</p>
      </Card>
    </>
  )
}

function Programs(): React.JSX.Element {
  const { t } = useLang()
  return (
    <Card title={t('waf.programs.title', 'Mipango inayopatikana kwa mfanyakazi')}>
      <ul>
        <li>{t('waf.programs.pmplus', 'PM+ Kiswahili (vikao 5)')}</li>
        <li>{t('waf.programs.tcbt', 't-CBT (vikao 8)')}</li>
        <li>{t('waf.programs.mi', 'MI — substance brief (vikao 4)')}</li>
        <li>{t('waf.programs.mbsr', 'MBSR-Lite (wiki 6)')}</li>
        <li>{t('waf.programs.pst', 'PST — kutatua matatizo (vikao 6)')}</li>
      </ul>
    </Card>
  )
}

function ManagerTraining(): React.JSX.Element {
  const { t } = useLang()
  return (
    <Card title={t('waf.mgr.title', 'Mafunzo ya wasimamizi')}>
      <Table headers={[t('waf.mgr.col.module', 'Moduli'), t('waf.mgr.col.duration', 'Muda'), t('waf.mgr.col.status', 'Hali')]}>
        {MGR_MODULES.map((m) => (
          <tr key={m.id}>
            <Td>{t(m.key, m.name)}</Td>
            <Td>{m.mins} {t('common.minutes', 'dakika')}</Td>
            <Td><span style={{ padding: '2px 8px', borderRadius: 999, background: JEWEL.tealRoho, color: TEXT.onJewel, fontSize: 11 }}>{t('waf.mgr.available', 'Inapatikana')}</span></Td>
          </tr>
        ))}
      </Table>
    </Card>
  )
}

export default function Wafanyakazi(): React.JSX.Element {
  const { t } = useLang()
  const SUBS: SubNav[] = [
    { to: '.', label: t('common.mwongozo', 'Mwongozo') },
    { to: 'mfanyakazi', label: t('waf.sub.mfanyakazi', 'Mfanyakazi') },
    { to: 'hr', label: 'HR Dashboard' },
    { to: 'mipango', label: t('waf.sub.mipango', 'Mipango') },
    { to: 'wasimamizi', label: t('waf.sub.wasimamizi', 'Wasimamizi') },
  ]
  return (
    <ModuleShell slug="wafanyakazi" subs={SUBS}>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="mfanyakazi" element={<EmpAccess />} />
        <Route path="hr" element={<HrDash />} />
        <Route path="mipango" element={<Programs />} />
        <Route path="wasimamizi" element={<ManagerTraining />} />
      </Routes>
    </ModuleShell>
  )
}
