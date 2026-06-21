import type React from 'react'
import { Card } from '../../_shared/Layout'
import { BRAND, CREAM, NEUTRAL, TEXT, hexToRgba } from '../../../lib/glass'

const ink = (a = 1) => hexToRgba(NEUTRAL.ink, a)

type PaperStatus = 'Drafting' | 'Submitted' | 'R&R' | 'Accepted'

interface Paper {
  num: number
  title: string
  swahili: string
  status: PaperStatus
  journal: string
  authors: string[]
  findings: string[]
  accent: string
}

const PAPERS: Paper[] = [
  {
    num: 1,
    title: 'Formative — Pre-implementation context, cultural adaptation, and fidelity protocol of PM+ in Tanzanian primary care',
    swahili: 'Karatasi 1 — Maandalizi',
    status: 'Drafting',
    journal: 'Implementation Science Communications',
    authors: ['A. Nooher', 'J. Baloh', 'M. Selemani', 'F. Mosha', 'Stakeholder advisory group'],
    findings: [
      'Idioms za "msongo wa mawazo" + "huzuni ya moyo" zilihitaji adaptation ya PHQ-9 item 4 + 6.',
      'Lay providers waliomba modular workbook badala ya single bound manual.',
      'CFIR rapid assessment ilibainisha incentive systems + relative priority kama high-impact barriers.',
      'Fidelity rubric ya vitu 5 ilipata inter-rater kappa = 0.81 baada ya marekebisho 2.',
    ],
    accent: BRAND.green,
  },
  {
    num: 2,
    title: 'Effectiveness — A Hybrid Type 2 trial of lay-provider PM+ for depression in Tanzanian outpatient clinics',
    swahili: 'Karatasi 2 — Ufanisi',
    status: 'Drafting',
    journal: 'The Lancet Psychiatry · arXiv preprint',
    authors: ['A. Nooher', 'J. Baloh', 'M. Selemani', 'site PIs (n=8)', 'NIMR biostatistics'],
    findings: [
      'Primary: PHQ-9 remission wiki 12 = 42.1% vs 18% routine care (OR 3.3, 95% CI 2.4–4.5).',
      'Secondary: GAD-7 mean drop −6.5 (SD 4.2); WHODAS functional gain +0.34 SD.',
      'Sub-analyses: rural strata 35.8% vs urban 47.2% remission (pengo 11.4pp — equity flag).',
      'Per-protocol consistent na ITT; multiple-imputation sensitivity confirmed primary.',
    ],
    accent: BRAND.blue,
  },
  {
    num: 3,
    title: 'RE-AIM + Cost-Effectiveness + Scale-Up — National extrapolation of PM+ for Tanzania',
    swahili: 'Karatasi 3 — Uendelevu na Gharama',
    status: 'Drafting',
    journal: 'BMJ Global Health · Health Policy & Planning',
    authors: ['A. Nooher', 'J. Baloh', 'M. Mwakipesile (NIMR)', 'MoH-HMIS team'],
    findings: [
      'RE-AIM aggregate: Reach 70%, Adoption 60% facilities, Implementation fidelity 81%.',
      'CEA: cost per remission USD 215; ICER vs routine USD 138 — chini ya 1× GDP/capita (cost-effective WHO-CHOICE).',
      'Markov 12-month projection: ICER USD 340 / QALY gained.',
      'National scale-up sketch: ~$4.2M / mwaka kufikia mikoa 26.',
    ],
    accent: BRAND.yellow,
  },
]

function StatusPill({ s }: { s: PaperStatus }): React.JSX.Element {
  const color = s === 'Accepted' ? BRAND.green : s === 'R&R' ? BRAND.blue : s === 'Submitted' ? BRAND.yellow : NEUTRAL.ink
  return (
    <span style={{
      padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
      background: color, color: TEXT.onJewel, letterSpacing: '0.05em', textTransform: 'uppercase',
    }}>{s}</span>
  )
}

function PaperCard({ p }: { p: Paper }): React.JSX.Element {
  return (
    <Card title={p.swahili} accent={p.accent}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 999, background: p.accent, color: TEXT.onJewel,
          display: 'grid', placeItems: 'center', fontSize: 18, fontWeight: 700,
        }} className="serif">{p.num}</div>
        <StatusPill s={p.status} />
      </div>
      <h3 className="serif" style={{ fontSize: 18, color: TEXT.heading, margin: '6px 0 10px', lineHeight: 1.3 }}>
        {p.title}
      </h3>
      <div style={{
        display: 'inline-block', padding: '4px 10px', borderRadius: 999, background: CREAM.cream,
        fontSize: 11, color: TEXT.muted, border: `1px solid ${ink(0.08)}`, marginBottom: 12,
      }}>Target: <strong style={{ color: TEXT.body }}>{p.journal}</strong></div>

      <div style={{ fontSize: 11, color: TEXT.muted, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 4 }}>
        Waandishi
      </div>
      <div style={{ fontSize: 12, color: TEXT.body, marginBottom: 12 }}>{p.authors.join(' · ')}</div>

      <div style={{ fontSize: 11, color: TEXT.muted, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 4 }}>
        Matokeo muhimu (rasimu)
      </div>
      <ul style={{ paddingLeft: 18, fontSize: 13, color: TEXT.body, lineHeight: 1.6, margin: 0 }}>
        {p.findings.map((f) => <li key={f}>{f}</li>)}
      </ul>
    </Card>
  )
}

export default function PaperPipeline(): React.JSX.Element {
  return (
    <>
      <Card title="3-paper packaging — PhD dissertation arc" accent={BRAND.green}>
        <p style={{ margin: 0, fontSize: 13, color: TEXT.muted }}>
          Karatasi tatu zinazokamilisha dissertation: Formative (Paper 1), Effectiveness (Paper 2), RE-AIM + Cost-effectiveness + Scale-up (Paper 3). Kila moja ina hali, jarida lengwa, waandishi, na rasimu ya matokeo muhimu.
        </p>
      </Card>
      {PAPERS.map((p) => <PaperCard key={p.num} p={p} />)}
    </>
  )
}
