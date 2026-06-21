import { useEffect, useState } from 'react'
import { TZ_FLAG } from '../lib/glass'

/**
 * EntranceBrain — persistent centerpiece for the sign-in screen.
 *
 * Real anatomical brain photograph throbbing gently (CSS keyframe scale).
 * Around it, an SVG overlay carries the orbital balls and the expanding
 * wave rings — all animated via SMIL <animateTransform> / <animate>, the
 * same pattern THOS uses smoothly across browsers.
 *
 * SMIL was chosen over CSS-on-divs because the user reported CSS
 * transforms on HTML wrappers were freezing on their machine; SMIL on
 * SVG carries no such issue (THOS proves it). Mixing HTML img + SVG
 * overlay keeps each engine in its sweet spot.
 */
export default function EntranceBrain({ size = 260 }: { size?: number }) {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])

  // SVG canvas — generous space for waves + outer orbit.
  const FRAME = Math.max(560, Math.round(size * 2.6))
  const cx = FRAME / 2
  const cy = FRAME / 2

  // Orbits — coprime periods so balls never lock visually.
  const ORBITS = [
    { color: TZ_FLAG.green,  radius: Math.round(size * 0.65), period: 9,  dir:  1 },
    { color: TZ_FLAG.yellow, radius: Math.round(size * 0.82), period: 11, dir: -1 },
    { color: TZ_FLAG.black,  radius: Math.round(size * 0.98), period: 13, dir:  1 },
    { color: TZ_FLAG.blue,   radius: Math.round(size * 1.14), period: 15, dir: -1 },
  ] as const
  const BALL = Math.round(size * 0.07)
  const PHASES = [0, 90, 180, 270]

  // Wave rings — start at brain radius, expand outward and fade.
  const WAVES = [TZ_FLAG.green, TZ_FLAG.yellow, TZ_FLAG.black, TZ_FLAG.blue]
  const WAVE_DUR = 3.2
  const WAVE_BEGIN = [0, 0.8, 1.6, 2.4]
  const WAVE_R_FROM = size / 2
  const WAVE_R_TO   = size * 1.4

  return (
    <div
      data-eb
      aria-hidden
      style={{
        position: 'relative',
        width: FRAME,
        height: FRAME,
        display: 'grid',
        placeItems: 'center',
      }}
    >
      {/* SVG overlay — waves + orbital balls. Sits ABOVE the brain. */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${FRAME} ${FRAME}`}
        width={FRAME}
        height={FRAME}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}
        aria-hidden
      >
        {/* Expanding wave rings */}
        {WAVES.map((c, i) => (
          <circle
            key={`wave-${i}`}
            cx={cx} cy={cy}
            r={WAVE_R_FROM}
            fill="none"
            stroke={c}
            strokeWidth={2}
            opacity={0}
          >
            {!reduced && (
              <>
                <animate
                  attributeName="r"
                  from={WAVE_R_FROM}
                  to={WAVE_R_TO}
                  dur={`${WAVE_DUR}s`}
                  begin={`${WAVE_BEGIN[i]}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.55;0.10;0"
                  keyTimes="0;0.7;1"
                  dur={`${WAVE_DUR}s`}
                  begin={`${WAVE_BEGIN[i]}s`}
                  repeatCount="indefinite"
                />
              </>
            )}
          </circle>
        ))}

        {/* Orbital balls — each in its own rotating group around (cx, cy). */}
        {ORBITS.map((o, i) => {
          const to = `${o.dir === 1 ? 360 : -360} ${cx} ${cy}`
          const ballX = cx + o.radius
          const ballY = cy
          return (
            <g key={`orbit-${i}`} transform={`rotate(${PHASES[i]} ${cx} ${cy})`}>
              {!reduced && (
                <animateTransform
                  attributeName="transform"
                  attributeType="XML"
                  type="rotate"
                  from={`0 ${cx} ${cy}`}
                  to={to}
                  dur={`${o.period}s`}
                  repeatCount="indefinite"
                  additive="sum"
                />
              )}
              <circle
                cx={ballX}
                cy={ballY}
                r={BALL / 2}
                fill={o.color}
                style={{ filter: `drop-shadow(0 0 8px ${o.color}88)` }}
              />
            </g>
          )
        })}
      </svg>

      {/* Brain — HTML img, CSS keyframe breath. Simple scale → buttery. */}
      <div
        style={{
          width: size,
          height: size,
          display: 'grid',
          placeItems: 'center',
          animation: reduced ? 'none' : 'eb-breath 2.6s cubic-bezier(.45,.05,.55,.95) infinite',
          willChange: 'transform',
          zIndex: 2,
          position: 'relative',
        }}
      >
        <img
          src="/brand/rafiki.png"
          width={size}
          height={size}
          alt=""
          draggable={false}
          style={{
            display: 'block',
            width: size,
            height: size,
            objectFit: 'contain',
            userSelect: 'none',
            pointerEvents: 'none',
            filter: 'drop-shadow(0 12px 28px rgba(11,9,8,0.18))',
          }}
        />
      </div>

      <style>{`
        @keyframes eb-breath {
          0%,100% { transform: scale(1.000); }
          50%     { transform: scale(1.045); }
        }
      `}</style>
    </div>
  )
}
