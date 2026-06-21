import { useMemo, useState } from 'react'
import { JEWEL, TYPE, TEXT, hexToRgba } from '../../../lib/glass'
import { Card, H1 } from '../components/Card'
import { loadOutcomes } from '../lib/storage'
import { useLang } from '../../../lib/i18n/Provider'

const INSTRUMENT_MAX: Record<string, number> = {
  'PHQ-9': 27,
  'GAD-7': 21,
  'PCL-5': 80,
  AUDIT: 40,
}

export default function Outcomes() {
  const { t } = useLang()
  const all = useMemo(loadOutcomes, [])
  const patients = useMemo(() => Array.from(new Set(all.map((o) => o.patientPseudonym))), [all])
  const [patient, setPatient] = useState<string>(patients[0] ?? '')

  const series = useMemo(() => {
    const byInst: Record<string, { score: number; dateISO: string }[]> = {}
    all
      .filter((o) => o.patientPseudonym === patient)
      .sort((a, b) => +new Date(a.dateISO) - +new Date(b.dateISO))
      .forEach((o) => {
        byInst[o.instrument] = byInst[o.instrument] || []
        byInst[o.instrument]!.push({ score: o.score, dateISO: o.dateISO })
      })
    return byInst
  }, [all, patient])

  return (
    <div>
      <H1 english="Outcomes">{t('wataalam.outcomes.title', 'Matokeo kwa muda')}</H1>

      <Card title={t('wataalam.outcomes.choose_patient', 'Chagua mteja')}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {patients.map((p) => (
            <button
              key={p}
              onClick={() => setPatient(p)}
              style={{
                padding: '8px 14px',
                borderRadius: 999,
                background:
                  p === patient
                    ? hexToRgba(JEWEL.goldHope, 0.45)
                    : 'rgba(250,245,229,0.85)',
                border: `1px solid ${p === patient ? hexToRgba(JEWEL.goldSoft, 0.6) : 'rgba(11,9,8,0.10)'}`,
                color: TEXT.body,
                cursor: 'pointer',
                fontFamily: TYPE.sans,
                fontSize: 13,
                fontWeight: p === patient ? 600 : 400,
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </Card>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 14,
          marginTop: 14,
        }}
      >
        {Object.entries(series).map(([inst, points]) => (
          <Card key={inst} title={inst}>
            <Spark points={points} max={INSTRUMENT_MAX[inst] ?? 30} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 8 }}>
              <span style={{ color: TEXT.muted }}>
                {t('wataalam.outcomes.first', 'Kwanza:')} <strong>{points[0]?.score}</strong>
              </span>
              <span style={{ color: TEXT.muted }}>
                {t('wataalam.outcomes.now', 'Sasa:')} <strong>{points[points.length - 1]?.score}</strong>
              </span>
              <span style={{ color: TEXT.heading, fontWeight: 600 }}>
                Δ {points[points.length - 1]!.score - points[0]!.score}
              </span>
            </div>
          </Card>
        ))}
        {Object.keys(series).length === 0 && (
          <p style={{ color: TEXT.muted }}>{t('wataalam.outcomes.none', 'Hakuna matokeo kwa mteja huyu bado.')}</p>
        )}
      </div>
    </div>
  )
}

function Spark({ points, max }: { points: { score: number; dateISO: string }[]; max: number }) {
  const W = 320
  const H = 100
  const pad = 8
  if (points.length === 0) return null
  const stepX = (W - pad * 2) / Math.max(1, points.length - 1)
  const path = points
    .map((p, i) => {
      const x = pad + i * stepX
      const y = H - pad - ((p.score / max) * (H - pad * 2))
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')
  const lastY = H - pad - ((points[points.length - 1]!.score / max) * (H - pad * 2))
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height={H}
      role="img"
      aria-label="Timeline"
    >
      <line
        x1={pad}
        x2={W - pad}
        y1={H - pad}
        y2={H - pad}
        stroke={hexToRgba(JEWEL.goldSoft, 0.18)}
        strokeWidth={1}
      />
      <path
        d={path}
        fill="none"
        stroke={JEWEL.goldSoft}
        strokeWidth={2.4}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {points.map((p, i) => {
        const x = pad + i * stepX
        const y = H - pad - ((p.score / max) * (H - pad * 2))
        return <circle key={i} cx={x} cy={y} r={3} fill={JEWEL.goldSoft} />
      })}
      <circle
        cx={pad + (points.length - 1) * stepX}
        cy={lastY}
        r={5}
        fill="none"
        stroke={JEWEL.goldSoft}
        strokeWidth={1.5}
      />
    </svg>
  )
}
