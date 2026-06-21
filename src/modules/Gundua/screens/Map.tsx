import { useMemo, useState } from 'react'
import { JEWEL, NEUTRAL, TEXT, RADII, TYPE, hexToRgba } from '../../../lib/glass'
import Filters, { DEFAULT_FILTERS, type FilterState } from '../components/Filters'
import ProviderCard from '../components/ProviderCard'
import { PROVIDERS, type Provider } from '../data/providers'
import { applyFilters } from '../lib/filter'

/**
 * Tanzania map view — inline SVG silhouette (simplified outline of the
 * mainland + Zanzibar/Pemba) with provider markers placed by lat/lng.
 * Click marker → mini ProviderCard popover.
 */

// Approximate bounds for Tanzania (mainland + Zanzibar archipelago).
const LAT_MIN = -11.8 // south
const LAT_MAX = -0.9 // north
const LNG_MIN = 29.2 // west
const LNG_MAX = 40.7 // east

const VW = 600
const VH = 600

function project(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * VW
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * VH
  return { x, y }
}

/** Simplified Tanzania mainland outline — coarse but recognizable. */
const TZ_PATH =
  'M 95 105 L 140 75 L 215 60 L 295 70 L 360 95 L 425 120 L 475 165 L 510 215 L 525 280 L 530 360 L 510 420 L 470 470 L 415 510 L 350 545 L 285 555 L 215 540 L 150 510 L 105 470 L 78 415 L 65 355 L 60 295 L 70 230 L 80 165 L 95 105 Z'

export default function GunduaMap() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const filtered = useMemo(() => applyFilters(PROVIDERS, filters), [filters])
  const selected: Provider | undefined = selectedId
    ? PROVIDERS.find((p) => p.id === selectedId)
    : undefined

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '32px 20px 64px',
        color: TEXT.body,
        fontFamily: TYPE.sans,
      }}
    >
      <h1
        style={{
          fontFamily: TYPE.serif,
          fontSize: 32,
          letterSpacing: TYPE.tighterTrack,
          margin: '0 0 16px',
        }}
      >
        Ramani ya Tanzania
      </h1>
      <Filters value={filters} onChange={setFilters} />

      <div
        style={{
          marginTop: 18,
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap: 16,
        }}
      >
        <div
          style={{
            background: 'rgba(250,245,229,0.85)',
            border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.10)}`,
            borderRadius: RADII.sheet,
            padding: 12,
            position: 'relative',
          }}
        >
          <svg
            viewBox={`0 0 ${VW} ${VH}`}
            width="100%"
            style={{ display: 'block', maxHeight: 560 }}
            aria-label={`Ramani ya Tanzania yenye wataalamu ${filtered.length}`}
            role="img"
          >
            <defs>
              <radialGradient id="lakeFill" cx="0.3" cy="0.3" r="0.7">
                <stop offset="0%" stopColor={hexToRgba(JEWEL.indigoWisdom, 0.55)} />
                <stop offset="100%" stopColor={hexToRgba(JEWEL.indigoWisdom, 0.25)} />
              </radialGradient>
            </defs>
            <path
              d={TZ_PATH}
              fill={hexToRgba(JEWEL.tealRoho, 0.35)}
              stroke={hexToRgba(JEWEL.goldSoft, 0.5)}
              strokeWidth={1.5}
            />
            {/* Lake Victoria (north) */}
            <ellipse cx={245} cy={95} rx={55} ry={28} fill="url(#lakeFill)" />
            {/* Lake Tanganyika (west) */}
            <ellipse cx={88} cy={300} rx={14} ry={75} fill="url(#lakeFill)" />
            {/* Lake Nyasa (south) */}
            <ellipse cx={200} cy={500} rx={12} ry={55} fill="url(#lakeFill)" />
            {/* Zanzibar */}
            <ellipse
              cx={project(-6.16, 39.2).x}
              cy={project(-6.16, 39.2).y}
              rx={9}
              ry={18}
              fill={hexToRgba(JEWEL.tealRoho, 0.35)}
              stroke={hexToRgba(JEWEL.goldSoft, 0.5)}
              strokeWidth={1}
            />
            {/* Pemba */}
            <ellipse
              cx={project(-5.1, 39.78).x}
              cy={project(-5.1, 39.78).y}
              rx={6}
              ry={12}
              fill={hexToRgba(JEWEL.tealRoho, 0.35)}
              stroke={hexToRgba(JEWEL.goldSoft, 0.5)}
              strokeWidth={1}
            />

            {filtered.map((p) => {
              const { x, y } = project(p.location.lat, p.location.lng)
              const isSel = p.id === selectedId
              return (
                <g
                  key={p.id}
                  transform={`translate(${x}, ${y})`}
                  onClick={() => setSelectedId(p.id)}
                  style={{ cursor: 'pointer' }}
                  tabIndex={0}
                  role="button"
                  aria-label={`${p.honorific} ${p.name}, ${p.location.city}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setSelectedId(p.id)
                  }}
                >
                  <circle
                    r={isSel ? 11 : 7}
                    fill={hexToRgba(isSel ? JEWEL.goldHope : JEWEL.tealRoho, 0.95)}
                    stroke={JEWEL.goldSoft}
                    strokeWidth={isSel ? 2 : 1.2}
                  />
                  <circle r={2.4} fill={NEUTRAL.paper} />
                </g>
              )
            })}
          </svg>

          {selected && (
            <div
              role="dialog"
              aria-label={`Wasifu mfupi wa ${selected.name}`}
              style={{
                position: 'absolute',
                left: 12,
                right: 12,
                bottom: 12,
                maxWidth: 380,
                margin: '0 auto',
              }}
            >
              <ProviderCard provider={selected} compact />
              <button
                onClick={() => setSelectedId(null)}
                aria-label="Funga"
                style={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  background: hexToRgba(JEWEL.maroonCrisis, 0.7),
                  color: NEUTRAL.paper,
                  border: 'none',
                  borderRadius: 999,
                  width: 26,
                  height: 26,
                  cursor: 'pointer',
                  fontSize: 14,
                }}
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
