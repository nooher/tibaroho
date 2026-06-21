import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageShell, Card } from '../components/Shell'
import { JEWEL, TYPE, TEXT, hexToRgba } from '../../../lib/glass'
import { db } from '../../../lib/db'
import { getMeId } from '../../../lib/me'

interface LabUpload {
  id: string
  ts: number
  title: string
  rows: number
}

const KEY = 'tumaini.mimi.labs.uploads'

function readUploads(): LabUpload[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const p: unknown = JSON.parse(raw)
    if (Array.isArray(p)) return p as LabUpload[]
  } catch { /* ignore */ }
  return []
}

async function readUploadsAsync(): Promise<LabUpload[]> {
  if (!db.supabase) return readUploads()
  try {
    const me = await getMeId()
    const rows = await db.list('tr_journal_entries', { user_id: me })
    const labs: LabUpload[] = rows
      .filter((r) => Array.isArray(r.tags) && r.tags?.includes('lab:upload'))
      .map((r) => {
        let parsed: { client_id?: string; title?: string; rows?: unknown[] } = {}
        try { parsed = JSON.parse(r.body) as typeof parsed } catch { /* legacy */ }
        return {
          id: parsed.client_id ?? r.id,
          ts: r.created_at ? +new Date(r.created_at) : Date.now(),
          title: parsed.title ?? 'Kipimo',
          rows: Array.isArray(parsed.rows) ? parsed.rows.length : 0,
        }
      })
      .sort((a, b) => b.ts - a.ts)
    try { localStorage.setItem(KEY, JSON.stringify(labs)) } catch { /* ignore */ }
    return labs
  } catch {
    return readUploads()
  }
}

export default function LabsHub() {
  const [items, setItems] = useState<LabUpload[]>(() => readUploads().sort((a, b) => b.ts - a.ts))
  useEffect(() => {
    let on = true
    void readUploadsAsync().then((rows) => { if (on) setItems(rows) })
    return () => { on = false }
  }, [])
  return (
    <PageShell
      title="Vipimo vya maabara"
      subtitle="Pakia matokeo, weka tafsiri rahisi ya Kiswahili, na uliza maswali ya kumuuliza daktari."
      back={{ to: '/mimi', label: 'Mimi' }}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Link
          to="/mimi/vipimo-vya-maabara/pakia"
          style={{
            display: 'inline-block',
            padding: '12px 18px',
            background: JEWEL.tealMwenza,
            color: TEXT.onJewel,
            borderRadius: 999,
            textDecoration: 'none',
            fontFamily: TYPE.sans,
            fontWeight: 600,
          }}
        >
          + Pakia kipimo kipya
        </Link>
      </div>
      {items.length === 0 ? (
        <Card>
          <p style={{ margin: 0, color: JEWEL.tealMwenza }}>
            Bado hujapakia matokeo yoyote. Bonyeza "Pakia kipimo kipya" ili uanze.
          </p>
        </Card>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {items.map((u) => (
            <Link
              key={u.id}
              to={`/mimi/vipimo-vya-maabara/matokeo/${u.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontFamily: TYPE.serif, fontWeight: 700, fontSize: 18, color: JEWEL.tealDeep }}>
                      {u.title}
                    </div>
                    <div style={{ fontSize: 13, color: TEXT.muted }}>
                      {new Date(u.ts).toLocaleString('sw-TZ')} · {u.rows} thamani
                    </div>
                  </div>
                  <span style={{ color: JEWEL.goldHope, fontWeight: 700 }}>Fungua →</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
      <div style={{ marginTop: 24, padding: 14, borderRadius: 12, background: hexToRgba(JEWEL.goldHope, 0.08), border: `1px solid ${hexToRgba(JEWEL.goldHope, 0.25)}` }}>
        <strong style={{ color: JEWEL.goldHope }}>Kumbuka:</strong> Tafsiri hizi ni za kielimu. Daktari wako ndiye anayepaswa kufanya maamuzi ya mwisho.
      </div>
    </PageShell>
  )
}
