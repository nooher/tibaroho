import { useEffect, useState, useCallback } from 'react'
import { PageShell, Card } from '../components/Shell'
import { JEWEL, TYPE, TEXT, hexToRgba } from '../../../lib/glass'
import { useLang } from '../../../lib/i18n/Provider'
import { listChannels, listMessages, sendMessage, markRead, type ChatChannel, type ChatMessage } from '../../../lib/chat'

const ME = 'me'

export default function MimiMessages() {
  const { t } = useLang()
  const TABS: Array<{ key: 'patient_provider' | 'peer_group' | 'mwenza'; label: string }> = [
    { key: 'patient_provider', label: t('mimi.msg.tab.providers', 'Wataalamu') },
    { key: 'peer_group', label: t('mimi.msg.tab.groups', 'Vikundi') },
    { key: 'mwenza', label: t('mimi.msg.tab.companion', 'Mwenza') },
  ]
  const [tab, setTab] = useState<typeof TABS[number]['key']>('patient_provider')
  const [channels, setChannels] = useState<ChatChannel[]>([])
  const [openId, setOpenId] = useState<string | null>(null)
  const [msgs, setMsgs] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')

  useEffect(() => {
    setChannels(listChannels(ME))
  }, [])

  const refreshMsgs = useCallback((id: string) => {
    setMsgs(listMessages(id))
  }, [])

  function open(id: string): void {
    setOpenId(id)
    refreshMsgs(id)
    const last = listMessages(id).slice(-1)[0]
    if (last) markRead(id, ME, last.id)
    setChannels(listChannels(ME))
  }

  function send(): void {
    if (!openId || !draft.trim()) return
    sendMessage(openId, ME, draft.trim())
    setDraft('')
    refreshMsgs(openId)
  }

  const filtered = channels.filter((c) => c.kind === tab)

  return (
    <PageShell title={t('mimi.msg.title', 'Mazungumzo')} subtitle={t('mimi.msg.subtitle', 'Mazungumzo na wataalamu, vikundi vya wenzako, na Rafiki wako.')} back={{ to: '/mimi', label: t('mimi.nav.back', 'Mimi') }}>
      <div role="tablist" style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {TABS.map((tb) => (
          <button
            key={tb.key}
            role="tab"
            aria-selected={tab === tb.key}
            onClick={() => { setTab(tb.key); setOpenId(null) }}
            style={{
              padding: '8px 16px',
              borderRadius: 999,
              border: 'none',
              background: tab === tb.key ? JEWEL.tealMwenza : hexToRgba(JEWEL.tealMwenza, 0.1),
              color: tab === tb.key ? TEXT.onJewel : JEWEL.tealMwenza,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >{tb.label}</button>
        ))}
      </div>

      {!openId ? (
        <div style={{ display: 'grid', gap: 10 }}>
          {filtered.length === 0 ? (
            <Card><p style={{ margin: 0 }}>{t('mimi.msg.empty', 'Hakuna mazungumzo bado.')}</p></Card>
          ) : filtered.map((c) => (
            <Card key={c.id}>
              <button
                onClick={() => open(c.id)}
                style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                aria-label={`${t('mimi.msg.open-aria', 'Fungua mazungumzo')} ${c.title_sw ?? c.id}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ fontFamily: TYPE.serif, color: JEWEL.tealDeep }}>{c.title_sw ?? c.id}</strong>
                  {c.unread > 0 && <span style={{ background: JEWEL.goldHope, color: '#0B0908', borderRadius: 999, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{c.unread}</span>}
                </div>
                <div style={{ fontSize: 13, color: TEXT.muted, marginTop: 4 }}>{c.participants.length} {t('mimi.msg.participants', 'washiriki')}</div>
              </button>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <button
            onClick={() => setOpenId(null)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: JEWEL.tealMwenza, fontWeight: 600, marginBottom: 10 }}
          >{t('mimi.msg.back-list', '← Rudi kwenye mazungumzo')}</button>
          <div style={{ maxHeight: 380, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, padding: 8, background: '#F8F2D8', borderRadius: 14 }}>
            {msgs.length === 0 && <p style={{ color: TEXT.muted, textAlign: 'center' }}>{t('mimi.msg.start', 'Hakuna ujumbe bado. Anza mazungumzo.')}</p>}
            {msgs.map((m) => (
              <div key={m.id} style={{ alignSelf: m.senderId === ME ? 'flex-end' : 'flex-start', maxWidth: '78%' }}>
                <div style={{
                  padding: '8px 12px',
                  borderRadius: 14,
                  background: m.senderId === ME ? JEWEL.tealMwenza : '#FAF5E5',
                  color: m.senderId === ME ? TEXT.onJewel : TEXT.body,
                  border: m.senderId === ME ? 'none' : `1px solid ${hexToRgba('#000', 0.08)}`,
                }}>{m.body}</div>
                <div style={{ fontSize: 10, color: TEXT.muted, marginTop: 2, textAlign: m.senderId === ME ? 'right' : 'left' }}>
                  {new Date(m.ts).toLocaleTimeString('sw-TZ')}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') send() }}
              placeholder={t('mimi.msg.compose-ph', 'Andika ujumbe…')}
              aria-label={t('mimi.msg.compose-aria', 'Andika ujumbe')}
              style={{ flex: 1, padding: 10, borderRadius: 999, border: `1px solid ${hexToRgba('#000', 0.12)}`, background: '#FAF5E5' }}
            />
            <button
              onClick={send}
              style={{ padding: '8px 18px', borderRadius: 999, background: JEWEL.tealMwenza, color: TEXT.onJewel, border: 'none', fontWeight: 700, cursor: 'pointer' }}
            >{t('mimi.msg.send', 'Tuma')}</button>
          </div>
        </Card>
      )}
    </PageShell>
  )
}
