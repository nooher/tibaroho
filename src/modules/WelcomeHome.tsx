import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../lib/i18n/Provider'
import { BRAND, CREAM, NEUTRAL, TEXT, TYPE, hexToRgba } from '../lib/glass'
import CinematicIntro, { introAlreadyPlayed } from '../components/CinematicIntro'
import EntranceBrain from '../components/EntranceBrain'
import { clearPersona, DEMO_PASSWORD, PERSONAS, personaEmail, setPersona, type Persona, type PersonaId } from '../lib/personas'
import { hasBackend, supabase } from '../lib/supabase'

/**
 * Tumaini entrance — orange TBHOS splash → persistent throbbing brain
 * (centre-left) + a glass-on-water sign-in panel (right).
 *
 * No big "Tumaini" wordmark on the entrance, no description blocks, no
 * module catalogue. The brain breathes, the flag-coloured rings expand
 * outward like ripples on still water. The sign-in panel sits in clear
 * space — brief copy, floating inputs, quick persona chips for demo
 * access. This is the product opening.
 */
export default function WelcomeHome() {
  const nav = useNavigate()
  const { t } = useLang()
  const [introDone, setIntroDone] = useState<boolean>(() => introAlreadyPlayed())
  const [revealed, setRevealed] = useState<boolean>(() => introAlreadyPlayed())
  const [mode, setMode] = useState<'ingia' | 'jisajili'>('ingia')
  const [busy, setBusy] = useState<PersonaId | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [authEmail, setAuthEmail] = useState('')
  const [authPwd, setAuthPwd] = useState('')

  const onPick = async (p: Persona) => {
    setErr(null)
    setPersona(p.id)
    if (hasBackend && supabase) {
      setBusy(p.id)
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: personaEmail[p.id],
          password: DEMO_PASSWORD,
        })
        if (error) throw error
      } catch (e) {
        setErr(e instanceof Error ? e.message : 'Backend imeshindwa kuingia')
        // Fall through to navigation anyway — persona localStorage still set.
      } finally {
        setBusy(null)
      }
    }
    nav(p.startRoute, { replace: true })
  }

  const onAuthSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErr(null)
    if (!hasBackend || !supabase) {
      setErr('Backend bado haijasanidiwa')
      return
    }
    setBusy('mpya')
    try {
      if (mode === 'ingia') {
        const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPwd })
        if (error) throw error
        clearPersona()
        nav('/mimi', { replace: true })
      } else {
        const { error } = await supabase.auth.signUp({ email: authEmail, password: authPwd })
        if (error) throw error
        clearPersona()
        nav('/karibu', { replace: true })
      }
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Imeshindwa')
    } finally {
      setBusy(null)
    }
  }

  if (!introDone) {
    return (
      <CinematicIntro
        onComplete={() => {
          setIntroDone(true)
          window.setTimeout(() => setRevealed(true), 80)
        }}
      />
    )
  }

  return (
    <main
      style={{
        position: 'relative',
        background: CREAM.milk,
        minHeight: '100vh',
        overflow: 'hidden',
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 800ms cubic-bezier(.16,1,.3,1), transform 800ms cubic-bezier(.16,1,.3,1)',
      }}
    >
      {/* Faint flag-coloured radial halos — water shimmer underneath everything */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            `radial-gradient(60% 40% at 30% 40%, ${hexToRgba(BRAND.green, 0.07)} 0%, transparent 60%),` +
            `radial-gradient(50% 35% at 70% 65%, ${hexToRgba(BRAND.blue, 0.06)} 0%, transparent 60%),` +
            `radial-gradient(40% 30% at 80% 25%, ${hexToRgba(BRAND.yellow, 0.05)} 0%, transparent 60%)`,
          pointerEvents: 'none',
        }}
      />

      <div
        className="welcome-grid"
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(360px, 460px)',
          gap: 24,
          maxWidth: 1280,
          margin: '0 auto',
          padding: '32px 32px 48px',
          minHeight: '100vh',
          alignItems: 'center',
        }}
      >
        {/* Left — the persistent throbbing brain */}
        <section
          aria-hidden
          data-eb
          style={{
            display: 'grid',
            placeItems: 'center',
            minHeight: 500,
          }}
        >
          <EntranceBrain size={260} />
        </section>

        {/* Right — glass-on-water sign-in panel */}
        <section
          aria-labelledby="welcome-sign-title"
          style={{
            background: 'rgba(255,253,243,0.62)',
            backdropFilter: 'blur(28px) saturate(160%)',
            WebkitBackdropFilter: 'blur(28px) saturate(160%)',
            border: '1px solid rgba(255,255,255,0.6)',
            borderRadius: 28,
            padding: '32px 30px',
            boxShadow:
              '0 1px 0 rgba(255,255,255,0.8) inset,' +
              '0 24px 60px rgba(11,9,8,0.08),' +
              '0 2px 6px rgba(11,9,8,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
          }}
        >
          <header>
            <div
              style={{
                fontSize: 11,
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                fontWeight: 700,
                color: BRAND.green,
                marginBottom: 8,
              }}
            >
              TABHOS · Tanzania
            </div>
            <h1
              id="welcome-sign-title"
              style={{
                margin: 0,
                fontFamily: TYPE.serif,
                fontSize: 26,
                fontWeight: 800,
                color: TEXT.heading,
                letterSpacing: '-0.4px',
                lineHeight: 1.15,
              }}
            >
              {t('welcome.h_sw', 'Karibu kwenye jukwaa la afya ya tabia.')}
            </h1>
            <p
              style={{
                margin: '8px 0 0',
                fontSize: 13.5,
                lineHeight: 1.55,
                color: TEXT.body,
              }}
            >
              {t(
                'welcome.lede_sw',
                'Bure milele · de-identified · IRB-gated · ushahidi (EBM) · faragha imara · interoperable na EHR yoyote.',
              )}
            </p>
            <p
              style={{
                margin: '6px 0 0',
                fontSize: 12,
                lineHeight: 1.55,
                color: TEXT.muted,
                fontStyle: 'normal',
              }}
            >
              {t(
                'welcome.lede_en',
                'Free forever · de-identified · IRB-gated · evidence-based · privacy-first · interoperable with any EHR.',
              )}
            </p>
          </header>

          {/* Tabs */}
          <div
            role="tablist"
            aria-label={t('welcome.mode', 'Hali ya kuingia')}
            style={{
              display: 'inline-flex',
              gap: 4,
              padding: 4,
              borderRadius: 999,
              background: 'rgba(255,255,255,0.55)',
              border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.10)}`,
              alignSelf: 'flex-start',
            }}
          >
            {(['ingia', 'jisajili'] as const).map((m) => (
              <button
                key={m}
                role="tab"
                aria-selected={mode === m}
                onClick={() => setMode(m)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 999,
                  border: 'none',
                  background: mode === m ? BRAND.green : 'transparent',
                  color: mode === m ? TEXT.onJewel : TEXT.body,
                  fontSize: 12.5,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  transition: 'background 180ms, color 180ms',
                }}
              >
                {m === 'ingia'
                  ? t('welcome.tab_signin', 'Ingia')
                  : t('welcome.tab_signup', 'Jisajili')}
              </button>
            ))}
          </div>

          {/* Floating inputs */}
          <form onSubmit={onAuthSubmit} style={{ display: 'grid', gap: 16 }}>
            <FloatingField
              id="welcome-email"
              type="email"
              autoComplete="email"
              labelSw="Barua pepe"
              labelEn="Email"
              value={authEmail}
              onChange={setAuthEmail}
            />
            <FloatingField
              id="welcome-pwd"
              type="password"
              autoComplete={mode === 'ingia' ? 'current-password' : 'new-password'}
              labelSw="Nenosiri"
              labelEn="Password"
              value={authPwd}
              onChange={setAuthPwd}
            />
            {err && (
              <div
                role="alert"
                style={{
                  fontSize: 12,
                  color: '#8C2222',
                  background: 'rgba(140,34,34,0.08)',
                  border: '1px solid rgba(140,34,34,0.25)',
                  borderRadius: 8,
                  padding: '6px 10px',
                }}
              >
                {err}
              </div>
            )}
            <button
              type="submit"
              disabled={!hasBackend || busy !== null || !authEmail || !authPwd}
              title={hasBackend ? '' : t('welcome.backend_soon', 'Backend bado haijasanidiwa')}
              style={{
                marginTop: 4,
                padding: '12px 16px',
                borderRadius: 14,
                background: BRAND.green,
                color: TEXT.onJewel,
                border: 'none',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.04em',
                cursor: busy !== null ? 'wait' : 'pointer',
                opacity: !hasBackend || busy !== null || !authEmail || !authPwd ? 0.55 : 1,
              }}
            >
              {busy === 'mpya'
                ? t('welcome.busy', 'Inaingia…')
                : mode === 'ingia'
                  ? t('welcome.cta_signin', 'Ingia')
                  : t('welcome.cta_signup', 'Jisajili')}
            </button>
          </form>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              color: TEXT.muted,
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 700,
            }}
          >
            <span style={{ height: 1, flex: 1, background: hexToRgba(NEUTRAL.ink, 0.12) }} />
            {t('welcome.or_demo', 'Au ingia kama')}
            <span style={{ height: 1, flex: 1, background: hexToRgba(NEUTRAL.ink, 0.12) }} />
          </div>

          {/* Persona quick-chips */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: 8,
            }}
          >
            {PERSONAS.map((p) => (
              <button
                key={p.id}
                onClick={() => onPick(p)}
                aria-label={`Ingia kama ${p.name}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  padding: '8px 10px',
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.55)',
                  border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.10)}`,
                  color: TEXT.body,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 160ms, border-color 160ms, transform 160ms',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.85)'
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor = hexToRgba(p.accent, 0.45)
                  ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.55)'
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor = hexToRgba(NEUTRAL.ink, 0.10)
                  ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: p.accent,
                    color: p.accent === BRAND.yellow ? BRAND.ink : '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    fontFamily: TYPE.serif,
                    fontSize: 10,
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {p.initials}
                </span>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.name.split(' ').slice(0, 2).join(' ')}
                </span>
              </button>
            ))}
          </div>

          <footer
            style={{
              marginTop: 4,
              fontSize: 10,
              letterSpacing: '0.20em',
              textTransform: 'uppercase',
              color: TEXT.muted,
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            Laetoli (T) Ltd
          </footer>
        </section>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .welcome-grid {
            grid-template-columns: 1fr !important;
            padding: 20px 18px 32px !important;
            gap: 8px !important;
          }
          .welcome-grid > section:first-child {
            min-height: 340px !important;
          }
        }
      `}</style>
    </main>
  )
}

interface FloatingFieldProps {
  id: string
  type: string
  autoComplete: string
  labelSw: string
  labelEn: string
  value: string
  onChange: (v: string) => void
}

function FloatingField({ id, type, autoComplete, labelSw, labelEn, value, onChange }: FloatingFieldProps) {
  return (
    <label
      htmlFor={id}
      style={{
        display: 'block',
        position: 'relative',
        borderBottom: `1px solid ${hexToRgba(NEUTRAL.ink, 0.22)}`,
        paddingTop: 16,
        paddingBottom: 8,
      }}
    >
      <span
        style={{
          display: 'block',
          fontSize: 10.5,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: TEXT.muted,
          fontWeight: 700,
          marginBottom: 4,
        }}
      >
        {labelSw} · {labelEn}
      </span>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=""
        style={{
          width: '100%',
          padding: '4px 0 6px',
          background: 'transparent',
          border: 'none',
          color: TEXT.body,
          fontSize: 15,
          fontFamily: 'inherit',
          outline: 'none',
        }}
        onFocus={(e) => {
          const parent = (e.target as HTMLInputElement).parentElement
          if (parent) parent.style.borderBottomColor = BRAND.green
        }}
        onBlur={(e) => {
          const parent = (e.target as HTMLInputElement).parentElement
          if (parent) parent.style.borderBottomColor = hexToRgba(NEUTRAL.ink, 0.22)
        }}
      />
    </label>
  )
}
