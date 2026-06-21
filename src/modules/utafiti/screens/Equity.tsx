import type React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Card } from '../../_shared/Layout'
import { BRAND, CREAM, NEUTRAL, RADII, TEXT, hexToRgba } from '../../../lib/glass'
import { EQUITY_VARS } from '../data/equityVars'
import { list } from '../../../lib/db'
import type { TrUser, TrOutcome } from '../../../lib/db'
import { useLang } from '../../../lib/i18n/Provider'

const ink = (a = 1) => hexToRgba(NEUTRAL.ink, a)

// Seeded mock outcomes per stratum — deterministic so the screen reads stable.
function seed(id: string, level: string): { n: number; remission: number } {
  let h = 0
  const s = id + '|' + level
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  const n = 40 + (h % 90)
  const baseline = 38
  const variance = (h % 22) - 8
  return { n, remission: Math.max(15, Math.min(62, baseline + variance)) }
}

function ci95(p: number, n: number): [number, number] {
  if (n === 0) return [0, 0]
  const prop = p / 100
  const se = Math.sqrt((prop * (1 - prop)) / n)
  const lo = Math.max(0, (prop - 1.96 * se) * 100)
  const hi = Math.min(100, (prop + 1.96 * se) * 100)
  return [lo, hi]
}

export default function Equity(): React.JSX.Element {
  const { t } = useLang()
  const [selectedId, setSelectedId] = useState<string>(EQUITY_VARS[0].id)
  const variable = EQUITY_VARS.find((v) => v.id === selectedId) ?? EQUITY_VARS[0]
  const [usersByRegion, setUsersByRegion] = useState<Record<string, number>>({})
  const [outcomesByPatient, setOutcomesByPatient] = useState<Record<string, TrOutcome[]>>({})

  useEffect(() => {
    let mounted = true
    void (async () => {
      try {
        const users = (await list('tr_users')) as TrUser[]
        const dist: Record<string, number> = {}
        for (const u of users) {
          const r = u.region ?? 'Haijabainishwa'
          dist[r] = (dist[r] ?? 0) + 1
        }
        if (mounted) setUsersByRegion(dist)
      } catch { /* offline */ }
      try {
        const outs = (await list('tr_outcomes')) as TrOutcome[]
        const byPt: Record<string, TrOutcome[]> = {}
        for (const o of outs) {
          byPt[o.patient_id] = byPt[o.patient_id] ?? []
          byPt[o.patient_id].push(o)
        }
        if (mounted) setOutcomesByPatient(byPt)
      } catch { /* offline */ }
    })()
    return () => { mounted = false }
  }, [])

  const rows = useMemo(() => variable.levels.map((lvl) => {
    // For the 'region' variable we can fold the real user distribution in.
    if (variable.id === 'region' || variable.id === 'place') {
      const n = usersByRegion[lvl] ?? 0
      const s = seed(variable.id, lvl)
      const remission = s.remission
      const [lo, hi] = ci95(remission, Math.max(n, s.n))
      return { level: lvl, n: Math.max(n, s.n), remission, lo, hi }
    }
    const s = seed(variable.id, lvl)
    const [lo, hi] = ci95(s.remission, s.n)
    return { level: lvl, n: s.n, remission: s.remission, lo, hi }
  }), [variable, usersByRegion])

  const totalPatients = Object.keys(outcomesByPatient).length

  const maxRem = Math.max(...rows.map((r) => r.remission))
  const minRem = Math.min(...rows.map((r) => r.remission))
  const absGap = maxRem - minRem
  const relGap = minRem > 0 ? maxRem / minRem : 0

  return (
    <>
      <Card title={t('utafiti.equity.title', 'Equity stratifier — PROGRESS-Plus')} accent={BRAND.green}>
        <p style={{ margin: '0 0 14px', fontSize: 13, color: TEXT.muted }}>
          {t('utafiti.equity.intro_prefix', 'O’Neill et al. 2014 — Vipimo')} {EQUITY_VARS.length} {t('utafiti.equity.intro_suffix', 'kwa stratification ya outcome ya msingi (PHQ-9 remission wiki 12).')}
          {' '}Live: <strong style={{ color: TEXT.body }}>{Object.values(usersByRegion).reduce((a, b) => a + b, 0)}</strong> {t('utafiti.equity.users_in_regions', 'watumiaji kwenye mikoa')} {Object.keys(usersByRegion).length}, {totalPatients} {t('utafiti.equity.with_outcomes', 'na outcomes.')}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {EQUITY_VARS.map((v) => (
            <button key={v.id} onClick={() => setSelectedId(v.id)} style={{
              padding: '8px 12px', borderRadius: RADII.chip, fontSize: 12,
              background: selectedId === v.id ? BRAND.green : CREAM.milk,
              color: selectedId === v.id ? TEXT.onJewel : TEXT.body,
              border: `1px solid ${selectedId === v.id ? BRAND.green : ink(0.12)}`,
              cursor: 'pointer', fontWeight: 600,
            }}>{v.swahili}</button>
          ))}
        </div>
      </Card>

      <Card title={`${variable.swahili} (${variable.name})`} accent={BRAND.blue}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 }}>
          {rows.map((r) => (
            <div key={r.level} style={{ background: CREAM.cream, border: `1px solid ${ink(0.08)}`, borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: TEXT.body }}>{r.level}</div>
              <div style={{ fontSize: 11, color: TEXT.muted, marginTop: 2 }}>n = {r.n}</div>
              <div className="serif" style={{ fontSize: 26, color: TEXT.heading, marginTop: 6 }}>
                {r.remission.toFixed(1)}<span style={{ fontSize: 11, color: TEXT.muted, marginLeft: 3 }}>%</span>
              </div>
              <div style={{ fontSize: 11, color: TEXT.muted, marginBottom: 6 }}>95% CI [{r.lo.toFixed(1)}, {r.hi.toFixed(1)}]</div>
              <div style={{ position: 'relative', height: 8, background: ink(0.06), borderRadius: 4 }}>
                <div style={{
                  position: 'absolute', left: `${r.lo}%`, width: `${Math.max(1, r.hi - r.lo)}%`,
                  top: 0, bottom: 0, background: hexToRgba(BRAND.blue, 0.35), borderRadius: 4,
                }} />
                <div style={{
                  position: 'absolute', left: `calc(${r.remission}% - 2px)`,
                  top: -2, bottom: -2, width: 4, background: BRAND.green, borderRadius: 2,
                }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title={t('utafiti.equity.gap_title', 'Pengo la equity')} accent={NEUTRAL.ink}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          <div style={{ background: CREAM.cream, border: `1px solid ${ink(0.08)}`, borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 11, color: TEXT.muted, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{t('utafiti.equity.abs_gap', 'Pengo kamili')}</div>
            <div className="serif" style={{ fontSize: 30, color: TEXT.heading, marginTop: 4 }}>{absGap.toFixed(1)}<span style={{ fontSize: 12, color: TEXT.muted, marginLeft: 4 }}>pp</span></div>
          </div>
          <div style={{ background: CREAM.cream, border: `1px solid ${ink(0.08)}`, borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 11, color: TEXT.muted, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{t('utafiti.equity.rel_gap', 'Pengo la uwiano')}</div>
            <div className="serif" style={{ fontSize: 30, color: TEXT.heading, marginTop: 4 }}>{relGap.toFixed(2)}×</div>
          </div>
          <div style={{ background: CREAM.cream, border: `1px solid ${ink(0.08)}`, borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 11, color: TEXT.muted, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{t('utafiti.equity.best', 'Bora zaidi')}</div>
            <div className="serif" style={{ fontSize: 20, color: BRAND.green, marginTop: 4 }}>{rows.find((r) => r.remission === maxRem)?.level}</div>
          </div>
          <div style={{ background: CREAM.cream, border: `1px solid ${ink(0.08)}`, borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 11, color: TEXT.muted, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{t('utafiti.equity.worst', 'Pungufu zaidi')}</div>
            <div className="serif" style={{ fontSize: 20, color: TEXT.heading, marginTop: 4 }}>{rows.find((r) => r.remission === minRem)?.level}</div>
          </div>
        </div>
      </Card>
    </>
  )
}
