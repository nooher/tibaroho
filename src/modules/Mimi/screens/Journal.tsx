import { useEffect, useRef, useState, useMemo } from 'react'
import { JEWEL, NEUTRAL, RADII, TYPE, TEXT, CREAM, hexToRgba } from '../../../lib/glass'
import { PageShell, Card } from '../components/Shell'
import { Pill } from '../components/Pill'
import { MicButton } from '../../../components/MicButton'
import { listJournal, saveJournal, uid, type JournalEntry } from '../data/store'

const TOPICS = ['kazi', 'familia', 'afya', 'fedha', 'mahusiano', 'usingizi', 'matumaini']

type SpeechRec = {
  lang: string; interimResults: boolean; continuous: boolean
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onend: (() => void) | null
  start: () => void; stop: () => void
}

export default function JournalPage() {
  const [text, setText] = useState('')
  const [topics, setTopics] = useState<Set<string>>(new Set())
  const [mood, setMood] = useState<number>(6)
  const [image, setImage] = useState<string | undefined>()
  const [audio, setAudio] = useState<string | undefined>()
  const [transcript, setTranscript] = useState('')
  const [listening, setListening] = useState(false)
  const [recAudio, setRecAudio] = useState(false)
  const [entries, setEntries] = useState<JournalEntry[]>(() => listJournal())
  const recRef = useRef<SpeechRec | null>(null)
  const mediaRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  useEffect(() => () => { try { recRef.current?.stop() } catch {/* ignore */} }, [])

  function toggleTopic(t: string) {
    const next = new Set(topics)
    if (next.has(t)) next.delete(t); else next.add(t)
    setTopics(next)
  }

  function onImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    const r = new FileReader(); r.onload = () => setImage(String(r.result)); r.readAsDataURL(file)
  }

  function startVoice() {
    const w = window as unknown as { SpeechRecognition?: new () => SpeechRec; webkitSpeechRecognition?: new () => SpeechRec }
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition
    if (!Ctor) { alert('Sauti haitumiki kwenye kifaa hiki.'); return }
    const rec = new Ctor()
    rec.lang = 'sw-TZ'; rec.interimResults = true; rec.continuous = true
    rec.onresult = (e) => {
      let t = ''
      for (let k = 0; k < e.results.length; k++) t += e.results[k][0].transcript
      setTranscript(t)
    }
    rec.onend = () => setListening(false)
    recRef.current = rec
    setListening(true); rec.start()
  }
  function stopVoice() { try { recRef.current?.stop() } catch {/* ignore */} setListening(false) }

  async function startAudio() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      chunksRef.current = []
      mr.ondataavailable = (e) => chunksRef.current.push(e.data)
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const r = new FileReader(); r.onload = () => setAudio(String(r.result)); r.readAsDataURL(blob)
        stream.getTracks().forEach((t) => t.stop())
      }
      mediaRef.current = mr; mr.start(); setRecAudio(true)
    } catch { alert('Imeshindikana kufikia maikrofoni.') }
  }
  function stopAudio() { try { mediaRef.current?.stop() } catch {/* ignore */} setRecAudio(false) }

  function save() {
    if (!text.trim() && !audio && !image && !transcript.trim()) return
    const entry: JournalEntry = {
      id: uid(),
      takenAt: new Date().toISOString(),
      text: text.trim() || undefined,
      audioDataUrl: audio,
      imageDataUrl: image,
      voiceTranscript: transcript.trim() || undefined,
      mood,
      topics: [...topics],
    }
    saveJournal(entry)
    setEntries(listJournal())
    setText(''); setTranscript(''); setAudio(undefined); setImage(undefined); setTopics(new Set()); setMood(6)
  }

  const grouped = useMemo(() => {
    const m = new Map<string, JournalEntry[]>()
    for (const e of entries) {
      const d = e.takenAt.slice(0, 10)
      if (!m.has(d)) m.set(d, [])
      m.get(d)!.push(e)
    }
    return [...m.entries()]
  }, [entries])

  return (
    <PageShell title="Shajara yangu" subtitle="Andika, sema, piga picha — historia yako ya hisia." back={{ to: '/mimi' }}>
      <Card jewel={JEWEL.tealRoho}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Pill tone="teal">Ingizo jipya</Pill>
          <MicButton onTranscript={(t) => setText((cur) => (cur ? cur + ' ' + t : t))} />
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          placeholder="Leo nimehisi…"
          aria-label="Andika ingizo lako la shajara"
          style={{
            width: '100%', marginTop: 14, padding: 14, borderRadius: RADII.card,
            background: CREAM.milk,
            border: '1px solid rgba(11,9,8,0.22)',
            color: TEXT.body, fontFamily: TYPE.serif, fontSize: 16, lineHeight: 1.5, resize: 'vertical',
          }}
        />

        {transcript && (
          <p style={{ marginTop: 10, padding: 10, borderRadius: RADII.card, background: JEWEL.indigoWisdom, color: TEXT.onJewel, fontSize: 13 }}>
            🎙 {transcript}
          </p>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
          {TOPICS.map((t) => {
            const on = topics.has(t)
            return (
              <button key={t} onClick={() => toggleTopic(t)} aria-pressed={on} style={chipStyle(on)}>#{t}</button>
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginTop: 14 }}>
          <label style={{ fontSize: 13, color: TEXT.muted }}>Hisia: {mood}</label>
          <input type="range" min={0} max={10} value={mood} onChange={(e) => setMood(Number(e.target.value))} aria-label="Hisia za sasa" style={{ flex: 1, accentColor: JEWEL.goldHope }} />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 16 }}>
          <button onClick={listening ? stopVoice : startVoice} style={btn(listening ? JEWEL.maroonCrisis : JEWEL.indigoWisdom)}>
            {listening ? '● Inasikiliza…' : '🎤 Sema'}
          </button>
          <button onClick={recAudio ? stopAudio : startAudio} style={btn(recAudio ? JEWEL.maroonCrisis : JEWEL.tealRoho)}>
            {recAudio ? '● Inarekodi…' : '🎵 Rekodi sauti'}
          </button>
          <label style={{ ...btn(JEWEL.tealRoho), cursor: 'pointer' }}>
            🖼 Picha
            <input type="file" accept="image/*" onChange={onImage} style={{ display: 'none' }} aria-label="Pakia picha" />
          </label>
          {(audio || image) && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: TEXT.muted, fontSize: 12 }}>
              {audio && '🎵 sauti tayari'} {image && '🖼 picha tayari'}
            </div>
          )}
          <button onClick={save} style={{ ...btn(JEWEL.goldHope), color: NEUTRAL.ink, fontWeight: 700, marginLeft: 'auto' }}>Hifadhi</button>
        </div>
      </Card>

      <h2 style={{ fontFamily: TYPE.serif, fontSize: 26, letterSpacing: TYPE.tighterTrack, margin: '32px 0 14px' }}>Kalenda ya shajara</h2>
      {grouped.length === 0 && <p style={{ color: TEXT.muted }}>Bado hakuna ingizo. Anza leo.</p>}
      {grouped.map(([day, es]) => (
        <Card key={day} jewel={JEWEL.indigoWisdom} style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <strong style={{ fontFamily: TYPE.serif, fontSize: 18 }}>{day}</strong>
            <Pill tone="indigo">{es.length} ingizo</Pill>
          </div>
          {es.map((e) => (
            <div key={e.id} style={{ padding: '12px 0', borderTop: `1px solid ${hexToRgba(NEUTRAL.ink, 0.10)}` }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, color: TEXT.muted, fontSize: 12 }}>
                <span>{new Date(e.takenAt).toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' })}</span>
                {typeof e.mood === 'number' && <Pill tone={e.mood >= 7 ? 'gold' : e.mood >= 4 ? 'teal' : 'maroon'}>hisia {e.mood}</Pill>}
                {e.topics.map((t) => <span key={t} style={{ color: TEXT.muted }}>#{t}</span>)}
              </div>
              {e.text && <p style={{ margin: '4px 0', fontFamily: TYPE.serif, fontSize: 15 }}>{e.text}</p>}
              {e.voiceTranscript && <p style={{ fontSize: 13, color: TEXT.body }}>🎙 {e.voiceTranscript}</p>}
              {e.audioDataUrl && <audio controls src={e.audioDataUrl} style={{ width: '100%', marginTop: 6 }} />}
              {e.imageDataUrl && <img src={e.imageDataUrl} alt="Picha ya shajara" style={{ maxWidth: 240, borderRadius: RADII.card, marginTop: 6 }} />}
            </div>
          ))}
        </Card>
      ))}
    </PageShell>
  )
}

function btn(bg: string): React.CSSProperties {
  return { padding: '10px 16px', borderRadius: RADII.chip, background: bg, border: 'none', color: TEXT.onJewel, cursor: 'pointer', fontSize: 13 }
}
function chipStyle(on: boolean): React.CSSProperties {
  return {
    padding: '6px 12px', borderRadius: RADII.chip,
    background: on ? JEWEL.tealRoho : 'rgba(250,245,229,0.85)',
    border: `1px solid ${on ? JEWEL.goldHope : 'rgba(11,9,8,0.10)'}`,
    color: on ? TEXT.onJewel : TEXT.body, fontSize: 12, cursor: 'pointer',
  }
}
