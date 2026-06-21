import { useState } from 'react'
import { JEWEL, RADII, TYPE, TEXT, hexToRgba } from '../../../lib/glass'
import { Card, FieldLabel, fieldStyle, buttonStyle, H1 } from '../components/Card'
import { loadSlots, saveSlots, type SlotRule } from '../lib/storage'
import { useLang } from '../../../lib/i18n/Provider'

const DAYS = ['Jumapili', 'Jumatatu', 'Jumanne', 'Jumatano', 'Alhamisi', 'Ijumaa', 'Jumamosi']

export default function Schedule() {
  const { t } = useLang()
  const [slots, setSlots] = useState<SlotRule[]>(() => loadSlots())
  const [draft, setDraft] = useState<Omit<SlotRule, 'id'>>({
    dayOfWeek: 1,
    startHHMM: '09:00',
    endHHMM: '12:00',
    mode: 'both',
  })

  const persist = (next: SlotRule[]) => {
    setSlots(next)
    saveSlots(next)
  }

  function add() {
    persist([...slots, { ...draft, id: 's-' + Date.now() }])
  }

  function remove(id: string) {
    persist(slots.filter((s) => s.id !== id))
  }

  // Weekly grid: 7 columns × hour rows 7–19.
  const HOURS = Array.from({ length: 13 }, (_, i) => 7 + i)

  return (
    <div>
      <H1 english="Schedule">{t('wataalam.schedule.title', 'Ratiba ya wiki')}</H1>

      <div style={{ display: 'grid', gap: 14, gridTemplateColumns: '2fr 1fr' }}>
        <Card title={t('wataalam.schedule.week_calendar', 'Kalenda ya wiki')}>
          <div
            role="grid"
            aria-label={t('wataalam.schedule.week_calendar', 'Kalenda ya wiki')}
            style={{
              display: 'grid',
              gridTemplateColumns: '60px repeat(7, 1fr)',
              gap: 2,
              fontSize: 11,
            }}
          >
            <div />
            {DAYS.map((d) => (
              <div
                key={d}
                style={{
                  textAlign: 'center',
                  padding: '6px 0',
                  color: TEXT.muted,
                  fontWeight: 600,
                  letterSpacing: 0.4,
                }}
              >
                {d.slice(0, 3)}
              </div>
            ))}
            {HOURS.map((h) => (
              <RowFragment key={h} hour={h} slots={slots} />
            ))}
          </div>
        </Card>

        <Card title={t('wataalam.schedule.add_slot', 'Ongeza muda')}>
          <FieldLabel>{t('wataalam.schedule.day', 'Siku')}</FieldLabel>
          <select
            value={draft.dayOfWeek}
            style={fieldStyle()}
            onChange={(e) => setDraft({ ...draft, dayOfWeek: Number(e.target.value) })}
          >
            {DAYS.map((d, i) => (
              <option key={d} value={i}>
                {d}
              </option>
            ))}
          </select>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
            <div>
              <FieldLabel>{t('wataalam.schedule.start', 'Anza')}</FieldLabel>
              <input
                type="time"
                style={fieldStyle()}
                value={draft.startHHMM}
                onChange={(e) => setDraft({ ...draft, startHHMM: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>{t('wataalam.schedule.end', 'Mwisho')}</FieldLabel>
              <input
                type="time"
                style={fieldStyle()}
                value={draft.endHHMM}
                onChange={(e) => setDraft({ ...draft, endHHMM: e.target.value })}
              />
            </div>
          </div>
          <FieldLabel>{t('wataalam.schedule.mode', 'Aina')}</FieldLabel>
          <select
            value={draft.mode}
            style={fieldStyle()}
            onChange={(e) => setDraft({ ...draft, mode: e.target.value as SlotRule['mode'] })}
          >
            <option value="both">{t('wataalam.schedule.both', 'Zote mbili')}</option>
            <option value="virtual">{t('wataalam.common.virtual', 'Mtandaoni')}</option>
            <option value="in_person">{t('wataalam.common.in_person', 'Ana kwa ana')}</option>
          </select>
          <button onClick={add} style={{ ...buttonStyle(JEWEL.goldHope, true), marginTop: 14 }}>
            {t('wataalam.schedule.add', '+ Ongeza')}
          </button>

          <h3 style={{ fontFamily: TYPE.serif, fontSize: 14, marginTop: 22 }}>
            {t('wataalam.schedule.active_rules', 'Sheria zinazoendelea')}
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 6 }}>
            {slots.map((s) => (
              <li
                key={s.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: 'rgba(250,245,229,0.85)',
                  border: '1px solid rgba(11,9,8,0.10)',
                  borderRadius: RADII.chip,
                  fontSize: 12,
                  color: TEXT.body,
                }}
              >
                <span>
                  {DAYS[s.dayOfWeek]} · {s.startHHMM}–{s.endHHMM} ·{' '}
                  {s.mode === 'virtual' ? t('wataalam.common.virtual_lc', 'mtandaoni') : s.mode === 'in_person' ? t('wataalam.common.in_person_lc', 'ana kwa ana') : t('wataalam.schedule.all_lc', 'zote')}
                </span>
                <button
                  onClick={() => remove(s.id)}
                  aria-label={t('wataalam.common.delete', 'Futa')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: TEXT.muted,
                    cursor: 'pointer',
                  }}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}

function RowFragment({ hour, slots }: { hour: number; slots: SlotRule[] }) {
  return (
    <>
      <div style={{ padding: '4px 6px', color: TEXT.muted, textAlign: 'right' }}>{hour}:00</div>
      {[0, 1, 2, 3, 4, 5, 6].map((dow) => {
        const inSlot = slots.find((s) => {
          if (s.dayOfWeek !== dow) return false
          const sh = parseInt(s.startHHMM.slice(0, 2), 10)
          const eh = parseInt(s.endHHMM.slice(0, 2), 10)
          return hour >= sh && hour < eh
        })
        return (
          <div
            key={dow}
            style={{
              minHeight: 22,
              background: inSlot ? hexToRgba(JEWEL.goldHope, 0.35) : hexToRgba(JEWEL.tealDeep, 0.3),
              borderRadius: 4,
              border: `1px solid ${hexToRgba(JEWEL.goldSoft, 0.1)}`,
            }}
            aria-label={inSlot ? `Anaweza saa ${hour}` : undefined}
          />
        )
      })}
    </>
  )
}
