import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { JEWEL, TYPE, TEXT, hexToRgba } from '../../../lib/glass'

interface JitsiApiLike {
  dispose: () => void
}

interface JitsiCtor {
  new (domain: string, options: Record<string, unknown>): JitsiApiLike
}

function getJitsiCtor(): JitsiCtor | undefined {
  const w = window as unknown as { JitsiMeetExternalAPI?: unknown }
  if (typeof w.JitsiMeetExternalAPI === 'function') return w.JitsiMeetExternalAPI as JitsiCtor
  return undefined
}

const SCRIPT_URL = 'https://meet.jit.si/external_api.js'

interface ChecklistKey { key: 'mic' | 'camera' | 'lighting' | 'private'; label: string }
const CHECKLIST: ChecklistKey[] = [
  { key: 'mic', label: 'Mic inafanya kazi' },
  { key: 'camera', label: 'Kamera iko safi' },
  { key: 'lighting', label: 'Mwanga unatosha usoni' },
  { key: 'private', label: 'Mahali pana faragha' },
]

export default function JitsiSession() {
  const { roomId } = useParams<{ roomId: string }>()
  const containerRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<JitsiApiLike | null>(null)
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [started, setStarted] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [notes, setNotes] = useState('')
  const [recording, setRecording] = useState(false)
  const [phq9, setPhq9] = useState('')
  const [nextStep, setNextStep] = useState('')
  const [referral, setReferral] = useState(false)
  const [rxNote, setRxNote] = useState('')

  const allChecked = CHECKLIST.every((c) => checked[c.key])
  const NOTES_KEY = `tumaini.wataalam.session_notes.${roomId ?? 'room'}`

  useEffect(() => {
    try { const v = localStorage.getItem(NOTES_KEY); if (v) setNotes(v) } catch { /* ignore */ }
  }, [NOTES_KEY])

  useEffect(() => {
    if (!started) return
    const t = setInterval(() => {
      setElapsed((e) => e + 1)
      try { localStorage.setItem(NOTES_KEY, notes) } catch { /* ignore */ }
    }, 2000)
    return () => clearInterval(t)
  }, [started, notes, NOTES_KEY])

  useEffect(() => {
    if (!started || !containerRef.current) return
    let cancelled = false

    function mount(): void {
      const Ctor = getJitsiCtor()
      if (!Ctor || !containerRef.current) return
      apiRef.current = new Ctor('meet.jit.si', {
        roomName: `tumaini-${roomId ?? 'general'}`,
        parentNode: containerRef.current,
        width: '100%',
        height: 480,
        configOverwrite: { startWithAudioMuted: false, prejoinPageEnabled: false },
      })
    }

    if (getJitsiCtor()) {
      mount()
    } else {
      const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_URL}"]`)
      if (existing) {
        existing.addEventListener('load', () => { if (!cancelled) mount() })
      } else {
        const s = document.createElement('script')
        s.src = SCRIPT_URL
        s.async = true
        s.onload = () => { if (!cancelled) mount() }
        document.head.appendChild(s)
      }
    }

    return () => {
      cancelled = true
      try { apiRef.current?.dispose() } catch { /* ignore */ }
      apiRef.current = null
    }
  }, [started, roomId])

  function fmt(sec: number): string {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div style={{ padding: '20px 22px 80px', fontFamily: TYPE.sans }}>
      <Link to="/wataalam/video" style={{ color: JEWEL.tealMwenza, fontSize: 14, textDecoration: 'none' }}>← Lobby ya telehealth</Link>
      <h1 style={{ fontFamily: TYPE.serif, fontWeight: 800, color: JEWEL.tealDeep, fontSize: 30, marginBottom: 4 }}>Kikao cha video</h1>
      <div style={{ color: TEXT.muted, marginBottom: 16 }}>Chumba: <code>{roomId}</code></div>

      {!started && (
        <div style={{ background: '#FAF5E5', padding: 18, borderRadius: 18, border: `1px solid ${hexToRgba('#000', 0.08)}`, marginBottom: 18 }}>
          <h3 style={{ marginTop: 0, fontFamily: TYPE.serif, color: JEWEL.tealDeep }}>Orodha ya kuangalia kabla ya kuanza</h3>
          <div style={{ display: 'grid', gap: 8 }}>
            {CHECKLIST.map((c) => (
              <label key={c.key} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input type="checkbox" checked={!!checked[c.key]} onChange={(e) => setChecked((s) => ({ ...s, [c.key]: e.target.checked }))} />
                <span>{c.label}</span>
              </label>
            ))}
            <label style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 }}>
              <input type="checkbox" checked={recording} onChange={(e) => setRecording(e.target.checked)} />
              <span>Nakubali kurekodi kikao (chaguo la hiari)</span>
            </label>
          </div>
          <button
            onClick={() => setStarted(true)}
            disabled={!allChecked}
            style={{
              marginTop: 14,
              padding: '10px 22px',
              borderRadius: 999,
              background: allChecked ? JEWEL.tealMwenza : hexToRgba(JEWEL.tealMwenza, 0.3),
              color: '#FAF5E5',
              border: 'none',
              fontWeight: 700,
              cursor: allChecked ? 'pointer' : 'not-allowed',
            }}
          >Anza kikao</button>
        </div>
      )}

      {started && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontWeight: 700, color: JEWEL.tealDeep }}>Muda: {fmt(elapsed)}</span>
            <Link
              to="/mimi/dharura"
              style={{ background: JEWEL.maroonCrisis, color: '#FAF5E5', padding: '8px 14px', borderRadius: 999, textDecoration: 'none', fontWeight: 700 }}
              aria-label="Rafiki-mlinzi: nenda dharura"
            >Rafiki-mlinzi</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(280px, 1fr)', gap: 16 }}>
            <div ref={containerRef} style={{ minHeight: 480, background: '#000', borderRadius: 14, overflow: 'hidden' }} aria-label="Jitsi video" />
            <div>
              <h3 style={{ marginTop: 0, fontFamily: TYPE.serif, color: JEWEL.tealDeep }}>Notes</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={16}
                aria-label="Notes za kikao"
                placeholder="Andika notes hapa — zinahifadhiwa kila baada ya sekunde 2."
                style={{ width: '100%', padding: 10, borderRadius: 12, border: `1px solid ${hexToRgba('#000', 0.12)}`, fontFamily: TYPE.sans, fontSize: 14, background: '#FAF5E5' }}
              />
            </div>
          </div>

          <div style={{ marginTop: 22, padding: 16, background: '#FAF5E5', borderRadius: 18, border: `1px solid ${hexToRgba('#000', 0.08)}` }}>
            <h3 style={{ marginTop: 0, fontFamily: TYPE.serif, color: JEWEL.tealDeep }}>Baada ya kikao</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
              <label>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Mabadiliko ya PHQ-9</div>
                <input type="number" value={phq9} onChange={(e) => setPhq9(e.target.value)} placeholder="km. -3" style={{ width: '100%', padding: 8, borderRadius: 10, border: `1px solid ${hexToRgba('#000', 0.12)}`, marginTop: 4 }} />
              </label>
              <label>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Hatua inayofuata</div>
                <textarea value={nextStep} onChange={(e) => setNextStep(e.target.value)} rows={3} style={{ width: '100%', padding: 8, borderRadius: 10, border: `1px solid ${hexToRgba('#000', 0.12)}`, marginTop: 4 }} />
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={referral} onChange={(e) => setReferral(e.target.checked)} />
                <span>Tuma rufaa</span>
              </label>
              <label>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Daraja la dawa</div>
                <textarea value={rxNote} onChange={(e) => setRxNote(e.target.value)} rows={3} placeholder="Andika dawa kwa kifupi" style={{ width: '100%', padding: 8, borderRadius: 10, border: `1px solid ${hexToRgba('#000', 0.12)}`, marginTop: 4 }} />
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
