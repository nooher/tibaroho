import { useMemo, useState } from 'react'
import { Card, Filter, Table, Td } from '../../_shared/Layout'
import { JEWEL, NEUTRAL, TEXT, hexToRgba } from '../../../lib/glass'
import { REGIONS, phq9Color } from '../data'

type SortKey = 'name' | 'phq9Mean' | 'screeningReach' | 'treatmentEngagement' | 'remission12wk' | 'suicideRate' | 'providerDensity'

export default function SeraRegions() {
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<SortKey>('phq9Mean')
  const [desc, setDesc] = useState(true)

  const rows = useMemo(() => {
    const filtered = REGIONS.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()))
    return [...filtered].sort((a, b) => {
      const av = a[sort] as number | string
      const bv = b[sort] as number | string
      if (typeof av === 'number' && typeof bv === 'number') return desc ? bv - av : av - bv
      return desc ? String(bv).localeCompare(String(av)) : String(av).localeCompare(String(bv))
    })
  }, [q, sort, desc])

  function toggleSort(k: SortKey) {
    if (sort === k) setDesc((d) => !d)
    else { setSort(k); setDesc(true) }
  }

  const cols: { key: SortKey; label: string }[] = [
    { key: 'name', label: 'Mkoa' },
    { key: 'phq9Mean', label: 'PHQ-9' },
    { key: 'screeningReach', label: 'Tathmini %' },
    { key: 'treatmentEngagement', label: 'Tiba %' },
    { key: 'remission12wk', label: 'Remission 12wk %' },
    { key: 'suicideRate', label: 'Kujidhuru /100k' },
    { key: 'providerDensity', label: 'Wataalam /100k' },
  ]

  return (
    <>
      <Filter value={q} onChange={setQ} placeholder="Tafuta mkoa…" />
      <Card title={`Mlinganisho wa Mikoa (${rows.length})`} accent={JEWEL.indigoWisdom}>
        <Table headers={cols.map((c) => c.label)}>
          {rows.map((r) => (
            <tr key={r.id}>
              {cols.map((c) => {
                const v = r[c.key]
                if (c.key === 'name') {
                  return (
                    <Td key={c.key}>
                      <span style={{
                        display: 'inline-block', width: 10, height: 10, borderRadius: 999,
                        background: phq9Color(r.phq9Mean), marginRight: 8, verticalAlign: 'middle',
                      }} />
                      <strong style={{ color: JEWEL.tealDeep }}>{r.name}</strong>
                    </Td>
                  )
                }
                return <Td key={c.key} style={{ color: TEXT.body, fontVariantNumeric: 'tabular-nums' }}>{typeof v === 'number' ? v.toFixed(1) : v}</Td>
              })}
            </tr>
          ))}
        </Table>
        <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {cols.slice(1).map((c) => (
            <button
              key={c.key}
              onClick={() => toggleSort(c.key)}
              style={{
                padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                background: sort === c.key ? JEWEL.indigoWisdom : 'transparent',
                color: sort === c.key ? TEXT.onJewel : TEXT.muted,
                border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.18)}`,
                cursor: 'pointer',
              }}
            >
              Panga: {c.label}{sort === c.key ? (desc ? ' ↓' : ' ↑') : ''}
            </button>
          ))}
        </div>
      </Card>
    </>
  )
}
