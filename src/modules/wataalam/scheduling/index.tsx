import { useState } from 'react'
import { JEWEL, TYPE, TEXT, hexToRgba } from '../../../lib/glass'
import { useLang } from '../../../lib/i18n/Provider'

interface DayRule {
  day: string
  start: string
  end: string
  open: boolean
}

interface ExceptionDay {
  date: string
  closed: boolean
  start?: string
  end?: string
}

const DAYS = ['Jumatatu', 'Jumanne', 'Jumatano', 'Alhamisi', 'Ijumaa', 'Jumamosi', 'Jumapili']
const TZ = 'Africa/Dar_es_Salaam'

export interface SlotRequest {
  startIso: string
  endIso: string
}
export interface ExistingBooking {
  startIso: string
  endIso: string
}

/** Returns false if `req` collides with any booking. */
export function preventDoubleBooking(req: SlotRequest, existing: ExistingBooking[]): boolean {
  const rs = Date.parse(req.startIso)
  const re = Date.parse(req.endIso)
  return !existing.some((b) => {
    const bs = Date.parse(b.startIso)
    const be = Date.parse(b.endIso)
    return rs < be && bs < re
  })
}

export default function ProviderAvailability() {
  const { t } = useLang()
  const [rules, setRules] = useState<DayRule[]>(DAYS.map((d, i) => ({ day: d, start: '09:00', end: '17:00', open: i < 5 })))
  const [exceptions, setExceptions] = useState<ExceptionDay[]>([])
  const [exDate, setExDate] = useState('')
  const [exClosed, setExClosed] = useState(true)
  const [reminders, setReminders] = useState({ h24: true, h2: true, m30: false })

  function update(i: number, patch: Partial<DayRule>): void {
    setRules((rs) => rs.map((r, j) => (i === j ? { ...r, ...patch } : r)))
  }

  function addException(): void {
    if (!exDate) return
    setExceptions((xs) => [...xs, { date: exDate, closed: exClosed }])
    setExDate('')
  }

  return (
    <div style={{ padding: '20px 22px 80px', fontFamily: TYPE.sans }}>
      <h1 style={{ fontFamily: TYPE.serif, fontWeight: 800, color: JEWEL.tealDeep, fontSize: 30 }}>{t('wataalam.scheduling.title', 'Upatikanaji wako')}</h1>
      <p style={{ color: TEXT.muted }}>{t('wataalam.scheduling.subtitle', 'Sheria za kawaida za wiki na siku za kipekee. Saa za eneo:')} {TZ}.</p>

      <section style={{ background: '#FAF5E5', padding: 16, borderRadius: 18, border: `1px solid ${hexToRgba('#000', 0.08)}`, marginTop: 18 }}>
        <h3 style={{ marginTop: 0, fontFamily: TYPE.serif, color: JEWEL.tealDeep }}>{t('wataalam.scheduling.week_rules', 'Sheria za wiki')}</h3>
        <div style={{ display: 'grid', gap: 10 }}>
          {rules.map((r, i) => (
            <div key={r.day} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 1fr auto', gap: 10, alignItems: 'center' }}>
              <strong style={{ color: JEWEL.tealDeep }}>{r.day}</strong>
              <label><span style={{ fontSize: 12, color: TEXT.muted }}>{t('wataalam.scheduling.start_label', 'Anza:')}</span>
                <input type="time" value={r.start} onChange={(e) => update(i, { start: e.target.value })} disabled={!r.open} style={{ marginLeft: 6 }} />
              </label>
              <label><span style={{ fontSize: 12, color: TEXT.muted }}>{t('wataalam.scheduling.end_label', 'Mwisho:')}</span>
                <input type="time" value={r.end} onChange={(e) => update(i, { end: e.target.value })} disabled={!r.open} style={{ marginLeft: 6 }} />
              </label>
              <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input type="checkbox" checked={r.open} onChange={(e) => update(i, { open: e.target.checked })} />
                <span>{r.open ? t('wataalam.scheduling.open', 'Funguliwa') : t('wataalam.scheduling.closed', 'Funga')}</span>
              </label>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: '#FAF5E5', padding: 16, borderRadius: 18, border: `1px solid ${hexToRgba('#000', 0.08)}`, marginTop: 16 }}>
        <h3 style={{ marginTop: 0, fontFamily: TYPE.serif, color: JEWEL.tealDeep }}>{t('wataalam.scheduling.exceptions', 'Siku za kipekee')}</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <input type="date" value={exDate} onChange={(e) => setExDate(e.target.value)} aria-label={t('wataalam.scheduling.date', 'Tarehe')} />
          <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input type="checkbox" checked={exClosed} onChange={(e) => setExClosed(e.target.checked)} />
            <span>{t('wataalam.scheduling.is_closed', 'Imefungwa')}</span>
          </label>
          <button onClick={addException} style={{ padding: '8px 14px', borderRadius: 999, background: JEWEL.tealMwenza, color: '#FAF5E5', border: 'none', cursor: 'pointer', fontWeight: 700 }}>{t('wataalam.schedule.add_lc', 'Ongeza')}</button>
        </div>
        <ul style={{ marginTop: 12, paddingLeft: 18 }}>
          {exceptions.map((x, i) => (
            <li key={i}>{x.date} — {x.closed ? t('wataalam.scheduling.is_closed', 'Imefungwa') : t('wataalam.scheduling.open', 'Funguliwa')}</li>
          ))}
        </ul>
      </section>

      <section style={{ background: '#FAF5E5', padding: 16, borderRadius: 18, border: `1px solid ${hexToRgba('#000', 0.08)}`, marginTop: 16 }}>
        <h3 style={{ marginTop: 0, fontFamily: TYPE.serif, color: JEWEL.tealDeep }}>{t('wataalam.scheduling.reminders', 'Mfululizo wa vikumbusho')}</h3>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input type="checkbox" checked={reminders.h24} onChange={(e) => setReminders({ ...reminders, h24: e.target.checked })} /> {t('wataalam.scheduling.h24', 'Masaa 24 kabla')}
          </label>
          <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input type="checkbox" checked={reminders.h2} onChange={(e) => setReminders({ ...reminders, h2: e.target.checked })} /> {t('wataalam.scheduling.h2', 'Masaa 2 kabla')}
          </label>
          <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input type="checkbox" checked={reminders.m30} onChange={(e) => setReminders({ ...reminders, m30: e.target.checked })} /> {t('wataalam.scheduling.m30', 'Dakika 30 kabla')}
          </label>
        </div>
      </section>
    </div>
  )
}
