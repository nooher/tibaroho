import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageShell, Card } from '../components/Shell'
import { JEWEL, TYPE, TEXT, hexToRgba } from '../../../lib/glass'

function next14Days(): Date[] {
  const out: Date[] = []
  const today = new Date()
  for (let i = 0; i < 14; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    out.push(d)
  }
  return out
}

const SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']

export default function MimiBook() {
  const [params] = useSearchParams()
  const providerId = params.get('provider') ?? 'mtaalamu'
  const [picked, setPicked] = useState<{ date: string; slot: string } | null>(null)
  const days = useMemo(() => next14Days(), [])

  function confirm(): void {
    if (!picked) return
    try {
      const KEY = 'tumaini.mimi.bookings'
      const raw = localStorage.getItem(KEY)
      const list = raw ? (JSON.parse(raw) as unknown[]) : []
      list.push({ id: `bk_${Date.now()}`, providerId, date: picked.date, slot: picked.slot, ts: Date.now() })
      localStorage.setItem(KEY, JSON.stringify(list))
    } catch { /* ignore */ }
    alert(`Miadi imewekwa: ${picked.date} saa ${picked.slot}`)
    setPicked(null)
  }

  return (
    <PageShell title="Weka miadi" subtitle={`Mtaalamu: ${providerId}`} back={{ to: '/mimi/ratiba', label: 'Ratiba yangu' }}>
      <Card>
        <p style={{ marginTop: 0 }}>Chagua siku na muda unaokufaa katika siku 14 zijazo.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(132px, 1fr))', gap: 10 }}>
          {days.map((d) => {
            const iso = d.toISOString().slice(0, 10)
            return (
              <div key={iso} style={{ padding: 10, borderRadius: 14, border: `1px solid ${hexToRgba('#000', 0.08)}`, background: '#FAF5E5' }}>
                <div style={{ fontWeight: 700, color: JEWEL.tealDeep, fontFamily: TYPE.serif }}>{d.toLocaleDateString('sw-TZ', { weekday: 'short', day: 'numeric', month: 'short' })}</div>
                <div style={{ display: 'grid', gap: 6, marginTop: 6 }}>
                  {SLOTS.map((s) => {
                    const active = picked?.date === iso && picked.slot === s
                    return (
                      <button
                        key={s}
                        onClick={() => setPicked({ date: iso, slot: s })}
                        aria-label={`Chagua ${iso} saa ${s}`}
                        style={{
                          padding: '6px 10px',
                          borderRadius: 999,
                          border: 'none',
                          cursor: 'pointer',
                          background: active ? JEWEL.tealMwenza : hexToRgba(JEWEL.tealMwenza, 0.1),
                          color: active ? TEXT.onJewel : JEWEL.tealMwenza,
                          fontWeight: 600,
                          fontSize: 13,
                        }}
                      >{s}</button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
        {picked && (
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Umechagua: <strong>{picked.date}</strong> saa <strong>{picked.slot}</strong></span>
            <button onClick={confirm} style={{ padding: '10px 20px', borderRadius: 999, background: JEWEL.tealMwenza, color: TEXT.onJewel, border: 'none', cursor: 'pointer', fontWeight: 700 }}>Thibitisha</button>
          </div>
        )}
      </Card>
    </PageShell>
  )
}
