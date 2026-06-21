import type React from 'react'
import { useMemo, useState } from 'react'
import { RADII, TEXT, CREAM } from '../../../lib/glass'

export interface Column<T> {
  key: keyof T & string
  label: string
  render?: (row: T) => React.ReactNode
  sortable?: boolean
  width?: number | string
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  pageSize?: number
  emptyText?: string
  onRowClick?: (row: T) => void
  searchKeys?: (keyof T & string)[]
  filters?: { label: string; key: keyof T & string; options: string[] }[]
}

export default function DataTable<T extends { id?: string }>(props: DataTableProps<T>): React.JSX.Element {
  const { columns, rows, pageSize = 10, emptyText = 'Hakuna data', onRowClick, searchKeys, filters } = props
  const [q, setQ] = useState('')
  const [page, setPage] = useState(0)
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [filterVals, setFilterVals] = useState<Record<string, string>>({})

  const filtered = useMemo(() => {
    let r = rows
    if (q && searchKeys) {
      const lo = q.toLowerCase()
      r = r.filter((row) => searchKeys.some((k) => String((row as Record<string, unknown>)[k] ?? '').toLowerCase().includes(lo)))
    }
    for (const [k, v] of Object.entries(filterVals)) {
      if (!v) continue
      r = r.filter((row) => String((row as Record<string, unknown>)[k] ?? '') === v)
    }
    if (sortKey) {
      r = [...r].sort((a, b) => {
        const av = (a as Record<string, unknown>)[sortKey]
        const bv = (b as Record<string, unknown>)[sortKey]
        const cmp = String(av ?? '').localeCompare(String(bv ?? ''))
        return sortDir === 'asc' ? cmp : -cmp
      })
    }
    return r
  }, [rows, q, searchKeys, filterVals, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageRows = filtered.slice(page * pageSize, (page + 1) * pageSize)

  const inputStyle: React.CSSProperties = {
    padding: '8px 12px', borderRadius: RADII.chip,
    background: CREAM.milk,
    border: `1px solid rgba(11,9,8,0.22)`,
    color: TEXT.body, fontSize: 13, outline: 'none',
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        {searchKeys ? (
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(0) }}
            placeholder="Tafuta…"
            style={{ ...inputStyle, flex: '1 1 240px' }}
          />
        ) : null}
        {filters?.map((f) => (
          <select
            key={f.key}
            value={filterVals[f.key] ?? ''}
            onChange={(e) => { setFilterVals({ ...filterVals, [f.key]: e.target.value }); setPage(0) }}
            style={inputStyle}
          >
            <option value="">{f.label}: zote</option>
            {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        ))}
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, color: TEXT.body }}>
          <thead>
            <tr>{columns.map((c) => (
              <th
                key={c.key}
                onClick={() => {
                  if (!c.sortable) return
                  if (sortKey === c.key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
                  else { setSortKey(c.key); setSortDir('asc') }
                }}
                style={{
                  textAlign: 'left', padding: '10px 12px', fontSize: 10, fontWeight: 700,
                  letterSpacing: 1.4, textTransform: 'uppercase',
                  color: TEXT.muted,
                  borderBottom: `1px solid rgba(11,9,8,0.10)`,
                  cursor: c.sortable ? 'pointer' : 'default',
                  width: c.width,
                }}
              >
                {c.label}{c.sortable && sortKey === c.key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}
              </th>
            ))}</tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr><td colSpan={columns.length} style={{ padding: 24, textAlign: 'center', color: TEXT.muted }}>{emptyText}</td></tr>
            ) : pageRows.map((row, i) => (
              <tr
                key={row.id ?? i}
                onClick={() => onRowClick?.(row)}
                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {columns.map((c) => (
                  <td key={c.key} style={{
                    padding: '10px 12px', verticalAlign: 'top',
                    borderBottom: `1px solid rgba(11,9,8,0.06)`,
                  }}>
                    {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, fontSize: 12, color: TEXT.muted }}>
        <span>{filtered.length} mistari · ukurasa {page + 1} / {totalPages}</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button disabled={page === 0} onClick={() => setPage(page - 1)} style={pageBtn}>‹</button>
          <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} style={pageBtn}>›</button>
        </div>
      </div>
    </div>
  )
}

const pageBtn: React.CSSProperties = {
  padding: '4px 10px', borderRadius: 6,
  background: 'transparent',
  border: `1px solid rgba(11,9,8,0.18)`,
  color: TEXT.body, cursor: 'pointer', fontSize: 12,
}
