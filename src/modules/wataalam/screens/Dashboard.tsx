import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { JEWEL, RADII, TYPE, hexToRgba } from '../../../lib/glass'
import { Card, H1 } from '../components/Card'
import { loadAppointments, loadOutcomes, loadSupervision } from '../lib/storage'
import { ArchitectureBadge } from '../../../components/ArchitectureBadge'

export default function Dashboard() {
  const appts = useMemo(loadAppointments, [])
  const outcomes = useMemo(loadOutcomes, [])
  const supervision = useMemo(loadSupervision, [])

  const today = new Date().toDateString()
  const todays = appts.filter((a) => new Date(a.startISO).toDateString() === today)
  const queue = todays.filter((a) => a.status === 'scheduled')

  // Average PHQ-9 change per patient (latest − earliest).
  const phqChange = (() => {
    const byPt: Record<string, number[]> = {}
    outcomes
      .filter((o) => o.instrument === 'PHQ-9')
      .sort((a, b) => +new Date(a.dateISO) - +new Date(b.dateISO))
      .forEach((o) => {
        byPt[o.patientPseudonym] = byPt[o.patientPseudonym] || []
        byPt[o.patientPseudonym]!.push(o.score)
      })
    const deltas = Object.values(byPt)
      .filter((arr) => arr.length >= 2)
      .map((arr) => arr[arr.length - 1]! - arr[0]!)
    if (!deltas.length) return null
    return deltas.reduce((a, b) => a + b, 0) / deltas.length
  })()

  const pendingSup = supervision.filter((s) => s.status === 'pending').length

  return (
    <div>
      <H1 english="Dashboard">Habari za asubuhi, Mtaalamu.</H1>
      <div style={{ marginTop: -6, marginBottom: 16 }}>
        <ArchitectureBadge moduleSlug="wataalam" />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 14,
          marginBottom: 18,
        }}
      >
        <Stat label="Miadi leo" value={String(todays.length)} accent={JEWEL.tealRoho} />
        <Stat label="Foleni" value={String(queue.length)} accent={JEWEL.goldHope} />
        <Stat
          label="Wastani wa PHQ-9 (Δ)"
          value={phqChange === null ? '—' : phqChange.toFixed(1)}
          subtitle={phqChange === null ? '' : 'punguzo bora ni hasi'}
          accent={JEWEL.indigoWisdom}
        />
        <Stat
          label="Usimamizi unaongoja"
          value={String(pendingSup)}
          accent={pendingSup > 0 ? JEWEL.maroonCrisis : JEWEL.tealDeep}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 14 }}>
        <Card title="Miadi ya leo" english="Today">
          {todays.length === 0 ? (
            <p style={{ opacity: 0.7, margin: 0 }}>Hakuna miadi leo.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
              {todays.map((a) => (
                <li
                  key={a.id}
                  style={{
                    padding: 12,
                    borderRadius: RADII.card,
                    background: 'rgba(250,245,229,0.85)',
                    border: `1px solid ${hexToRgba(JEWEL.tealMwenza, 0.20)}`,
                    color: '#0A0808',
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 10,
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontFamily: TYPE.serif, fontSize: 15, color: '#0A0808', fontWeight: 700 }}>
                      {a.patientPseudonym}
                    </div>
                    <div style={{ fontSize: 12, color: '#3B3B3B' }}>
                      {new Date(a.startISO).toLocaleTimeString('sw-TZ', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      · {a.mode === 'virtual' ? 'Mtandaoni' : 'Ana kwa ana'} · {a.reasonSw}
                    </div>
                  </div>
                  {a.mode === 'virtual' ? (
                    <Link
                      to="../video"
                      style={{
                        padding: '6px 14px',
                        borderRadius: 999,
                        background: '#C99700',
                        color: '#0A0808',
                        fontSize: 12,
                        textDecoration: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Anza video
                    </Link>
                  ) : (
                    <Link
                      to="../intake"
                      style={{
                        padding: '6px 14px',
                        borderRadius: 999,
                        background: '#0F4D1F',
                        color: '#F4EAC9',
                        fontSize: 12,
                        textDecoration: 'none',
                      }}
                    >
                      Mapokezi
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Usimamizi" english="Supervision queue" accent={JEWEL.maroonCrisis}>
          {pendingSup === 0 ? (
            <p style={{ color: '#3B3B3B', margin: 0 }}>Hakuna kesi za usimamizi.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
              {supervision
                .filter((s) => s.status === 'pending')
                .map((s) => (
                  <li
                    key={s.id}
                    style={{
                      padding: 12,
                      borderRadius: RADII.card,
                      background: 'rgba(250,245,229,0.85)',
                      border: '1px solid rgba(11,9,8,0.10)',
                    }}
                  >
                    <div style={{ fontSize: 14, fontFamily: TYPE.serif, color: '#0A0808', fontWeight: 700 }}>
                      {s.supervisee} — {s.patientPseudonym}
                    </div>
                    <div style={{ fontSize: 12, color: '#3B3B3B', marginTop: 4 }}>{s.summarySw}</div>
                  </li>
                ))}
            </ul>
          )}
          <div style={{ marginTop: 12 }}>
            <Link to="../usimamizi" style={{ color: '#0F4D1F', fontSize: 13, fontWeight: 700, textDecoration: 'underline' }}>
              Tazama zote →
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  subtitle,
  accent,
}: {
  label: string
  value: string
  subtitle?: string
  accent: string
}) {
  return (
    <div
      style={{
        padding: 16,
        background: hexToRgba(accent, 0.2),
        border: `1px solid ${hexToRgba(accent, 0.5)}`,
        borderRadius: RADII.sheet,
      }}
    >
      <div style={{ fontSize: 11, letterSpacing: 0.6, textTransform: 'uppercase', color: '#3B3B3B', fontWeight: 700 }}>
        {label}
      </div>
      <div
        style={{
          fontFamily: TYPE.serif,
          fontSize: 32,
          fontWeight: 600,
          letterSpacing: TYPE.tighterTrack,
          marginTop: 4,
          color: '#0A0808',
        }}
      >
        {value}
      </div>
      {subtitle && <div style={{ fontSize: 11, color: '#3B3B3B', marginTop: 2 }}>{subtitle}</div>}
    </div>
  )
}
