import type React from 'react'
import { useEffect, useState } from 'react'
import { Card, Table, Td } from '../../_shared/Layout'
import { BRAND, CREAM, NEUTRAL, RADII, TEXT, hexToRgba } from '../../../lib/glass'
import { list, insert } from '../../../lib/db'
import type { TrAuditLog } from '../../../lib/db'
import { getMeId } from '../../../lib/me'
import { useLang } from '../../../lib/i18n/Provider'

const ink = (a = 1) => hexToRgba(NEUTRAL.ink, a)

interface Program {
  id: string
  name: string
  swahili: string
  sessions: string[]
}

const PROGRAMS: Program[] = [
  { id: 'pmplus', name: 'PM+ (Problem Management Plus)', swahili: 'PM+', sessions: [
    'Mafunzo ya kupumua + tatizo la kwanza',
    'Kupanga shughuli + matatizo madogo',
    'Kuwajibika + kuongeza msaada',
    'Mawazo mazuri + kupambana na hofu',
    'Kupanga mbele + kufunga'] },
  { id: 'fb', name: 'Friendship Bench', swahili: 'Friendship Bench', sessions: [
    'Kufunua tatizo (kuvhura pfungwa)',
    'Kupanga njia (kusimudzira)',
    'Kuimarisha (kusimbisa)',
    'Kufuatilia 1', 'Kufuatilia 2', 'Kufunga'] },
  { id: 'ipt', name: 'IPT-G (12-week group)', swahili: 'IPT-G', sessions: Array.from({ length: 12 }, (_, i) => `Wiki ${i + 1}`) },
  { id: 'tcbt', name: 't-CBT (8-session)', swahili: 't-CBT', sessions: Array.from({ length: 8 }, (_, i) => `Kikao ${i + 1}`) },
]

type State = Record<string, Record<string, boolean[]>>

const KEY = 'tumaini.utafiti.fidelity'

function load(): State {
  try { const r = localStorage.getItem(KEY); return r ? (JSON.parse(r) as State) : {} } catch { return {} }
}

/** Compose latest fidelity state from tr_audit_log entity='fidelity'. */
async function loadAsync(): Promise<State> {
  try {
    const rows = (await list('tr_audit_log', { entity: 'fidelity' })) as TrAuditLog[]
    const latest = rows
      .slice()
      .sort((a, b) => (a.at ?? '') > (b.at ?? '') ? -1 : 1)[0]
    const m = (latest?.meta ?? {}) as { state?: State }
    return m.state ?? load()
  } catch { return load() }
}

const PROVIDERS = ['Bibi Salima', 'Bw. Hamisi', 'Ms. Neema', 'Bw. Joel']
const CHECKLIST = ['Maelezo ya wazi', 'Lugha sahihi', 'Kuhakikisha usalama', 'Kufuatilia kazi za nyumbani', 'Hatua za kufunga']

function TrendBar({ values }: { values: number[] }): React.JSX.Element {
  const w = 320, h = 60, pad = 4, bw = (w - pad * 2) / values.length
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h}>
      <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke={ink(0.15)} />
      {values.map((v, i) => {
        const bh = (v / 100) * (h - pad * 2)
        const color = v >= 80 ? BRAND.green : v >= 70 ? BRAND.blue : BRAND.yellow
        return (
          <rect key={i} x={pad + i * bw + 2} y={h - pad - bh} width={bw - 4} height={bh} fill={color} rx={2} />
        )
      })}
    </svg>
  )
}

export default function Fidelity(): React.JSX.Element {
  const { t } = useLang()
  const [state, setState] = useState<State>({})
  const [program, setProgram] = useState<string>(PROGRAMS[0].id)
  const [provider, setProvider] = useState<string>(PROVIDERS[0])

  useEffect(() => {
    setState(load())
    let mounted = true
    void loadAsync().then((s) => { if (mounted) setState(s) })
    return () => { mounted = false }
  }, [])

  const current = PROGRAMS.find((p) => p.id === program)!
  const sessionStates: boolean[][] = current.sessions.map((_, si) => {
    return CHECKLIST.map((_, ci) => state[program]?.[provider]?.[si * CHECKLIST.length + ci] ?? false)
  })

  const toggle = (sIdx: number, cIdx: number): void => {
    const next: State = { ...state }
    if (!next[program]) next[program] = {}
    const flat = next[program][provider] ? [...next[program][provider]] : []
    const k = sIdx * CHECKLIST.length + cIdx
    flat[k] = !flat[k]
    next[program][provider] = flat
    setState(next)
    try { localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* quota */ }
    void (async () => {
      try {
        const actor = await getMeId().catch(() => undefined)
        await insert('tr_audit_log', {
          actor_id: actor,
          action: 'fidelity.toggle',
          entity: 'fidelity',
          entity_id: `${program}:${provider}`,
          meta: { program, provider, sIdx, cIdx, state: next },
          at: new Date().toISOString(),
        })
      } catch { /* offline */ }
    })()
  }

  const adherence = sessionStates.map((s) => (s.filter(Boolean).length / CHECKLIST.length) * 100)
  const meanAdh = adherence.reduce((a, b) => a + b, 0) / (adherence.length || 1)

  const reviewQueue = [
    { id: 'r1', provider: 'Bibi Salima', program: 'PM+', flag: 'Kikao 3 chini ya 60% adherence', priority: 'Juu' },
    { id: 'r2', provider: 'Bw. Hamisi', program: 't-CBT', flag: 'Kuruka kazi za nyumbani vikao 2 mfululizo', priority: 'Kati' },
    { id: 'r3', provider: 'Ms. Neema', program: 'IPT-G', flag: 'Hatua za usalama hazijaorodheshwa', priority: 'Juu' },
  ]

  return (
    <>
      <Card title={t('utafiti.fidelity.title', 'Protocol fidelity tracker')} accent={BRAND.green}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
          <select value={program} onChange={(e) => setProgram(e.target.value)} style={{
            padding: '8px 12px', borderRadius: RADII.chip, background: CREAM.milk,
            border: `1px solid ${ink(0.22)}`, color: TEXT.body, fontSize: 13,
          }}>
            {PROGRAMS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select value={provider} onChange={(e) => setProvider(e.target.value)} style={{
            padding: '8px 12px', borderRadius: RADII.chip, background: CREAM.milk,
            border: `1px solid ${ink(0.22)}`, color: TEXT.body, fontSize: 13,
          }}>
            {PROVIDERS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <div style={{ marginLeft: 'auto', fontSize: 13, color: TEXT.muted, alignSelf: 'center' }}>
            {t('utafiti.fidelity.mean', 'Wastani:')} <strong style={{ color: TEXT.body }}>{meanAdh.toFixed(0)}%</strong>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px 6px', fontSize: 11, color: TEXT.muted, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: `1px solid ${ink(0.1)}` }}>{t('utafiti.fidelity.session', 'Kikao')}</th>
                {CHECKLIST.map((c) => (
                  <th key={c} style={{ textAlign: 'center', padding: '8px 4px', fontSize: 10, color: TEXT.muted, letterSpacing: '0.04em', borderBottom: `1px solid ${ink(0.1)}` }}>{c}</th>
                ))}
                <th style={{ textAlign: 'right', padding: '8px 6px', fontSize: 11, color: TEXT.muted, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: `1px solid ${ink(0.1)}` }}>%</th>
              </tr>
            </thead>
            <tbody>
              {current.sessions.map((label, si) => {
                const adh = adherence[si]
                return (
                  <tr key={label}>
                    <td style={{ padding: '8px 6px', color: TEXT.body, fontSize: 12, borderBottom: `1px solid ${ink(0.05)}` }}>{label}</td>
                    {CHECKLIST.map((_, ci) => {
                      const on = sessionStates[si][ci]
                      return (
                        <td key={ci} style={{ textAlign: 'center', padding: '6px 4px', borderBottom: `1px solid ${ink(0.05)}` }}>
                          <button onClick={() => toggle(si, ci)} aria-label="toggle" style={{
                            width: 22, height: 22, borderRadius: 6,
                            background: on ? BRAND.green : CREAM.milk,
                            border: `1px solid ${on ? BRAND.green : ink(0.22)}`,
                            color: TEXT.onJewel, fontSize: 12, cursor: 'pointer', fontWeight: 700,
                          }}>{on ? '✓' : ''}</button>
                        </td>
                      )
                    })}
                    <td style={{ textAlign: 'right', padding: '8px 6px', color: TEXT.body, fontWeight: 600, borderBottom: `1px solid ${ink(0.05)}` }}>{adh.toFixed(0)}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title={t('utafiti.fidelity.trend_title', 'Mwenendo wa adherence kwa vikao')} accent={BRAND.blue}>
        <TrendBar values={adherence.length ? adherence : [0]} />
        <div style={{ fontSize: 11, color: TEXT.muted, marginTop: 8 }}>
          {t('utafiti.fidelity.legend', 'Kijani ≥ 80% · Bluu 70–80% · Njano < 70%')}
        </div>
      </Card>

      <Card title={t('utafiti.fidelity.queue_title', 'Foleni ya ukaguzi wa supervisor')} accent={BRAND.yellow}>
        <Table headers={[t('utafiti.fidelity.col.provider', 'Mtoa huduma'), t('utafiti.fidelity.col.program', 'Programu'), t('utafiti.fidelity.col.issue', 'Tatizo'), t('utafiti.fidelity.col.priority', 'Kipaumbele')]}>
          {reviewQueue.map((r) => (
            <tr key={r.id}>
              <Td style={{ color: TEXT.body }}><strong>{r.provider}</strong></Td>
              <Td style={{ color: TEXT.body }}>{r.program}</Td>
              <Td style={{ color: TEXT.muted }}>{r.flag}</Td>
              <Td style={{ color: r.priority === 'Juu' ? BRAND.green : TEXT.muted }}>{r.priority}</Td>
            </tr>
          ))}
        </Table>
      </Card>
    </>
  )
}
