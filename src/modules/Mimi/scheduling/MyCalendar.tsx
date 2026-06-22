import type React from 'react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageShell, Card } from '../components/Shell'
import { JEWEL, TYPE, TEXT, hexToRgba } from '../../../lib/glass'
import { useLang } from '../../../lib/i18n/Provider'
import { db } from '../../../lib/db'
import type { TrAppointment } from '../../../lib/db'
import { getMeId } from '../../../lib/me'
import { supabase } from '../../../lib/supabase'

interface Booking {
  id: string
  providerId: string
  date: string
  slot: string
  ts: number
  status?: string
  modality?: string
  summary?: string
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
  let summary: string | undefined
  // notes may carry "provider_slug=<id>; summary=<text>"
  if (row.notes) {
    const ms = /provider_slug=([^;\s]+)/.exec(row.notes)
    if (ms && ms[1]) providerId = ms[1]
    const mu = /summary=(.+?)(?:;|$)/.exec(row.notes)
    if (mu && mu[1]) summary = mu[1].trim()
  }
  return { id: row.id, providerId, date, slot, ts: +d, status: row.status, modality: row.modality, summary }
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
  const { t } = useLang()
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
    <PageShell title={t('mimi.cal.title', 'Ratiba yangu')} subtitle={t('mimi.cal.subtitle', 'Miadi yote ya wataalamu mahali pamoja.')} back={{ to: '/mimi', label: t('mimi.nav.back', 'Mimi') }}>
      <div role="tablist" style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['bookings', 'delegation'] as const).map((tk) => (
          <button
            key={tk}
            role="tab"
            aria-selected={tab === tk}
            onClick={() => setTab(tk)}
            style={{
              padding: '8px 16px', borderRadius: 999, border: 'none',
              background: tab === tk ? JEWEL.tealMwenza : hexToRgba(JEWEL.tealMwenza, 0.1),
              color: tab === tk ? TEXT.onJewel : JEWEL.tealMwenza, fontWeight: 700, cursor: 'pointer',
            }}
          >{tk === 'bookings' ? t('mimi.cal.tab.appts', 'Miadi') : t('mimi.cal.tab.caregiver', 'Mlezi')}</button>
        ))}
      </div>

      {tab === 'bookings' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <Link to="/mimi/ratiba/weka" style={{ padding: '8px 14px', borderRadius: 999, background: JEWEL.tealMwenza, color: TEXT.onJewel, textDecoration: 'none', fontWeight: 700 }}>{t('mimi.cal.add', '+ Weka mpya')}</Link>
            <button onClick={exportIcs} disabled={bookings.length === 0} style={{ padding: '8px 14px', borderRadius: 999, background: JEWEL.goldHope, color: '#0B0908', border: 'none', fontWeight: 700, cursor: bookings.length ? 'pointer' : 'not-allowed', opacity: bookings.length ? 1 : 0.5 }}>{t('mimi.cal.export', 'Pakua ICS')}</button>
          </div>
          {bookings.length === 0 ? (
            <Card><p style={{ margin: 0 }}>{t('mimi.cal.empty', 'Bado huna miadi.')}</p></Card>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {bookings.map((b) => (
                <BookingCard key={b.id} booking={b} t={t} />
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'delegation' && (
        <Card>
          <h3 style={{ marginTop: 0, fontFamily: TYPE.serif, color: JEWEL.tealDeep }}>{t('mimi.cal.caregivers-title', 'Walezi waliotumiwa')}</h3>
          <div style={{ display: 'grid', gap: 8 }}>
            {caregivers.length === 0 && <p style={{ color: TEXT.muted }}>{t('mimi.cal.caregivers-empty', 'Hujamtuma mlezi yeyote bado.')}</p>}
            {caregivers.map((c) => (
              <div key={c.id} style={{ padding: 10, borderRadius: 10, background: '#F8F2D8', display: 'flex', justifyContent: 'space-between' }}>
                <span>{c.name}</span><span style={{ color: TEXT.muted }}>{c.email}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, marginTop: 12 }}>
            <input value={invite.name} onChange={(e) => setInvite({ ...invite, name: e.target.value })} placeholder={t('mimi.cal.name', 'Jina')} aria-label={t('mimi.cal.name-aria', 'Jina la mlezi')} style={{ padding: 8, borderRadius: 10, border: `1px solid ${hexToRgba('#000', 0.12)}`, background: '#FAF5E5' }} />
            <input value={invite.email} onChange={(e) => setInvite({ ...invite, email: e.target.value })} placeholder={t('mimi.cal.email', 'Barua pepe')} aria-label={t('mimi.cal.email-aria', 'Barua pepe ya mlezi')} style={{ padding: 8, borderRadius: 10, border: `1px solid ${hexToRgba('#000', 0.12)}`, background: '#FAF5E5' }} />
            <button onClick={addCaregiver} style={{ padding: '8px 14px', borderRadius: 999, background: JEWEL.tealMwenza, color: TEXT.onJewel, border: 'none', fontWeight: 700, cursor: 'pointer' }}>{t('mimi.cal.invite', 'Tuma')}</button>
          </div>
        </Card>
      )}
    </PageShell>
  )
}

interface BookingCardProps {
  booking: Booking
  t: (k: string, fb: string) => string
}

function BookingCard({ booking, t }: BookingCardProps): React.JSX.Element {
  const [showSummary, setShowSummary] = useState(false)
  const [joining, setJoining] = useState(false)
  const [joinErr, setJoinErr] = useState<string | null>(null)
  const now = Date.now()
  const minsToStart = Math.round((booking.ts - now) / 60000)
  // Join is available 15 minutes before until 90 minutes after start
  const joinable = booking.modality === 'virtual'
    && booking.status !== 'completed' && booking.status !== 'cancelled'
    && minsToStart <= 15 && minsToStart >= -90

  const isPast = booking.status === 'completed' || minsToStart < -90
  const statusLabel = (() => {
    if (booking.status === 'completed') return t('mimi.cal.status.completed', 'Imekamilika')
    if (booking.status === 'cancelled') return t('mimi.cal.status.cancelled', 'Imeghairiwa')
    if (booking.status === 'confirmed') return t('mimi.cal.status.confirmed', 'Imethibitishwa')
    if (booking.status === 'requested') return t('mimi.cal.status.requested', 'Inasubiri uthibitisho')
    return booking.status ?? ''
  })()

  async function joinTelehealth(): Promise<void> {
    if (!supabase) {
      setJoinErr(t('mimi.cal.join_err.no_backend', 'Backend bado haijasanidiwa'))
      return
    }
    setJoining(true)
    setJoinErr(null)
    try {
      const { data, error } = await supabase.functions.invoke('telehealth-token', {
        body: { appointmentId: booking.id },
      })
      if (error) throw error
      const url = (data as { url?: string })?.url
      if (!url) throw new Error('No URL returned')
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch (e) {
      setJoinErr(e instanceof Error ? e.message : String(e))
    } finally {
      setJoining(false)
    }
  }

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <strong style={{ fontFamily: TYPE.serif, color: JEWEL.tealDeep, display: 'block' }}>{booking.providerId}</strong>
          {statusLabel && (
            <span style={{ fontSize: 11, color: TEXT.muted, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {statusLabel}
              {booking.modality === 'virtual' && <> · {t('mimi.cal.virtual_tag', 'Mtandaoni')}</>}
            </span>
          )}
        </div>
        <span style={{ color: JEWEL.goldHope, fontWeight: 700 }}>{booking.date} · {booking.slot}</span>
      </div>

      {joinable && (
        <div style={{ marginTop: 10 }}>
          <button
            onClick={() => void joinTelehealth()}
            disabled={joining}
            style={{
              padding: '8px 16px', borderRadius: 999, background: JEWEL.tealMwenza, color: TEXT.onJewel,
              border: 'none', fontWeight: 700, fontSize: 13, cursor: joining ? 'wait' : 'pointer',
            }}
          >
            {joining ? t('mimi.cal.joining', 'Inaunganisha…') : t('mimi.cal.join', 'Jiunge kwenye telehealth')}
          </button>
          {joinErr && <span style={{ marginLeft: 10, color: '#8C2222', fontSize: 12 }}>{joinErr}</span>}
        </div>
      )}

      {isPast && booking.summary && (
        <div style={{ marginTop: 10 }}>
          <button
            onClick={() => setShowSummary((s) => !s)}
            style={{
              background: 'none', border: 'none', color: JEWEL.tealMwenza, fontWeight: 700, fontSize: 12,
              cursor: 'pointer', padding: 0, textDecoration: 'underline',
            }}
          >
            {showSummary
              ? t('mimi.cal.hide_summary', 'Ficha muhtasari wa daktari')
              : t('mimi.cal.show_summary', 'Onyesha muhtasari wa daktari')}
          </button>
          {showSummary && (
            <p style={{
              marginTop: 8, padding: 12, borderRadius: 10,
              background: hexToRgba(JEWEL.tealMwenza, 0.07),
              borderLeft: `3px solid ${JEWEL.tealMwenza}`,
              fontSize: 13, color: TEXT.body, lineHeight: 1.55,
            }}>
              {booking.summary}
            </p>
          )}
        </div>
      )}
    </Card>
  )
}
