import { useState } from 'react'
import { JEWEL, TYPE, TEXT, hexToRgba } from '../../../lib/glass'
import { Card, H1, buttonStyle, FieldLabel, fieldStyle } from '../components/Card'
import { loadProfile, saveProfile, type ProviderProfileDraft } from '../lib/storage'
import { initialsOf } from '../../Gundua/data/providers'

export default function Profile() {
  const [p, setP] = useState<ProviderProfileDraft>(() => loadProfile())
  const [preview, setPreview] = useState(false)

  const update = <K extends keyof ProviderProfileDraft>(k: K, v: ProviderProfileDraft[K]) => {
    const next = { ...p, [k]: v }
    setP(next)
    saveProfile(next)
  }

  return (
    <div>
      <H1 english="Public profile">Wasifu wa hadhara</H1>

      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <button
          onClick={() => setPreview(false)}
          style={buttonStyle(!preview ? JEWEL.goldHope : JEWEL.tealDeep, !preview)}
        >
          ✏️ Hariri
        </button>
        <button
          onClick={() => setPreview(true)}
          style={buttonStyle(preview ? JEWEL.goldHope : JEWEL.tealDeep, preview)}
        >
          👁 Onyesha kama mteja
        </button>
      </div>

      {preview ? (
        <Card>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div
              aria-hidden
              style={{
                width: 84,
                height: 84,
                borderRadius: 999,
                background: hexToRgba(JEWEL.tealRoho, 0.45),
                border: `1px solid ${hexToRgba(JEWEL.goldSoft, 0.5)}`,
                display: 'grid',
                placeItems: 'center',
                fontFamily: TYPE.serif,
                fontSize: 28,
                fontWeight: 600,
                color: TEXT.onJewel,
              }}
            >
              {initialsOf(p.fullName || 'Mtaalamu')}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontFamily: TYPE.serif, margin: 0, fontSize: 22 }}>
                {p.honorific} {p.fullName || '—'}
              </h2>
              <p style={{ margin: '4px 0 0', color: TEXT.muted }}>
                {p.specialty || '—'} · {p.city || '—'}, {p.region}
              </p>
              <p style={{ marginTop: 10, fontFamily: TYPE.serif }}>{p.bioSw || '—'}</p>
              <p style={{ marginTop: 10, fontSize: 14, color: TEXT.muted }}>
                Ada: TSh {p.feeTzs.toLocaleString('sw-TZ')} ·{' '}
                {p.mode === 'virtual' ? 'Mtandaoni' : p.mode === 'in_person' ? 'Ana kwa ana' : 'Zote'}
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <Card title="Hariri">
          <FieldLabel>Jina kamili</FieldLabel>
          <input
            style={fieldStyle()}
            value={p.fullName}
            onChange={(e) => update('fullName', e.target.value)}
          />
          <FieldLabel>Utaalamu (Kiswahili)</FieldLabel>
          <input
            style={fieldStyle()}
            value={p.specialty}
            onChange={(e) => update('specialty', e.target.value)}
          />
          <FieldLabel>Bio (Kiswahili)</FieldLabel>
          <textarea
            rows={4}
            value={p.bioSw}
            onChange={(e) => update('bioSw', e.target.value)}
            style={{
              ...fieldStyle(),
              fontFamily: TYPE.serif,
              fontSize: 14,
              resize: 'vertical',
            }}
            placeholder="Eleza falsafa yako ya tiba…"
          />
          <FieldLabel>Bio (English — optional)</FieldLabel>
          <textarea
            rows={4}
            value={p.bioEn}
            onChange={(e) => update('bioEn', e.target.value)}
            style={{
              ...fieldStyle(),
              fontFamily: TYPE.serif,
              fontSize: 14,
              resize: 'vertical',
            }}
          />
        </Card>
      )}
    </div>
  )
}
