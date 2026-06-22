import { useEffect, useState } from 'react'
import { useLang } from '../lib/i18n/Provider'

/**
 * TumainiCompass — Tanzania at the centre, four flag-coloured discs
 * drifting around her on coprime SMIL orbits.
 *
 * Matches THOS's TanzaniaOrbit pattern verbatim: SVG-native
 * <animateTransform> for the four discs (works in every browser, smoothest
 * possible orbit), CSS keyframe breath on the country. Coprime periods
 * 11/14/12/16 s so the four discs never visually lock.
 */
export default function TumainiCompass({ size = 480 }: { size?: number }) {
  const { t } = useLang()
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(m.matches)
    const onChange = () => setReduced(m.matches)
    m.addEventListener?.('change', onChange)
    return () => m.removeEventListener?.('change', onChange)
  }, [])

  const VBW = 700
  const VBH = 560
  const cx = 350
  const cy = 280

  const INK    = '#1A3E44'
  const YELLOW = '#FCD116'
  const GREEN  = '#1EB53A'
  const BLUE   = '#00A3DD'
  const BLACK  = '#000000'

  const DISCS = [
    { id: 'yellow', x: cx,       y: cy - 240, r: 22, period: 11, dir:  1, fill: YELLOW },
    { id: 'green',  x: cx + 256, y: cy,       r: 24, period: 14, dir: -1, fill: GREEN  },
    { id: 'blue',   x: cx,       y: cy + 240, r: 22, period: 12, dir:  1, fill: BLUE   },
    { id: 'black',  x: cx - 248, y: cy,       r: 24, period: 16, dir: -1, fill: BLACK  },
  ] as const

  const heightPx = Math.round((size * VBH) / VBW)

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${VBW} ${VBH}`}
      width={size}
      height={heightPx}
      role="img"
      aria-label={t('compass.aria', 'TABHOS — Tanzania na mizunguko minne ya rangi za bendera')}
      style={{ display: 'block', overflow: 'visible', width: '100%', maxWidth: size, height: 'auto', marginInline: 'auto' }}
    >
      <style>{`
        @keyframes tumaini-breath {
          0%,100% { transform: scale(1.000); opacity: 0.96; }
          45%     { transform: scale(1.018); opacity: 1.00; }
          60%     { transform: scale(1.018); opacity: 1.00; }
        }
        .tumaini-pulse {
          transform-origin: ${cx}px ${cy}px;
          animation: tumaini-breath 5.5s ease-in-out infinite;
          will-change: transform, opacity;
        }
        ${reduced
          ? `.tumaini-pulse { animation: none !important; transform: none !important; opacity: 1 !important; }`
          : ''}
      `}</style>

      <defs>
        <filter id="tc-disc-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
          <feOffset dy="1"/>
          <feComponentTransfer><feFuncA type="linear" slope="0.35"/></feComponentTransfer>
          <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Faint orbital rings */}
      <g opacity="0.08" stroke={INK} strokeWidth="0.5" fill="none">
        <ellipse cx={cx} cy={cy} rx="240" ry="240"/>
        <ellipse cx={cx} cy={cy} rx="256" ry="256"/>
      </g>

      {/* Tanzania map — breathes via CSS keyframe */}
      <g className="tumaini-pulse">
        <image
          href="/brand/tanzania.png"
          x={cx - 160}
          y={cy - 160}
          width={320}
          height={320}
          preserveAspectRatio="xMidYMid meet"
          opacity={0.95}
        />
      </g>

      {/* Four orbiting discs — SVG-native SMIL rotation around (cx, cy). */}
      {DISCS.map(d => {
        const to = `${d.dir === 1 ? 360 : -360} ${cx} ${cy}`
        return (
          <g key={d.id}>
            {!reduced && (
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from={`0 ${cx} ${cy}`}
                to={to}
                dur={`${d.period}s`}
                repeatCount="indefinite"
                additive="sum"
              />
            )}
            <circle
              cx={d.x} cy={d.y} r={d.r}
              fill={d.fill}
              filter="url(#tc-disc-shadow)"
            />
            <circle
              cx={d.x - d.r * 0.32}
              cy={d.y - d.r * 0.36}
              r={d.r * 0.18}
              fill="#FFFFFF"
              opacity="0.38"
            />
          </g>
        )
      })}
    </svg>
  )
}
