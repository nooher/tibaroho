import { useEffect, useState } from 'react'
import { JEWEL, TYPE, TEXT, hexToRgba } from '../../../lib/glass'
import { db, hasBackend } from '../../../lib/db'
import { getMyProviderId } from '../../../lib/me'

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

// Map between Tumaini display statuses and the canonical tr_referrals.status text.
const TR_STATUS_FROM_DB: Record<string, Status> = {
  open: 'sent',
  seen: 'seen',
  accepted: 'accepted',
  declined: 'declined',
  completed: 'completed',
}
const TR_STATUS_TO_DB: Record<Status, string> = {
  sent: 'open',
  seen: 'seen',
  accepted: 'accepted',
  declined: 'declined',
  completed: 'completed',
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

/** Live upgrade: pull the signed-in provider's inbox from tr_referrals. */
async function fetchInbox(): Promise<ReceivedReferral[] | null> {
  if (!hasBackend) return null
  const meProvider = await getMyProviderId()
  if (!meProvider) return null
  try {
    const rows = await db.list('tr_referrals', { to_provider_id: meProvider })
    return rows.map((r) => {
      const createdAt = (r as unknown as { created_at?: string }).created_at
      return {
      id: r.id,
      ts: createdAt ? Date.parse(createdAt) : Date.now(),
      // We don't denormalise the sender label here — show the id; the provider
      // directory view will resolve names. Patient is shown by id similarly.
      fromProvider: r.from_provider_id ? `Mtaalamu ${r.from_provider_id.slice(0, 6)}` : '—',
      patient: r.patient_id ? `Mgonjwa ${r.patient_id.slice(0, 6)}` : '—',
      reasonSw: r.reason,
      status: TR_STATUS_FROM_DB[r.status] ?? 'sent',
      acked: r.status !== 'open',
    }
    })
  } catch { return null }
}

export default function ReferralsInbox() {
  const [items, setItems] = useState<ReceivedReferral[]>([])

  useEffect(() => {
    setItems(read())
    let mounted = true
    void fetchInbox().then((rows) => {
      if (mounted && rows && rows.length) {
        setItems(rows)
        write(rows)
      }
    })
    return () => { mounted = false }
  }, [])

  async function persistStatus(id: string, status: Status): Promise<void> {
    if (!hasBackend) return
    try { await db.update('tr_referrals', id, { status: TR_STATUS_TO_DB[status] }) } catch { /* graceful */ }
  }

  function ack(id: string): void {
    const next = items.map((r) => r.id === id ? { ...r, acked: true, status: r.status === 'sent' ? 'seen' as const : r.status } : r)
    setItems(next); write(next)
    const ackedStatus: Status = items.find((r) => r.id === id)?.status === 'sent' ? 'seen' : (items.find((r) => r.id === id)?.status ?? 'seen')
    void persistStatus(id, ackedStatus)
  }
  function changeStatus(id: string, s: Status): void {
    const next = items.map((r) => r.id === id ? { ...r, status: s } : r)
    setItems(next); write(next)
    void persistStatus(id, s)
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
