import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PageShell, Card } from '../components/Shell'
import { JEWEL, TYPE, TEXT, hexToRgba } from '../../../lib/glass'
import { REF_RANGES, interpretLab, type LabFlag } from './data/refRanges'
import { createRafiki, createRafikiSession } from '../../../lib/rafiki/router'
import { allExperts } from '../../../lib/rafiki/experts'
import type { RafikiAnswer } from '../../../lib/rafiki/types'

interface SavedResult {
  id: string
  ts: number
  title: string
  rows: { testId: string; value: string; unit: string }[]
}

function readResult(id: string): SavedResult | undefined {
  try {
    const raw = localStorage.getItem(`tumaini.mimi.labs.result.${id}`)
    if (!raw) return undefined
    return JSON.parse(raw) as SavedResult
  } catch {
    return undefined
  }
}

const FLAG_COLORS: Record<LabFlag, string> = {
  low: JEWEL.indigoWisdom,
  normal: JEWEL.tealMwenza,
  high: JEWEL.goldHope,
  critical: JEWEL.maroonCrisis,
  unknown: '#666',
}

const FLAG_LABEL: Record<LabFlag, string> = {
  low: 'CHINI',
  normal: 'KAWAIDA',
  high: 'JUU',
  critical: 'DHARURA',
  unknown: 'HAIJULIKANI',
}

export default function LabsResult() {
  const { id } = useParams<{ id: string }>()
  const result = id ? readResult(id) : undefined
  const [rafikiAnswer, setRafikiAnswer] = useState<RafikiAnswer | null>(null)

  const interpretations = useMemo(() => {
    if (!result) return []
    return result.rows.map((r) => {
      const range = REF_RANGES.find((rr) => rr.id === r.testId)
      if (!range) return null
      const interp = interpretLab(r.value, range)
      return { range, value: r.value, interp }
    }).filter((x): x is NonNullable<typeof x> => x !== null)
  }, [result])

  useEffect(() => {
    if (!result || result.rows.length === 0) return
    const rafiki = createRafiki(allExperts)
    const session = createRafikiSession(rafiki)
    const first = result.rows[0]
    const range = REF_RANGES.find((r) => r.id === first.testId)
    if (!range) return
    const probe = `${range.name_en} = ${first.value}`
    void session.ask({ text: probe, lang: 'sw' }).then((a) => setRafikiAnswer(a))
  }, [result])

  if (!result) {
    return (
      <PageShell title="Matokeo hayapatikani" back={{ to: '/mimi/vipimo-vya-maabara', label: 'Maabara' }}>
        <Card>
          <p>Matokeo ya kipimo hicho hayapo kwenye kifaa hiki.</p>
        </Card>
      </PageShell>
    )
  }

  const questions = [
    'Je, ni nini husababisha matokeo haya?',
    'Je, ninahitaji kipimo cha kufuatilia?',
    'Mtindo wa maisha gani ungesaidia?',
    'Je, kuna dawa zinazoweza kuathiri matokeo?',
    'Lini nirudie kupima?',
  ]

  return (
    <PageShell
      title={result.title}
      subtitle={new Date(result.ts).toLocaleString('sw-TZ')}
      back={{ to: '/mimi/vipimo-vya-maabara', label: 'Maabara' }}
    >
      <Card style={{ marginBottom: 16 }}>
        <h3 style={{ marginTop: 0, fontFamily: TYPE.serif, color: JEWEL.tealDeep }}>Tafsiri ya kila thamani</h3>
        <div style={{ display: 'grid', gap: 12 }}>
          {interpretations.map((row, i) => (
            <div key={i} style={{ padding: 12, borderRadius: 12, background: hexToRgba(FLAG_COLORS[row.interp.flag], 0.07), border: `1px solid ${hexToRgba(FLAG_COLORS[row.interp.flag], 0.25)}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontFamily: TYPE.serif, color: JEWEL.tealDeep }}>{row.range.name_sw}</strong>
                <span style={{ fontSize: 12, fontWeight: 700, color: FLAG_COLORS[row.interp.flag] }}>{FLAG_LABEL[row.interp.flag]}</span>
              </div>
              <div style={{ fontSize: 14, marginTop: 4 }}>{row.interp.message_sw}</div>
              <div style={{ fontSize: 12, color: TEXT.muted, marginTop: 4 }}>Chanzo: {row.range.source}</div>
            </div>
          ))}
        </div>
      </Card>

      {rafikiAnswer && (
        <Card style={{ marginBottom: 16 }}>
          <h3 style={{ marginTop: 0, fontFamily: TYPE.serif, color: JEWEL.tealDeep }}>Rafiki anasema</h3>
          <div style={{ whiteSpace: 'pre-line', color: JEWEL.tealMwenza }}>{rafikiAnswer.text.sw}</div>
        </Card>
      )}

      <Card>
        <h3 style={{ marginTop: 0, fontFamily: TYPE.serif, color: JEWEL.tealDeep }}>Maswali ya kumuuliza daktari</h3>
        <ol style={{ paddingLeft: 18, lineHeight: 1.7 }}>
          {questions.map((q, i) => (<li key={i}>{q}</li>))}
        </ol>
      </Card>
    </PageShell>
  )
}
