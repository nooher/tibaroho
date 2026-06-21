import type React from 'react'
import { Card } from '../../_shared/Layout'
import { BRAND, CREAM, NEUTRAL, RADII, TEXT, hexToRgba } from '../../../lib/glass'
import { REAIM_METRICS, type ReaimMetric } from '../data/reaimMetrics'

const ink = (a = 1) => hexToRgba(NEUTRAL.ink, a)

function TrendChart({ m }: { m: ReaimMetric }): React.JSX.Element {
  const w = 320, h = 110, pad = 18
  const xs = m.history.map((p) => p.week)
  const ys = m.history.map((p) => p.value)
  const maxX = Math.max(...xs, 12)
  const maxY = Math.max(...ys, m.target, 1)
  const px = (x: number) => pad + (x / maxX) * (w - pad * 2)
  const py = (y: number) => h - pad - (y / maxY) * (h - pad * 2)
  const pts = m.history.map((p) => `${px(p.week).toFixed(1)},${py(p.value).toFixed(1)}`).join(' ')
  const ty = py(m.target)
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} style={{ display: 'block' }}>
      <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke={ink(0.15)} strokeWidth={1} />
      <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke={ink(0.15)} strokeWidth={1} />
      <line x1={pad} y1={ty} x2={w - pad} y2={ty} stroke={BRAND.yellow} strokeWidth={1.2} strokeDasharray="4 4" />
      <text x={w - pad} y={ty - 4} textAnchor="end" fontSize={9} fill={BRAND.yellow} fontWeight={700}>lengo {m.target}</text>
      <polyline points={pts} fill="none" stroke={BRAND.green} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      {m.history.map((p, i) => (
        <circle key={i} cx={px(p.week)} cy={py(p.value)} r={2.5} fill={BRAND.green} />
      ))}
      {m.history.map((p, i) => (
        <text key={`t${i}`} x={px(p.week)} y={h - pad + 11} textAnchor="middle" fontSize={9} fill={TEXT.muted}>W{p.week}</text>
      ))}
    </svg>
  )
}

function exportMatrix(): void {
  const rows = ['dimension,swahili,definition,calculation,current_value,unit,target']
  for (const m of REAIM_METRICS) {
    rows.push(`"${m.name}","${m.swahili}","${m.definition.replace(/"/g, "'")}","${m.calculation.replace(/"/g, "'")}",${m.currentValue},"${m.unit}",${m.target}`)
  }
  const blob = new Blob([rows.join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `reaim_matrix_${new Date().toISOString().slice(0,10)}.csv`; a.click()
  URL.revokeObjectURL(url)
}

export default function REAIM(): React.JSX.Element {
  return (
    <>
      <Card title="RE-AIM — vipimo vya msingi" accent={BRAND.blue}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <p style={{ margin: 0, fontSize: 13, color: TEXT.muted, maxWidth: 600 }}>
            Glasgow, Vogt &amp; Boles 1999 — kufuatilia athari ya utafiti wa Hybrid Type 2 kwenye ngazi tano: Reach, Effectiveness, Adoption, Implementation, Maintenance.
          </p>
          <button onClick={exportMatrix} style={{
            padding: '8px 14px', borderRadius: RADII.chip, background: BRAND.green,
            color: CREAM.milk, border: 'none', fontSize: 12, cursor: 'pointer',
          }}>Pakua matrix (CSV)</button>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 16 }}>
        {REAIM_METRICS.map((m) => (
          <Card key={m.id} title={`${m.swahili} — ${m.name}`} accent={BRAND.green}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <div className="serif" style={{ fontSize: 36, color: TEXT.heading, letterSpacing: '-0.6px' }}>{m.currentValue.toFixed(1)}</div>
              <div style={{ fontSize: 12, color: TEXT.muted }}>{m.unit} · lengo {m.target}</div>
            </div>
            <p style={{ fontSize: 12, color: TEXT.muted, margin: '8px 0 6px', lineHeight: 1.5 }}>{m.definition}</p>
            <div style={{
              background: CREAM.cream, border: `1px solid ${ink(0.08)}`, borderRadius: 8,
              padding: '6px 10px', fontSize: 11, color: TEXT.muted, marginBottom: 12, fontFamily: 'monospace',
            }}>= {m.calculation}</div>
            <TrendChart m={m} />
          </Card>
        ))}
      </div>
    </>
  )
}
