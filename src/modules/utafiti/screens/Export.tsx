import type React from 'react'
import { Card, Table, Td } from '../../_shared/Layout'
import { BRAND, CREAM, NEUTRAL, TEXT, hexToRgba } from '../../../lib/glass'
import { useLang } from '../../../lib/i18n/Provider'

const ink = (a = 1) => hexToRgba(NEUTRAL.ink, a)

interface Variable {
  name: string
  type: 'int' | 'float' | 'string' | 'enum' | 'date'
  description: string
  promis?: string
  cde?: string
}

const CODEBOOK: Variable[] = [
  { name: 'pid', type: 'string', description: 'De-identified participant ID' },
  { name: 'protocol', type: 'enum', description: 'TR-001 | TR-002 | TR-003' },
  { name: 'week', type: 'int', description: 'Study week (0..52)' },
  { name: 'phq9_score', type: 'int', description: 'PHQ-9 total score (0–27)', promis: 'PROMIS-Depression-SF8a', cde: 'NIH CDE 5555-1' },
  { name: 'gad7_score', type: 'int', description: 'GAD-7 total score (0–21)', promis: 'PROMIS-Anxiety-SF7a', cde: 'NIH CDE 5555-2' },
  { name: 'k10_score', type: 'int', description: 'Kessler-10 (10–50)', cde: 'NIH CDE 5555-3' },
  { name: 'cssrs_ideation', type: 'enum', description: 'C-SSRS ideation level (0–5)', cde: 'NIH CDE 7777-1' },
  { name: 'whodas_score', type: 'float', description: 'WHODAS 2.0 12-item mean', cde: 'NIH CDE 6666-1' },
  { name: 'remission_12wk', type: 'enum', description: 'Y / N — PHQ-9 < 5 at week 12' },
  { name: 'site_id', type: 'string', description: 'Implementation site code' },
  { name: 'progress_place', type: 'enum', description: 'Urban / Peri-urban / Rural' },
  { name: 'progress_gender', type: 'enum', description: 'F / M / NB' },
  { name: 'progress_ses', type: 'enum', description: 'NHIF / CHF / Self-pay / Waiver' },
]

function downloadCsv(): void {
  const rows = ['pid,protocol,week,phq9_score,gad7_score,site_id,remission_12wk']
  for (let i = 0; i < 10; i++) {
    rows.push(`TR001-${String(i).padStart(4, '0')},TR-001,12,${4 + (i % 6)},${3 + (i % 5)},MUHIM,${i % 2 ? 'Y' : 'N'}`)
  }
  trigger(rows.join('\n'), 'tumaini_long_format.csv', 'text/csv')
}

function downloadSps(): void {
  const syntax = `* SPSS syntax — Tumaini TR-001 cohort.\n\n` +
`GET DATA /TYPE=TXT /FILE='tumaini_long_format.csv' /DELIMITERS="," /FIRSTCASE=2\n` +
`  /VARIABLES = pid A10 protocol A8 week F2 phq9_score F2 gad7_score F2 site_id A10 remission_12wk A1.\n` +
`EXECUTE.\n\nMIXED phq9_score BY week protocol\n  /FIXED week protocol week*protocol\n  /RANDOM INTERCEPT | SUBJECT(pid) COVTYPE(VC)\n  /METHOD = REML.\n`
  trigger(syntax, 'tumaini_tr001.sps', 'text/plain')
}

function downloadStata(): void {
  const code = `* Stata syntax — Tumaini TR-001.\n\n` +
`import delimited using "tumaini_long_format.csv", clear\n` +
`encode protocol, gen(protocol_n)\n` +
`xtmixed phq9_score week##protocol_n || pid: , reml\n` +
`* primary outcome\nlogit remission_12wk i.protocol_n, vce(cluster site_id)\n`
  trigger(code, 'tumaini_tr001.do', 'text/plain')
}

function downloadSas(): void {
  const code = `/* SAS syntax — Tumaini TR-001. */\n\n` +
`proc import datafile="tumaini_long_format.csv" out=tum dbms=csv replace; getnames=yes; run;\n` +
`proc mixed data=tum; class pid site_id protocol; model phq9_score = week protocol week*protocol / solution;\n  random intercept / subject=pid; run;\n` +
`proc logistic data=tum; class protocol(ref='TR-001'); model remission_12wk(event='Y') = protocol; run;\n`
  trigger(code, 'tumaini_tr001.sas', 'text/plain')
}

function downloadCodebook(): void {
  const rows = ['name,type,description,promis,cde']
  for (const v of CODEBOOK) {
    rows.push(`${v.name},${v.type},"${v.description}",${v.promis || ''},${v.cde || ''}`)
  }
  trigger(rows.join('\n'), 'tumaini_codebook.csv', 'text/csv')
}

function trigger(content: string, filename: string, mime: string): void {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

function ExportTile({ label, sub, onClick, downloadLabel }: { label: string; sub: string; onClick: () => void; downloadLabel: string }): React.JSX.Element {
  return (
    <button onClick={onClick} style={{
      textAlign: 'left', background: CREAM.cream, border: `1px solid ${ink(0.1)}`,
      borderRadius: 12, padding: 16, cursor: 'pointer',
    }}>
      <div className="serif" style={{ fontSize: 16, color: TEXT.heading }}>{label}</div>
      <div style={{ fontSize: 12, color: TEXT.muted, marginTop: 4 }}>{sub}</div>
      <div style={{ marginTop: 10, display: 'inline-block', padding: '4px 10px', borderRadius: 999, background: BRAND.green, color: TEXT.onJewel, fontSize: 11, fontWeight: 600 }}>{downloadLabel}</div>
    </button>
  )
}

export default function ExportScreen(): React.JSX.Element {
  const { t } = useLang()
  const dl = t('utafiti.export.download', 'Pakua')
  return (
    <>
      <Card title={t('utafiti.export.title', 'Analysis-ready exports')} accent={BRAND.green}>
        <p style={{ margin: '0 0 14px', fontSize: 13, color: TEXT.muted }}>
          {t('utafiti.export.intro', 'Data zote zinapakuliwa kama de-identified, long format (REDCap-compatible). Templates za uchambuzi zinazalishwa kwa SPSS, Stata, na SAS.')}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          <ExportTile label={t('utafiti.export.csv', 'CSV — long format')} sub={t('utafiti.export.csv_sub', 'REDCap-compatible · 1 row / (pid × week × instrument)')} onClick={downloadCsv} downloadLabel={dl} />
          <ExportTile label={t('utafiti.export.spss', 'SPSS syntax (.sps)')} sub={t('utafiti.export.spss_sub', 'MIXED + primary outcome model')} onClick={downloadSps} downloadLabel={dl} />
          <ExportTile label={t('utafiti.export.stata', 'Stata do-file (.do)')} sub={t('utafiti.export.stata_sub', 'xtmixed + logit clustered')} onClick={downloadStata} downloadLabel={dl} />
          <ExportTile label={t('utafiti.export.sas', 'SAS syntax (.sas)')} sub={t('utafiti.export.sas_sub', 'proc mixed + proc logistic')} onClick={downloadSas} downloadLabel={dl} />
          <ExportTile label={t('utafiti.export.codebook', 'Codebook (auto-generated)')} sub={t('utafiti.export.codebook_sub', 'Variables + types + descriptions')} onClick={downloadCodebook} downloadLabel={dl} />
        </div>
      </Card>

      <Card title={t('utafiti.export.codebook_title', 'Variable codebook — PROMIS / NIH CDE mapping')} accent={BRAND.blue}>
        <Table headers={[t('utafiti.export.col.variable', 'Variable'), t('utafiti.export.col.type', 'Aina'), t('utafiti.export.col.desc', 'Maelezo'), 'PROMIS', 'NIH CDE']}>
          {CODEBOOK.map((v) => (
            <tr key={v.name}>
              <Td><code style={{ fontSize: 12, color: TEXT.body }}>{v.name}</code></Td>
              <Td style={{ color: TEXT.muted }}>{v.type}</Td>
              <Td style={{ color: TEXT.body }}>{v.description}</Td>
              <Td style={{ color: TEXT.muted, fontSize: 12 }}>{v.promis || '—'}</Td>
              <Td style={{ color: TEXT.muted, fontSize: 12 }}>{v.cde || '—'}</Td>
            </tr>
          ))}
        </Table>
      </Card>
    </>
  )
}
