import { useState } from 'react'
import { Card } from '../../_shared/Layout'
import { JEWEL, CREAM, NEUTRAL, TEXT, hexToRgba } from '../../../lib/glass'
import { REGIONS, phq9Color, FRAMEWORK_LABEL, type RegionMetric } from '../data'

export default function SeraDashboard() {
  const [selected, setSelected] = useState<RegionMetric | null>(null)

  return (
    <>
      <Card title="Ramani ya Kitaifa — PHQ-9 wastani kwa mkoa" accent={JEWEL.indigoWisdom}>
        <p style={{ fontSize: 13, color: TEXT.muted, margin: '0 0 14px' }}>
          Bonyeza mkoa wowote kuona vipimo vya msingi. Data hapa ni ya mfano — itaungwa
          na backend ya wizara mara tu mikataba itakapokamilika.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.4fr) minmax(260px, 1fr)', gap: 18 }}>
          <svg
            viewBox="0 0 600 600"
            role="img"
            aria-label="Ramani ya mikoa ya Tanzania"
            style={{
              width: '100%',
              height: 'auto',
              background: CREAM.milk,
              border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.08)}`,
              borderRadius: 16,
            }}
          >
            {/* Country silhouette — simplified shape */}
            <path
              d="M120,220 L160,160 L220,130 L280,130 L320,150 L370,140 L420,160 L450,180 L460,230 L500,250 L530,290 L520,340 L490,370 L490,420 L470,470 L450,510 L400,540 L340,540 L290,520 L240,500 L200,470 L160,430 L130,380 L110,320 L120,260 Z"
              fill={CREAM.cream}
              stroke={hexToRgba(NEUTRAL.ink, 0.18)}
              strokeWidth={1.5}
            />
            {/* Pemba + Unguja islands */}
            <ellipse cx={510} cy={290} rx={16} ry={22} fill={CREAM.cream} stroke={hexToRgba(NEUTRAL.ink, 0.18)} strokeWidth={1.2} />
            <ellipse cx={510} cy={330} rx={18} ry={24} fill={CREAM.cream} stroke={hexToRgba(NEUTRAL.ink, 0.18)} strokeWidth={1.2} />

            {/* Region nodes */}
            {REGIONS.map((r) => {
              const isSelected = selected?.id === r.id
              const fill = phq9Color(r.phq9Mean)
              const radius = isSelected ? 18 : 13
              return (
                <g key={r.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(r)}>
                  <circle
                    cx={r.cx}
                    cy={r.cy}
                    r={radius}
                    fill={fill}
                    stroke={isSelected ? JEWEL.tealDeep : CREAM.milk}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    opacity={0.92}
                  >
                    <title>{`${r.name} — PHQ-9 wastani ${r.phq9Mean.toFixed(1)}`}</title>
                  </circle>
                  <text
                    x={r.cx}
                    y={r.cy + radius + 11}
                    textAnchor="middle"
                    fontSize={9}
                    fontWeight={600}
                    fill={TEXT.body}
                    style={{ pointerEvents: 'none' }}
                  >
                    {r.name.length > 9 ? r.name.slice(0, 8) + '…' : r.name}
                  </text>
                </g>
              )
            })}

            {/* Legend */}
            <g transform="translate(20,530)">
              <text x={0} y={0} fontSize={10} fontWeight={700} fill={TEXT.heading} letterSpacing="0.06em">PHQ-9 WASTANI</text>
              {[
                { label: '<8',  color: '#2E5E64' },
                { label: '8-9', color: '#3F6B70' },
                { label: '9-10',color: '#B8951F' },
                { label: '10-11',color: '#9C5A1F' },
                { label: '≥11', color: '#5E1F3E' },
              ].map((b, i) => (
                <g key={b.label} transform={`translate(${i * 70},14)`}>
                  <circle cx={6} cy={6} r={6} fill={b.color} />
                  <text x={18} y={9} fontSize={10} fill={TEXT.muted}>{b.label}</text>
                </g>
              ))}
            </g>
          </svg>

          {/* Region detail panel */}
          <div
            aria-live="polite"
            style={{
              background: CREAM.milk,
              border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.08)}`,
              borderRadius: 16,
              padding: 18,
              minHeight: 360,
            }}
          >
            {selected ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <h3 style={{
                    margin: 0, fontFamily: "'Georgia', serif", fontSize: 24,
                    color: JEWEL.tealDeep, letterSpacing: '-0.3px',
                  }}>
                    {selected.name}
                  </h3>
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
                    textTransform: 'uppercase', padding: '4px 10px', borderRadius: 999,
                    background: hexToRgba(FRAMEWORK_LABEL[selected.framework].color, 0.16),
                    color: FRAMEWORK_LABEL[selected.framework].color,
                    border: `1px solid ${hexToRgba(FRAMEWORK_LABEL[selected.framework].color, 0.4)}`,
                  }}>
                    {FRAMEWORK_LABEL[selected.framework].sw}
                  </span>
                </div>
                <dl style={{ margin: '18px 0 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Metric label="PHQ-9 wastani" value={selected.phq9Mean.toFixed(1)} />
                  <Metric label="Ufikiaji wa tathmini" value={`${selected.screeningReach}%`} />
                  <Metric label="Wanaopata tiba" value={`${selected.treatmentEngagement}%`} />
                  <Metric label="Remission wiki 12" value={`${selected.remission12wk}%`} />
                  <Metric label="Kujidhuru /100k" value={selected.suicideRate.toFixed(1)} />
                  <Metric label="Wataalam /100k" value={selected.providerDensity.toFixed(1)} />
                </dl>
              </>
            ) : (
              <div style={{
                display: 'grid', placeItems: 'center', minHeight: 320,
                color: TEXT.hint, fontSize: 14, textAlign: 'center', padding: 12,
              }}>
                Bonyeza mkoa kwenye ramani kuona vipimo.
              </div>
            )}
          </div>
        </div>
      </Card>
    </>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt style={{
        fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
        color: TEXT.hint, fontWeight: 700,
      }}>
        {label}
      </dt>
      <dd style={{
        margin: '4px 0 0', fontFamily: "'Georgia', serif",
        fontSize: 22, color: JEWEL.tealDeep, fontWeight: 700, letterSpacing: '-0.3px',
      }}>
        {value}
      </dd>
    </div>
  )
}
