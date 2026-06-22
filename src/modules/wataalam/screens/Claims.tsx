import { useState } from 'react'
import { JEWEL, RADII, TYPE, TEXT, hexToRgba } from '../../../lib/glass'
import { Card, H1, buttonStyle, FieldLabel, fieldStyle } from '../components/Card'
import { INSURANCES } from '../../Gundua/data/insurances'
import { useLang } from '../../../lib/i18n/Provider'

export default function Claims() {
  const { t } = useLang()
  const [patient, setPatient] = useState('Mteja A')
  const [insurance, setInsurance] = useState('nhif')
  const [icd, setICD] = useState('6A70')
  const [fee, setFee] = useState(80_000)
  const [coverage, setCoverage] = useState(70)

  const copay = Math.round((fee * (100 - coverage)) / 100)
  const insurerPays = fee - copay

  function downloadPdf() {
    // Stub: build a printable HTML blob.
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Claim</title>
      <style>body{font-family:Georgia,serif;padding:40px;max-width:720px;margin:0 auto;color:#0F2A2E}
      h1{font-size:22px;margin:0 0 4px}
      .row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #ccc}
      .total{font-weight:bold;font-size:18px;background:#F4EAC9;padding:14px;margin-top:18px}</style></head>
      <body>
      <h1>Madai ya Bima — TABHOS</h1>
      <p>Tarehe: ${new Date().toLocaleDateString('sw-TZ')}</p>
      <hr/>
      <div class="row"><span>Mteja</span><span>${patient}</span></div>
      <div class="row"><span>Bima</span><span>${INSURANCES.find(i=>i.id===insurance)?.name}</span></div>
      <div class="row"><span>ICD-11</span><span>${icd}</span></div>
      <div class="row"><span>Ada ya kipindi</span><span>TSh ${fee.toLocaleString('sw-TZ')}</span></div>
      <div class="row"><span>Bima inalipa (${coverage}%)</span><span>TSh ${insurerPays.toLocaleString('sw-TZ')}</span></div>
      <div class="row"><span>Mteja anachangia</span><span>TSh ${copay.toLocaleString('sw-TZ')}</span></div>
      <div class="total">Jumla: TSh ${fee.toLocaleString('sw-TZ')}</div>
      <p style="margin-top:30px;font-size:12px;color:#666">TABHOS ni jukwaa bure. Malipo haya yote ni kati ya bima na mtaalamu.</p>
      </body></html>`
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `claim-${patient.replace(/\s+/g, '_')}.html`
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <div>
      <H1 english="Insurance claims">{t('wataalam.claims.title', 'Madai ya bima')}</H1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Card title={t('wataalam.claims.details', 'Maelezo ya madai')}>
          <FieldLabel>{t('wataalam.claims.patient_code', 'Mteja (jina la kificho)')}</FieldLabel>
          <input style={fieldStyle()} value={patient} onChange={(e) => setPatient(e.target.value)} />

          <FieldLabel>{t('wataalam.claims.insurance', 'Bima')}</FieldLabel>
          <select
            style={fieldStyle()}
            value={insurance}
            onChange={(e) => setInsurance(e.target.value)}
          >
            {INSURANCES.filter((i) => i.id !== 'cash').map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>

          <FieldLabel>ICD-11</FieldLabel>
          <input style={fieldStyle()} value={icd} onChange={(e) => setICD(e.target.value)} />

          <FieldLabel>{t('wataalam.onboarding.fee', 'Ada ya kipindi (TSh)')}</FieldLabel>
          <input
            type="number"
            style={fieldStyle()}
            value={fee}
            step={5_000}
            onChange={(e) => setFee(Number(e.target.value))}
          />

          <FieldLabel>{t('wataalam.claims.coverage_pct', 'Asilimia ya bima (%)')}</FieldLabel>
          <input
            type="range"
            min={0}
            max={100}
            value={coverage}
            onChange={(e) => setCoverage(Number(e.target.value))}
            style={{ width: '100%', accentColor: JEWEL.goldSoft }}
          />
          <p style={{ fontSize: 13, color: TEXT.muted }}>{coverage}% {t('wataalam.claims.covered', 'imefunikwa na bima')}</p>
        </Card>

        <Card title={t('wataalam.claims.summary', 'Muhtasari wa madai')} accent={JEWEL.goldHope}>
          <Row k={t('wataalam.claims.patient', 'Mteja')} v={patient} />
          <Row k={t('wataalam.claims.insurance', 'Bima')} v={INSURANCES.find((i) => i.id === insurance)?.name ?? ''} />
          <Row k={t('wataalam.claims.code', 'Kanuni')} v={icd} />
          <Row k={t('wataalam.claims.fee_total', 'Ada jumla')} v={`TSh ${fee.toLocaleString('sw-TZ')}`} />
          <Row k={t('wataalam.claims.insurer_pays', 'Bima inalipa')} v={`TSh ${insurerPays.toLocaleString('sw-TZ')}`} />
          <div
            style={{
              padding: 14,
              borderRadius: RADII.card,
              background: hexToRgba(JEWEL.goldHope, 0.45),
              marginTop: 14,
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: TYPE.serif,
              fontSize: 18,
              fontWeight: 600,
              color: TEXT.heading,
            }}
          >
            <span>{t('wataalam.claims.patient_pays', 'Mteja anachangia')}</span>
            <span>TSh {copay.toLocaleString('sw-TZ')}</span>
          </div>
          <button
            onClick={downloadPdf}
            style={{ ...buttonStyle(JEWEL.goldHope, true), marginTop: 16, width: '100%' }}
          >
            {t('wataalam.claims.download', '📄 Pakua fomu ya madai')}
          </button>
        </Card>
      </div>
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '8px 0',
        borderBottom: '1px solid rgba(11,9,8,0.10)',
        fontSize: 14,
      }}
    >
      <span style={{ color: TEXT.muted }}>{k}</span>
      <span style={{ fontWeight: 500 }}>{v}</span>
    </div>
  )
}
