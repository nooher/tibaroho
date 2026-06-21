import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageShell, Card } from '../components/Shell'
import { JEWEL, TYPE, TEXT, hexToRgba } from '../../../lib/glass'
import { db } from '../../../lib/db'
import { getMeId } from '../../../lib/me'

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
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

interface LocalBooking { id: string; providerId: string; date: string; slot: string; ts: number }

async function resolveProviderUuid(slug: string): Promise<string | null> {
  if (UUID_RE.test(slug)) return slug
  if (!db.supabase) return null
  try {
    const rows = await db.list('tr_providers')
    if (rows.length === 0) return null
    return (rows[0]?.id as string) ?? null
  } catch {
    return null
  }
}

export default function MimiBook() {
  const [params] = useSearchParams()
  const providerId = params.get('provider') ?? 'mtaalamu'
  const [picked, setPicked] = useState<{ date: string; slot: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const days = useMemo(() => next14Days(), [])

  async function confirm(): Promise<void> {
    if (!picked || busy) return
    setBusy(true)
    const KEY = 'tumaini.mimi.bookings'
    const localBooking: LocalBooking = {
      id: `bk_${Date.now()}`,
      providerId,
      date: picked.date,
      slot: picked.slot,
      ts: Date.now(),
    }

    // Write-through to local cache first so MyCalendar paints instantly.
    try {
      const raw = localStorage.getItem(KEY)
      const list = raw ? (JSON.parse(raw) as LocalBooking[]) : []
      list.push(localBooking)
      localStorage.setItem(KEY, JSON.stringify(list))
    } catch { /* ignore */ }

    // Persist canonical row to tr_appointments when authed + we can resolve a provider.
    try {
      const me = await getMeId()
      const providerUuid = await resolveProviderUuid(providerId)
      if (db.supabase && providerUuid && me) {
        const scheduledAt = new Date(`${picked.date}T${picked.slot}:00`).toISOString()
        await db.insert('tr_appointments', {
          patient_id: me,
          provider_id: providerUuid,
          scheduled_at: scheduledAt,
          duration_min: 60,
          modality: 'virtual',
          status: 'requested',
          notes: providerId === providerUuid ? undefined : `provider_slug=${providerId}`,
        })
        void db.audit('appointment.request', 'tr_appointments', undefined, {
          provider_slug: providerId, date: picked.date, slot: picked.slot,
        })
      }
    } catch { /* offline / unauth — local cache holds */ }

    alert(`Miadi imewekwa: ${picked.date} saa ${picked.slot}`)
    setPicked(null)
    setBusy(false)
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
            <button onClick={() => void confirm()} disabled={busy} style={{ padding: '10px 20px', borderRadius: 999, background: JEWEL.tealMwenza, color: TEXT.onJewel, border: 'none', cursor: busy ? 'wait' : 'pointer', fontWeight: 700, opacity: busy ? 0.6 : 1 }}>Thibitisha</button>
          </div>
        )}
      </Card>
    </PageShell>
  )
}
