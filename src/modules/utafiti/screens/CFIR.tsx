import type React from 'react'
import { useEffect, useState } from 'react'
import { Card } from '../../_shared/Layout'
import { BRAND, CREAM, NEUTRAL, RADII, TEXT, hexToRgba } from '../../../lib/glass'
import { CFIR_DOMAINS, CFIR_CONSTRUCT_COUNT } from '../data/cfirConstructs'
import { list, insert } from '../../../lib/db'
import type { TrAuditLog } from '../../../lib/db'
import { getMeId } from '../../../lib/me'
import { useLang } from '../../../lib/i18n/Provider'

const ink = (a = 1) => hexToRgba(NEUTRAL.ink, a)

const SITES = [
  { id: 'muhimbili', name: 'Muhimbili NH' },
  { id: 'mirembe',   name: 'Mirembe RH' },
  { id: 'dodoma',    name: 'Dodoma RRH' },
  { id: 'mwananyamala', name: 'Mwananyamala' },
  { id: 'temeke',    name: 'Temeke RRH' },
  { id: 'bugando',   name: 'Bugando MC' },
]

type Scores = Record<string, number>

function loadScoresCache(siteId: string): Scores {
  try {
    const raw = localStorage.getItem(`tumaini.utafiti.cfir.${siteId}`)
    return raw ? (JSON.parse(raw) as Scores) : {}
  } catch { return {} }
}

function writeCache(siteId: string, s: Scores): void {
  try { localStorage.setItem(`tumaini.utafiti.cfir.${siteId}`, JSON.stringify(s)) } catch { /* quota */ }
}

/**
 * Load the latest CFIR scores for `siteId` from tr_audit_log
 * (entity='cfir', entity_id=siteId). The newest entry per construct
 * wins — we replay the entries in chronological order so the most
 * recent score for each construct sits on top.
 */
async function loadScoresAsync(siteId: string): Promise<Scores> {
  try {
    const rows = (await list('tr_audit_log', { entity: 'cfir', entity_id: siteId })) as TrAuditLog[]
    const sorted = [...rows].sort((a, b) => (a.at ?? '') > (b.at ?? '') ? 1 : -1)
    const out: Scores = {}
    for (const r of sorted) {
      const m = (r.meta ?? {}) as { construct?: string; score?: number; scores?: Scores }
      if (m.scores && typeof m.scores === 'object') Object.assign(out, m.scores)
      else if (m.construct && typeof m.score === 'number') out[m.construct] = m.score
    }
    writeCache(siteId, out)
    return out
  } catch {
    return loadScoresCache(siteId)
  }
}

async function persistConstruct(siteId: string, construct: string, score: number, all: Scores): Promise<void> {
  writeCache(siteId, all)
  try {
    const actor = await getMeId().catch(() => undefined)
    await insert('tr_audit_log', {
      actor_id: actor,
      action: 'cfir.score.set',
      entity: 'cfir',
      entity_id: siteId,
      meta: { construct, score, site: siteId },
      at: new Date().toISOString(),
    })
  } catch { /* offline */ }
}

function heatColor(score: number): string {
  if (!score) return CREAM.cream
  if (score >= 4) return hexToRgba(BRAND.green, 0.85)
  if (score >= 3) return hexToRgba(BRAND.blue, 0.70)
  if (score >= 2) return hexToRgba(BRAND.yellow, 0.65)
  return hexToRgba(NEUTRAL.ink, 0.50)
}

function exportCsv(siteId: string, scores: Scores): void {
  const rows: string[] = ['domain,construct_id,construct,swahili,score']
  for (const d of CFIR_DOMAINS) {
    for (const c of d.constructs) {
      rows.push(`"${d.name}","${c.id}","${c.name}","${c.swahili}",${scores[c.id] ?? ''}`)
    }
  }
  const blob = new Blob([rows.join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `cfir_${siteId}_${new Date().toISOString().slice(0,10)}.csv`; a.click()
  URL.revokeObjectURL(url)
}

export default function CFIR(): React.JSX.Element {
  const { t } = useLang()
  const [siteId, setSiteId] = useState<string>(SITES[0].id)
  const [scores, setScores] = useState<Scores>({})

  useEffect(() => {
    setScores(loadScoresCache(siteId))
    let mounted = true
    void loadScoresAsync(siteId).then((s) => { if (mounted) setScores(s) })
    return () => { mounted = false }
  }, [siteId])

  const setScore = (id: string, v: number): void => {
    const next = { ...scores, [id]: v }
    setScores(next)
    void persistConstruct(siteId, id, v, next)
  }

  const mean = (() => {
    const vals = Object.values(scores).filter((v) => typeof v === 'number')
    if (!vals.length) return 0
    return vals.reduce((a, b) => a + b, 0) / vals.length
  })()

  return (
    <>
      <Card title={t('utafiti.cfir.title', 'CFIR 2.0 — site readiness assessment')} accent={BRAND.green}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: TEXT.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('utafiti.cfir.site', 'Tovuti')}</label>
          <select value={siteId} onChange={(e) => setSiteId(e.target.value)} style={{
            padding: '8px 12px', borderRadius: RADII.chip, background: CREAM.milk,
            border: `1px solid ${ink(0.22)}`, color: TEXT.body, fontSize: 13,
          }}>
            {SITES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <div style={{ fontSize: 13, color: TEXT.muted, marginLeft: 'auto' }}>
            {t('utafiti.cfir.mean', 'Wastani:')} <strong style={{ color: TEXT.body }}>{mean.toFixed(2)} / 5</strong>
            {' · '}{Object.keys(scores).length}/{CFIR_CONSTRUCT_COUNT} {t('utafiti.cfir.measured', 'vimepimwa')}
          </div>
          <button onClick={() => exportCsv(siteId, scores)} style={{
            padding: '8px 14px', borderRadius: RADII.chip, background: BRAND.green,
            color: CREAM.milk, border: 'none', fontSize: 12, cursor: 'pointer',
          }}>{t('utafiti.cfir.export_csv', 'Pakua CSV')}</button>
        </div>
      </Card>

      {CFIR_DOMAINS.map((d) => (
        <Card key={d.id} title={`${d.swahili} — ${d.name}`} accent={BRAND.blue}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
            {d.constructs.map((c) => {
              const s = scores[c.id] ?? 0
              return (
                <div key={c.id} style={{
                  background: heatColor(s), border: `1px solid ${ink(0.08)}`, borderRadius: 12, padding: 12,
                  transition: 'background 200ms ease',
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: s >= 3 ? TEXT.onJewel : TEXT.body }}>{c.swahili}</div>
                  <div style={{ fontSize: 11, color: s >= 3 ? hexToRgba(CREAM.milk, 0.85) : TEXT.muted, marginTop: 2 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: s >= 3 ? hexToRgba(CREAM.milk, 0.8) : TEXT.muted, marginTop: 6, lineHeight: 1.4 }}>{c.definition}</div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
                    {[1,2,3,4,5].map((n) => (
                      <button key={n} onClick={() => setScore(c.id, n)} style={{
                        flex: 1, padding: '6px 0', borderRadius: 8, fontSize: 12, fontWeight: 600,
                        background: s === n ? NEUTRAL.ink : (s >= 3 ? hexToRgba(CREAM.milk, 0.25) : CREAM.milk),
                        color: s === n ? CREAM.milk : (s >= 3 ? CREAM.milk : NEUTRAL.ink),
                        border: `1px solid ${s === n ? NEUTRAL.ink : ink(0.12)}`, cursor: 'pointer',
                      }}>{n}</button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      ))}
    </>
  )
}
