import type React from 'react'
import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Card, ModuleShell, Table, Td, type SubNav } from '../_shared/Layout'
import { JEWEL, RADII, TEXT } from '../../lib/glass'
import { useLang } from '../../lib/i18n/Provider'
import CrisisMonitor from './screens/Crisis'
import FounderConsole from './screens/Founder'
import Providers from './screens/Providers'
import Insurers from './screens/Insurers'
import Finance from './screens/Finance'
import Config from './screens/Config'

interface VerifyRow { id: string; name: string; kind: string; submitted: string; status: 'pending' | 'verified' | 'rejected' }
const VERIFY_INITIAL: VerifyRow[] = [
  { id: 'v1', name: 'Dr. Asha Mwema, MD', kind: 'Psychiatrist (MCT-licensed)', submitted: '2026-06-10', status: 'pending' },
  { id: 'v2', name: 'Bibi Salima — Lay counsellor', kind: 'Friendship Bench trained', submitted: '2026-06-12', status: 'pending' },
  { id: 'v3', name: 'Sheikh Yunus', kind: 'Faith provider — Muslim', submitted: '2026-06-13', status: 'pending' },
  { id: 'v4', name: 'Ms. Neema — school counsellor', kind: 'Diploma in counselling', submitted: '2026-06-14', status: 'pending' },
]

const MOD_QUEUE = [
  { id: 'r1', kind: 'Journal entry', preview: '“Sitaki kuendelea…”', flagged_by: 'auto-CSSRS', action: 'Mwenza crisis mode + offer hotline' },
  { id: 'r2', kind: 'Provider bio', preview: 'Anasema atatibu UKIMWI kwa dua…', flagged_by: 'auto-keywords', action: 'Verify or remove' },
  { id: 'r3', kind: 'Community post', preview: 'Spam — link ya nje', flagged_by: 'user-report', action: 'Remove' },
]

const EQUITY_REPORT = [
  { dim: 'Jinsia', balanced: '52% wanawake / 48% wanaume', note: 'Inafanana na sensa' },
  { dim: 'Mkoa', balanced: 'Dar 38% · Mwanza 14% · Arusha 9% · Mwingine 39%', note: 'Mkoa wa Kigoma + Kagera chini ya wastani' },
  { dim: 'Umri', balanced: '15-24: 28%, 25-44: 48%, 45+: 24%', note: 'Wazee chini ya wastani — kazi inaendelea' },
  { dim: 'Lugha', balanced: 'sw 78% · sw_mtaa 14% · en 8%', note: '' },
  { dim: 'Imani', balanced: 'Kikristo 51% · Kiislamu 42% · Asili 4% · Hakuna 3%', note: 'Inafanana na sensa' },
]

const IRB_LIBRARY = [
  { name: 'TR-001 — PhD primary outcome', irb: 'MUHAS IRB-2026-04-PSY-018', version: 'v3.2' },
  { name: 'TR-002 — Implementation', irb: 'UAMS IRB-26-04-1129', version: 'v2.1' },
  { name: 'TR-003 — Cost-effectiveness', irb: 'Pending', version: 'v1.0' },
]

const AUDIT_LOG = [
  { ts: '2026-06-20 09:01', actor: 'admin@laetoli', action: 'Verified provider v1', entity: 'tr_providers' },
  { ts: '2026-06-20 08:44', actor: 'system', action: 'Auto-flagged journal r1 (CSSRS)', entity: 'tr_journal_entries' },
  { ts: '2026-06-19 22:11', actor: 'researcher@muhas', action: 'Export TR-001 PHQ-9 (de-identified)', entity: 'tr_outcomes' },
  { ts: '2026-06-19 14:30', actor: 'admin@laetoli', action: 'Schema migration v0.4 applied', entity: 'tr_*' },
]

function Overview(): React.JSX.Element {
  const { t } = useLang()
  return (
    <Card title={t('ndani.overview.title', 'Ndani — Uongozi')}>
      <p>{t('ndani.overview.body', 'Sehemu ya admin kwa wafanyakazi wa Laetoli. Inajumuisha foleni ya kuthibitisha wahudumu, moderation, ripoti ya equity, IRB library, na audit log.')}</p>
    </Card>
  )
}

function Verify(): React.JSX.Element {
  const { t } = useLang()
  const [rows, setRows] = useState(VERIFY_INITIAL)
  const act = (id: string, status: 'verified' | 'rejected') => setRows(rows.map((r) => r.id === id ? { ...r, status } : r))
  return (
    <Card title={t('ndani.verify.title', 'Foleni ya kuthibitisha wahudumu')}>
      <Table headers={[t('ndani.verify.col.name', 'Jina'), t('ndani.verify.col.kind', 'Aina'), t('ndani.verify.col.date', 'Tarehe'), t('ndani.verify.col.status', 'Hali'), t('ndani.verify.col.action', 'Hatua')]}>
        {rows.map((r) => (
          <tr key={r.id}>
            <Td><strong>{r.name}</strong></Td>
            <Td>{r.kind}</Td>
            <Td>{r.submitted}</Td>
            <Td>{r.status}</Td>
            <Td>
              {r.status === 'pending' ? (
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => act(r.id, 'verified')} style={{ ...btnStyle, background: JEWEL.tealRoho }}>{t('ndani.verify.approve', 'Thibitisha')}</button>
                  <button onClick={() => act(r.id, 'rejected')} style={{ ...btnStyle, background: JEWEL.maroonCrisis }}>{t('ndani.verify.reject', 'Kataa')}</button>
                </div>
              ) : '—'}
            </Td>
          </tr>
        ))}
      </Table>
    </Card>
  )
}

const btnStyle = {
  padding: '6px 12px', borderRadius: RADII.chip, color: JEWEL.cream,
  border: 'none', cursor: 'pointer', fontSize: 12,
}

function Moderation(): React.JSX.Element {
  const { t } = useLang()
  return (
    <Card title={t('ndani.moderation.title', 'Foleni ya moderation')}>
      <Table headers={[t('ndani.moderation.col.kind', 'Aina'), t('ndani.moderation.col.content', 'Maudhui'), t('ndani.moderation.col.flagged_by', 'Imegunduliwa na'), t('ndani.moderation.col.suggested', 'Hatua iliyopendekezwa')]}>
        {MOD_QUEUE.map((r) => (
          <tr key={r.id}>
            <Td>{r.kind}</Td>
            <Td style={{ color: TEXT.muted }}>{r.preview}</Td>
            <Td>{r.flagged_by}</Td>
            <Td>{r.action}</Td>
          </tr>
        ))}
      </Table>
    </Card>
  )
}

function Equity(): React.JSX.Element {
  const { t } = useLang()
  return (
    <Card title={t('ndani.equity.title', 'Ripoti ya equity')}>
      <Table headers={[t('ndani.equity.col.axis', 'Mhimili'), t('ndani.equity.col.distribution', 'Mgawanyo'), t('ndani.equity.col.notes', 'Maelezo')]}>
        {EQUITY_REPORT.map((r) => (
          <tr key={r.dim}><Td><strong>{r.dim}</strong></Td><Td>{r.balanced}</Td><Td>{r.note}</Td></tr>
        ))}
      </Table>
    </Card>
  )
}

function IrbLib(): React.JSX.Element {
  const { t } = useLang()
  return (
    <Card title={t('ndani.irb.title', 'Maktaba ya IRB')}>
      <Table headers={[t('ndani.irb.col.protocol', 'Itifaki'), t('ndani.irb.col.irb', 'IRB'), t('ndani.irb.col.version', 'Toleo')]}>
        {IRB_LIBRARY.map((r) => (
          <tr key={r.name}><Td>{r.name}</Td><Td>{r.irb}</Td><Td>{r.version}</Td></tr>
        ))}
      </Table>
    </Card>
  )
}

function AuditView(): React.JSX.Element {
  const { t } = useLang()
  return (
    <Card title={t('ndani.audit.title', 'Audit log')}>
      <Table headers={[t('ndani.audit.col.time', 'Wakati'), t('ndani.audit.col.actor', 'Mhusika'), t('ndani.audit.col.action', 'Hatua'), t('ndani.audit.col.entity', 'Entity')]}>
        {AUDIT_LOG.map((r, i) => (
          <tr key={i}><Td>{r.ts}</Td><Td>{r.actor}</Td><Td>{r.action}</Td><Td><code>{r.entity}</code></Td></tr>
        ))}
      </Table>
    </Card>
  )
}

const SUBS: SubNav[] = [
  { to: '.', label: 'Mwongozo' },
  { to: 'dharura', label: 'Dharura hai' },
  { to: 'thibitisha', label: 'Thibitisha wahudumu' },
  { to: 'wahudumu', label: 'Wahudumu (soko)' },
  { to: 'bima', label: 'Bima' },
  { to: 'fedha', label: 'Fedha' },
  { to: 'moderation', label: 'Moderation' },
  { to: 'equity', label: 'Equity' },
  { to: 'irb', label: 'IRB library' },
  { to: 'audit', label: 'Audit log' },
  { to: 'mipangilio', label: 'Mipangilio' },
  { to: 'mwanzilishi', label: 'Mwanzilishi' },
]

export default function Ndani(): React.JSX.Element {
  return (
    <ModuleShell slug="ndani" subs={SUBS}>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="dharura" element={<CrisisMonitor />} />
        <Route path="thibitisha" element={<Verify />} />
        <Route path="wahudumu" element={<Providers />} />
        <Route path="bima" element={<Insurers />} />
        <Route path="fedha" element={<Finance />} />
        <Route path="moderation" element={<Moderation />} />
        <Route path="equity" element={<Equity />} />
        <Route path="irb" element={<IrbLib />} />
        <Route path="audit" element={<AuditView />} />
        <Route path="mipangilio" element={<Config />} />
        <Route path="mwanzilishi" element={<FounderConsole />} />
      </Routes>
    </ModuleShell>
  )
}
