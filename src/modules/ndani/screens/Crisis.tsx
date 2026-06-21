import type React from 'react'
import { useMemo, useState } from 'react'
import { Card } from '../../_shared/Layout'
import { JEWEL, CREAM, NEUTRAL, hexToRgba, TEXT } from '../../../lib/glass'

type Risk = 'red' | 'amber' | 'green'
interface CrisisEvent {
  id: string
  ts: string
  kind: 'CSSRS' | 'IPV' | 'Child' | 'Psychosis'
  region: string
  risk: Risk
  anonHandle: string
  responder?: string
  ackedAt?: string
  notes?: string
}

const SEED: CrisisEvent[] = [
  { id: 'c-2026-0620-a', ts: '2026-06-20 21:42', kind: 'CSSRS', region: 'Dar es Salaam', risk: 'red', anonHandle: 'mt-7a1c' },
  { id: 'c-2026-0620-b', ts: '2026-06-20 20:14', kind: 'IPV',   region: 'Mwanza',         risk: 'amber', anonHandle: 'mt-3f29', responder: 'TAMWA helpline' },
  { id: 'c-2026-0620-c', ts: '2026-06-20 18:55', kind: 'CSSRS', region: 'Arusha',         risk: 'amber', anonHandle: 'mt-9b04', responder: 'Friendship Bench Arusha' },
  { id: 'c-2026-0620-d', ts: '2026-06-20 17:30', kind: 'Child', region: 'Mbeya',          risk: 'green', anonHandle: 'mt-12d7', responder: 'Auto-routed to MoH Child Protection', ackedAt: '2026-06-20 17:34' },
  { id: 'c-2026-0620-e', ts: '2026-06-20 14:08', kind: 'CSSRS', region: 'Dodoma',         risk: 'green', anonHandle: 'mt-44ee', responder: 'Lifeline 0800 110014', ackedAt: '2026-06-20 14:11' },
]

function pillFor(r: Risk): { bg: string; fg: string; label: string } {
  switch (r) {
    case 'red':   return { bg: JEWEL.maroonCrisis, fg: '#fff', label: 'Hatari Kubwa' }
    case 'amber': return { bg: JEWEL.goldHope,         fg: NEUTRAL.ink, label: 'Tahadhari' }
    case 'green': return { bg: JEWEL.tealMwenza,   fg: '#fff', label: 'Imedhibitiwa' }
  }
}

export default function CrisisMonitor(): React.JSX.Element {
  const [events, setEvents] = useState<CrisisEvent[]>(SEED)
  const [filter, setFilter] = useState<'all' | 'open' | Risk>('all')

  const visible = useMemo(() => {
    return events.filter(e => {
      if (filter === 'all') return true
      if (filter === 'open') return !e.ackedAt
      return e.risk === filter
    })
  }, [events, filter])

  const openRed = events.filter(e => e.risk === 'red' && !e.ackedAt).length
  const openAmber = events.filter(e => e.risk === 'amber' && !e.ackedAt).length
  const last24Total = events.length

  const acknowledge = (id: string) => {
    setEvents(prev => prev.map(e => e.id === id
      ? { ...e, ackedAt: new Date().toISOString().replace('T', ' ').slice(0, 16) }
      : e))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card title="Foleni ya Dharura — Hai">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 12 }}>
          <KpiBox label="Hatari kubwa wazi" value={openRed} accent={JEWEL.maroonCrisis} />
          <KpiBox label="Tahadhari wazi" value={openAmber} accent={JEWEL.goldHope} />
          <KpiBox label="Matukio (saa 24)" value={last24Total} accent={JEWEL.tealMwenza} />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {(['all', 'open', 'red', 'amber', 'green'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? JEWEL.tealMwenza : 'transparent',
                color: filter === f ? '#fff' : NEUTRAL.ink,
                border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.18)}`,
                borderRadius: 999,
                padding: '6px 14px',
                fontSize: 13,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {f === 'all' ? 'Zote' : f === 'open' ? 'Bado wazi' : pillFor(f).label}
            </button>
          ))}
        </div>
      </Card>

      <Card title={`Matukio — ${visible.length}`}>
        {visible.length === 0 && (
          <p style={{ color: TEXT.muted }}>Hakuna matukio yanayoendana na chujio hili.</p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {visible.map(e => {
            const p = pillFor(e.risk)
            const isOpen = !e.ackedAt
            return (
              <div
                key={e.id}
                style={{
                  background: hexToRgba(CREAM.milk, 0.85),
                  border: `1px solid ${isOpen ? p.bg : hexToRgba(NEUTRAL.ink, 0.10)}`,
                  borderLeft: `4px solid ${p.bg}`,
                  borderRadius: 12,
                  padding: '12px 14px',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: 10,
                }}
              >
                <div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
                    <span style={{
                      background: p.bg, color: p.fg, padding: '2px 10px',
                      borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: '0.6px',
                    }}>{p.label.toUpperCase()}</span>
                    <span style={{ fontSize: 12, color: TEXT.muted }}>{e.ts}</span>
                    <span style={{ fontSize: 12, color: TEXT.muted }}>· {e.kind} · {e.region}</span>
                  </div>
                  <div style={{ fontSize: 14 }}>
                    Mtumiaji: <code style={{ background: hexToRgba(NEUTRAL.ink, 0.06), padding: '1px 6px', borderRadius: 4 }}>{e.anonHandle}</code>
                    {e.responder && <span style={{ marginLeft: 10, color: TEXT.muted }}>→ {e.responder}</span>}
                  </div>
                  {e.ackedAt && (
                    <div style={{ fontSize: 12, color: TEXT.muted, marginTop: 4 }}>
                      Imeshughulikiwa: {e.ackedAt}
                    </div>
                  )}
                </div>
                {isOpen && (
                  <button
                    onClick={() => acknowledge(e.id)}
                    style={{
                      background: JEWEL.tealMwenza,
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '8px 14px',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      alignSelf: 'center',
                      fontFamily: 'inherit',
                    }}
                  >
                    Dhibiti
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      <Card title="Sheria za uelekezaji">
        <ul style={{ paddingLeft: 18, margin: 0, lineHeight: 1.7 }}>
          <li>C-SSRS &ge; 4 → Lifeline 0800 110014 + Muhimbili Casualty + Rafiki mlinzi-mode + msimamizi ana-pingwa</li>
          <li>IPV chanya → TAMWA + safety plan + go-bag link + emergency contact</li>
          <li>Tukio la mtoto → Idara ya Ustawi wa Jamii + mandatory-reporter form</li>
          <li>Psychosis ya papo hapo → Muhimbili Psychiatry + ambulance routing</li>
        </ul>
      </Card>
    </div>
  )
}

function KpiBox({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div style={{
      background: hexToRgba(accent, 0.10),
      border: `1px solid ${hexToRgba(accent, 0.30)}`,
      borderRadius: 12,
      padding: '14px 16px',
    }}>
      <div style={{ fontSize: 28, fontWeight: 700, color: accent }}>{value}</div>
      <div style={{ fontSize: 12, color: TEXT.muted, marginTop: 2 }}>{label}</div>
    </div>
  )
}
