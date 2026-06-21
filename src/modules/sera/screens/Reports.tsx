import { Card } from '../../_shared/Layout'
import { JEWEL, CREAM, NEUTRAL, TEXT, hexToRgba } from '../../../lib/glass'
import { NATIONAL, REGIONS } from '../data'

const QUARTER = 'Robo ya 2 · Aprili–Juni 2026'

/**
 * Build a parliament-grade quarterly report as plain-text Markdown,
 * then trigger a download. Real export to .docx will use the docx skill
 * server-side; for now we ship the canonical text so committees can paste
 * it into their template and reviewers see the exact wording.
 */
function downloadReport(format: 'md' | 'pdf-stub') {
  const lines: string[] = []
  lines.push(`# Tumaini · TBHOS — Ripoti ya ${QUARTER}`)
  lines.push('')
  lines.push('## Muhtasari wa Kitaifa')
  lines.push(`- Ufikiaji wa kitaifa: **${NATIONAL.rolloutPct}%** ya wilaya`)
  lines.push(`- Walioandikishwa: **${NATIONAL.enrolment.toLocaleString('sw-TZ')}**`)
  lines.push(`- Remission ya wiki 12 (PHQ-9 < 5): **${NATIONAL.remissionRate12wk}%**`)
  lines.push(`- Gharama kwa kila remission: **USD ${NATIONAL.costPerRemissionUSD}**`)
  lines.push(`- Mikoa iliyoshirikiana: **${NATIONAL.frameworkSignings}/26**`)
  lines.push(`- Matukio ya dharura YoY: **${(NATIONAL.crisisEventsYoY * 100).toFixed(0)}%**`)
  lines.push('')
  lines.push('## Vipimo kwa Mkoa')
  lines.push('| Mkoa | PHQ-9 wastani | Tathmini % | Tiba % | Remission 12wk % |')
  lines.push('|---|---|---|---|---|')
  for (const r of REGIONS) {
    lines.push(`| ${r.name} | ${r.phq9Mean.toFixed(1)} | ${r.screeningReach} | ${r.treatmentEngagement} | ${r.remission12wk} |`)
  }
  lines.push('')
  lines.push('## Mapendekezo')
  lines.push('1. Kupanua mafunzo ya lay counsellors kwa mikoa ya mpakani (Kigoma, Katavi, Rukwa, Songwe).')
  lines.push('2. Kuongeza upatikanaji wa dawa za mood na anxiolytics katika ngazi ya vituo vya afya.')
  lines.push('3. Kuingiza coding ya ICD-11 Sura ya 6 katika mfumo wa NHIF.')
  lines.push('4. Kuanzisha mstari wa dharura wa kitaifa wa afya ya akili (24/7).')
  lines.push('')
  lines.push('---')
  lines.push('Imejengwa na Laetoli (T) Ltd · Tumaini ni huduma. Tumaini ni mfumo. Tumaini ni taifa.')

  const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `Tumaini-TBHOS-${QUARTER.replace(/\s+/g, '-')}.${format === 'md' ? 'md' : 'pdf.txt'}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function SeraReports() {
  return (
    <>
      <Card title={`Ripoti za Bunge — ${QUARTER}`} accent={JEWEL.indigoWisdom}>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: TEXT.body, margin: '0 0 16px' }}>
          Ripoti hii inajijaza yenyewe kwa kutumia data ya sasa ya kitaifa.
          Imejengwa kwa muundo wa Bunge — sehemu za muhtasari, jedwali la mikoa,
          na mapendekezo zinatolewa moja kwa moja.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={() => downloadReport('md')}
            style={btn(JEWEL.indigoWisdom)}
          >
            Pakua Markdown / DOCX-tayari
          </button>
          <button
            onClick={() => downloadReport('pdf-stub')}
            style={btn(JEWEL.tealMwenza)}
          >
            Pakua kama PDF (rasimu)
          </button>
        </div>
      </Card>

      <Card title="Vichwa vya Ripoti" accent={JEWEL.goldHope}>
        <ol style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9, color: TEXT.body, fontSize: 14 }}>
          <li>Muhtasari wa kitaifa</li>
          <li>Maendeleo dhidi ya malengo ya robo iliyopita</li>
          <li>Vipimo kwa mkoa (jedwali kamili)</li>
          <li>Hali ya makubaliano ya MoH</li>
          <li>Matukio ya dharura na mwitikio</li>
          <li>Usawa wa kijinsia na vijijini-mijini</li>
          <li>Gharama na ufanisi (CEA)</li>
          <li>Mapendekezo kwa Bunge</li>
          <li>Viambatisho — taarifa za kifani</li>
        </ol>
      </Card>

      <Card title="Vidokezo" accent={JEWEL.tealMwenza}>
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7, color: TEXT.muted, fontSize: 13 }}>
          <li>Hifadhi ya Markdown inafunguliwa moja kwa moja kwenye MS Word.</li>
          <li>Toleo la PDF la rasimu litabadilishwa na pdf-service ya wizara.</li>
          <li>Data zote zinapatikana pia kupitia API ya <code>/v1/sera/report</code>.</li>
        </ul>
      </Card>
    </>
  )
}

function btn(color: string): React.CSSProperties {
  return {
    padding: '12px 20px',
    borderRadius: 999,
    background: color,
    color: CREAM.cream,
    border: 'none',
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: '0.02em',
    cursor: 'pointer',
  }
}
