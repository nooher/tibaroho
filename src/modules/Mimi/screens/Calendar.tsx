import { useMemo, useState } from 'react'
import { JEWEL, NEUTRAL, RADII, TYPE, TEXT, CREAM, hexToRgba } from '../../../lib/glass'
import { PageShell, Card } from '../components/Shell'
import { Pill } from '../components/Pill'
import { listEvents, saveEvent, deleteEvent, uid, type CalEvent } from '../data/store'

type View = 'siku' | 'wiki' | 'mwezi'

const KINDS: Array<{ id: CalEvent['kind']; sw: string }> = [
  { id: 'session', sw: 'Mazungumzo' },
  { id: 'medication', sw: 'Dawa' },
  { id: 'checkin', sw: 'Ukaguzi' },
  { id: 'lab', sw: 'Maabara' },
  { id: 'other', sw: 'Nyingine' },
]

function startOfDay(d: Date) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x }
function addDays(d: Date, n: number) { const x = new Date(d); x.setDate(x.getDate() + n); return x }
function sameDay(a: Date, b: Date) { return a.toDateString() === b.toDateString() }

export default function CalendarPage() {
  const [events, setEvents] = useState<CalEvent[]>(() => listEvents())
  const [view, setView] = useState<View>('wiki')
  const [cursor, setCursor] = useState<Date>(() => startOfDay(new Date()))
  const [draft, setDraft] = useState<Partial<CalEvent>>({ kind: 'session', durationMin: 60, reminder: true })

  const range = useMemo(() => {
    if (view === 'siku') return [cursor]
    if (view === 'wiki') return Array.from({ length: 7 }, (_, i) => addDays(cursor, i))
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
    const days = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate()
    return Array.from({ length: days }, (_, i) => addDays(first, i))
  }, [view, cursor])

  const byDay = useMemo(() => {
    const m = new Map<string, CalEvent[]>()
    for (const e of events) {
      const k = startOfDay(new Date(e.startsAt)).toDateString()
      if (!m.has(k)) m.set(k, [])
      m.get(k)!.push(e)
    }
    return m
  }, [events])

  function add() {
    if (!draft.title_sw || !draft.startsAt) return
    const evt: CalEvent = {
      id: uid(),
      startsAt: new Date(draft.startsAt).toISOString(),
      durationMin: Number(draft.durationMin || 60),
      title_sw: String(draft.title_sw),
      kind: (draft.kind as CalEvent['kind']) || 'other',
      notes: draft.notes,
      reminder: !!draft.reminder,
    }
    saveEvent(evt)
    setEvents(listEvents())
    setDraft({ kind: 'session', durationMin: 60, reminder: true })
  }
  function rm(id: string) { deleteEvent(id); setEvents(listEvents()) }

  return (
    <PageShell title="Kalenda yangu" subtitle="Miadi, vikumbusho vya madawa, na vipimo vya mara kwa mara." back={{ to: '/mimi' }}>
      <Card jewel={JEWEL.tealRoho}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['siku', 'wiki', 'mwezi'] as View[]).map((v) => (
              <button key={v} onClick={() => setView(v)} aria-pressed={view === v} style={tab(view === v)}>{v.toUpperCase()}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={() => setCursor(addDays(cursor, view === 'mwezi' ? -30 : view === 'wiki' ? -7 : -1))} style={tab(false)} aria-label="Nyuma">←</button>
            <strong style={{ fontFamily: TYPE.serif, fontSize: 18 }}>{cursor.toLocaleDateString('sw-TZ', { day: '2-digit', month: 'long', year: 'numeric' })}</strong>
            <button onClick={() => setCursor(addDays(cursor, view === 'mwezi' ? 30 : view === 'wiki' ? 7 : 1))} style={tab(false)} aria-label="Mbele">→</button>
          </div>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: view === 'mwezi' ? 'repeat(7, 1fr)' : '1fr', gap: 8, marginTop: 16 }}>
        {range.map((day) => {
          const events = byDay.get(day.toDateString()) || []
          const isToday = sameDay(day, new Date())
          return (
            <div key={day.toISOString()} style={{
              ...{ background: hexToRgba(JEWEL.tealRoho, 0.10), border: `1px solid ${isToday ? JEWEL.goldHope : hexToRgba(NEUTRAL.ink, 0.10)}`, borderRadius: RADII.card, padding: 12, minHeight: view === 'mwezi' ? 80 : 60 },
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <strong style={{ fontFamily: TYPE.serif, fontSize: 14 }}>{day.toLocaleDateString('sw-TZ', { weekday: 'short', day: '2-digit' })}</strong>
                {events.length > 0 && <Pill tone="indigo">{events.length}</Pill>}
              </div>
              {events.map((e) => (
                <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: JEWEL.indigoWisdom, color: TEXT.onJewel, padding: '6px 8px', borderRadius: 8, fontSize: 12, marginBottom: 4 }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{e.title_sw}</div>
                    <div style={{ color: TEXT.onJewel, opacity: 0.85 }}>{new Date(e.startsAt).toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' })} · {e.kind}</div>
                  </div>
                  <button onClick={() => rm(e.id)} aria-label="Ondoa" style={{ background: 'transparent', border: 'none', color: TEXT.onJewel, cursor: 'pointer' }}>×</button>
                </div>
              ))}
            </div>
          )
        })}
      </div>

      <Card jewel={JEWEL.indigoWisdom} style={{ marginTop: 20 }}>
        <Pill tone="indigo">Ongeza miadi</Pill>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginTop: 12 }}>
          <input
            placeholder="Kichwa (mfano: Mazungumzo na mshauri)"
            value={draft.title_sw || ''}
            onChange={(e) => setDraft({ ...draft, title_sw: e.target.value })}
            aria-label="Kichwa cha miadi"
            style={inp}
          />
          <input
            type="datetime-local"
            value={draft.startsAt || ''}
            onChange={(e) => setDraft({ ...draft, startsAt: e.target.value })}
            aria-label="Tarehe na muda"
            style={inp}
          />
          <select
            value={draft.kind}
            onChange={(e) => setDraft({ ...draft, kind: e.target.value as CalEvent['kind'] })}
            aria-label="Aina"
            style={inp}
          >
            {KINDS.map((k) => <option key={k.id} value={k.id}>{k.sw}</option>)}
          </select>
          <input
            type="number" min={5} max={480}
            value={draft.durationMin || 60}
            onChange={(e) => setDraft({ ...draft, durationMin: Number(e.target.value) })}
            aria-label="Muda (dakika)" style={inp}
          />
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <input type="checkbox" checked={!!draft.reminder} onChange={(e) => setDraft({ ...draft, reminder: e.target.checked })} />
            Kikumbusho
          </label>
          <button onClick={add} style={{ padding: '10px 18px', borderRadius: RADII.chip, background: JEWEL.goldHope, color: NEUTRAL.ink, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            Hifadhi
          </button>
        </div>
      </Card>
    </PageShell>
  )
}

const tab = (on: boolean): React.CSSProperties => ({
  padding: '8px 14px', borderRadius: RADII.chip,
  background: on ? JEWEL.goldHope : 'rgba(250,245,229,0.85)',
  color: on ? NEUTRAL.ink : TEXT.body,
  border: on ? 'none' : '1px solid rgba(11,9,8,0.10)',
  cursor: 'pointer', fontSize: 13, fontWeight: 600,
})
const inp: React.CSSProperties = {
  padding: 10, borderRadius: RADII.card,
  background: CREAM.milk,
  border: '1px solid rgba(11,9,8,0.22)',
  color: TEXT.body, fontSize: 14, fontFamily: TYPE.sans,
}
