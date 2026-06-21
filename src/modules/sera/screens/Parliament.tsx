import { Card } from '../../_shared/Layout'
import { JEWEL, CREAM, NEUTRAL, TEXT, hexToRgba } from '../../../lib/glass'
import { NATIONAL } from '../data'

const ROWS: { label_sw: string; label_en: string; value: string; trend: 'up' | 'down' | 'flat'; band: 'good' | 'warn' | 'bad' }[] = [
  { label_sw: 'Ufikiaji wa kitaifa',         label_en: 'National rollout',         value: `${NATIONAL.rolloutPct}%`,                  trend: 'up',   band: 'warn' },
  { label_sw: 'Walioandikishwa',             label_en: 'Enrolment',                value: NATIONAL.enrolment.toLocaleString('sw-TZ'), trend: 'up',   band: 'good' },
  { label_sw: 'Remission wiki 12',           label_en: 'Outcomes',                 value: `${NATIONAL.remissionRate12wk}%`,           trend: 'up',   band: 'good' },
  { label_sw: 'Gharama / remission',         label_en: 'Cost per remission',       value: `USD ${NATIONAL.costPerRemissionUSD}`,      trend: 'down', band: 'good' },
  { label_sw: 'Pengo la usawa',              label_en: 'Equity gap',               value: NATIONAL.equityGap.toFixed(2),              trend: 'flat', band: 'warn' },
  { label_sw: 'Ufikiaji wa watoa-huduma',    label_en: 'Workforce coverage',       value: `${Math.round(NATIONAL.workforceCoverage * 100)}%`, trend: 'up',   band: 'warn' },
  { label_sw: 'Mikoa iliyosaini mkataba',    label_en: 'Framework signings',       value: `${NATIONAL.frameworkSignings}/26`,         trend: 'up',   band: 'warn' },
  { label_sw: 'Matukio ya dharura YoY',      label_en: 'Crisis events Y/Y',        value: `${(NATIONAL.crisisEventsYoY * 100).toFixed(0)}%`, trend: 'down', band: 'good' },
]

const BAND_COLOR: Record<'good' | 'warn' | 'bad', string> = {
  good: JEWEL.tealMwenza,
  warn: JEWEL.goldHope,
  bad:  JEWEL.maroonCrisis,
}

const TREND_GLYPH: Record<'up' | 'down' | 'flat', string> = { up: '▲', down: '▼', flat: '–' }

export default function SeraParliament() {
  return (
    <>
      <Card title="Ubao wa Wazi — Wizara na Bunge" accent={JEWEL.indigoWisdom}>
        <p style={{ fontSize: 13, color: TEXT.muted, margin: '0 0 16px' }}>
          Mtazamo wa kusoma-tu, umeundwa kuonekana kwenye dashibodi za wizara
          na vyumba vya kamati. Vipimo nane vya kitaifa.
        </p>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr', gap: 0,
          background: CREAM.milk, borderRadius: 16,
          border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.08)}`,
          overflow: 'hidden',
        }}>
          {ROWS.map((r, i) => (
            <div
              key={r.label_sw}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(180px, 1.2fr) minmax(140px, 1fr) 60px',
                alignItems: 'center',
                gap: 14,
                padding: '16px 18px',
                borderTop: i === 0 ? 'none' : `1px solid ${hexToRgba(NEUTRAL.ink, 0.06)}`,
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: TEXT.body }}>{r.label_sw}</div>
                <div style={{ fontSize: 11, color: TEXT.hint, letterSpacing: '0.04em', marginTop: 2 }}>{r.label_en}</div>
              </div>
              <div style={{
                fontFamily: "'Georgia', serif", fontSize: 28, fontWeight: 700,
                color: BAND_COLOR[r.band], letterSpacing: '-0.4px',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {r.value}
              </div>
              <div style={{
                fontSize: 16, fontWeight: 700,
                color: BAND_COLOR[r.band], textAlign: 'center',
              }} aria-label={`Mwelekeo: ${r.trend}`}>
                {TREND_GLYPH[r.trend]}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}
