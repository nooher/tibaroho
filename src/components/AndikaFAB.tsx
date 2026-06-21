import { useEffect, useRef, useState } from 'react'
import { CREAM, JEWEL, NEUTRAL, TEXT, hexToRgba, focusRing } from '../lib/glass'
import { saveNote } from '../lib/andika'
import { listen, voiceSupported } from '../lib/rafiki/voice'
import { useLang } from '../lib/i18n/Provider'

const MOOD_KEYS = ['mood.furaha', 'mood.utulivu', 'mood.wasiwasi', 'mood.huzuni', 'mood.hasira'] as const
const MOODS = ['Furaha', 'Utulivu', 'Wasiwasi', 'Huzuni', 'Hasira']
const TAGS = ['kazi', 'familia', 'afya', 'ndoto', 'shukrani']

interface FabState {
  open: boolean
  text: string
  mood: string | null
  tags: string[]
  imageDataUrl: string | undefined
  recording: boolean
  saving: boolean
  saved: boolean
  error: string | null
  small: boolean
}

export function AndikaFAB() {
  const { t } = useLang()
  const [s, setS] = useState<FabState>({
    open: false,
    text: '',
    mood: null,
    tags: [],
    imageDataUrl: undefined,
    recording: false,
    saving: false,
    saved: false,
    error: null,
    small: typeof window !== 'undefined' ? window.innerWidth < 380 : false,
  })
  const fileRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const onResize = () => setS((p) => ({ ...p, small: window.innerWidth < 380 }))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (!s.open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setS((p) => ({ ...p, open: false }))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [s.open])

  const supported = voiceSupported()
  const offset = s.small ? 16 : 24

  const handleSave = async () => {
    if (!s.text.trim()) return
    setS((p) => ({ ...p, saving: true, error: null }))
    try {
      saveNote({
        text: s.text.trim(),
        mood: s.mood ?? undefined,
        tags: s.tags,
        imageDataUrl: s.imageDataUrl,
      })
      setS((p) => ({
        ...p,
        saving: false,
        saved: true,
        text: '',
        mood: null,
        tags: [],
        imageDataUrl: undefined,
      }))
      setTimeout(() => setS((p) => ({ ...p, saved: false, open: false })), 900)
    } catch {
      setS((p) => ({ ...p, saving: false, error: t('ui.imeshindikana', 'Imeshindikana kuhifadhi') }))
    }
  }

  const handleVoice = async () => {
    if (!supported.listen) return
    setS((p) => ({ ...p, recording: true, error: null }))
    try {
      const transcript = await listen('sw')
      setS((p) => ({
        ...p,
        recording: false,
        text: (p.text + ' ' + transcript).trim(),
      }))
    } catch {
      setS((p) => ({ ...p, recording: false, error: t('ui.sauti_haijapatikana', 'Sauti haijapatikana') }))
    }
  }

  const handleFile = (file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setS((p) => ({ ...p, imageDataUrl: reader.result as string }))
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <>
      <button
        aria-label={t('ui.andika_kumbukumbu', 'Andika kumbukumbu')}
        onClick={() => setS((p) => ({ ...p, open: true }))}
        style={{
          position: 'fixed',
          right: offset,
          bottom: offset,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: CREAM.milk,
          border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.18)}`,
          boxShadow: '0 10px 28px rgba(11,9,8,0.18), inset 0 1px 0 rgba(255,255,255,0.7)',
          display: 'grid',
          placeItems: 'center',
          cursor: 'pointer',
          zIndex: 920,
          color: JEWEL.tealMwenza,
          fontStyle: 'normal',
        }}
        onFocus={(e) => Object.assign(e.currentTarget.style, focusRing(JEWEL.tealMwenza))}
        onBlur={(e) => { e.currentTarget.style.outline = 'none' }}
      >
        <svg width={22} height={22} viewBox="0 0 24 24" aria-hidden>
          <path
            d="M3 21l3.5-1 11.6-11.6a2.5 2.5 0 0 0-3.5-3.5L3 16.5V21z M14 7l3 3"
            fill="none"
            stroke={JEWEL.tealMwenza}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {s.open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t('ui.andika_kumbukumbu', 'Andika kumbukumbu')}
          onClick={() => setS((p) => ({ ...p, open: false }))}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1050,
            background: hexToRgba(NEUTRAL.ink, 0.42),
            display: 'grid',
            placeItems: 'end center',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'min(560px, 96vw)',
              background: CREAM.milk,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.1)}`,
              boxShadow: '0 -20px 60px rgba(11,9,8,0.22)',
              padding: 22,
              maxHeight: '90vh',
              overflowY: 'auto',
              color: NEUTRAL.ink,
              fontStyle: 'normal',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: 22,
                  margin: 0,
                  color: JEWEL.tealDeep,
                  letterSpacing: '-0.3px',
                  fontWeight: 800,
                  fontStyle: 'normal',
                }}
              >
                {t('ui.andika_kumbukumbu', 'Andika kumbukumbu')}
              </h2>
              <button
                onClick={() => setS((p) => ({ ...p, open: false }))}
                aria-label={t('ui.funga', 'Funga')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: TEXT.muted,
                  fontSize: 20,
                  cursor: 'pointer',
                  fontStyle: 'normal',
                }}
              >
                ×
              </button>
            </div>

            <textarea
              value={s.text}
              onChange={(e) => setS((p) => ({ ...p, text: e.target.value }))}
              placeholder={t('ui.andika_unayohisi', 'Andika unayohisi sasa…')}
              rows={4}
              aria-label={t('ui.andika_kumbukumbu', 'Andika kumbukumbu')}
              style={{
                marginTop: 12,
                width: '100%',
                resize: 'vertical',
                padding: 12,
                borderRadius: 14,
                background: CREAM.ivory,
                border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.14)}`,
                fontSize: 15,
                lineHeight: 1.45,
                color: NEUTRAL.ink,
                fontFamily: "'Inter', system-ui, sans-serif",
                fontStyle: 'normal',
              }}
            />

            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12, color: TEXT.muted, marginBottom: 6, fontStyle: 'normal' }}>
                {t('ui.hisia', 'Hisia')}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {MOODS.map((m, idx) => {
                  const moodKey = MOOD_KEYS[idx]
                  const moodLabel = moodKey ? t(moodKey, m) : m
                  const active = s.mood === m
                  return (
                    <button
                      key={m}
                      onClick={() => setS((p) => ({ ...p, mood: active ? null : m }))}
                      aria-pressed={active}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 999,
                        border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.18)}`,
                        background: active ? JEWEL.tealMwenza : CREAM.ivory,
                        color: active ? CREAM.cream : NEUTRAL.ink,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontStyle: 'normal',
                      }}
                    >
                      {moodLabel}
                    </button>
                  )
                })}
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12, color: TEXT.muted, marginBottom: 6, fontStyle: 'normal' }}>
                {t('ui.vitambulisho', 'Vitambulisho')}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {TAGS.map((t) => {
                  const active = s.tags.includes(t)
                  return (
                    <button
                      key={t}
                      onClick={() =>
                        setS((p) => ({
                          ...p,
                          tags: active ? p.tags.filter((x) => x !== t) : [...p.tags, t],
                        }))
                      }
                      aria-pressed={active}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 999,
                        border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.18)}`,
                        background: active ? JEWEL.goldHope : CREAM.ivory,
                        color: active ? CREAM.cream : NEUTRAL.ink,
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontStyle: 'normal',
                      }}
                    >
                      #{t}
                    </button>
                  )
                })}
              </div>
            </div>

            <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                onClick={handleVoice}
                disabled={!supported.listen || s.recording}
                aria-label={t('ui.sauti', 'Sauti')}
                style={{
                  padding: '8px 14px',
                  borderRadius: 999,
                  background: s.recording ? JEWEL.maroonCrisis : CREAM.ivory,
                  color: s.recording ? CREAM.cream : JEWEL.tealMwenza,
                  border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.18)}`,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: supported.listen ? 'pointer' : 'not-allowed',
                  opacity: supported.listen ? 1 : 0.5,
                  fontStyle: 'normal',
                }}
              >
                {s.recording ? t('ui.inasikiliza', 'Inasikiliza…') : t('ui.sauti', 'Sauti')}
              </button>
              <button
                onClick={() => fileRef.current?.click()}
                aria-label={t('ui.ambatisha_picha', 'Ambatisha picha')}
                style={{
                  padding: '8px 14px',
                  borderRadius: 999,
                  background: CREAM.ivory,
                  color: JEWEL.tealMwenza,
                  border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.18)}`,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontStyle: 'normal',
                }}
              >
                {s.imageDataUrl ? t('ui.picha_imeambatishwa', 'Picha imeambatishwa') : t('ui.ambatisha_picha', 'Ambatisha picha')}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleFile(e.target.files?.[0] ?? undefined)}
              />
            </div>

            {s.imageDataUrl && (
              <img
                src={s.imageDataUrl}
                alt={t('ui.picha_imeambatishwa', 'Picha imeambatishwa')}
                style={{
                  marginTop: 10,
                  maxWidth: '100%',
                  maxHeight: 160,
                  borderRadius: 12,
                  border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.12)}`,
                }}
              />
            )}

            {s.error && (
              <div
                role="alert"
                style={{
                  marginTop: 10,
                  fontSize: 13,
                  color: JEWEL.maroonCrisis,
                  fontStyle: 'normal',
                }}
              >
                {s.error}
              </div>
            )}

            <div style={{ marginTop: 18, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button
                onClick={() => setS((p) => ({ ...p, open: false }))}
                style={{
                  padding: '10px 18px',
                  borderRadius: 999,
                  background: 'transparent',
                  color: TEXT.muted,
                  border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.18)}`,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontStyle: 'normal',
                }}
              >
                {t('ui.ghairi', 'Ghairi')}
              </button>
              <button
                onClick={handleSave}
                disabled={!s.text.trim() || s.saving}
                aria-label={t('ui.hifadhi', 'Hifadhi')}
                style={{
                  padding: '10px 22px',
                  borderRadius: 999,
                  background: JEWEL.tealMwenza,
                  color: CREAM.cream,
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: s.text.trim() ? 'pointer' : 'not-allowed',
                  opacity: s.text.trim() ? 1 : 0.5,
                  fontStyle: 'normal',
                }}
              >
                {s.saved ? t('ui.imehifadhiwa', 'Imehifadhiwa') : s.saving ? t('ui.inahifadhi', 'Inahifadhi…') : t('ui.hifadhi', 'Hifadhi')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AndikaFAB
