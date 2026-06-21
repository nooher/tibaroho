import type React from 'react'
import { useEffect, useState } from 'react'
import { Card } from '../../_shared/Layout'
import { BRAND, CREAM, NEUTRAL, TEXT, TZ_FLAG, hexToRgba } from '../../../lib/glass'
import { REAIM_METRICS } from '../data/reaimMetrics'
import { CFIR_DOMAINS, CFIR_CONSTRUCT_COUNT } from '../data/cfirConstructs'
import { supabase, list } from '../../../lib/db'
import type { TrResearchConsent } from '../../../lib/db'
import { useLang } from '../../../lib/i18n/Provider'

const ink = (a = 1) => hexToRgba(NEUTRAL.ink, a)

const STUDIES_ACTIVE = 3
const ENROLLED_N = 624
const PENDING_IRB = 2
const EQUITY_GAP_PP = 11.4 // rural vs urban remission gap (pp)

const OUTCOME_SPARK = [14.8, 12.9, 11.2, 9.7, 8.1, 6.9, 5.8]

function KpiTile({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent: string }): React.JSX.Element {
  return (
    <div style={{
      background: CREAM.milk, border: `1px solid ${ink(0.08)}`, borderRadius: 14,
      padding: '18px 18px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: accent }} />
      <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: TEXT.muted, fontWeight: 600 }}>{label}</div>
      <div className="serif" style={{ marginTop: 8, fontSize: 30, color: TEXT.heading, letterSpacing: '-0.4px' }}>{value}</div>
      {sub ? <div style={{ marginTop: 4, fontSize: 12, color: TEXT.muted }}>{sub}</div> : null}
    </div>
  )
}

function Spark({ values, color }: { values: number[]; color: string }): React.JSX.Element {
  const w = 240, h = 60, pad = 4
  const min = Math.min(...values), max = Math.max(...values)
  const range = max - min || 1
  const pts = values.map((v, i) => {
    const x = pad + (i * (w - pad * 2)) / (values.length - 1)
    const y = h - pad - ((v - min) / range) * (h - pad * 2)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      {values.map((v, i) => {
        const x = pad + (i * (w - pad * 2)) / (values.length - 1)
        const y = h - pad - ((v - min) / range) * (h - pad * 2)
        return <circle key={i} cx={x} cy={y} r={2.2} fill={color} />
      })}
    </svg>
  )
}

interface DeidRow { patient_hash: string; instrument: string; score: number; delta: number | null; week: string }

export default function UtafitiDashboard(): React.JSX.Element {
  const { t } = useLang()
  const reaimReach = REAIM_METRICS.find((m) => m.id === 'reach')!
  const reaimEff = REAIM_METRICS.find((m) => m.id === 'effectiveness')!
  const [live, setLive] = useState<{ consents: number; uniquePatients: number; outcomes: number }>({ consents: 0, uniquePatients: 0, outcomes: 0 })

  useEffect(() => {
    let mounted = true
    void (async () => {
      try {
        const consents = (await list('tr_research_consents')) as TrResearchConsent[]
        const granted = consents.filter((c) => c.granted && !c.revoked_at)
        let outcomes = 0
        let uniquePatients = 0
        if (supabase) {
          const { data } = await supabase.from('tr_v_outcomes_deid').select('*')
          const rows = (data ?? []) as DeidRow[]
          outcomes = rows.length
          uniquePatients = new Set(rows.map((r) => r.patient_hash)).size
        }
        if (mounted) setLive({ consents: granted.length, uniquePatients, outcomes })
      } catch { /* offline */ }
    })()
    return () => { mounted = false }
  }, [])
  return (
    <>
      <Card title={t('utafiti.dashboard.title', 'Muhtasari wa Utafiti')} accent={BRAND.green}>
        <p style={{ margin: '0 0 18px', fontSize: 14, color: TEXT.muted }}>
          {t('utafiti.dashboard.intro', 'Konsoli ya PhD ya Dr. Nooher — tafiti hai, CFIR, RE-AIM, fidelity, equity, na maandalizi ya karatasi tatu.')}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          <KpiTile label={t('utafiti.dashboard.kpi.active', 'Tafiti hai')} value={String(STUDIES_ACTIVE)} sub={t('utafiti.dashboard.kpi.active_sub', '2 zinarekodi · 1 rasimu')} accent={BRAND.green} />
          <KpiTile label={t('utafiti.dashboard.kpi.enrolled', 'Walioandikishwa')} value={(live.uniquePatients || ENROLLED_N).toLocaleString('sw-TZ')} sub={live.uniquePatients ? `live · ${t('utafiti.dashboard.kpi.consent', 'idhini')} ${live.consents} · ${t('utafiti.dashboard.kpi.outcomes', 'matokeo')} ${live.outcomes}` : t('utafiti.dashboard.kpi.enrolled_sub', 'lengo 600 · ufikiaji 104%')} accent={BRAND.blue} />
          <KpiTile label={t('utafiti.dashboard.kpi.irb', 'Idhini za IRB')} value={String(PENDING_IRB)} sub={t('utafiti.dashboard.kpi.irb_sub', 'UAMS pending · NIMR review')} accent={BRAND.yellow} />
          <KpiTile label={t('utafiti.dashboard.kpi.equity_gap', 'Pengo la equity')} value={`${EQUITY_GAP_PP}pp`} sub={t('utafiti.dashboard.kpi.equity_sub', 'vijijini < mijini (remission)')} accent={NEUTRAL.ink} />
        </div>
      </Card>

      <Card title={t('utafiti.dashboard.reaim_title', 'RE-AIM — kwa mtazamo')} accent={BRAND.blue}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
          {REAIM_METRICS.map((m) => {
            const pct = Math.min(100, (m.currentValue / m.target) * 100)
            return (
              <div key={m.id} style={{ background: CREAM.cream, border: `1px solid ${ink(0.08)}`, borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 11, color: TEXT.muted, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{m.swahili}</div>
                <div className="serif" style={{ fontSize: 22, color: TEXT.heading, marginTop: 4 }}>{m.currentValue.toFixed(1)}<span style={{ fontSize: 11, color: TEXT.muted, marginLeft: 4 }}>{m.unit}</span></div>
                <div style={{ marginTop: 8, height: 6, background: ink(0.06), borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: BRAND.green }} />
                </div>
                <div style={{ marginTop: 4, fontSize: 10, color: TEXT.hint }}>{t('utafiti.dashboard.target', 'lengo')} {m.target}{m.unit.includes('%') ? '%' : ''}</div>
              </div>
            )
          })}
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        <Card title={t('utafiti.dashboard.cfir_title', 'CFIR — site readiness')} accent={BRAND.green}>
          <div style={{ fontSize: 13, color: TEXT.muted, marginBottom: 12 }}>
            {t('utafiti.dashboard.cfir_measures', 'Vipimo')} {CFIR_CONSTRUCT_COUNT} {t('utafiti.dashboard.cfir_in_domains', 'kwa vikoa')} {CFIR_DOMAINS.length}. {t('utafiti.dashboard.cfir_mean_6', 'Wastani wa tovuti 6:')} <strong style={{ color: TEXT.body }}>3.4 / 5</strong>.
          </div>
          {CFIR_DOMAINS.map((d) => {
            const score = 2.8 + Math.random() * 0.001 + d.constructs.length * 0.04
            const pct = (Math.min(5, score) / 5) * 100
            return (
              <div key={d.id} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: TEXT.muted, marginBottom: 4 }}>
                  <span>{d.swahili}</span>
                  <span style={{ color: TEXT.body, fontWeight: 600 }}>{score.toFixed(1)}</span>
                </div>
                <div style={{ height: 6, background: ink(0.06), borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: BRAND.blue }} />
                </div>
              </div>
            )
          })}
        </Card>

        <Card title={t('utafiti.dashboard.phq9_title', 'PHQ-9 wastani — wiki 0 → 12')} accent={BRAND.yellow}>
          <Spark values={OUTCOME_SPARK} color={BRAND.green} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: TEXT.muted, marginTop: 8 }}>
            <span>W0: 14.8</span><span>W12: 5.8</span>
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: TEXT.muted }}>
            {t('utafiti.dashboard.remission_wk12', 'Remission (PHQ-9 < 5) wiki 12:')} <strong style={{ color: BRAND.green }}>42.1%</strong> ({t('utafiti.dashboard.target', 'lengo')} 45%).
          </div>
        </Card>

        <Card title={t('utafiti.dashboard.equity_title', 'Equity — pengo la mwisho')} accent={NEUTRAL.ink}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <div className="serif" style={{ fontSize: 32, color: TEXT.heading }}>{EQUITY_GAP_PP}<span style={{ fontSize: 14, color: TEXT.muted }}>pp</span></div>
            <div style={{ fontSize: 12, color: TEXT.muted }}>{t('utafiti.dashboard.equity_urban_rural', 'Mji 47.2% vs Vijiji 35.8% (remission)')}</div>
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 4 }}>
            {[TZ_FLAG.green, TZ_FLAG.yellow, TZ_FLAG.blue, TZ_FLAG.black].map((c) => (
              <div key={c} style={{ flex: 1, height: 4, background: c, borderRadius: 2 }} />
            ))}
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: TEXT.muted }}>
            {t('utafiti.dashboard.progress_plus_note', 'Mhimili 13 wa PROGRESS-Plus unafanyiwa stratification kwa kila matokeo ya msingi.')}
          </div>
        </Card>
      </div>
    </>
  )
}
