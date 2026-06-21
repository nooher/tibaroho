import { useEffect, useRef, useState } from 'react'
import { JEWEL, NEUTRAL, RADII, MOTION, TYPE, TEXT, CREAM, glass, focusRing } from '../../../lib/glass'
import { useLang } from '../../../lib/i18n/Provider'
import { saveMood, uid } from '../data/store'
import { Pill } from './Pill'

const EMOTIONS: Array<{ id: string; sw: string; key: string }> = [
  { id: 'amani', sw: 'Amani', key: 'mimi.mood.amani' },
  { id: 'furaha', sw: 'Furaha', key: 'mimi.mood.furaha' },
  { id: 'shukrani', sw: 'Shukrani', key: 'mimi.mood.shukrani' },
  { id: 'wasiwasi', sw: 'Wasiwasi', key: 'mimi.mood.wasiwasi' },
  { id: 'huzuni', sw: 'Huzuni', key: 'mimi.mood.huzuni' },
  { id: 'hasira', sw: 'Hasira', key: 'mimi.mood.hasira' },
  { id: 'upweke', sw: 'Upweke', key: 'mimi.mood.upweke' },
  { id: 'hofu', sw: 'Hofu', key: 'mimi.mood.hofu' },
  { id: 'matumaini', sw: 'Matumaini', key: 'mimi.mood.matumaini' },
  { id: 'uchovu', sw: 'Uchovu', key: 'mimi.mood.uchovu' },
]

type SpeechRec = {
  lang: string
  interimResults: boolean
  continuous: boolean
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

export function MoodCheck({ onSaved }: { onSaved?: () => void }) {
  const { t } = useLang()
  const [score, setScore] = useState(6)
  const [picked, setPicked] = useState<Set<string>>(new Set())
  const [note, setNote] = useState('')
  const [listening, setListening] = useState(false)
  const recRef = useRef<SpeechRec | null>(null)

  useEffect(() => () => { try { recRef.current?.stop() } catch {/* ignore */} }, [])

  function toggle(id: string) {
    const next = new Set(picked)
    if (next.has(id)) next.delete(id); else next.add(id)
    setPicked(next)
  }

  function startVoice() {
    const w = window as unknown as { SpeechRecognition?: new () => SpeechRec; webkitSpeechRecognition?: new () => SpeechRec }
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition
    if (!Ctor) { alert(t('mimi.mood.voice-unsupported', 'Kifaa hiki hakitumii sauti.')); return }
    const rec = new Ctor()
    rec.lang = 'sw-TZ'
    rec.interimResults = true
    rec.continuous = false
    rec.onresult = (e) => {
      let text = ''
      for (let k = 0; k < e.results.length; k++) text += e.results[k][0].transcript
      setNote((prev) => (prev ? prev + ' ' : '') + text)
    }
    rec.onend = () => setListening(false)
    recRef.current = rec
    setListening(true)
    rec.start()
  }
  function stopVoice() { try { recRef.current?.stop() } catch {/* ignore */} setListening(false) }

  function save() {
    saveMood({
      id: uid(),
      takenAt: new Date().toISOString(),
      score,
      emotions: [...picked],
      note: note.trim() || undefined,
    })
    setNote(''); setPicked(new Set()); setScore(6)
    onSaved?.()
  }

  const tone = score >= 7 ? JEWEL.goldHope : score >= 4 ? JEWEL.tealRoho : JEWEL.maroonCrisis

  return (
    <section
      aria-label={t('mimi.mood.section-aria', 'Salama leo? — kipimo cha hisia')}
      style={{ ...glass(JEWEL.tealRoho, 0.12), padding: 22, color: TEXT.body, fontFamily: TYPE.sans, borderRadius: RADII.sheet }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontFamily: TYPE.serif, fontSize: 22, letterSpacing: TYPE.tighterTrack }}>{t('mimi.mood.heading', 'Salama leo?')}</h3>
        <Pill tone="teal">{t('mimi.mood.quick-check', 'Kipimo cha haraka')}</Pill>
      </header>

      <label htmlFor="mood-range" style={{ display: 'block', fontSize: 13, color: TEXT.muted, marginBottom: 6 }}>
        {t('mimi.mood.range-label', 'Hisia za sasa (0 = ngumu sana, 10 = amani kubwa)')}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <input
          id="mood-range"
          type="range"
          min={0}
          max={10}
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          aria-valuetext={`${t('mimi.mood.feelings-label', 'Hisia')}: ${score} / 10`}
          style={{ flex: 1, accentColor: tone }}
        />
        <span style={{ fontFamily: TYPE.serif, fontSize: 30, lineHeight: 1, color: tone, minWidth: 44, textAlign: 'right' }}>{score}</span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
        {EMOTIONS.map((e) => {
          const on = picked.has(e.id)
          return (
            <button
              key={e.id}
              type="button"
              onClick={() => toggle(e.id)}
              aria-pressed={on}
              style={{
                padding: '7px 14px',
                borderRadius: RADII.chip,
                background: on ? JEWEL.tealRoho : 'rgba(250,245,229,0.85)',
                border: `1px solid ${on ? JEWEL.goldHope : 'rgba(11,9,8,0.10)'}`,
                color: on ? TEXT.onJewel : TEXT.body,
                fontSize: 13,
                cursor: 'pointer',
                transition: `background ${MOTION.fast}`,
              }}
            >
              {t(e.key, e.sw)}
            </button>
          )
        })}
      </div>

      <label htmlFor="mood-note" style={{ display: 'block', fontSize: 13, color: TEXT.muted, margin: '18px 0 6px' }}>{t('mimi.mood.note-label', 'Andika au sema kwa ufupi')}</label>
      <textarea
        id="mood-note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        aria-label={t('mimi.mood.note-aria', 'Maelezo mafupi ya hisia zako')}
        rows={3}
        style={{
          width: '100%',
          padding: 12,
          borderRadius: RADII.card,
          background: CREAM.milk,
          border: '1px solid rgba(11,9,8,0.22)',
          color: TEXT.body,
          fontFamily: TYPE.sans,
          fontSize: 14,
          resize: 'vertical',
          ...(listening ? focusRing(JEWEL.goldHope) : {}),
        }}
        placeholder={t('mimi.mood.note-ph', 'Mfano: Nilihisi amani asubuhi…')}
      />

      <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
        <button
          type="button"
          onClick={listening ? stopVoice : startVoice}
          aria-label={listening ? t('mimi.mood.stop-voice', 'Simamisha sauti') : t('mimi.mood.speak-sw', 'Sema kwa Kiswahili')}
          style={{
            padding: '10px 16px',
            borderRadius: RADII.chip,
            background: listening ? JEWEL.maroonCrisis : 'rgba(250,245,229,0.85)',
            border: listening ? 'none' : '1px solid rgba(11,9,8,0.10)',
            color: listening ? TEXT.onJewel : TEXT.body,
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          {listening ? t('mimi.mood.listening', '● Inasikiliza…') : t('mimi.mood.speak', '🎤 Sema')}
        </button>
        <button
          type="button"
          onClick={save}
          aria-label={t('mimi.mood.save-aria', 'Hifadhi kipimo cha hisia')}
          style={{
            padding: '11px 22px',
            borderRadius: RADII.chip,
            background: JEWEL.goldHope,
            border: 'none',
            color: NEUTRAL.ink,
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          {t('mimi.mood.save', 'Hifadhi')}
        </button>
      </footer>
    </section>
  )
}
