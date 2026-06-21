import { useMemo, useState } from 'react'
import { NEUTRAL, CREAM, TEXT, RADII, TYPE, hexToRgba } from '../../../lib/glass'
import Filters, { DEFAULT_FILTERS, type FilterState } from '../components/Filters'
import ProviderCard from '../components/ProviderCard'
import { PROVIDERS } from '../data/providers'
import { applyFilters, sortProviders, type SortKey } from '../lib/filter'

export default function GunduaList() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [sort, setSort] = useState<SortKey>('relevance')
  const results = useMemo(
    () => sortProviders(applyFilters(PROVIDERS, filters), sort),
    [filters, sort],
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
      <h1
        style={{
          fontFamily: TYPE.serif,
          fontSize: 32,
          letterSpacing: TYPE.tighterTrack,
          margin: '0 0 16px',
        }}
      >
        Orodha ya Wataalamu
      </h1>

      <Filters value={filters} onChange={setFilters} />

      <div
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          margin: '18px 0 12px',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ color: TEXT.muted, fontSize: 13 }}>
          {results.length} matokeo
        </span>
        <div style={{ flex: 1 }} />
        <label htmlFor="srt" style={{ fontSize: 12, color: TEXT.muted }}>
          Panga kwa:
        </label>
        <select
          id="srt"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          style={{
            padding: '8px 12px',
            borderRadius: RADII.chip,
            background: CREAM.milk,
            border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.22)}`,
            color: TEXT.body,
            fontFamily: TYPE.sans,
            fontSize: 13,
          }}
        >
          <option value="relevance">Umuhimu</option>
          <option value="rating">Kiwango cha juu</option>
          <option value="fee_low">Ada — chini</option>
          <option value="fee_high">Ada — juu</option>
        </select>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 14,
        }}
      >
        {results.map((p) => (
          <ProviderCard key={p.id} provider={p} />
        ))}
      </div>
    </div>
  )
}
