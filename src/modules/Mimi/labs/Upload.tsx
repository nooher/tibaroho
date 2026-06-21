import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageShell, Card } from '../components/Shell'
import { JEWEL, TYPE, TEXT, focusRing, hexToRgba } from '../../../lib/glass'
import { REF_RANGES } from './data/refRanges'

interface Row {
  testId: string
  value: string
  unit: string
}

interface SavedResult {
  id: string
  ts: number
  title: string
  rows: { testId: string; value: string; unit: string }[]
}

function saveResult(result: SavedResult): void {
  try {
    const KEY = 'tumaini.mimi.labs.uploads'
    const RES_KEY = `tumaini.mimi.labs.result.${result.id}`
    const raw = localStorage.getItem(KEY)
    const list: SavedResult[] = raw ? (JSON.parse(raw) as SavedResult[]) : []
    list.push({ id: result.id, ts: result.ts, title: result.title, rows: [] as SavedResult['rows'] })
    localStorage.setItem(KEY, JSON.stringify(list.map((i) => ({ id: i.id, ts: i.ts, title: i.title, rows: i.rows?.length ?? 0 }))))
    localStorage.setItem(RES_KEY, JSON.stringify(result))
  } catch {
    // ignore
  }
}

export default function LabsUpload() {
  const nav = useNavigate()
  const [title, setTitle] = useState('Kipimo cha ' + new Date().toLocaleDateString('sw-TZ'))
  const [rows, setRows] = useState<Row[]>([{ testId: 'hb', value: '', unit: 'g/dL' }])
  const [fileName, setFileName] = useState<string>('')

  function updateRow(idx: number, patch: Partial<Row>): void {
    setRows((rs) => rs.map((r, i) => (i === idx ? { ...r, ...patch } : r)))
  }
  function addRow(): void {
    setRows((rs) => [...rs, { testId: 'hb', value: '', unit: 'g/dL' }])
  }
  function removeRow(idx: number): void {
    setRows((rs) => rs.filter((_, i) => i !== idx))
  }
  function onTestChange(idx: number, testId: string): void {
    const range = REF_RANGES.find((r) => r.id === testId)
    updateRow(idx, { testId, unit: range?.unit ?? '' })
  }
  function onSave(): void {
    const id = `lab_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
    const result: SavedResult = { id, ts: Date.now(), title, rows: rows.filter((r) => r.value !== '') }
    saveResult(result)
    nav(`/mimi/vipimo-vya-maabara/matokeo/${id}`)
  }

  return (
    <PageShell
      title="Pakia kipimo cha maabara"
      subtitle="Chagua faili au andika matokeo mwenyewe. OCR inakuja hivi karibuni."
      back={{ to: '/mimi/vipimo-vya-maabara', label: 'Maabara' }}
    >
      <Card style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Jina la kipimo</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Jina la kipimo"
          style={{
            width: '100%',
            padding: 10,
            border: `1px solid ${hexToRgba('#000', 0.12)}`,
            borderRadius: 10,
            fontFamily: TYPE.sans,
            fontSize: 15,
            background: '#FAF5E5',
          }}
          onFocus={(e) => Object.assign(e.currentTarget.style, focusRing(JEWEL.tealMwenza))}
        />
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <h3 style={{ marginTop: 0, fontFamily: TYPE.serif, color: JEWEL.tealDeep }}>Faili</h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="file"
            accept=".pdf,image/*,.hl7,.txt"
            aria-label="Chagua faili la kipimo"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')}
          />
          <button
            type="button"
            disabled
            aria-label="OCR inakuja hivi karibuni"
            style={{
              padding: '8px 14px',
              borderRadius: 999,
              background: hexToRgba(JEWEL.tealMwenza, 0.2),
              color: JEWEL.tealMwenza,
              border: 'none',
              cursor: 'not-allowed',
              fontFamily: TYPE.sans,
              fontWeight: 600,
            }}
          >
            OCR (inakuja hivi karibuni)
          </button>
        </div>
        {fileName && <div style={{ marginTop: 8, fontSize: 14, color: TEXT.muted }}>Imechaguliwa: {fileName}</div>}
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <h3 style={{ marginTop: 0, fontFamily: TYPE.serif, color: JEWEL.tealDeep }}>Andika matokeo</h3>
        <div style={{ display: 'grid', gap: 10 }}>
          {rows.map((r, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8 }}>
              <select
                value={r.testId}
                aria-label="Jina la kipimo"
                onChange={(e) => onTestChange(i, e.target.value)}
                style={{ padding: 8, borderRadius: 8, border: `1px solid ${hexToRgba('#000', 0.12)}`, background: '#FAF5E5' }}
              >
                {REF_RANGES.map((r2) => (
                  <option key={r2.id} value={r2.id}>{r2.name_sw}</option>
                ))}
              </select>
              <input
                type="text"
                value={r.value}
                placeholder="Thamani"
                aria-label="Thamani"
                onChange={(e) => updateRow(i, { value: e.target.value })}
                style={{ padding: 8, borderRadius: 8, border: `1px solid ${hexToRgba('#000', 0.12)}`, background: '#FAF5E5' }}
              />
              <input
                type="text"
                value={r.unit}
                placeholder="Kipimo"
                aria-label="Kipimo"
                onChange={(e) => updateRow(i, { unit: e.target.value })}
                style={{ padding: 8, borderRadius: 8, border: `1px solid ${hexToRgba('#000', 0.12)}`, background: '#FAF5E5' }}
              />
              <button
                type="button"
                aria-label="Ondoa safu"
                onClick={() => removeRow(i)}
                style={{ background: 'transparent', border: 'none', color: JEWEL.maroonCrisis, cursor: 'pointer', fontWeight: 700 }}
              >×</button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addRow}
          style={{
            marginTop: 10,
            padding: '8px 14px',
            border: `1px solid ${JEWEL.tealMwenza}`,
            borderRadius: 999,
            background: 'transparent',
            color: JEWEL.tealMwenza,
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >+ Ongeza safu</button>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={onSave}
          aria-label="Hifadhi na tafsiri"
          style={{
            padding: '12px 22px',
            borderRadius: 999,
            background: JEWEL.tealMwenza,
            color: TEXT.onJewel,
            border: 'none',
            cursor: 'pointer',
            fontWeight: 700,
          }}
        >Hifadhi na tafsiri</button>
      </div>
    </PageShell>
  )
}
