import type React from 'react'
import { useState } from 'react'
import { Card, Table, Td } from '../../_shared/Layout'
import { BRAND, CREAM, NEUTRAL, TEXT, hexToRgba } from '../../../lib/glass'

const ink = (a = 1) => hexToRgba(NEUTRAL.ink, a)

interface Study {
  id: string
  title: string
  pi: string
  irb: string
  status: 'Recruiting' | 'Analysis' | 'Draft' | 'Closed'
  enrolled: number
  target: number
  completion: string
  primary: string
  design: string
  facilities: number
}

const STUDIES: Study[] = [
  {
    id: 'TR-001',
    title: 'PhD Dissertation Arc — Hybrid Type 2 Effectiveness-Implementation',
    pi: 'Dr. A. Nooher (MUHAS/UAMS)',
    irb: 'MUHAS IRB-2026-04-PSY-018 · UAMS IRB-26-04-1129',
    status: 'Recruiting',
    enrolled: 624,
    target: 600,
    completion: '2027-03-31',
    primary: 'PHQ-9 remission (<5) wiki 12; uendelevu wiki 52',
    design: 'Hybrid Type 2; CFIR + RE-AIM; 6–10 facilities; stepped-wedge cluster',
    facilities: 8,
  },
  {
    id: 'TR-002',
    title: 'CFIR implementation determinants of PM+ in Tanzanian primary care',
    pi: 'Dr. A. Nooher · Prof. J. Baloh',
    irb: 'MUHAS IRB-2026-04-PSY-019 · UAMS IRB-26-04-1130',
    status: 'Analysis',
    enrolled: 12,
    target: 12,
    completion: '2026-09-30',
    primary: 'CFIR domain scores; ERIC strategy match',
    design: 'Mixed-methods; rapid CFIR + key-informant interviews (n=36)',
    facilities: 8,
  },
  {
    id: 'TR-003',
    title: 'Cost-effectiveness of lay-provider PM+ versus routine outpatient psychiatry',
    pi: 'Dr. A. Nooher · Dr. M. Mwakipesile (NIMR)',
    irb: 'NIMR/HQ/R.8a/Vol.IX/4321 (pending)',
    status: 'Draft',
    enrolled: 0,
    target: 0,
    completion: '2027-06-30',
    primary: 'ICER per remission; cost per QALY (secondary)',
    design: 'Markov micro-simulation; payer + societal perspective',
    facilities: 8,
  },
]

function Bar({ value, target }: { value: number; target: number }): React.JSX.Element {
  const pct = Math.min(100, target > 0 ? (value / target) * 100 : 0)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 8, background: ink(0.07), borderRadius: 4, overflow: 'hidden', minWidth: 80 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: BRAND.green }} />
      </div>
      <div style={{ fontSize: 11, color: TEXT.muted, minWidth: 60, textAlign: 'right' }}>{value}/{target || '—'}</div>
    </div>
  )
}

function StudyDetail({ s, onClose }: { s: Study; onClose: () => void }): React.JSX.Element {
  return (
    <Card title={`${s.id} — ${s.title}`} accent={BRAND.green}>
      <button onClick={onClose} style={{
        padding: '6px 12px', borderRadius: 999, background: 'transparent',
        border: `1px solid ${ink(0.22)}`, color: TEXT.body, fontSize: 12, cursor: 'pointer', marginBottom: 12,
      }}>← Rudi orodha</button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 18 }}>
        <Field label="PI" value={s.pi} />
        <Field label="IRB" value={s.irb} />
        <Field label="Design" value={s.design} />
        <Field label="Primary outcome" value={s.primary} />
        <Field label="Facilities" value={String(s.facilities)} />
        <Field label="Expected completion" value={s.completion} />
      </div>

      <h3 style={{ fontSize: 14, color: TEXT.heading, margin: '12px 0 8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>CONSORT flow</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {[
          { label: 'Walikaguliwa', n: 1820 },
          { label: 'Wamekubali (n consented)', n: s.enrolled },
          { label: 'Wamekamilisha wiki 12', n: Math.round(s.enrolled * 0.83) },
          { label: 'Walioachana (LTFU)', n: Math.round(s.enrolled * 0.17) },
        ].map((b) => (
          <div key={b.label} style={{ background: CREAM.cream, border: `1px solid ${ink(0.08)}`, borderRadius: 10, padding: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: TEXT.muted }}>{b.label}</div>
            <div className="serif" style={{ fontSize: 20, color: TEXT.heading, marginTop: 4 }}>{b.n}</div>
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: 14, color: TEXT.heading, margin: '18px 0 8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Mpango wa uchambuzi</h3>
      <ul style={{ paddingLeft: 18, fontSize: 13, color: TEXT.body, lineHeight: 1.6 }}>
        <li>Primary: mixed-effects logistic regression (PHQ-9 &lt; 5) na facility random effect.</li>
        <li>Secondary: GAD-7, K-10, WHO-DAS continuous mixed-effects.</li>
        <li>Sub-analyses: PROGRESS-Plus stratifiers (mahali, jinsia, ukali wa awali).</li>
        <li>Sensitivity: per-protocol vs ITT; multiple imputation kwa missing.</li>
      </ul>

      <h3 style={{ fontSize: 14, color: TEXT.heading, margin: '18px 0 8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Hali ya karatasi</h3>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {['Paper 1 — Drafting', 'Paper 2 — In analysis', 'Paper 3 — Not started'].map((p, i) => (
          <span key={p} style={{
            padding: '6px 12px', borderRadius: 999, fontSize: 12,
            background: i === 0 ? BRAND.green : i === 1 ? BRAND.blue : CREAM.cream,
            color: i < 2 ? TEXT.onJewel : TEXT.body,
            border: `1px solid ${ink(0.12)}`,
          }}>{p}</span>
        ))}
      </div>
    </Card>
  )
}

function Field({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div style={{ background: CREAM.cream, border: `1px solid ${ink(0.08)}`, borderRadius: 10, padding: 12 }}>
      <div style={{ fontSize: 10, color: TEXT.muted, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 13, color: TEXT.body, marginTop: 4, lineHeight: 1.4 }}>{value}</div>
    </div>
  )
}

export default function Studies(): React.JSX.Element {
  const [selected, setSelected] = useState<Study | null>(null)
  if (selected) return <StudyDetail s={selected} onClose={() => setSelected(null)} />

  return (
    <Card title="Active studies registry" accent={BRAND.green}>
      <Table headers={['#', 'Kichwa', 'PI', 'Hali', 'Uandikishaji', 'Kukamilisha', 'Outcome ya msingi']}>
        {STUDIES.map((s) => (
          <tr key={s.id} onClick={() => setSelected(s)} style={{ cursor: 'pointer' }}>
            <Td style={{ color: TEXT.body }}><strong>{s.id}</strong></Td>
            <Td style={{ color: TEXT.body }}>{s.title}</Td>
            <Td style={{ color: TEXT.muted }}>{s.pi}</Td>
            <Td style={{ color: s.status === 'Recruiting' ? BRAND.green : s.status === 'Analysis' ? BRAND.blue : TEXT.muted, fontWeight: 600 }}>{s.status}</Td>
            <Td><Bar value={s.enrolled} target={s.target} /></Td>
            <Td style={{ color: TEXT.muted }}>{s.completion}</Td>
            <Td style={{ color: TEXT.muted, fontSize: 12 }}>{s.primary}</Td>
          </tr>
        ))}
      </Table>
      <div style={{ fontSize: 11, color: TEXT.muted, marginTop: 10 }}>Bonyeza safu kuona maelezo kamili (CONSORT, mpango wa uchambuzi, hali ya karatasi).</div>
    </Card>
  )
}
