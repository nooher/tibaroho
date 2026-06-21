import type React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Card, Filter, Table, Td } from '../../_shared/Layout'
import { BRAND, CREAM, TZ_FLAG, hexToRgba, RADII, TEXT } from '../../../lib/glass'
import { list, update } from '../../../lib/db'
import type { TrProvider, TrUser } from '../../../lib/db'
import { auditEvent } from '../audit'

type ProviderStatus = 'active' | 'locked' | 'suspended' | 'pending'

interface Provider {
  id: string
  name: string
  specialty: string
  license: string
  region: string
  status: ProviderStatus
  fee: number              // TZS per session
  phq9Change: number       // mean PHQ-9 reduction across caseload (negative is better)
  dropoutPct: number       // % of clients who dropped before session 4
  nps: number              // -100..100
  supervisorFlags: number
  caseload: number
}

const SEED: Provider[] = [
  { id: 'p-001', name: 'Dr. Asha Mwema',        specialty: 'Psychiatry',          license: 'MCT/PSY/2142', region: 'Dar es Salaam', status: 'active',    fee: 45000, phq9Change: -7.2, dropoutPct: 11, nps: 72, supervisorFlags: 0, caseload: 48 },
  { id: 'p-002', name: 'Mwalimu Neema Kileo',   specialty: 'School counselling',  license: 'TCU/DC/0918',  region: 'Arusha',        status: 'active',    fee: 15000, phq9Change: -4.8, dropoutPct: 22, nps: 58, supervisorFlags: 1, caseload: 31 },
  { id: 'p-003', name: 'Bibi Salima Mwinjuma',  specialty: 'Friendship Bench',    license: 'FB-TZ-014',    region: 'Mwanza',        status: 'active',    fee:  8000, phq9Change: -5.6, dropoutPct: 14, nps: 81, supervisorFlags: 0, caseload: 54 },
  { id: 'p-004', name: 'Dr. Hamadi Juma',       specialty: 'Clinical psychology', license: 'MCT/PSY/3471', region: 'Dodoma',        status: 'active',    fee: 35000, phq9Change: -6.4, dropoutPct: 17, nps: 64, supervisorFlags: 0, caseload: 36 },
  { id: 'p-005', name: 'Sister Furaha Lyimo',   specialty: 'Faith-informed CBT',  license: 'CCT/PC/0227',  region: 'Kilimanjaro',   status: 'active',    fee: 12000, phq9Change: -4.1, dropoutPct: 19, nps: 70, supervisorFlags: 0, caseload: 28 },
  { id: 'p-006', name: 'Sheikh Yunus Mwakyusa', specialty: 'Faith-informed MI',   license: 'BAKWATA/IC/091',region: 'Mbeya',         status: 'active',    fee: 10000, phq9Change: -3.9, dropoutPct: 24, nps: 66, supervisorFlags: 1, caseload: 22 },
  { id: 'p-007', name: 'Dr. Tatu Ngonyani',     specialty: 'Perinatal psychiatry',license: 'MCT/PSY/4022', region: 'Dar es Salaam', status: 'active',    fee: 50000, phq9Change: -8.1, dropoutPct:  9, nps: 84, supervisorFlags: 0, caseload: 41 },
  { id: 'p-008', name: 'Mr. Baraka Mhagama',    specialty: 'PM+ lay counsellor',  license: 'PM+/TZ/118',   region: 'Tabora',        status: 'pending',   fee:  6000, phq9Change:  0,   dropoutPct:  0, nps:  0, supervisorFlags: 0, caseload:  0 },
  { id: 'p-009', name: 'Dr. Pendo Mwalukasa',   specialty: 'Substance use',       license: 'MCT/MD/1209',  region: 'Iringa',        status: 'suspended', fee: 30000, phq9Change: -2.1, dropoutPct: 38, nps: 22, supervisorFlags: 3, caseload: 14 },
  { id: 'p-010', name: 'Mama Rehema Kayombo',   specialty: 'Peer recovery',       license: 'PEER/TZ/0034', region: 'Kagera',        status: 'locked',    fee:  5000, phq9Change: -4.6, dropoutPct: 20, nps: 60, supervisorFlags: 0, caseload: 19 },
]

const SPECIALTIES = ['All', 'Psychiatry', 'Clinical psychology', 'School counselling', 'Friendship Bench', 'Faith-informed CBT', 'Faith-informed MI', 'Perinatal psychiatry', 'PM+ lay counsellor', 'Substance use', 'Peer recovery']
const REGIONS = ['All', 'Dar es Salaam', 'Arusha', 'Mwanza', 'Dodoma', 'Kilimanjaro', 'Mbeya', 'Tabora', 'Iringa', 'Kagera']
const STATUSES: (ProviderStatus | 'All')[] = ['All', 'active', 'pending', 'locked', 'suspended']

function StatusChip({ s }: { s: ProviderStatus }): React.JSX.Element {
  const map: Record<ProviderStatus, { bg: string; fg: string; label: string }> = {
    active:    { bg: TZ_FLAG.green,  fg: '#fff',            label: 'Hai' },
    pending:   { bg: TZ_FLAG.yellow, fg: BRAND.ink,         label: 'Inasubiri' },
    locked:    { bg: BRAND.ink,      fg: '#fff',            label: 'Imefungwa' },
    suspended: { bg: BRAND.yellow,   fg: BRAND.ink,         label: 'Imesimamishwa' },
  }
  const t = map[s]
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: 999,
      background: t.bg, color: t.fg, fontSize: 11, fontWeight: 700, letterSpacing: 0.4,
    }}>{t.label}</span>
  )
}

function specialtyFromKind(kind: TrProvider['kind']): string {
  switch (kind) {
    case 'clinician': return 'Clinical psychology'
    case 'lay_counsellor': return 'PM+ lay counsellor'
    case 'faith': return 'Faith-informed MI'
    case 'school': return 'School counselling'
    case 'ngo': return 'Peer recovery'
    default: return 'Clinical psychology'
  }
}

function dbToProvider(p: TrProvider, users: Map<string, TrUser>): Provider {
  const u = users.get(p.user_id)
  return {
    id: p.id,
    name: u?.display_name ?? 'Mhudumu',
    specialty: specialtyFromKind(p.kind),
    license: p.id.slice(0, 8),
    region: u?.region ?? (p.regions?.[0] ?? '—'),
    status: p.verified ? 'active' : 'pending',
    fee: p.fee_default,
    phq9Change: 0,
    dropoutPct: 0,
    nps: 0,
    supervisorFlags: 0,
    caseload: 0,
  }
}

export default function Providers(): React.JSX.Element {
  const [rows, setRows] = useState<Provider[]>(SEED)
  const [q, setQ] = useState('')
  const [spec, setSpec] = useState('All')
  const [region, setRegion] = useState('All')
  const [status, setStatus] = useState<ProviderStatus | 'All'>('All')
  const [sel, setSel] = useState<Provider | null>(null)
  const [feeDraft, setFeeDraft] = useState<string>('')

  useEffect(() => {
    let mounted = true
    void (async () => {
      try {
        const [provs, users] = await Promise.all([list('tr_providers'), list('tr_users')])
        if (!mounted || !provs.length) return
        const userMap = new Map<string, TrUser>(users.map((u) => [u.id, u]))
        setRows(provs.map((p) => dbToProvider(p as TrProvider, userMap)))
      } catch { /* offline */ }
    })()
    return () => { mounted = false }
  }, [])

  const filtered = useMemo(() => rows.filter((r) =>
    (spec === 'All' || r.specialty === spec) &&
    (region === 'All' || r.region === region) &&
    (status === 'All' || r.status === status) &&
    (q === '' || (r.name + r.specialty + r.region).toLowerCase().includes(q.toLowerCase())),
  ), [rows, q, spec, region, status])

  function setProviderStatus(id: string, s: ProviderStatus): void {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status: s } : r)))
    setSel((cur) => (cur && cur.id === id ? { ...cur, status: s } : cur))
    void update('tr_providers', id, { verified: s === 'active' }).catch(() => undefined)
    void auditEvent('provider.status.change', 'tr_providers', id, { status: s })
  }

  function saveFee(): void {
    if (!sel) return
    const n = Number(feeDraft)
    if (!Number.isFinite(n) || n < 0) return
    setRows((rs) => rs.map((r) => (r.id === sel.id ? { ...r, fee: n } : r)))
    setSel({ ...sel, fee: n })
    setFeeDraft('')
    void update('tr_providers', sel.id, { fee_default: n }).catch(() => undefined)
    void auditEvent('provider.fee.update', 'tr_providers', sel.id, { fee: n })
  }

  return (
    <>
      <Card title="Soko la wahudumu">
        <p style={{ marginTop: 0 }}>
          Mfumo wa kuwasimamia wahudumu wote walioidhinishwa — wataalam wa afya ya akili,
          wahudumu wa imani, washauri wa shule, na watoa-huduma wa rika. Tunapima ubora kwa
          mabadiliko ya PHQ-9 (Kroenke et al., 2001), kiwango cha kuacha tiba (dropout), na NPS.
        </p>
        <div style={{
          display: 'grid', gap: 10, marginTop: 12,
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        }}>
          <Filter value={q} onChange={setQ} placeholder="Tafuta mhudumu…" />
          <SelectFilter label="Utaalamu" value={spec} onChange={setSpec} options={SPECIALTIES} />
          <SelectFilter label="Mkoa" value={region} onChange={setRegion} options={REGIONS} />
          <SelectFilter label="Hali" value={status} onChange={(v) => setStatus(v as ProviderStatus | 'All')} options={STATUSES as readonly string[]} />
        </div>
      </Card>

      <Card title={`Orodha (${filtered.length})`}>
        <Table headers={['Jina', 'Utaalamu', 'Mkoa', 'Hali', 'PHQ-9 Δ', 'Dropout %', 'NPS', 'Flags', 'Caseload']}>
          {filtered.map((r) => (
            <tr key={r.id} onClick={() => { setSel(r); setFeeDraft(String(r.fee)) }}
                style={{ cursor: 'pointer', background: sel?.id === r.id ? hexToRgba(BRAND.green, 0.10) : 'transparent' }}>
              <Td><strong>{r.name}</strong></Td>
              <Td>{r.specialty}</Td>
              <Td>{r.region}</Td>
              <Td><StatusChip s={r.status} /></Td>
              <Td style={{ color: r.phq9Change <= -5 ? TZ_FLAG.green : BRAND.ink }}>{r.phq9Change.toFixed(1)}</Td>
              <Td>{r.dropoutPct}%</Td>
              <Td>{r.nps}</Td>
              <Td style={{ color: r.supervisorFlags > 0 ? BRAND.yellow : TEXT.muted }}>{r.supervisorFlags}</Td>
              <Td>{r.caseload}</Td>
            </tr>
          ))}
        </Table>
      </Card>

      {sel ? (
        <Card title={`Maelezo — ${sel.name}`}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 14 }}>
            <KV k="Leseni" v={sel.license} />
            <KV k="Utaalamu" v={sel.specialty} />
            <KV k="Mkoa" v={sel.region} />
            <KV k="Hali" v={sel.status} />
            <KV k="Caseload" v={String(sel.caseload)} />
            <KV k="Ada (kwa kipindi)" v={`TZS ${sel.fee.toLocaleString()}`} />
            <KV k="PHQ-9 Δ" v={sel.phq9Change.toFixed(1)} />
            <KV k="Dropout %" v={`${sel.dropoutPct}%`} />
            <KV k="NPS" v={String(sel.nps)} />
            <KV k="Flags za msimamizi" v={String(sel.supervisorFlags)} />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            {sel.status !== 'active' && <Btn aria-label="Wezesha tena" onClick={() => setProviderStatus(sel.id, 'active')}>Wezesha tena</Btn>}
            {sel.status === 'active' && <Btn aria-label="Funga akaunti" tone="warn" onClick={() => setProviderStatus(sel.id, 'locked')}>Funga akaunti</Btn>}
            {sel.status !== 'suspended' && <Btn aria-label="Simamisha" tone="warn" onClick={() => setProviderStatus(sel.id, 'suspended')}>Simamisha (review)</Btn>}
            {sel.status === 'suspended' && <Btn aria-label="Rejesha" onClick={() => setProviderStatus(sel.id, 'active')}>Rejesha</Btn>}
            <Btn aria-label="Tazama audit" tone="ghost" onClick={() => { /* audit link */ }}>Tazama audit</Btn>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <label htmlFor={`fee-${sel.id}`} style={{ fontSize: 12, color: TEXT.muted }}>Badili ada (TZS):</label>
            <input
              id={`fee-${sel.id}`}
              aria-label="Ada mpya kwa kipindi"
              value={feeDraft}
              onChange={(e) => setFeeDraft(e.target.value)}
              inputMode="numeric"
              style={{
                padding: '8px 12px', borderRadius: RADII.chip,
                background: CREAM.milk, color: BRAND.ink, fontSize: 13,
                border: `1px solid ${hexToRgba(BRAND.ink, 0.15)}`, outline: 'none', width: 140,
              }}
            />
            <Btn aria-label="Hifadhi ada" onClick={saveFee}>Hifadhi ada</Btn>
          </div>
        </Card>
      ) : null}
    </>
  )
}

function SelectFilter({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: readonly string[] }): React.JSX.Element {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 11, color: TEXT.muted, letterSpacing: 0.6, textTransform: 'uppercase' }}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        style={{
          padding: '10px 12px', borderRadius: RADII.chip,
          background: CREAM.milk, color: TEXT.body,
          border: `1px solid rgba(11,9,8,0.22)`, fontSize: 13, outline: 'none',
        }}>
        {options.map((o) => <option key={o} value={o} style={{ color: BRAND.ink }}>{o}</option>)}
      </select>
    </label>
  )
}

function KV({ k, v }: { k: string; v: string }): React.JSX.Element {
  return (
    <div>
      <div style={{ fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', color: TEXT.muted, fontWeight: 700 }}>{k}</div>
      <div style={{ fontSize: 14, color: TEXT.body, marginTop: 2 }}>{v}</div>
    </div>
  )
}

function Btn({ children, onClick, tone = 'primary', ...rest }: { children: React.ReactNode; onClick?: () => void; tone?: 'primary' | 'warn' | 'ghost' } & React.ButtonHTMLAttributes<HTMLButtonElement>): React.JSX.Element {
  const bg = tone === 'primary' ? BRAND.green : tone === 'warn' ? BRAND.yellow : 'transparent'
  const fg = tone === 'ghost' ? TEXT.body : tone === 'warn' ? BRAND.ink : CREAM.cream
  return (
    <button
      onClick={onClick}
      {...rest}
      style={{
        padding: '8px 14px', borderRadius: RADII.chip,
        background: bg, color: fg,
        border: tone === 'ghost' ? `1px solid rgba(11,9,8,0.20)` : 'none',
        fontSize: 13, fontWeight: 600, cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}
