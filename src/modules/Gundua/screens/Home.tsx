import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { JEWEL, NEUTRAL, TEXT, RADII, TYPE, hexToRgba } from '../../../lib/glass'
import Filters, { DEFAULT_FILTERS, type FilterState } from '../components/Filters'
import ProviderCard from '../components/ProviderCard'
import { ArchitectureBadge } from '../../../components/ArchitectureBadge'
import { PROVIDERS } from '../data/providers'
import { applyFilters, sortProviders } from '../lib/filter'

/**
 * Gundua Home — discovery entry point.
 * Hero with search; filters; relevance-sorted snapshot; CTAs to Map and full List.
 */
export default function GunduaHome() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const matches = useMemo(
    () => sortProviders(applyFilters(PROVIDERS, filters), 'relevance'),
    [filters],
  )

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
      <header style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontFamily: TYPE.serif,
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 600,
            letterSpacing: TYPE.tighterTrack,
            margin: 0,
            lineHeight: TYPE.headLeading,
            color: TEXT.heading,
          }}
        >
          Gundua mtaalamu wa moyo wako.
        </h1>
        <p
          style={{
            fontFamily: TYPE.serif,
            fontSize: 17,
            color: TEXT.muted,
            margin: '8px 0 0',
            maxWidth: 640,
            lineHeight: TYPE.bodyLeading,
          }}
        >
          Madaktari, wanasaikolojia, washauri wa kijamii na wa kidini —
          waliothibitishwa, karibu na wewe, kwa lugha unayoielewa.
        </p>
        <div style={{ marginTop: 12 }}>
          <ArchitectureBadge moduleSlug="gundua" />
        </div>
      </header>

      <Filters value={filters} onChange={setFilters} />

      <div
        style={{
          display: 'flex',
          gap: 12,
          margin: '20px 0 14px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ color: TEXT.muted, fontSize: 13 }}>
          {matches.length} wataalamu wamepatikana
        </span>
        <div style={{ flex: 1 }} />
        <Link
          to="/gundua/list"
          style={btnStyle(JEWEL.tealRoho)}
          aria-label="Tazama orodha kamili"
        >
          Orodha kamili
        </Link>
        <Link
          to="/gundua/map"
          style={btnStyle(JEWEL.indigoWisdom)}
          aria-label="Tazama ramani ya Tanzania"
        >
          Ramani ya Tanzania
        </Link>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 14,
        }}
      >
        {matches.slice(0, 9).map((p) => (
          <ProviderCard key={p.id} provider={p} />
        ))}
      </div>

      {matches.length === 0 && (
        <div
          style={{
            padding: 28,
            background: 'rgba(250,245,229,0.85)',
            border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.10)}`,
            borderRadius: RADII.sheet,
            textAlign: 'center',
            color: TEXT.body,
          }}
        >
          Hakuna mtaalamu aliyepatikana kwa vichujio hivi. Jaribu kupanua mkoa au
          ondoa kichujio cha bima.
        </div>
      )}
    </div>
  )
}

function btnStyle(jewel: string) {
  return {
    padding: '9px 16px',
    borderRadius: RADII.chip,
    background: jewel,
    border: `1px solid ${jewel}`,
    color: TEXT.onJewel,
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: 0.2,
  } as const
}
