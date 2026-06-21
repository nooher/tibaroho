import { useEffect, useState } from 'react'
import { PageShell, Card } from '../components/Shell'
import { JEWEL, TYPE, TEXT, hexToRgba } from '../../../lib/glass'
import { listAdapters, getAdapter, type WatchAdapter, type WatchStatus, type WatchSample } from '../../../lib/smartwatch'
import { parseCsv, parseJson, appendSamples } from '../../../lib/smartwatch/generic'

const SCOPE_LABEL: Record<string, string> = {
  hr: 'Mapigo', hrv: 'HRV', sleep: 'Usingizi', steps: 'Hatua', spo2: 'SpO₂',
  skin_temp: 'Joto la ngozi', menstrual: 'Hedhi', activity: 'Mazoezi', calories: 'Kalori',
}

export default function SmartwatchConnect() {
  const [adapters, setAdapters] = useState<WatchAdapter[]>([])
  const [statuses, setStatuses] = useState<Record<string, WatchStatus>>({})
  const [reason, setReason] = useState<Record<string, string>>({})
  const [consentFor, setConsentFor] = useState<string | null>(null)
  const [paste, setPaste] = useState('')
  const [importResult, setImportResult] = useState<{ count: number; kind: 'csv' | 'json' } | null>(null)

  useEffect(() => {
    const list = listAdapters()
    setAdapters(list)
    const s: Record<string, WatchStatus> = {}
    for (const a of list) s[a.id] = a.status()
    setStatuses(s)
  }, [])

  async function doConnect(id: string): Promise<void> {
    const a = getAdapter(id)
    if (!a) return
    const r = await a.connect()
    setStatuses((s) => ({ ...s, [id]: a.status() }))
    if (!r.ok && r.reason) setReason((rr) => ({ ...rr, [id]: r.reason as string }))
    setConsentFor(null)
  }

  function doImport(): void {
    let samples: WatchSample[] = []
    let kind: 'csv' | 'json' = 'csv'
    const trimmed = paste.trim()
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      samples = parseJson(trimmed)
      kind = 'json'
    } else {
      samples = parseCsv(trimmed)
      kind = 'csv'
    }
    appendSamples(samples)
    setImportResult({ count: samples.length, kind })
  }

  return (
    <PageShell
      title="Saa mahiri"
      subtitle="Unganisha saa au smartphone ili Tumaini ielewe usingizi, mapigo, na hatua zako."
      back={{ to: '/mimi', label: 'Mimi' }}
    >
      <div style={{ display: 'grid', gap: 14 }}>
        {adapters.map((a) => (
          <Card key={a.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontFamily: TYPE.serif, color: JEWEL.tealDeep }}>{a.label_sw}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  {a.scopes.map((s) => (
                    <span key={s} style={{
                      fontSize: 11,
                      padding: '3px 9px',
                      borderRadius: 999,
                      background: hexToRgba(JEWEL.tealMwenza, 0.1),
                      color: JEWEL.tealMwenza,
                      fontWeight: 600,
                    }}>{SCOPE_LABEL[s] ?? s}</span>
                  ))}
                </div>
                {reason[a.id] && (
                  <div style={{ marginTop: 10, fontSize: 13, color: JEWEL.maroonCrisis }}>{reason[a.id]}</div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '3px 9px',
                  borderRadius: 999,
                  background: statuses[a.id] === 'connected' ? hexToRgba(JEWEL.goldHope, 0.18) : hexToRgba('#000', 0.06),
                  color: statuses[a.id] === 'connected' ? JEWEL.goldHope : '#666',
                }}>
                  {statuses[a.id] === 'connected' ? 'IMEUNGANISHWA' : 'HAIJAUNGANISHWA'}
                </span>
                <button
                  onClick={() => setConsentFor(a.id)}
                  aria-label={`Unganisha ${a.label_sw}`}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 999,
                    background: JEWEL.tealMwenza,
                    color: TEXT.onJewel,
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >Unganisha</button>
              </div>
            </div>

            {a.id === 'generic' && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${hexToRgba('#000', 0.08)}` }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                  Bandika data ya CSV au JSON
                </label>
                <textarea
                  value={paste}
                  onChange={(e) => setPaste(e.target.value)}
                  rows={5}
                  aria-label="Data ya saa mahiri"
                  placeholder={'metric,value,unit,ts\nhr,72,bpm,2026-06-20T08:00:00'}
                  style={{
                    width: '100%',
                    padding: 10,
                    border: `1px solid ${hexToRgba('#000', 0.12)}`,
                    borderRadius: 10,
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    fontSize: 13,
                    background: '#FAF5E5',
                  }}
                />
                <button
                  onClick={doImport}
                  style={{
                    marginTop: 8,
                    padding: '8px 14px',
                    borderRadius: 999,
                    background: JEWEL.goldHope,
                    color: '#0B0908',
                    border: 'none',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >Ingiza</button>
                {importResult && (
                  <div style={{ marginTop: 8, fontSize: 13, color: JEWEL.tealMwenza }}>
                    Imeingiza {importResult.count} sampuli ({importResult.kind.toUpperCase()}).
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>

      {consentFor && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Idhini ya kuunganisha"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(11,9,8,0.4)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 50,
          }}
          onClick={() => setConsentFor(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 420,
              background: '#FAF5E5',
              padding: 24,
              borderRadius: 24,
              border: `1px solid ${hexToRgba('#000', 0.08)}`,
            }}
          >
            <h3 style={{ marginTop: 0, fontFamily: TYPE.serif, color: JEWEL.tealDeep }}>Idhini ya kuunganisha</h3>
            <p style={{ fontSize: 14, lineHeight: 1.6 }}>
              Tumaini itasoma tu data unayoidhinisha. Unaweza kuzuia muunganisho wakati wowote.
              Data huhifadhiwa kwenye kifaa chako kwanza, kisha kwa Supabase iliyolindwa.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
              <button
                onClick={() => setConsentFor(null)}
                style={{ padding: '8px 14px', borderRadius: 999, background: 'transparent', border: `1px solid ${hexToRgba('#000', 0.15)}`, cursor: 'pointer' }}
              >Ghairi</button>
              <button
                onClick={() => void doConnect(consentFor)}
                style={{ padding: '8px 14px', borderRadius: 999, background: JEWEL.tealMwenza, color: TEXT.onJewel, border: 'none', cursor: 'pointer', fontWeight: 700 }}
              >Nakubali, unganisha</button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  )
}
