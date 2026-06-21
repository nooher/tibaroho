import { useEffect, useState, useMemo } from 'react'
import { JEWEL, NEUTRAL, RADII, MOTION, TYPE, TEXT, glass, focusRing, hexToRgba } from '../../../lib/glass'
import type { Instrument, Interpretation } from '../data/instruments'
import { Pill } from './Pill'

type Props = {
  instrument: Instrument
  onDone: (result: { answers: number[]; interpret: Interpretation; consent: boolean }) => void
  onCancel?: () => void
}

const DRAFT = (id: string) => `tibaroho:mimi:draft:${id}`

export function AssessmentRunner({ instrument, onDone, onCancel }: Props) {
  const [answers, setAnswers] = useState<number[]>(() => {
    try {
      const raw = localStorage.getItem(DRAFT(instrument.id))
      if (raw) return JSON.parse(raw)
    } catch {/* ignore */}
    return new Array(instrument.items.length).fill(-1)
  })
  const [i, setI] = useState(0)
  const [consent, setConsent] = useState(true)
  const [focused, setFocused] = useState<string | null>(null)

  useEffect(() => {
    try { localStorage.setItem(DRAFT(instrument.id), JSON.stringify(answers)) } catch {/* ignore */}
  }, [answers, instrument.id])

  const total = instrument.items.length
  const done = answers.every((a) => a >= 0)
  const progress = useMemo(
    () => Math.round((answers.filter((a) => a >= 0).length / total) * 100),
    [answers, total],
  )

  const item = instrument.items[i]

  function pick(v: number) {
    const next = [...answers]
    next[i] = v
    setAnswers(next)
    setTimeout(() => {
      if (i < total - 1) setI(i + 1)
    }, 220)
  }

  function finish() {
    const cleaned = answers.map((a) => (a >= 0 ? a : 0))
    const score = instrument.scoring(cleaned)
    const interpret = instrument.interpret(score, cleaned)
    try { localStorage.removeItem(DRAFT(instrument.id)) } catch {/* ignore */}
    onDone({ answers: cleaned, interpret, consent })
  }

  return (
    <section
      aria-label={`Tathmini: ${instrument.name_sw}`}
      style={{
        ...glass(JEWEL.tealRoho, 0.14),
        padding: 28,
        borderRadius: RADII.sheet,
        color: TEXT.body,
        fontFamily: TYPE.sans,
        maxWidth: 720,
        margin: '0 auto',
      }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div>
          <Pill tone="teal">{instrument.domain.toUpperCase()}</Pill>
          <h2 style={{ margin: '8px 0 0', fontFamily: TYPE.serif, fontSize: 24, letterSpacing: TYPE.tighterTrack, lineHeight: TYPE.headLeading }}>
            {instrument.name_sw}
          </h2>
          <p style={{ margin: '4px 0 0', color: TEXT.muted, fontSize: 13 }}>{instrument.name_en}</p>
        </div>
        <div role="status" aria-live="polite" aria-label={`Maendeleo: ${progress}%`} style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: TEXT.muted }}>Swali</div>
          <div style={{ fontFamily: TYPE.serif, fontSize: 28, lineHeight: 1, color: TEXT.heading }}>{i + 1}<span style={{ color: TEXT.muted }}>/{total}</span></div>
        </div>
      </header>

      {/* progress bar */}
      <div
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{
          height: 4, borderRadius: 999, background: hexToRgba(NEUTRAL.ink, 0.10), overflow: 'hidden', margin: '8px 0 28px',
        }}
      >
        <div style={{ height: '100%', width: `${progress}%`, background: JEWEL.goldHope, transition: `width ${MOTION.med}` }} />
      </div>

      {item && (
        <>
          <p
            id={`stem-${item.id}`}
            style={{ fontFamily: TYPE.serif, fontSize: 22, lineHeight: 1.35, letterSpacing: TYPE.tightTrack, margin: '0 0 6px' }}
          >
            {item.stem_sw}
          </p>
          <p style={{ margin: '0 0 22px', color: TEXT.muted, fontSize: 13 }}>{item.stem_en}</p>

          <div role="radiogroup" aria-labelledby={`stem-${item.id}`} style={{ display: 'grid', gap: 10 }}>
            {item.scale.map((opt) => {
              const selected = answers[i] === opt.value
              const id = `${item.id}-${opt.value}`
              return (
                <button
                  key={id}
                  id={id}
                  role="radio"
                  aria-checked={selected}
                  onClick={() => pick(opt.value)}
                  onFocus={() => setFocused(id)}
                  onBlur={() => setFocused(null)}
                  style={{
                    textAlign: 'left',
                    padding: '14px 18px',
                    borderRadius: RADII.card,
                    background: selected ? JEWEL.tealRoho : 'rgba(250,245,229,0.85)',
                    border: `1px solid ${selected ? JEWEL.goldHope : 'rgba(11,9,8,0.10)'}`,
                    color: selected ? TEXT.onJewel : TEXT.body,
                    fontSize: 15,
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: `background ${MOTION.fast}, border ${MOTION.fast}, transform ${MOTION.fast}`,
                    transform: selected ? 'scale(0.995)' : 'scale(1)',
                    ...(focused === id ? focusRing(JEWEL.goldHope) : {}),
                  }}
                >
                  <span style={{ display: 'inline-block', minWidth: 28, fontFamily: TYPE.serif, color: selected ? TEXT.onJewel : TEXT.muted }}>{opt.value}</span>
                  <span>{opt.label_sw}</span>
                  <span style={{ float: 'right', color: selected ? TEXT.onJewel : TEXT.muted, fontSize: 12 }}>{opt.label_en}</span>
                </button>
              )
            })}
          </div>
        </>
      )}

      <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginTop: 28 }}>
        <button
          type="button"
          onClick={() => (i > 0 ? setI(i - 1) : onCancel?.())}
          aria-label={i > 0 ? 'Rudi swali la nyuma' : 'Ghairi tathmini'}
          style={{
            padding: '10px 18px',
            borderRadius: RADII.chip,
            background: 'transparent',
            border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.22)}`,
            color: TEXT.body,
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          {i > 0 ? '← Nyuma' : 'Ghairi'}
        </button>

        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: TEXT.muted }}>
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            aria-label="Nakubali kuhifadhi matokeo kwenye kifaa changu"
          />
          Hifadhi kwenye kifaa changu
        </label>

        <button
          type="button"
          onClick={done ? finish : () => setI(Math.min(total - 1, i + 1))}
          aria-label={done ? 'Maliza tathmini' : 'Endelea'}
          style={{
            padding: '12px 22px',
            borderRadius: RADII.chip,
            background: done ? JEWEL.goldHope : JEWEL.tealRoho,
            border: 'none',
            color: done ? NEUTRAL.ink : TEXT.onJewel,
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: 14,
            letterSpacing: '-0.2px',
          }}
        >
          {done ? 'Maliza →' : 'Endelea →'}
        </button>
      </footer>
    </section>
  )
}
