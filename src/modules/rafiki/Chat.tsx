import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { JEWEL, TEXT, TYPE, hexToRgba } from '../../lib/glass'
import { createRafiki, createRafikiSession, type RafikiSession } from '../../lib/rafiki/router'
import { allExperts } from '../../lib/rafiki/experts'
import type { RafikiAnswer } from '../../lib/rafiki/types'

interface Turn {
  who: 'me' | 'mwenza'
  text: string
  ts: number
}

export default function RafikiChat() {
  const session = useMemo<RafikiSession>(() => createRafikiSession(createRafiki(allExperts)), [])
  const [turns, setTurns] = useState<Turn[]>([])
  const [draft, setDraft] = useState('')
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTurns([{ who: 'mwenza', text: 'Karibu. Niko hapa. Tuongee polepole — uniambie unahisije leo.', ts: Date.now() }])
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [turns])

  async function send(): Promise<void> {
    const text = draft.trim()
    if (!text) return
    setTurns((t) => [...t, { who: 'me', text, ts: Date.now() }])
    setDraft('')
    setThinking(true)
    try {
      const ans: RafikiAnswer = await session.ask({ text, lang: 'sw' })
      setTurns((t) => [...t, { who: 'mwenza', text: ans.text.sw, ts: Date.now() }])
    } finally {
      setThinking(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#FAF5E5', fontFamily: TYPE.sans, display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '18px 22px', borderBottom: `1px solid ${hexToRgba('#000', 0.08)}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link to="/rafiki" style={{ color: JEWEL.tealMwenza, textDecoration: 'none', fontSize: 14 }}>← Mwenza</Link>
          <h1 style={{ margin: '6px 0 0', fontFamily: TYPE.serif, fontWeight: 800, color: JEWEL.tealDeep }}>Ongea na Rafiki</h1>
        </div>
        <Link to="/mimi/dharura" style={{ color: JEWEL.maroonCrisis, fontWeight: 700, textDecoration: 'none' }}>Dharura</Link>
      </header>

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 720, margin: '0 auto', width: '100%' }}>
        {turns.map((t, i) => (
          <div key={i} style={{ alignSelf: t.who === 'me' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
            <div style={{
              padding: '10px 14px',
              borderRadius: 18,
              background: t.who === 'me' ? JEWEL.tealMwenza : '#F4EAC9',
              color: t.who === 'me' ? '#FAF5E5' : '#0B0908',
              whiteSpace: 'pre-line',
              lineHeight: 1.5,
              border: t.who === 'me' ? 'none' : `1px solid ${hexToRgba('#000', 0.06)}`,
            }}>{t.text}</div>
          </div>
        ))}
        {thinking && <div style={{ alignSelf: 'flex-start', color: TEXT.muted }}>Rafiki anaandika…</div>}
      </div>

      <div style={{ borderTop: `1px solid ${hexToRgba('#000', 0.08)}`, padding: '14px 22px', display: 'flex', gap: 10, maxWidth: 720, margin: '0 auto', width: '100%' }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') void send() }}
          placeholder="Andika unayohisi…"
          aria-label="Andika ujumbe kwa Rafiki"
          style={{ flex: 1, padding: 12, borderRadius: 999, border: `1px solid ${hexToRgba('#000', 0.12)}`, background: '#FAF5E5', fontFamily: TYPE.sans }}
        />
        <button
          onClick={() => void send()}
          disabled={thinking || !draft.trim()}
          style={{
            padding: '10px 22px',
            borderRadius: 999,
            background: JEWEL.tealMwenza,
            color: '#FAF5E5',
            border: 'none',
            fontWeight: 700,
            cursor: thinking ? 'not-allowed' : 'pointer',
            opacity: thinking ? 0.6 : 1,
          }}
        >Tuma</button>
      </div>
    </main>
  )
}
