import { useEffect, useRef, useState } from 'react'
import { JEWEL, RADII, TYPE, TEXT, CREAM, hexToRgba } from '../../../lib/glass'
import { Card, H1, buttonStyle } from '../components/Card'
import { useLang } from '../../../lib/i18n/Provider'

/**
 * Telehealth — video + audio + chat shell. WebRTC integration is stubbed:
 * a placeholder remote tile plus local camera preview via getUserMedia when
 * available. Real signalling will replace this in v2.
 */
export default function Telehealth() {
  const { t } = useLang()
  const localRef = useRef<HTMLVideoElement | null>(null)
  const [cameraOn, setCameraOn] = useState(false)
  const [micOn, setMicOn] = useState(true)
  const [streamErr, setStreamErr] = useState<string | null>(null)
  const [messages, setMessages] = useState<{ who: 'mtaalamu' | 'mteja'; text: string }[]>([
    { who: 'mteja', text: 'Habari za asubuhi.' },
  ])
  const [draft, setDraft] = useState('')
  const [notes, setNotes] = useState('')
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!cameraOn) return
    let stream: MediaStream | null = null
    ;(async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: micOn,
        })
        if (localRef.current) {
          localRef.current.srcObject = stream
          await localRef.current.play().catch(() => {})
        }
      } catch (e) {
        setStreamErr(t('wataalam.telehealth.camera_err', 'Hatuwezi kufikia kamera. Hakikisha umetoa idhini ya kivinjari.'))
        setCameraOn(false)
      }
    })()
    return () => {
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [cameraOn, micOn])

  useEffect(() => {
    const id = window.setInterval(() => setElapsed((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [])

  function send() {
    if (!draft.trim()) return
    setMessages((m) => [...m, { who: 'mtaalamu', text: draft.trim() }])
    setDraft('')
  }

  return (
    <div>
      <H1 english="Telehealth">{t('wataalam.telehealth.title', 'Kipindi cha video')}</H1>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
        <Card title={`Mteja A · ${formatElapsed(elapsed)}`}>
          <div
            style={{
              position: 'relative',
              background: hexToRgba(JEWEL.tealDeep, 0.7),
              borderRadius: RADII.card,
              aspectRatio: '16/9',
              overflow: 'hidden',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <div
              aria-label="Mteja"
              style={{
                position: 'absolute',
                inset: 0,
                display: 'grid',
                placeItems: 'center',
                fontFamily: TYPE.serif,
                fontSize: 56,
                color: TEXT.onJewel,
                opacity: 0.35,
              }}
            >
              MA
            </div>
            <video
              ref={localRef}
              muted
              playsInline
              style={{
                position: 'absolute',
                right: 10,
                bottom: 10,
                width: '24%',
                aspectRatio: '4/3',
                background: '#000',
                borderRadius: 8,
                border: `1px solid ${hexToRgba(JEWEL.goldSoft, 0.4)}`,
                objectFit: 'cover',
                display: cameraOn ? 'block' : 'none',
              }}
            />
            {!cameraOn && (
              <div
                style={{
                  position: 'absolute',
                  right: 10,
                  bottom: 10,
                  width: '24%',
                  aspectRatio: '4/3',
                  background: hexToRgba(JEWEL.tealRoho, 0.6),
                  borderRadius: 8,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 11,
                  color: TEXT.onJewel,
                }}
              >
                {t('wataalam.telehealth.camera_off', 'Kamera imezimwa')}
              </div>
            )}
          </div>

          {streamErr && (
            <p
              role="alert"
              style={{
                marginTop: 12,
                color: TEXT.heading,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {streamErr}
            </p>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
            <button
              onClick={() => setCameraOn((v) => !v)}
              style={buttonStyle(cameraOn ? JEWEL.tealRoho : JEWEL.tealDeep, cameraOn)}
              aria-pressed={cameraOn}
            >
              {cameraOn ? t('wataalam.telehealth.cam_on', '📹 Kamera ON') : t('wataalam.telehealth.cam_start', '📹 Anza kamera')}
            </button>
            <button
              onClick={() => setMicOn((v) => !v)}
              style={buttonStyle(micOn ? JEWEL.tealRoho : JEWEL.tealDeep, micOn)}
              aria-pressed={micOn}
            >
              {micOn ? t('wataalam.telehealth.mic_on', '🎤 Mic ON') : t('wataalam.telehealth.mic_muted', '🎤 Mic MUTED')}
            </button>
            <div style={{ flex: 1 }} />
            <button style={buttonStyle(JEWEL.maroonCrisis, true)}>{t('wataalam.telehealth.end_session', 'Maliza kipindi')}</button>
          </div>
        </Card>

        <div style={{ display: 'grid', gap: 14 }}>
          <Card title={t('wataalam.telehealth.live_notes', 'Maandiko ya wakati huu')} english="Live notes">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={8}
              placeholder={t('wataalam.telehealth.notes_ph', 'Andika maelezo yako…')}
              style={{
                width: '100%',
                background: CREAM.milk,
                color: TEXT.body,
                border: '1px solid rgba(11,9,8,0.22)',
                borderRadius: RADII.card,
                padding: 12,
                fontFamily: TYPE.serif,
                fontSize: 14,
                resize: 'vertical',
                outline: 'none',
              }}
            />
            <p style={{ fontSize: 11, color: TEXT.muted, marginTop: 6 }}>
              {t('wataalam.telehealth.autosave', 'Yatahifadhiwa moja kwa moja kwenye sehemu ya Kumbukumbu.')}
            </p>
          </Card>

          <Card title={t('wataalam.telehealth.chat', 'Mazungumzo')}>
            <div
              style={{
                maxHeight: 220,
                overflowY: 'auto',
                display: 'grid',
                gap: 6,
                marginBottom: 10,
                paddingRight: 4,
              }}
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    alignSelf: m.who === 'mtaalamu' ? 'flex-end' : 'flex-start',
                    padding: '7px 12px',
                    borderRadius: 14,
                    background:
                      m.who === 'mtaalamu'
                        ? hexToRgba(JEWEL.goldHope, 0.35)
                        : 'rgba(250,245,229,0.85)',
                    border: m.who === 'mtaalamu' ? 'none' : '1px solid rgba(11,9,8,0.10)',
                    color: TEXT.body,
                    fontSize: 13,
                    maxWidth: '85%',
                  }}
                >
                  {m.text}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder={t('wataalam.telehealth.msg_ph', 'Andika ujumbe…')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 999,
                  background: CREAM.milk,
                  border: '1px solid rgba(11,9,8,0.22)',
                  color: TEXT.body,
                  outline: 'none',
                  fontFamily: TYPE.sans,
                  fontSize: 13,
                }}
              />
              <button onClick={send} style={buttonStyle(JEWEL.goldHope, true)}>
                {t('wataalam.common.send', 'Tuma')}
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function formatElapsed(s: number): string {
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`
}
