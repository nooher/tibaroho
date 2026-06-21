import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { JEWEL, NEUTRAL, BRAND, CREAM, TEXT, RADII, TYPE, hexToRgba } from '../../../lib/glass'
import { formatTzs, getProvider } from '../data/providers'

/**
 * Booking flow — 3 steps:
 *  1. pick slot
 *  2. consent
 *  3. confirm (M-Pesa stub for co-pay; this is PROVIDER REVENUE, not a fee
 *     the TBHOS platform charges the patient.)
 *
 * Persists to localStorage under tibaroho.v1.bookings.
 */

interface Booking {
  id: string
  providerId: string
  slot: string
  consent: boolean
  copayTzs: number
  paid: boolean
  createdAt: number
}

const STORAGE_KEY = 'tibaroho.v1.bookings'

function loadBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Booking[]) : []
  } catch {
    return []
  }
}
function saveBooking(b: Booking) {
  const list = loadBookings()
  list.push(b)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

/** Generate 6 upcoming slots — next 6 weekdays, 10:00 / 14:00. */
function generateSlots(): string[] {
  const out: string[] = []
  const d = new Date()
  let count = 0
  while (out.length < 6 && count < 14) {
    d.setDate(d.getDate() + 1)
    count++
    const dow = d.getDay()
    if (dow === 0 || dow === 6) continue
    const dateStr = d.toLocaleDateString('sw-TZ', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
    out.push(`${dateStr} · 10:00`)
    if (out.length < 6) out.push(`${dateStr} · 14:00`)
  }
  return out
}

export default function Book() {
  const { id } = useParams<{ id: string }>()
  const provider = id ? getProvider(id) : undefined
  const nav = useNavigate()
  const slots = useMemo(generateSlots, [])
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [slot, setSlot] = useState<string>('')
  const [consent, setConsent] = useState(false)
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (!provider) {
    return (
      <div style={{ padding: 40, color: TEXT.body, fontFamily: TYPE.sans }}>
        <h1 style={{ fontFamily: TYPE.serif, color: TEXT.heading }}>Mtaalamu hakupatikana.</h1>
        <Link to="/gundua" style={{ color: TEXT.link }}>
          ← Rudi Gundua
        </Link>
      </div>
    )
  }

  function confirm() {
    if (!slot) {
      setError('Tafadhali chagua muda.')
      return
    }
    if (!consent) {
      setError('Tafadhali kubali kibali cha matibabu.')
      return
    }
    const cleanPhone = phone.replace(/\s+/g, '')
    if (provider!.feeTzs > 0 && !/^\+?255\d{9}$/.test(cleanPhone)) {
      setError('Tafadhali weka nambari ya simu sahihi (+255…) kwa malipo.')
      return
    }
    setError(null)
    const b: Booking = {
      id: 'bk-' + Date.now(),
      providerId: provider!.id,
      slot,
      consent,
      copayTzs: provider!.feeTzs,
      paid: provider!.feeTzs === 0,
      createdAt: Date.now(),
    }
    saveBooking(b)
    setStep(4)
    setTimeout(() => nav('/gundua'), 2400)
  }

  return (
    <div
      style={{
        maxWidth: 640,
        margin: '0 auto',
        padding: '32px 20px 64px',
        color: TEXT.body,
        fontFamily: TYPE.sans,
      }}
    >
      <Link
        to={`/gundua/profile/${provider.id}`}
        style={{ color: TEXT.link, fontSize: 13, textDecoration: 'none' }}
      >
        ← Rudi kwenye wasifu
      </Link>

      <h1
        style={{
          fontFamily: TYPE.serif,
          fontSize: 28,
          letterSpacing: TYPE.tighterTrack,
          margin: '16px 0 4px',
          color: TEXT.heading,
        }}
      >
        Weka miadi
      </h1>
      <p style={{ margin: 0, color: TEXT.muted }}>
        na {provider.honorific} {provider.name}
      </p>

      <ol
        style={{
          display: 'flex',
          gap: 6,
          listStyle: 'none',
          padding: 0,
          margin: '20px 0',
        }}
        aria-label="Hatua"
      >
        {[1, 2, 3].map((n) => (
          <li
            key={n}
            style={{
              flex: 1,
              height: 6,
              borderRadius: 999,
              background: step >= n ? BRAND.green : hexToRgba(NEUTRAL.ink, 0.14),
            }}
          />
        ))}
      </ol>

      {step === 1 && (
        <Card title="1. Chagua muda">
          <div
            role="radiogroup"
            aria-label="Nyakati zinazopatikana"
            style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr' }}
          >
            {slots.map((s) => {
              const checked = s === slot
              return (
                <button
                  key={s}
                  role="radio"
                  aria-checked={checked}
                  onClick={() => setSlot(s)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: RADII.card,
                    background: checked ? BRAND.green : CREAM.milk,
                    border: `1px solid ${checked ? BRAND.green : hexToRgba(NEUTRAL.ink, 0.18)}`,
                    color: checked ? TEXT.onJewel : TEXT.body,
                    fontFamily: TYPE.sans,
                    fontSize: 13,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {s}
                </button>
              )
            })}
          </div>
          <NavRow
            onNext={() => slot && setStep(2)}
            disabled={!slot}
            nextLabel="Endelea →"
          />
        </Card>
      )}

      {step === 2 && (
        <Card title="2. Kibali">
          <p style={{ fontFamily: TYPE.serif, lineHeight: 1.55, fontSize: 15 }}>
            Ninakubali kuhudhuria kipindi na {provider.honorific} {provider.name}.
            Habari zangu zitabaki za siri kati yangu na mtaalamu, isipokuwa kuna
            hatari kwa maisha yangu au ya mwingine. Naelewa ninaweza kuondoa kibali
            wakati wowote.
          </p>
          <label
            style={{
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
              cursor: 'pointer',
              marginTop: 8,
            }}
          >
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              style={{
                accentColor: JEWEL.goldSoft,
                marginTop: 3,
                width: 18,
                height: 18,
              }}
            />
            <span>Nakubali</span>
          </label>
          <NavRow
            onBack={() => setStep(1)}
            onNext={() => consent && setStep(3)}
            disabled={!consent}
          />
        </Card>
      )}

      {step === 3 && (
        <Card title="3. Thibitisha">
          <Row k="Mtaalamu" v={`${provider.honorific} ${provider.name}`} />
          <Row k="Muda" v={slot} />
          <Row k="Ada" v={formatTzs(provider.feeTzs)} />
          {provider.feeTzs > 0 && (
            <>
              <p
                style={{
                  marginTop: 14,
                  fontSize: 13,
                  color: TEXT.muted,
                  lineHeight: 1.5,
                }}
              >
                Ada hii ni malipo ya moja kwa moja kwa mtaalamu kupitia M-Pesa.
                <strong> TBHOS haichaji mteja chochote.</strong>
              </p>
              <label style={{ display: 'block', marginTop: 12 }}>
                <span style={{ fontSize: 12, color: TEXT.muted }}>Nambari ya M-Pesa</span>
                <input
                  type="tel"
                  placeholder="+255 712 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    width: '100%',
                    marginTop: 4,
                    padding: '11px 14px',
                    borderRadius: RADII.chip,
                    background: CREAM.milk,
                    border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.22)}`,
                    color: TEXT.body,
                    fontFamily: TYPE.sans,
                    fontSize: 14,
                  }}
                />
              </label>
            </>
          )}
          {error && (
            <p
              role="alert"
              style={{
                color: TEXT.onJewel,
                background: BRAND.ink,
                padding: 10,
                borderRadius: RADII.card,
                marginTop: 14,
                fontSize: 13,
              }}
            >
              {error}
            </p>
          )}
          <NavRow onBack={() => setStep(2)} onNext={confirm} nextLabel="Thibitisha miadi" />
        </Card>
      )}

      {step === 4 && (
        <Card title="Asante!">
          <p style={{ fontFamily: TYPE.serif, fontSize: 18, lineHeight: 1.5 }}>
            Miadi yako imewekwa kwa {slot}. Mtaalamu atakutumia uthibitisho hivi
            karibuni.
          </p>
        </Card>
      )}
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        background: hexToRgba(JEWEL.tealRoho, 0.08),
        border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.10)}`,
        borderRadius: RADII.sheet,
        padding: 22,
        marginTop: 12,
      }}
    >
      <h2 style={{ fontFamily: TYPE.serif, margin: '0 0 14px', fontSize: 18, color: TEXT.heading }}>
        {title}
      </h2>
      {children}
    </section>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '8px 0',
        borderBottom: `1px solid ${hexToRgba(NEUTRAL.ink, 0.10)}`,
        fontSize: 14,
      }}
    >
      <span style={{ color: TEXT.muted }}>{k}</span>
      <span style={{ fontWeight: 500, color: TEXT.body }}>{v}</span>
    </div>
  )
}

function NavRow({
  onBack,
  onNext,
  disabled,
  nextLabel = 'Endelea →',
}: {
  onBack?: () => void
  onNext: () => void
  disabled?: boolean
  nextLabel?: string
}) {
  return (
    <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
      {onBack && (
        <button
          onClick={onBack}
          style={{
            padding: '10px 18px',
            borderRadius: RADII.chip,
            background: 'transparent',
            border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.20)}`,
            color: TEXT.body,
            cursor: 'pointer',
            fontFamily: TYPE.sans,
            fontSize: 13,
          }}
        >
          ← Rudi
        </button>
      )}
      <div style={{ flex: 1 }} />
      <button
        onClick={onNext}
        disabled={disabled}
        style={{
          padding: '10px 22px',
          borderRadius: RADII.chip,
          background: disabled ? hexToRgba(NEUTRAL.ink, 0.12) : BRAND.green,
          border: `1px solid ${disabled ? hexToRgba(NEUTRAL.ink, 0.18) : BRAND.green}`,
          color: disabled ? TEXT.muted : TEXT.onJewel,
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontFamily: TYPE.sans,
          fontWeight: 600,
          fontSize: 13,
        }}
      >
        {nextLabel}
      </button>
    </div>
  )
}
