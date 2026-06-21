import { useEffect, useRef, useState } from 'react'
import { BRAND, CREAM, TEXT, TYPE } from '../lib/glass'

/**
 * CinematicIntro — a single short orange TBHOS slide on cream.
 *
 * 1.5s total: the wordmark rises in, holds, then fades. The screen behind
 * remains cream the whole time; no chrome, no flag bar, no compass. Used
 * once per browser session before the entrance reveals.
 */

const DURATION_MS = 1500
const SESSION_KEY = 'tumaini.intro.played.v1'

export interface CinematicIntroProps {
  onComplete: () => void
}

export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [reduced, setReduced] = useState(false)
  const completedRef = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => finish(), reduced ? 450 : DURATION_MS)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced])

  const finish = () => {
    if (completedRef.current) return
    completedRef.current = true
    try { sessionStorage.setItem(SESSION_KEY, '1') } catch { /* noop */ }
    onComplete()
  }

  return (
    <div
      role="presentation"
      onClick={finish}
      onKeyDown={finish}
      style={{
        position: 'fixed',
        inset: 0,
        background: CREAM.milk,
        zIndex: 9999,
        display: 'grid',
        placeItems: 'center',
        cursor: 'pointer',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          padding: '0 24px',
          animation: reduced
            ? 'none'
            : `splashIn 600ms cubic-bezier(.16,1,.3,1) both, splashOut 400ms ${DURATION_MS - 400}ms cubic-bezier(.45,.05,.55,.95) forwards`,
        }}
      >
        <div
          style={{
            fontFamily: TYPE.serif,
            fontSize: 'clamp(72px, 14vw, 200px)',
            fontWeight: 800,
            color: BRAND.creamOrange,
            letterSpacing: '-3px',
            lineHeight: 0.92,
            textShadow:
              '0 1px 0 rgba(255,255,255,0.98), 0 -1px 1px rgba(11,9,8,0.28), 0 0 2px rgba(11,9,8,0.14)',
          }}
        >
          TBHOS
        </div>
        <div
          style={{
            marginTop: 14,
            fontFamily: TYPE.serif,
            fontSize: 'clamp(14px, 1.4vw, 18px)',
            color: TEXT.muted,
            letterSpacing: '0.30em',
            textTransform: 'uppercase',
            fontWeight: 700,
          }}
        >
          Tumaini · Tanzania
        </div>
      </div>

      <style>{`
        @keyframes splashIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes splashOut {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0; transform: scale(0.985); }
        }
      `}</style>
    </div>
  )
}

/** Helper for callers: did the intro already play this session? */
export function introAlreadyPlayed(): boolean {
  try { return sessionStorage.getItem(SESSION_KEY) === '1' } catch { return false }
}
