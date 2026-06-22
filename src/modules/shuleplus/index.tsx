import type React from 'react'
import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Card, ModuleShell, Table, Td, type SubNav } from '../_shared/Layout'
import { JEWEL, TEXT, hexToRgba, RADII } from '../../lib/glass'
import { useLang } from '../../lib/i18n/Provider'

const CAMPAIGNS = [
  { id: 'c1', name: 'SDQ Term 1 — Form III', status: 'Active', consented: 184, completed: 142 },
  { id: 'c2', name: 'PHQ-A — Form V (mitihani)', status: 'Scheduled', consented: 0, completed: 0 },
  { id: 'c3', name: 'CRAFFT — Form II', status: 'Draft', consented: 0, completed: 0 },
]

const PARENT_TEMPLATES = [
  { id: 't1', subject_key: 'shule.tpl.t1.subject', subject: 'Idhini ya tathmini ya afya ya akili (SDQ)',
    body_key: 'shule.tpl.t1.body', body: 'Mzazi mpendwa, shule yetu inashiriki TABHOS ShulePlus — mfumo wa bure wa kupima afya ya akili ya watoto. Tunaomba idhini yako kwa mtoto wako kufanya tathmini ya SDQ. Data ni siri kabisa na haitumii jina lake nje ya wahudumu.' },
  { id: 't2', subject_key: 'shule.tpl.t2.subject', subject: 'Mtoto wako anaonyesha dalili — wasiliana nasi',
    body_key: 'shule.tpl.t2.body', body: 'Mzazi mpendwa, tathmini ya hivi karibuni ya mtoto wako ilionyesha dalili tunazopenda kuongelea. Hii sio hatari — ni nafasi ya kusaidia mapema. Tafadhali wasiliana na mshauri wa shule.' },
  { id: 't3', subject_key: 'shule.tpl.t3.subject', subject: 'Warsha ya wazazi — Jumamosi',
    body_key: 'shule.tpl.t3.body', body: 'Mzazi mpendwa, tutakuwa na warsha ya bure ya saa 2 kwa wazazi kuhusu kusaidia watoto wakati wa mitihani. Tarehe + saa…' },
]

const AGGREGATE = {
  students: 1240, screened: 892,
  flagged_mild: 178, flagged_moderate: 64, flagged_referred: 22,
  topConcerns: [
    { key: 'shule.concern.exam', label: 'Wasiwasi wa mitihani' },
    { key: 'shule.concern.peers', label: 'Mahusiano ya rika' },
    { key: 'shule.concern.home', label: 'Mazingira nyumbani' },
  ],
  region: 'Dar es Salaam',
}

function Dashboard(): React.JSX.Element {
  const { t } = useLang()
  return (
    <>
      <Card title={t('shule.dash.title', 'Dashboard ya Mshauri')}>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', marginBottom: 12 }}>
          <Stat label={t('shule.dash.enrolled', 'Wanafunzi waliojiandikisha')} value={AGGREGATE.students.toString()} />
          <Stat label={t('shule.dash.screened', 'Waliopimwa muhula huu')} value={AGGREGATE.screened.toString()} />
          <Stat label={t('shule.dash.mild', 'Wenye dalili (mdogo)')} value={AGGREGATE.flagged_mild.toString()} />
          <Stat label={t('shule.dash.referred', 'Walioelekezwa kwa rufaa')} value={AGGREGATE.flagged_referred.toString()} />
        </div>
        <p style={{ fontSize: 12, color: TEXT.muted }}>
          {t('shule.dash.area_label', 'Eneo')}: {AGGREGATE.region}. {t('shule.dash.note', 'Data hii ni jumla — haina utambulisho wa mwanafunzi yeyote.')}
        </p>
      </Card>
      <Card title={t('shule.concerns.title', 'Wasiwasi mkubwa wa muhula')}>
        <ul>{AGGREGATE.topConcerns.map((c) => <li key={c.key}>{t(c.key, c.label)}</li>)}</ul>
      </Card>
    </>
  )
}

function Stat({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div style={{ padding: 16, borderRadius: RADII.card, background: hexToRgba(JEWEL.tealRoho, 0.18) }}>
      <div style={{ fontSize: 26, fontFamily: "'Tinos', serif", color: TEXT.heading }}>{value}</div>
      <div style={{ fontSize: 12, color: TEXT.muted, marginTop: 4 }}>{label}</div>
    </div>
  )
}

function Campaigns(): React.JSX.Element {
  const { t } = useLang()
  return (
    <Card title={t('shule.camp.title', 'Kampeni za uchunguzi (kwa idhini ya wazazi)')}>
      <Table headers={[t('shule.camp.col.name', 'Jina'), t('shule.camp.col.status', 'Hali'), t('shule.camp.col.consented', 'Wazazi waliokubali'), t('shule.camp.col.completed', 'Wanafunzi waliomaliza')]}>
        {CAMPAIGNS.map((c) => (
          <tr key={c.id}>
            <Td><strong>{c.name}</strong></Td>
            <Td>{c.status}</Td>
            <Td>{c.consented}</Td>
            <Td>{c.completed}</Td>
          </tr>
        ))}
      </Table>
      <p style={{ marginTop: 12, fontSize: 12, color: TEXT.muted }}>
        {t('shule.camp.consent_note', 'Kanuni: hakuna tathmini ya mwanafunzi bila idhini ya mzazi kwa wanaodogo (chini ya 18).')}
      </p>
    </Card>
  )
}

function ParentComms(): React.JSX.Element {
  const { t } = useLang()
  const [open, setOpen] = useState<string | null>(null)
  return (
    <Card title={t('shule.parents.title', 'Mifano ya mawasiliano kwa wazazi')}>
      {PARENT_TEMPLATES.map((tp) => (
        <div key={tp.id} style={{ borderTop: `1px solid rgba(11,9,8,0.10)`, padding: '12px 0' }}>
          <button
            onClick={() => setOpen(open === tp.id ? null : tp.id)}
            style={{ background: 'transparent', border: 'none', color: TEXT.heading, fontSize: 15, padding: 0, cursor: 'pointer', textAlign: 'left', width: '100%' }}
          >
            {open === tp.id ? '▾' : '▸'} {t(tp.subject_key, tp.subject)}
          </button>
          {open === tp.id ? (
            <p style={{ marginTop: 8, fontSize: 14, color: TEXT.body }}>{t(tp.body_key, tp.body)}</p>
          ) : null}
        </div>
      ))}
    </Card>
  )
}

function Aggregate(): React.JSX.Element {
  const { t } = useLang()
  return (
    <Card title={t('shule.agg.title', 'Dashboard ya shule (jumla)')}>
      <p>{t('shule.agg.body', 'Shule inaona takwimu za jumla pekee — hakuna data ya mwanafunzi binafsi. Hii inaiwezesha shule kuelewa mwelekeo bila kuvunja faragha ya watoto.')}</p>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', marginTop: 16 }}>
        <Stat label={t('shule.agg.total_screened', 'Jumla ya waliopimwa')} value={AGGREGATE.screened.toString()} />
        <Stat label={t('shule.agg.with_symptoms', 'Wenye dalili')} value={(AGGREGATE.flagged_mild + AGGREGATE.flagged_moderate).toString()} />
        <Stat label={t('shule.agg.referrals_made', 'Rufaa zilizofanywa')} value={AGGREGATE.flagged_referred.toString()} />
      </div>
    </Card>
  )
}

function Overview(): React.JSX.Element {
  const { t } = useLang()
  return (
    <Card title={t('shule.overview.title', 'ShulePlus — Mwongozo')}>
      <p>{t('shule.overview.body', 'Sehemu ya mshauri wa shule katika TABHOS. Bila malipo kwa shule yoyote ya umma au binafsi Tanzania. Mshauri anasimamia kampeni za uchunguzi, mawasiliano kwa wazazi, na dashboard ya jumla.')}</p>
    </Card>
  )
}

export default function ShulePlus(): React.JSX.Element {
  const { t } = useLang()
  const SUBS: SubNav[] = [
    { to: '.', label: t('common.mwongozo', 'Mwongozo') },
    { to: 'dashboard', label: 'Dashboard' },
    { to: 'kampeni', label: t('shule.sub.kampeni', 'Kampeni') },
    { to: 'wazazi', label: t('shule.sub.wazazi', 'Wazazi') },
    { to: 'shule', label: t('shule.sub.shule', 'Shule (jumla)') },
  ]
  return (
    <ModuleShell slug="shuleplus" subs={SUBS}>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="kampeni" element={<Campaigns />} />
        <Route path="wazazi" element={<ParentComms />} />
        <Route path="shule" element={<Aggregate />} />
      </Routes>
    </ModuleShell>
  )
}
