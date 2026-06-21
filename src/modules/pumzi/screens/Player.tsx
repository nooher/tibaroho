import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CREAM, JEWEL, NEUTRAL, TEXT, hexToRgba, focusRing } from '../../../lib/glass'
import { speak, stopSpeaking, voiceSupported } from '../../../lib/rafiki/voice'
import { BreathRing } from '../components/BreathRing'
import { getSessionById, PUMZI_SESSIONS, type PumziPhase } from '../data/sessions'

const PHASE_CUE_SW: Record<PumziPhase, string> = {
  inhale: 'Vuta pumzi',
  hold: 'Shika',
  exhale: 'Toa polepole',
}

export default function Player() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const session = (id && getSessionById(id)) || PUMZI_SESSIONS[0]
  const [running, setRunning] = useState(true)
  const [voiceOn, setVoiceOn] = useState(true)
  const [round, setRound] = useState(1)
  const [done, setDone] = useState(false)

  useEffect(() => {
    return () => stopSpeaking()
  }, [])

  const onPhaseChange = (phaseIndex: number, r: number) => {
    setRound(r)
    if (!voiceOn) return
    const phase = session.pattern.phases[phaseIndex] ?? 'inhale'
    speak(PHASE_CUE_SW[phase], 'sw')
  }

  const supported = voiceSupported()

  return (
    <div
      style={{
        minHeight: '100vh',
        background: CREAM.ivory,
        padding: '24px 16px 48px',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 560,
          display: 'grid',
          gap: 24,
          placeItems: 'center',
          textAlign: 'center',
        }}
      >
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/pumzi')}
            aria-label="Rudi kwenye orodha ya Pumzi"
            style={{
              background: CREAM.milk,
              color: JEWEL.tealMwenza,
              border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.18)}`,
              borderRadius: 999,
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: 700,
              fontStyle: 'normal',
              cursor: 'pointer',
            }}
            onFocus={(e) => Object.assign(e.currentTarget.style, focusRing(JEWEL.tealMwenza))}
            onBlur={(e) => { e.currentTarget.style.outline = 'none' }}
          >
            ← Rudi
          </button>

          <button
            onClick={() => {
              setVoiceOn((v) => {
                if (v) stopSpeaking()
                return !v
              })
            }}
            aria-pressed={voiceOn}
            aria-label={voiceOn ? 'Zima sauti ya muongozaji' : 'Washa sauti ya muongozaji'}
            disabled={!supported.speak}
            style={{
              background: voiceOn ? JEWEL.tealMwenza : CREAM.milk,
              color: voiceOn ? CREAM.cream : JEWEL.tealMwenza,
              border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.18)}`,
              borderRadius: 999,
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: 700,
              fontStyle: 'normal',
              cursor: supported.speak ? 'pointer' : 'not-allowed',
              opacity: supported.speak ? 1 : 0.5,
            }}
          >
            {voiceOn ? 'Sauti: Imewashwa' : 'Sauti: Imezimwa'}
          </button>
        </div>

        <div>
          <h1
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: 32,
              lineHeight: 1.1,
              color: JEWEL.tealDeep,
              margin: 0,
              letterSpacing: '-0.4px',
              fontWeight: 800,
              fontStyle: 'normal',
            }}
          >
            {session.name_sw}
          </h1>
          <div
            style={{
              marginTop: 6,
              fontSize: 13,
              color: TEXT.muted,
              fontStyle: 'normal',
            }}
          >
            {session.name_en}
          </div>
        </div>

        <BreathRing
          session={session}
          running={running && !done}
          onPhaseChange={onPhaseChange}
          onComplete={() => {
            setDone(true)
            setRunning(false)
            if (voiceOn) speak('Umemaliza. Asante.', 'sw')
          }}
          size={Math.min(320, typeof window !== 'undefined' ? window.innerWidth - 80 : 320)}
        />

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
          {Array.from({ length: session.pattern.rounds }).map((_, i) => (
            <span
              key={i}
              aria-hidden
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: i < round ? JEWEL.tealMwenza : hexToRgba(NEUTRAL.ink, 0.18),
              }}
            />
          ))}
        </div>
        <div
          style={{
            fontSize: 13,
            color: TEXT.muted,
            fontStyle: 'normal',
          }}
        >
          Mzunguko {round} / {session.pattern.rounds}
        </div>

        {done && (
          <div
            style={{
              padding: 16,
              borderRadius: 16,
              background: CREAM.milk,
              border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.1)}`,
              color: NEUTRAL.ink,
              fontStyle: 'normal',
            }}
          >
            <strong style={{ color: JEWEL.tealDeep }}>Umemaliza.</strong>{' '}
            Pumua kawaida sasa. Hongera kwa kujitunza.
            <div style={{ marginTop: 12 }}>
              <button
                onClick={() => {
                  setDone(false)
                  setRunning(true)
                  setRound(1)
                }}
                style={{
                  background: JEWEL.tealMwenza,
                  color: CREAM.cream,
                  border: 'none',
                  borderRadius: 999,
                  padding: '10px 22px',
                  fontWeight: 700,
                  fontSize: 13,
                  fontStyle: 'normal',
                  cursor: 'pointer',
                }}
              >
                Rudia
              </button>
            </div>
          </div>
        )}

        <Link
          to="/pumzi"
          style={{
            fontSize: 12,
            color: TEXT.hint,
            textDecoration: 'none',
            fontStyle: 'normal',
          }}
        >
          {session.evidence_citation}
        </Link>
      </div>
    </div>
  )
}
