import { useEffect, useState } from 'react'
import { JEWEL, TYPE, TEXT, hexToRgba } from '../../../lib/glass'

type Status = 'sent' | 'seen' | 'accepted' | 'declined' | 'completed'
const STATUS_LABEL: Record<Status, string> = {
  sent: 'Imetumwa', seen: 'Imeonekana', accepted: 'Imekubaliwa', declined: 'Imekataliwa', completed: 'Imekamilika',
}

interface ReceivedReferral {
  id: string
  ts: number
  fromProvider: string
  patient: string
  reasonSw: string
  status: Status
  acked: boolean
}

function seed(): ReceivedReferral[] {
  return [
    { id: 'ref_in_1', ts: Date.now() - 86400000, fromProvider: 'Dkt. Mwasha', patient: 'Mgonjwa A', reasonSw: 'Mfadhaiko mkubwa, anahitaji tathmini ya kina.', status: 'sent', acked: false },
    { id: 'ref_in_2', ts: Date.now() - 172800000, fromProvider: 'Dkt. Salim', patient: 'Mgonjwa B', reasonSw: 'Wasiwasi wa mara kwa mara, anahitaji ushauri.', status: 'seen', acked: true },
  ]
}

const KEY = 'tumaini.wataalam.referrals.received'

function read(): ReceivedReferral[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) {
      const s = seed()
      localStorage.setItem(KEY, JSON.stringify(s))
      return s
    }
    const p: unknown = JSON.parse(raw)
    if (Array.isArray(p)) return p as ReceivedReferral[]
  } catch { /* ignore */ }
  return seed()
}

function write(items: ReceivedReferral[]): void {
  try { localStorage.setItem(KEY, JSON.stringify(items)) } catch { /* ignore */ }
}

export default function ReferralsInbox() {
  const [items, setItems] = useState<ReceivedReferral[]>([])
  useEffect(() => { setItems(read()) }, [])

  function ack(id: string): void {
    const next = items.map((r) => r.id === id ? { ...r, acked: true, status: r.status === 'sent' ? 'seen' as const : r.status } : r)
    setItems(next); write(next)
  }
  function changeStatus(id: string, s: Status): void {
    const next = items.map((r) => r.id === id ? { ...r, status: s } : r)
    setItems(next); write(next)
  }

  return (
    <div style={{ padding: '24px 22px 80px', fontFamily: TYPE.sans }}>
      <h1 style={{ fontFamily: TYPE.serif, fontWeight: 800, color: JEWEL.tealDeep, fontSize: 30 }}>Rufaa zilizopokelewa</h1>
      <p style={{ color: TEXT.muted }}>Thibitisha umepokea, kisha sasisha hali ya kufunga mzunguko.</p>

      <div style={{ display: 'grid', gap: 12, marginTop: 18 }}>
        {items.map((r) => (
          <div key={r.id} style={{ padding: 14, background: '#FAF5E5', borderRadius: 14, border: `1px solid ${hexToRgba('#000', 0.08)}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong style={{ fontFamily: TYPE.serif, color: JEWEL.tealDeep }}>{r.patient}</strong>
              <span style={{ fontSize: 12, color: TEXT.heading, fontWeight: 700 }}>{STATUS_LABEL[r.status]}</span>
            </div>
            <div style={{ fontSize: 13, color: TEXT.muted }}>Kutoka: {r.fromProvider} · {new Date(r.ts).toLocaleDateString('sw-TZ')}</div>
            <p style={{ marginTop: 8 }}>{r.reasonSw}</p>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              {!r.acked && (
                <button onClick={() => ack(r.id)} style={{ padding: '6px 12px', borderRadius: 999, background: JEWEL.tealMwenza, color: '#FAF5E5', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Thibitisha</button>
              )}
              <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: TEXT.muted }}>Hali:</span>
                <select value={r.status} onChange={(e) => changeStatus(r.id, e.target.value as Status)} style={{ padding: 6, borderRadius: 8 }}>
                  {(Object.keys(STATUS_LABEL) as Status[]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                </select>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
