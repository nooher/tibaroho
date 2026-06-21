import type React from 'react'
import { JEWEL, glass, TYPE, TEXT } from '../../../lib/glass'

export interface KpiProps {
  label: string
  value: string | number
  hint?: string
  accent?: string
  trend?: number[]
}

export default function KpiCard({ label, value, hint, accent = JEWEL.tealMwenza, trend }: KpiProps): React.JSX.Element {
  return (
    <div style={{ ...glass(accent, 0.08), padding: 18, minWidth: 0 }}>
      <div style={{
        fontSize: 10, letterSpacing: 1.6, textTransform: 'uppercase',
        color: TEXT.muted, fontWeight: 700,
      }}>{label}</div>
      <div className="serif" style={{
        marginTop: 6, fontSize: 30, color: TEXT.heading, letterSpacing: TYPE.tighterTrack, lineHeight: 1,
      }}>{value}</div>
      {hint ? (
        <div style={{ marginTop: 6, fontSize: 12, color: TEXT.muted }}>{hint}</div>
      ) : null}
      {trend && trend.length > 1 ? (
        <svg viewBox={`0 0 ${trend.length * 12} 32`} style={{ marginTop: 10, width: '100%', height: 28 }} aria-hidden>
          <polyline
            points={trend.map((v, i) => {
              const max = Math.max(...trend, 1)
              const y = 30 - (v / max) * 26
              return `${i * 12 + 2},${y.toFixed(1)}`
            }).join(' ')}
            fill="none" stroke={accent} strokeWidth={2}
          />
        </svg>
      ) : null}
    </div>
  )
}

export function KpiGrid({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <div style={{
      display: 'grid', gap: 12,
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      marginBottom: 16,
    }}>{children}</div>
  )
}
