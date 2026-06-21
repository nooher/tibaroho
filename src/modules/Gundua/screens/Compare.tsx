import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../../lib/i18n/Provider'
import { JEWEL, TEXT, TYPE, hexToRgba } from '../../../lib/glass'
import { PROVIDERS } from '../data/providers'

export default function Compare() {
  const { t } = useLang()
  const [picked, setPicked] = useState<string[]>([])

  function toggle(id: string): void {
    setPicked((p) => {
      if (p.includes(id)) return p.filter((x) => x !== id)
      if (p.length >= 3) return p
      return [...p, id]
    })
  }

  const rows = picked.map((id) => PROVIDERS.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => !!p)

  return (
    <main style={{ minHeight: '100vh', background: '#FAF5E5', padding: '24px 22px 80px', fontFamily: TYPE.sans }}>
      <Link to="/gundua" style={{ color: JEWEL.tealMwenza, textDecoration: 'none', fontSize: 14 }}>{t('gundua.compare.back', '← Gundua')}</Link>
      <h1 style={{ fontFamily: TYPE.serif, fontWeight: 800, color: JEWEL.tealDeep, fontSize: 32 }}>{t('gundua.compare.title', 'Linganisha wataalamu')}</h1>
      <p style={{ color: TEXT.muted }}>{t('gundua.compare.hint', 'Chagua hadi watatu kulinganisha ada, lugha, na ukadiriaji.')}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10, marginTop: 16 }}>
        {PROVIDERS.slice(0, 12).map((p) => {
          const on = picked.includes(p.id)
          return (
            <button
              key={p.id}
              onClick={() => toggle(p.id)}
              aria-pressed={on}
              style={{
                textAlign: 'left',
                padding: 10,
                borderRadius: 14,
                border: `1px solid ${on ? JEWEL.tealMwenza : hexToRgba('#000', 0.1)}`,
                background: on ? hexToRgba(JEWEL.tealMwenza, 0.12) : '#FAF5E5',
                cursor: 'pointer',
              }}
            >
              <strong style={{ fontFamily: TYPE.serif, color: JEWEL.tealDeep }}>{p.honorific} {p.name}</strong>
              <div style={{ fontSize: 12, color: TEXT.muted }}>{p.kind} · {p.location.city}</div>
            </button>
          )
        })}
      </div>

      {rows.length > 0 && (
        <div style={{ marginTop: 22, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#FAF5E5', borderRadius: 18 }}>
            <thead>
              <tr>
                <th style={th()}>{t('gundua.compare.col_feature', 'Kipengele')}</th>
                {rows.map((r) => <th key={r.id} style={th()}>{r.honorific} {r.name}</th>)}
              </tr>
            </thead>
            <tbody>
              <tr><td style={td()}>{t('gundua.compare.row_kind', 'Aina')}</td>{rows.map((r) => <td key={r.id} style={td()}>{r.kind}</td>)}</tr>
              <tr><td style={td()}>{t('gundua.compare.row_languages', 'Lugha')}</td>{rows.map((r) => <td key={r.id} style={td()}>{r.languages.join(', ')}</td>)}</tr>
              <tr><td style={td()}>{t('gundua.compare.row_fee', 'Ada (TZS)')}</td>{rows.map((r) => <td key={r.id} style={td()}>{r.feeTzs.toLocaleString()}</td>)}</tr>
              <tr><td style={td()}>{t('gundua.compare.row_rating', 'Ukadiriaji')}</td>{rows.map((r) => <td key={r.id} style={td()}>{r.rating} ⭐</td>)}</tr>
              <tr><td style={td()}>{t('gundua.compare.row_location', 'Eneo')}</td>{rows.map((r) => <td key={r.id} style={td()}>{r.location.city}, {r.location.region}</td>)}</tr>
              <tr><td style={td()}>{t('gundua.compare.row_mode', 'Hali')}</td>{rows.map((r) => <td key={r.id} style={td()}>{r.mode}</td>)}</tr>
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}

function th(): React.CSSProperties {
  return { textAlign: 'left', padding: 10, borderBottom: `2px solid ${hexToRgba('#000', 0.12)}`, fontFamily: TYPE.serif, color: JEWEL.tealDeep }
}
function td(): React.CSSProperties {
  return { padding: 10, borderBottom: `1px solid ${hexToRgba('#000', 0.06)}`, fontSize: 14 }
}
