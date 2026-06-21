import { useCallback, useEffect, useState } from 'react'
import { JEWEL, TYPE, TEXT, hexToRgba } from '../../../lib/glass'
import { listChannels, listMessages, sendMessage, setTyping, getTyping, markRead, type ChatChannel, type ChatMessage } from '../../../lib/chat'
import { useLang } from '../../../lib/i18n/Provider'

const ME = 'dr_amina'

export default function ProviderMessages() {
  const { t } = useLang()
  const [channels, setChannels] = useState<ChatChannel[]>([])
  const [openId, setOpenId] = useState<string | null>(null)
  const [msgs, setMsgs] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [typers, setTypers] = useState<string[]>([])

  useEffect(() => { setChannels(listChannels(ME)) }, [])

  const refresh = useCallback((id: string) => {
    setMsgs(listMessages(id))
    setTypers(getTyping(id).filter((u) => u !== ME))
  }, [])

  useEffect(() => {
    if (!openId) return
    const t = setInterval(() => refresh(openId), 1500)
    return () => clearInterval(t)
  }, [openId, refresh])

  function send(): void {
    if (!openId || !draft.trim()) return
    sendMessage(openId, ME, draft.trim())
    setTyping(openId, ME, false)
    setDraft('')
    refresh(openId)
  }

  function onDraft(v: string): void {
    setDraft(v)
    if (openId) setTyping(openId, ME, v.length > 0)
  }

  function open(id: string): void {
    setOpenId(id)
    refresh(id)
    const last = listMessages(id).slice(-1)[0]
    if (last) markRead(id, ME, last.id)
    setChannels(listChannels(ME))
  }

  return (
    <div style={{ padding: '24px 24px 80px', fontFamily: TYPE.sans }}>
      <h1 style={{ fontFamily: TYPE.serif, fontWeight: 800, color: JEWEL.tealDeep, fontSize: 32 }}>{t('wataalam.messages.title', 'Ujumbe')}</h1>
      <p style={{ color: TEXT.muted, marginTop: 0 }}>{t('wataalam.messages.subtitle', 'Mazungumzo na wagonjwa wako, kikundi cha rika, na msimamizi.')}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 280px) 1fr', gap: 18, marginTop: 18 }}>
        <aside style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
          {channels.map((c) => (
            <button
              key={c.id}
              onClick={() => open(c.id)}
              aria-label={`${t('wataalam.messages.open', 'Fungua')} ${c.title_sw ?? c.id}`}
              style={{
                textAlign: 'left',
                padding: 12,
                borderRadius: 14,
                border: `1px solid ${hexToRgba('#000', 0.08)}`,
                background: openId === c.id ? hexToRgba(JEWEL.tealMwenza, 0.12) : '#FAF5E5',
                cursor: 'pointer',
              }}
            >
              <strong style={{ fontFamily: TYPE.serif, color: JEWEL.tealDeep }}>{c.title_sw ?? c.id}</strong>
              <div style={{ fontSize: 12, color: TEXT.muted, marginTop: 2 }}>{c.participants.length} washiriki · {c.kind}</div>
              {c.unread > 0 && <div style={{ marginTop: 6 }}><span style={{ background: JEWEL.goldHope, color: '#0B0908', borderRadius: 999, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{c.unread} {t('wataalam.messages.new', 'mpya')}</span></div>}
            </button>
          ))}
        </aside>

        <section style={{ background: '#FAF5E5', border: `1px solid ${hexToRgba('#000', 0.08)}`, borderRadius: 18, padding: 14, minHeight: 480, display: 'flex', flexDirection: 'column' }}>
          {!openId ? (
            <p style={{ color: TEXT.muted, alignSelf: 'center', marginTop: 60 }}>{t('wataalam.messages.choose_thread', 'Chagua mazungumzo upande wa kushoto.')}</p>
          ) : (
            <>
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, padding: 6 }}>
                {msgs.map((m) => {
                  const mine = m.senderId === ME
                  const seenByOther = m.readBy.some((u) => u !== ME)
                  return (
                    <div key={m.id} style={{ alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '78%' }}>
                      <div style={{
                        padding: '8px 12px', borderRadius: 14,
                        background: mine ? JEWEL.tealMwenza : '#F4EAC9',
                        color: mine ? '#FAF5E5' : '#0B0908',
                        border: mine ? 'none' : `1px solid ${hexToRgba('#000', 0.06)}`,
                      }}>{m.body}</div>
                      <div style={{ fontSize: 10, color: TEXT.muted, marginTop: 2, textAlign: mine ? 'right' : 'left' }}>
                        {new Date(m.ts).toLocaleTimeString('sw-TZ')} {mine && (seenByOther ? `· ${t('wataalam.messages.seen', 'Imeonekana')}` : `· ${t('wataalam.messages.sent', 'Imetumwa')}`)}
                      </div>
                    </div>
                  )
                })}
              </div>
              {typers.length > 0 && (
                <div style={{ fontSize: 12, color: TEXT.muted, padding: '4px 6px' }}>{typers.join(', ')} {t('wataalam.messages.typing', 'anaandika…')}</div>
              )}
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <input
                  value={draft}
                  onChange={(e) => onDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') send() }}
                  placeholder={t('wataalam.telehealth.msg_ph', 'Andika ujumbe…')}
                  aria-label={t('wataalam.messages.write', 'Andika ujumbe')}
                  style={{ flex: 1, padding: 10, borderRadius: 999, border: `1px solid ${hexToRgba('#000', 0.12)}`, background: '#FAF5E5' }}
                />
                <button onClick={send} style={{ padding: '8px 18px', borderRadius: 999, background: JEWEL.tealMwenza, color: '#FAF5E5', border: 'none', fontWeight: 700, cursor: 'pointer' }}>{t('wataalam.common.send', 'Tuma')}</button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
