import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { JEWEL, RADII, TYPE, TEXT, CREAM, hexToRgba } from '../../../lib/glass'
import { Card, FieldLabel, fieldStyle, buttonStyle, H1 } from '../components/Card'
import { EMPTY_PROFILE, loadProfile, saveProfile, type ProviderProfileDraft } from '../lib/storage'
import { INSURANCES } from '../../Gundua/data/insurances'
import { TZ_REGIONS } from '../../Gundua/data/providers'

/**
 * Credential-verification wizard. 9 steps; persists draft to localStorage so
 * applicants can resume. Step order:
 *  1 identity → 2 license → 3 specialty → 4 languages → 5 location
 *  6 fees → 7 insurances → 8 mode → 9 diploma upload
 */

const STEPS = [
  'Utambulisho',
  'Nambari ya Leseni',
  'Utaalamu',
  'Lugha',
  'Mahali',
  'Ada',
  'Bima',
  'Aina ya Kipindi',
  'Cheti',
] as const

const LANGS = [
  { id: 'sw', label: 'Kiswahili' },
  { id: 'en', label: 'Kiingereza' },
  { id: 'sw_mtaa', label: 'Kiswahili cha mtaani' },
  { id: 'ar', label: 'Kiarabu' },
  { id: 'fr', label: 'Kifaransa' },
  { id: 'lugha_alama', label: 'Lugha ya alama' },
]

export default function Onboarding() {
  const nav = useNavigate()
  const [p, setP] = useState<ProviderProfileDraft>(() => {
    const v = loadProfile()
    return v === EMPTY_PROFILE ? v : v
  })

  const update = <K extends keyof ProviderProfileDraft>(
    k: K,
    v: ProviderProfileDraft[K],
  ) => {
    const next = { ...p, [k]: v }
    setP(next)
    saveProfile(next)
  }

  const goto = (s: number) => update('step', Math.max(0, Math.min(STEPS.length - 1, s)))

  const stepLabel = STEPS[p.step]

  function finish() {
    saveProfile({ ...p, step: STEPS.length - 1 })
    nav('/wataalam')
  }

  return (
    <div>
      <H1 english="Onboarding">Karibu — tujue zaidi kuhusu wewe.</H1>

      <div
        style={{
          display: 'flex',
          gap: 4,
          marginBottom: 18,
          flexWrap: 'wrap',
        }}
        aria-label="Maendeleo"
      >
        {STEPS.map((s, i) => (
          <div
            key={s}
            title={s}
            style={{
              flex: 1,
              minWidth: 24,
              height: 5,
              borderRadius: 999,
              background:
                i <= p.step ? hexToRgba(JEWEL.goldHope, 0.85) : hexToRgba(JEWEL.tealDeep, 0.5),
            }}
          />
        ))}
      </div>

      <Card title={`Hatua ${p.step + 1} ya ${STEPS.length} — ${stepLabel}`}>
        {p.step === 0 && (
          <div style={{ display: 'grid', gap: 12 }}>
            <div>
              <FieldLabel>Heshima</FieldLabel>
              <select
                style={fieldStyle()}
                value={p.honorific}
                onChange={(e) => update('honorific', e.target.value)}
              >
                <option>Dr.</option>
                <option>Bw.</option>
                <option>Bi.</option>
                <option>Mch.</option>
                <option>Sh.</option>
                <option>Prof.</option>
              </select>
            </div>
            <div>
              <FieldLabel>Jina kamili</FieldLabel>
              <input
                style={fieldStyle()}
                value={p.fullName}
                onChange={(e) => update('fullName', e.target.value)}
                placeholder="kwa mfano: Amina Mwakasege"
              />
            </div>
          </div>
        )}

        {p.step === 1 && (
          <div>
            <FieldLabel>Nambari ya leseni (MCT/TPB/TCDA/BAKWATA/Synod)</FieldLabel>
            <input
              style={fieldStyle()}
              value={p.licenseNumber}
              onChange={(e) => update('licenseNumber', e.target.value)}
              placeholder="MCT/PSY/2142"
            />
            <p style={{ fontSize: 12, color: TEXT.muted, marginTop: 8 }}>
              Tutaithibitisha kwa MoH ndani ya saa 48.
            </p>
          </div>
        )}

        {p.step === 2 && (
          <div>
            <FieldLabel>Utaalamu (Kiswahili)</FieldLabel>
            <input
              style={fieldStyle()}
              value={p.specialty}
              onChange={(e) => update('specialty', e.target.value)}
              placeholder="kwa mfano: Sonona, Wasiwasi, CBT"
            />
          </div>
        )}

        {p.step === 3 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {LANGS.map((l) => {
              const on = p.languages.includes(l.id)
              return (
                <button
                  key={l.id}
                  onClick={() =>
                    update(
                      'languages',
                      on ? p.languages.filter((x) => x !== l.id) : [...p.languages, l.id],
                    )
                  }
                  style={{
                    ...buttonStyle(on ? JEWEL.goldHope : JEWEL.tealDeep, on),
                    padding: '8px 14px',
                  }}
                  aria-pressed={on}
                >
                  {l.label}
                </button>
              )
            })}
          </div>
        )}

        {p.step === 4 && (
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <FieldLabel>Mji</FieldLabel>
              <input
                style={fieldStyle()}
                value={p.city}
                onChange={(e) => update('city', e.target.value)}
                placeholder="Dar es Salaam"
              />
            </div>
            <div>
              <FieldLabel>Mkoa</FieldLabel>
              <select
                style={fieldStyle()}
                value={p.region}
                onChange={(e) => update('region', e.target.value)}
              >
                {TZ_REGIONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {p.step === 5 && (
          <div>
            <FieldLabel>Ada ya kipindi (TSh)</FieldLabel>
            <input
              type="number"
              style={fieldStyle()}
              value={p.feeTzs}
              step={5_000}
              onChange={(e) => update('feeTzs', Number(e.target.value))}
            />
            <p style={{ fontSize: 12, color: TEXT.muted, marginTop: 8 }}>
              Ada hii itakuwa malipo ya moja kwa moja kwako. TBHOS haichukui asilimia
              kutoka kwako wala kwa mteja.
            </p>
          </div>
        )}

        {p.step === 6 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {INSURANCES.map((ins) => {
              const on = p.insurances.includes(ins.id)
              return (
                <button
                  key={ins.id}
                  onClick={() =>
                    update(
                      'insurances',
                      on
                        ? p.insurances.filter((x) => x !== ins.id)
                        : [...p.insurances, ins.id],
                    )
                  }
                  style={{
                    ...buttonStyle(on ? ins.accent : JEWEL.tealDeep, on),
                    padding: '8px 14px',
                  }}
                  aria-pressed={on}
                >
                  {ins.name}
                </button>
              )
            })}
          </div>
        )}

        {p.step === 7 && (
          <div style={{ display: 'flex', gap: 8 }}>
            {(['virtual', 'in_person', 'both'] as const).map((m) => (
              <button
                key={m}
                onClick={() => update('mode', m)}
                style={{
                  ...buttonStyle(p.mode === m ? JEWEL.goldHope : JEWEL.tealDeep, p.mode === m),
                  flex: 1,
                }}
                aria-pressed={p.mode === m}
              >
                {m === 'virtual' ? 'Mtandaoni' : m === 'in_person' ? 'Ana kwa ana' : 'Zote'}
              </button>
            ))}
          </div>
        )}

        {p.step === 8 && (
          <div>
            <FieldLabel>Pakia cheti (PDF/JPG)</FieldLabel>
            <input
              type="file"
              accept="application/pdf,image/*"
              onChange={() => update('diplomaUploaded', true)}
              style={{
                padding: 12,
                borderRadius: RADII.card,
                background: CREAM.milk,
                border: '1px dashed rgba(11,9,8,0.22)',
                color: TEXT.body,
                width: '100%',
              }}
            />
            {p.diplomaUploaded && (
              <p
                style={{
                  marginTop: 10,
                  color: TEXT.link,
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                ✓ Cheti kimepokelewa. Tutawasiliana ndani ya saa 48.
              </p>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          {p.step > 0 && (
            <button onClick={() => goto(p.step - 1)} style={buttonStyle(JEWEL.tealDeep)}>
              ← Rudi
            </button>
          )}
          <div style={{ flex: 1 }} />
          {p.step < STEPS.length - 1 ? (
            <button
              onClick={() => goto(p.step + 1)}
              style={buttonStyle(JEWEL.goldHope, true)}
            >
              Endelea →
            </button>
          ) : (
            <button onClick={finish} style={buttonStyle(JEWEL.goldHope, true)}>
              Tuma maombi
            </button>
          )}
        </div>
      </Card>

      <p style={{ marginTop: 18, color: TEXT.muted, fontSize: 12, textAlign: 'center' }}>
        TBHOS ni bure milele kwa wataalamu na wateja. Sera yetu ya uhakika.
      </p>
    </div>
  )
}
