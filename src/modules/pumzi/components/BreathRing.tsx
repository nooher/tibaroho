import { useEffect, useRef, useState } from 'react'
import { CREAM, JEWEL, TEXT, hexToRgba } from '../../../lib/glass'
import type { PumziSession, PumziPhase } from '../data/sessions'

const PHASE_SW: Record<PumziPhase, string> = {
  inhale: 'Vuta',
  hold: 'Shika',
  exhale: 'Toa',
}

interface Props {
  session: PumziSession
  running: boolean
  onPhaseChange?: (phaseIndex: number, round: number) => void
  onComplete?: () => void
  size?: number
}

interface RingState {
  phaseIndex: number
  round: number
  remainingS: number
  scale: number
}

export function BreathRing({ session, running, onPhaseChange, onComplete, size = 280 }: Props) {
  const [reduced, setReduced] = useState(false)
  const [state, setState] = useState<RingState>({
    phaseIndex: 0,
    round: 1,
    remainingS: session.pattern.seconds[0] ?? 4,
    scale: 1,
  })
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number>(0)
  const phaseRef = useRef<number>(0)
  const roundRef = useRef<number>(1)
  const lastPhaseEmitted = useRef<number>(-1)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!running) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      return
    }
    phaseRef.current = 0
    roundRef.current = 1
    startRef.current = performance.now()

    const { phases, seconds, rounds } = session.pattern

    const tick = (now: number) => {
      const elapsedMs = now - startRef.current
      const phaseSec = seconds[phaseRef.current] ?? 4
      const phaseMs = phaseSec * 1000
      const t = Math.min(1, elapsedMs / phaseMs)
      const phase = phases[phaseRef.current] ?? 'inhale'

      // ease-in-out: 0 -> 1
      const ease = 0.5 - Math.cos(Math.PI * t) / 2
      let scale = 1
      if (phase === 'inhale') scale = 1 + 0.6 * ease
      else if (phase === 'exhale') scale = 1.6 - 0.6 * ease
      else scale = phaseRef.current > 0 && phases[phaseRef.current - 1] === 'inhale' ? 1.6 : 1

      const remainingS = Math.max(0, Math.ceil(phaseSec - elapsedMs / 1000))

      if (lastPhaseEmitted.current !== phaseRef.current) {
        lastPhaseEmitted.current = phaseRef.current
        onPhaseChange?.(phaseRef.current, roundRef.current)
      }

      setState({
        phaseIndex: phaseRef.current,
        round: roundRef.current,
        remainingS,
        scale,
      })

      if (elapsedMs >= phaseMs) {
        phaseRef.current += 1
        if (phaseRef.current >= phases.length) {
          phaseRef.current = 0
          roundRef.current += 1
          if (roundRef.current > rounds) {
            onComplete?.()
            return
          }
        }
        startRef.current = now
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, session.id])

  const phase = session.pattern.phases[state.phaseIndex] ?? 'inhale'
  const label = PHASE_SW[phase]
  const cx = size / 2
  const cy = size / 2
  const r = size * 0.28

  return (
    <div
      role="img"
      aria-label={`Pumzi: ${label}, sekunde ${state.remainingS}, mzunguko ${state.round}`}
      style={{ width: size, height: size, position: 'relative', display: 'grid', placeItems: 'center' }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <circle
          cx={cx}
          cy={cy}
          r={r * 1.6}
          fill="none"
          stroke={hexToRgba(JEWEL.tealMwenza, 0.08)}
          strokeWidth={1}
        />
        <circle
          cx={cx}
          cy={cy}
          r={r * 1.3}
          fill="none"
          stroke={hexToRgba(JEWEL.tealMwenza, 0.12)}
          strokeWidth={1}
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill={CREAM.milk}
          stroke={JEWEL.tealMwenza}
          strokeWidth={2}
          style={{
            transform: reduced ? undefined : `scale(${state.scale})`,
            transformOrigin: `${cx}px ${cy}px`,
            transition: reduced ? undefined : 'transform 60ms linear',
          }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
          color: JEWEL.tealMwenza,
          fontStyle: 'normal',
          pointerEvents: 'none',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: '-0.4px',
              color: JEWEL.tealDeep,
              fontStyle: 'normal',
            }}
          >
            {label}
          </div>
          <div
            style={{
              marginTop: 6,
              fontSize: 18,
              fontWeight: 700,
              color: TEXT.muted,
              fontStyle: 'normal',
            }}
          >
            {state.remainingS}s
          </div>
        </div>
      </div>
    </div>
  )
}

export default BreathRing
