import { useState } from 'react'
import { JEWEL, RADII, TYPE, TEXT, CREAM, hexToRgba } from '../../../lib/glass'
import { Card, H1, buttonStyle, FieldLabel } from '../components/Card'
import { loadNotes, saveNotes, type SessionNote } from '../lib/storage'

const SOAP_FIELDS: { key: string; labelSw: string; labelEn: string; hint: string }[] = [
  { key: 'S', labelSw: 'Maelezo ya mteja', labelEn: 'Subjective', hint: 'Anachosema mteja.' },
  { key: 'O', labelSw: 'Uchunguzi', labelEn: 'Objective', hint: 'Mienendo, sauti, mwonekano, alama.' },
  { key: 'A', labelSw: 'Tathmini', labelEn: 'Assessment', hint: 'Hukumu yako ya kitabibu na ICD-11.' },
  { key: 'P', labelSw: 'Mpango', labelEn: 'Plan', hint: 'Hatua zinazofuata, dawa, vipindi.' },
]

const DAP_FIELDS: { key: string; labelSw: string; labelEn: string; hint: string }[] = [
  { key: 'D', labelSw: 'Data', labelEn: 'Data', hint: 'Kile kilichotokea kwenye kipindi.' },
  { key: 'A', labelSw: 'Tathmini', labelEn: 'Assessment', hint: 'Maana yake kitabibu.' },
  { key: 'P', labelSw: 'Mpango', labelEn: 'Plan', hint: 'Hatua zinazofuata.' },
]

// Rafiki-pattern hook stub — these are placeholder “suggestions”. The Rafiki
// engine will inject real, context-aware aids in v2.
const ROHO_HINTS = [
  '“Eleza zaidi unachomaanisha kwa ‘kuchoka roho’.”',
  'Kumbuka kuthibitisha hisia kabla ya kuingia kwenye CBT.',
  'Fikiria kupima ulalaji na hamu ya chakula leo.',
  'Hatari ya kujiua: ulipima C-SSRS?',
]

export default function Notes() {
  const [template, setTemplate] = useState<'SOAP' | 'DAP'>('SOAP')
  const [pseudonym, setPseudonym] = useState('Mteja A')
  const [fields, setFields] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState<SessionNote[]>(() => loadNotes())

  const spec = template === 'SOAP' ? SOAP_FIELDS : DAP_FIELDS

  function save() {
    const n: SessionNote = {
      id: 'n-' + Date.now(),
      appointmentId: 'a-001',
      patientPseudonym: pseudonym,
      template,
      fields,
      createdAt: Date.now(),
    }
    const next = [n, ...saved]
    setSaved(next)
    saveNotes(next)
    setFields({})
  }

  return (
    <div>
      <H1 english="Session notes">Kumbukumbu za kipindi</H1>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
        <Card title={`Andika kumbukumbu — ${template}`}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            {(['SOAP', 'DAP'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTemplate(t)}
                style={buttonStyle(template === t ? JEWEL.goldHope : JEWEL.tealDeep, template === t)}
                aria-pressed={template === t}
              >
                {t}
              </button>
            ))}
            <div style={{ flex: 1 }} />
            <input
              value={pseudonym}
              onChange={(e) => setPseudonym(e.target.value)}
              placeholder="Mteja"
              style={{
                padding: '8px 12px',
                borderRadius: 999,
                background: CREAM.milk,
                border: '1px solid rgba(11,9,8,0.22)',
                color: TEXT.body,
                fontFamily: TYPE.sans,
                fontSize: 13,
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            {spec.map((f) => (
              <div key={f.key}>
                <FieldLabel>
                  {f.key} — {f.labelSw} <span style={{ color: TEXT.muted }}>· {f.labelEn}</span>
                </FieldLabel>
                <textarea
                  rows={3}
                  placeholder={f.hint}
                  value={fields[f.key] ?? ''}
                  onChange={(e) => setFields({ ...fields, [f.key]: e.target.value })}
                  style={{
                    width: '100%',
                    background: CREAM.milk,
                    color: TEXT.body,
                    border: '1px solid rgba(11,9,8,0.22)',
                    borderRadius: RADII.card,
                    padding: 12,
                    fontFamily: TYPE.serif,
                    fontSize: 14,
                    resize: 'vertical',
                    outline: 'none',
                  }}
                />
              </div>
            ))}
          </div>
          <button onClick={save} style={{ ...buttonStyle(JEWEL.goldHope, true), marginTop: 14 }}>
            Hifadhi kumbukumbu
          </button>
        </Card>

        <Card title="Mwenza — mapendekezo" accent={JEWEL.goldHope}>
          <p style={{ fontSize: 12, color: TEXT.muted, margin: '0 0 10px' }}>
            Vidokezo vya mwongozo (vya majaribio).
          </p>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
            {ROHO_HINTS.map((h, i) => (
              <li
                key={i}
                style={{
                  padding: 10,
                  borderRadius: RADII.card,
                  background: hexToRgba(JEWEL.tealRoho, 0.15),
                  border: '1px solid rgba(11,9,8,0.10)',
                  color: TEXT.body,
                  fontFamily: TYPE.serif,
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                {h}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title={`Kumbukumbu zilizohifadhiwa (${saved.length})`} style={{ marginTop: 14 }}>
        {saved.length === 0 ? (
          <p style={{ color: TEXT.muted, margin: 0 }}>Bado hakuna kumbukumbu.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
            {saved.slice(0, 5).map((n) => (
              <li
                key={n.id}
                style={{
                  padding: 12,
                  borderRadius: RADII.card,
                  background: 'rgba(250,245,229,0.85)',
                  border: '1px solid rgba(11,9,8,0.10)',
                  color: TEXT.body,
                  fontSize: 13,
                }}
              >
                <strong>{n.patientPseudonym}</strong> · {n.template} ·{' '}
                {new Date(n.createdAt).toLocaleString('sw-TZ')}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
