import { useEffect, useState } from 'react'
import { PageShell, Card } from './components/Shell'
import { JEWEL, TYPE, TEXT, hexToRgba } from '../../lib/glass'
import { useLang } from '../../lib/i18n/Provider'
import { CATEGORIES, CATEGORY_LABEL_SW, requestPermission, type NotificationCategory } from '../../lib/notifications'
import { listInbox, markRead, markAllRead, getSettings, setSettings, type InboxItem, type NotificationSettings } from '../../lib/notifications/inbox'

export default function Notifications() {
  const { t } = useLang()
  const [tab, setTab] = useState<'inbox' | 'settings'>('inbox')
  const [items, setItems] = useState<InboxItem[]>([])
  const [settings, setSettingsState] = useState<NotificationSettings>(() => getSettings())
  const [perm, setPerm] = useState<NotificationPermission>('default')

  useEffect(() => {
    setItems(listInbox())
    if (typeof Notification !== 'undefined') setPerm(Notification.permission)
  }, [])

  function refresh(): void {
    setItems(listInbox())
  }

  async function askPermission(): Promise<void> {
    const p = await requestPermission()
    setPerm(p)
  }

  function toggleCategory(c: NotificationCategory): void {
    const next: NotificationSettings = {
      ...settings,
      categories: { ...settings.categories, [c]: !settings.categories[c] },
    }
    setSettingsState(next)
    setSettings(next)
  }

  function setQuiet(field: 'start' | 'end', val: string): void {
    const next: NotificationSettings = {
      ...settings,
      quietHours: { ...settings.quietHours, [field]: val },
    }
    setSettingsState(next)
    setSettings(next)
  }

  return (
    <PageShell title={t('mimi.notify.title', 'Arifa')} subtitle={t('mimi.notify.subtitle', 'Inbox ya mafunzo, dawa, miadi, na ujumbe.')} back={{ to: '/mimi', label: t('mimi.nav.back', 'Mimi') }}>
      <div role="tablist" aria-label={t('mimi.notify.tabs-aria', 'Vichupo vya arifa')} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['inbox', 'settings'] as const).map((tk) => (
          <button
            key={tk}
            role="tab"
            aria-selected={tab === tk}
            onClick={() => setTab(tk)}
            style={{
              padding: '8px 16px',
              borderRadius: 999,
              border: 'none',
              background: tab === tk ? JEWEL.tealMwenza : hexToRgba(JEWEL.tealMwenza, 0.1),
              color: tab === tk ? TEXT.onJewel : JEWEL.tealMwenza,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >{tk === 'inbox' ? t('mimi.notify.inbox', 'Inbox') : t('mimi.notify.settings', 'Mipangilio')}</button>
        ))}
      </div>

      {tab === 'inbox' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ color: TEXT.muted }}>{items.length} {t('mimi.notify.messages', 'ujumbe')}</span>
            <button
              onClick={() => { markAllRead(); refresh() }}
              style={{ background: 'transparent', border: 'none', color: JEWEL.tealMwenza, cursor: 'pointer', fontWeight: 600 }}
            >{t('mimi.notify.mark-all', 'Tia alama yote kuwa imesomwa')}</button>
          </div>
          {items.length === 0 ? (
            <Card>
              <p style={{ margin: 0 }}>{t('mimi.notify.empty', 'Hakuna arifa kwa sasa. Utapata ujumbe wa miadi, dawa, na ufuatiliaji hapa.')}</p>
            </Card>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {items.map((i) => (
                <Card key={i.id} jewel={JEWEL.tealMwenza} alpha={i.read ? 0.04 : 0.12}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ fontFamily: TYPE.serif, color: JEWEL.tealDeep }}>{i.title_sw}</strong>
                    <span style={{ fontSize: 11, color: JEWEL.goldHope, fontWeight: 700 }}>{CATEGORY_LABEL_SW[i.category]}</span>
                  </div>
                  <div style={{ marginTop: 4, fontSize: 14 }}>{i.body_sw}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                    <span style={{ fontSize: 12, color: TEXT.muted }}>{new Date(i.ts).toLocaleString('sw-TZ')}</span>
                    {!i.read && (
                      <button
                        onClick={() => { markRead(i.id); refresh() }}
                        style={{ background: 'transparent', border: 'none', color: JEWEL.tealMwenza, cursor: 'pointer', fontWeight: 600 }}
                      >{t('mimi.notify.read', 'Soma')}</button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'settings' && (
        <>
          <Card style={{ marginBottom: 14 }}>
            <h3 style={{ marginTop: 0, fontFamily: TYPE.serif, color: JEWEL.tealDeep }}>{t('mimi.notify.device-perm', 'Idhini ya kifaa')}</h3>
            <p style={{ fontSize: 14 }}>{t('mimi.notify.current-status', 'Hali ya sasa')}: <strong>{perm}</strong></p>
            <button
              onClick={() => void askPermission()}
              style={{ padding: '8px 14px', borderRadius: 999, background: JEWEL.tealMwenza, color: TEXT.onJewel, border: 'none', fontWeight: 700, cursor: 'pointer' }}
            >{t('mimi.notify.ask-perm', 'Omba idhini ya arifa')}</button>
          </Card>

          <Card style={{ marginBottom: 14 }}>
            <h3 style={{ marginTop: 0, fontFamily: TYPE.serif, color: JEWEL.tealDeep }}>{t('mimi.notify.categories', 'Aina za arifa')}</h3>
            <div style={{ display: 'grid', gap: 8 }}>
              {CATEGORIES.map((c) => (
                <label key={c} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
                  <span>{CATEGORY_LABEL_SW[c]}</span>
                  <input
                    type="checkbox"
                    checked={!!settings.categories[c]}
                    onChange={() => toggleCategory(c)}
                    aria-label={`${t('mimi.notify.enable', 'Wezesha arifa ya')} ${CATEGORY_LABEL_SW[c]}`}
                  />
                </label>
              ))}
            </div>
          </Card>

          <Card>
            <h3 style={{ marginTop: 0, fontFamily: TYPE.serif, color: JEWEL.tealDeep }}>{t('mimi.notify.quiet-hours', 'Masaa ya kimya')}</h3>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <label>{t('mimi.notify.start', 'Kuanza')}:
                <input type="time" value={settings.quietHours.start} onChange={(e) => setQuiet('start', e.target.value)} style={{ marginLeft: 8 }} />
              </label>
              <label>{t('mimi.notify.end', 'Mwisho')}:
                <input type="time" value={settings.quietHours.end} onChange={(e) => setQuiet('end', e.target.value)} style={{ marginLeft: 8 }} />
              </label>
            </div>
          </Card>
        </>
      )}
    </PageShell>
  )
}
