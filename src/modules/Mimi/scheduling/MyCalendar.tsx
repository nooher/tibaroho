import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageShell, Card } from '../components/Shell'
import { JEWEL, TYPE, TEXT, hexToRgba } from '../../../lib/glass'
import { db } from '../../../lib/db'
import type { TrAppointment } from '../../../lib/db'
import { getMeId } from '../../../lib/me'

interface Booking {
  id: string
  providerId: string
  date: string
  slot: string
  ts: number
}

interface Caregiver {
  id: string
  name: string
  email: string
}

const LOCAL_KEY = 'tumaini.mimi.bookings'

function readBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (!raw) return []
    const p: unknown = JSON.parse(raw)
    if (Array.isArray(p)) return p as Booking[]
  } catch { /* ignore */ }
  return []
}

function appointmentToBooking(row: TrAppointment): Booking {
  const d = new Date(row.scheduled_at)
  const date = d.toISOString().slice(0, 10)
  const slot = d.toTimeString().slice(0, 5)
  let providerId = row.provider_id
  // notes may carry the original slug from Book.tsx as "provider_slug=<id>"
  if (row.notes) {
    const m = /provider_slug=([^;\s]+)/.exec(row.notes)
    if (m && m[1]) providerId = m[1]
  }
  return { id: row.id, providerId, date, slot, ts: +d }
}

async function loadBookingsAsync(): Promise<Booking[]> {
  if (!db.supabase) return readBookings()
  try {
    const me = await getMeId()
    const rows = await db.list('tr_appointments', { patient_id: me })
    const live = rows
      .map(appointmentToBooking)
      .sort((a, b) => a.date.localeCompare(b.date) || a.slot.localeCompare(b.slot))
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(live)) } catch { /* ignore */ }
    return live
  } catch {
    return readBookings()
  }
}

function readCaregivers(): Caregiver[] {
  try {
    const raw = localStorage.getItem('tumaini.mimi.caregivers')
    if (!raw) return []
    const p: unknown = JSON.parse(raw)
    if (Array.isArray(p)) return p as Caregiver[]
  } catch { /* ignore */ }
  return []
}

function generateIcs(bookings: Booking[]): string {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Tumaini//Mimi//SW']
  for (const b of bookings) {
    const [hh, mm] = b.slot.split(':')
    const start = b.date.replace(/-/g, '') + 'T' + hh + mm + '00'
    const endHour = String(Number(hh) + 1).padStart(2, '0')
    const end = b.date.replace(/-/g, '') + 'T' + endHour + mm + '00'
    lines.push('BEGIN:VEVENT', `UID:${b.id}@tumaini`, `DTSTART:${start}`, `DTEND:${end}`, `SUMMARY:Miadi na ${b.providerId}`, 'END:VEVENT')
  }
  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}

export default function MyCalendar() {
  const [tab, setTab] = useState<'bookings' | 'delegation'>('bookings')
  const [bookings, setBookings] = useState<Booking[]>(() => readBookings().sort((a, b) => a.date.localeCompare(b.date)))
  const [caregivers, setCaregivers] = useState<Caregiver[]>(() => readCaregivers())
  const [invite, setInvite] = useState({ name: '', email: '' })

  useEffect(() => {
    let on = true
    void loadBookingsAsync().then((rows) => { if (on) setBookings(rows) })
    return () => { on = false }
  }, [])

  function exportIcs(): void {
    const text = generateIcs(bookings)
    const blob = new Blob([text], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'tumaini-miadi.ics'
    a.click()
    URL.revokeObjectURL(url)
  }

  function addCaregiver(): void {
    if (!invite.name || !invite.email) return
    const next = [...caregivers, { id: `cg_${Date.now()}`, ...invite }]
    setCaregivers(next)
    try { localStorage.setItem('tumaini.mimi.caregivers', JSON.stringify(next)) } catch { /* ignore */ }
    setInvite({ name: '', email: '' })
  }

  return (
    <PageShell title="Ratiba yangu" subtitle="Miadi yote ya wataalamu mahali pamoja." back={{ to: '/mimi', label: 'Mimi' }}>
      <div role="tablist" style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['bookings', 'delegation'] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            style={{
              padding: '8px 16px', borderRadius: 999, border: 'none',
              background: tab === t ? JEWEL.tealMwenza : hexToRgba(JEWEL.tealMwenza, 0.1),
              color: tab === t ? TEXT.onJewel : JEWEL.tealMwenza, fontWeight: 700, cursor: 'pointer',
            }}
          >{t === 'bookings' ? 'Miadi' : 'Mlezi'}</button>
        ))}
      </div>

      {tab === 'bookings' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <Link to="/mimi/ratiba/weka" style={{ padding: '8px 14px', borderRadius: 999, background: JEWEL.tealMwenza, color: TEXT.onJewel, textDecoration: 'none', fontWeight: 700 }}>+ Weka mpya</Link>
            <button onClick={exportIcs} disabled={bookings.length === 0} style={{ padding: '8px 14px', borderRadius: 999, background: JEWEL.goldHope, color: '#0B0908', border: 'none', fontWeight: 700, cursor: bookings.length ? 'pointer' : 'not-allowed', opacity: bookings.length ? 1 : 0.5 }}>Pakua ICS</button>
          </div>
          {bookings.length === 0 ? (
            <Card><p style={{ margin: 0 }}>Bado huna miadi.</p></Card>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {bookings.map((b) => (
                <Card key={b.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ fontFamily: TYPE.serif, color: JEWEL.tealDeep }}>{b.providerId}</strong>
                    <span style={{ color: JEWEL.goldHope, fontWeight: 700 }}>{b.date} · {b.slot}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'delegation' && (
        <Card>
          <h3 style={{ marginTop: 0, fontFamily: TYPE.serif, color: JEWEL.tealDeep }}>Walezi waliotumiwa</h3>
          <div style={{ display: 'grid', gap: 8 }}>
            {caregivers.length === 0 && <p style={{ color: TEXT.muted }}>Hujamtuma mlezi yeyote bado.</p>}
            {caregivers.map((c) => (
              <div key={c.id} style={{ padding: 10, borderRadius: 10, background: '#F8F2D8', display: 'flex', justifyContent: 'space-between' }}>
                <span>{c.name}</span><span style={{ color: TEXT.muted }}>{c.email}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, marginTop: 12 }}>
            <input value={invite.name} onChange={(e) => setInvite({ ...invite, name: e.target.value })} placeholder="Jina" aria-label="Jina la mlezi" style={{ padding: 8, borderRadius: 10, border: `1px solid ${hexToRgba('#000', 0.12)}`, background: '#FAF5E5' }} />
            <input value={invite.email} onChange={(e) => setInvite({ ...invite, email: e.target.value })} placeholder="Barua pepe" aria-label="Barua pepe ya mlezi" style={{ padding: 8, borderRadius: 10, border: `1px solid ${hexToRgba('#000', 0.12)}`, background: '#FAF5E5' }} />
            <button onClick={addCaregiver} style={{ padding: '8px 14px', borderRadius: 999, background: JEWEL.tealMwenza, color: TEXT.onJewel, border: 'none', fontWeight: 700, cursor: 'pointer' }}>Tuma</button>
          </div>
        </Card>
      )}
    </PageShell>
  )
}
