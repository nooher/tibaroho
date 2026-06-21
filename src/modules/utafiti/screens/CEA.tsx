import type React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Card } from '../../_shared/Layout'
import { BRAND, CREAM, NEUTRAL, TEXT, hexToRgba } from '../../../lib/glass'

const ink = (a = 1) => hexToRgba(NEUTRAL.ink, a)

// Tanzania ~$1,200 GDP per capita 2026 estimate; TZS 2,600/USD.
const TZS_PER_USD = 2600
const GDP_PC_USD = 1200
const THRESH_1X = GDP_PC_USD
const THRESH_3X = GDP_PC_USD * 3

interface Inputs {
  costPerSession: number      // USD
  costPerAssessment: number   // USD
  infraOverhead: number       // USD per participant
  providerSalary: number      // USD per participant amortised
  mpesaFees: number           // USD per participant
  facilityCost: number        // USD per participant
  sessionsPerCase: number
  assessmentsPerCase: number
  caseDetectionRate: number   // % of screened
  treatmentInitiationRate: number // % of detected
  remissionRate: number       // % of treated
  routineCarePerCase: number  // USD comparator
  routineRemissionRate: number // %
}

const DEFAULTS: Inputs = {
  costPerSession: 8,
  costPerAssessment: 2,
  infraOverhead: 4,
  providerSalary: 18,
  mpesaFees: 0.6,
  facilityCost: 3,
  sessionsPerCase: 5,
  assessmentsPerCase: 3,
  caseDetectionRate: 22,
  treatmentInitiationRate: 78,
  remissionRate: 42.1,
  routineCarePerCase: 95,
  routineRemissionRate: 18,
}

const LOCAL_KEY = 'tumaini.utafiti.cea.inputs'

function load(): Inputs {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    return raw ? { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Inputs>) } : DEFAULTS
  } catch { return DEFAULTS }
}

function NumInput({ label, value, unit, onChange }: { label: string; value: number; unit: string; onChange: (v: number) => void }): React.JSX.Element {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12 }}>
      <span style={{ color: TEXT.muted, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input type="number" value={value} step={value < 1 ? 0.1 : 1}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          style={{
            flex: 1, padding: '8px 10px', borderRadius: 8, background: CREAM.milk,
            border: `1px solid ${ink(0.22)}`, color: TEXT.body, fontSize: 14, outline: 'none',
          }} />
        <span style={{ fontSize: 11, color: TEXT.muted, minWidth: 32 }}>{unit}</span>
      </div>
    </label>
  )
}

function OutTile({ label, usd, tzs, note }: { label: string; usd: number; tzs?: number; note?: string }): React.JSX.Element {
  return (
    <div style={{ background: CREAM.cream, border: `1px solid ${ink(0.08)}`, borderRadius: 12, padding: 14 }}>
      <div style={{ fontSize: 11, color: TEXT.muted, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{label}</div>
      <div className="serif" style={{ fontSize: 24, color: TEXT.heading, marginTop: 6, letterSpacing: '-0.4px' }}>
        USD {usd.toLocaleString(undefined, { maximumFractionDigits: 1 })}
      </div>
      {tzs !== undefined ? (
        <div style={{ fontSize: 12, color: TEXT.muted, marginTop: 2 }}>TZS {Math.round(tzs).toLocaleString('sw-TZ')}</div>
      ) : null}
      {note ? <div style={{ fontSize: 11, color: TEXT.muted, marginTop: 6 }}>{note}</div> : null}
    </div>
  )
}

export default function CEA(): React.JSX.Element {
  const [inp, setInp] = useState<Inputs>(DEFAULTS)
  useEffect(() => { setInp(load()) }, [])
  useEffect(() => {
    // TODO: sync to Supabase tr_cea_scenarios.
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(inp)) } catch {}
  }, [inp])

  const set = <K extends keyof Inputs>(k: K, v: number): void => setInp((s) => ({ ...s, [k]: v }))

  const calc = useMemo(() => {
    const perCase = inp.costPerSession * inp.sessionsPerCase
      + inp.costPerAssessment * inp.assessmentsPerCase
      + inp.infraOverhead + inp.providerSalary + inp.mpesaFees + inp.facilityCost
    const screenedPerDetected = inp.caseDetectionRate > 0 ? 100 / inp.caseDetectionRate : 0
    const screeningCost = inp.costPerAssessment * screenedPerDetected
    const costPerDetected = perCase + screeningCost
    const treatedPerDetected = inp.treatmentInitiationRate / 100
    const costPerTreated = treatedPerDetected > 0 ? costPerDetected / treatedPerDetected : 0
    const remitPerTreated = inp.remissionRate / 100
    const costPerRemission = remitPerTreated > 0 ? costPerTreated / remitPerTreated : 0
    const routineCostPerRemission = inp.routineRemissionRate > 0
      ? inp.routineCarePerCase / (inp.routineRemissionRate / 100) : 0
    const icer = (costPerRemission - routineCostPerRemission)
    const markovYear1Cost = perCase + (perCase * 0.25) // booster + maintenance
    return { perCase, costPerDetected, costPerTreated, costPerRemission, routineCostPerRemission, icer, markovYear1Cost }
  }, [inp])

  const icerVerdict = calc.icer < THRESH_1X
    ? 'Bora sana (chini ya 1× GDP/capita — WHO-CHOICE)'
    : calc.icer < THRESH_3X
      ? 'Bora (1×–3× GDP/capita)'
      : 'Si bora kiuchumi (juu ya 3× GDP/capita)'

  return (
    <>
      <Card title="Cost-Effectiveness Analysis — calculator" accent={BRAND.green}>
        <p style={{ margin: '0 0 14px', fontSize: 13, color: TEXT.muted }}>
          Weka gharama halisi za utafiti; mahesabu yanasasishwa moja kwa moja. Vipimo vya WHO-CHOICE Tanzania: 1× GDP/capita ≈ USD {THRESH_1X.toLocaleString()}, 3× ≈ USD {THRESH_3X.toLocaleString()}.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          <NumInput label="Gharama / kikao" value={inp.costPerSession} unit="USD" onChange={(v) => set('costPerSession', v)} />
          <NumInput label="Gharama / tathmini" value={inp.costPerAssessment} unit="USD" onChange={(v) => set('costPerAssessment', v)} />
          <NumInput label="Overhead miundombinu" value={inp.infraOverhead} unit="USD" onChange={(v) => set('infraOverhead', v)} />
          <NumInput label="Mshahara mtoa huduma" value={inp.providerSalary} unit="USD" onChange={(v) => set('providerSalary', v)} />
          <NumInput label="Ada za M-Pesa" value={inp.mpesaFees} unit="USD" onChange={(v) => set('mpesaFees', v)} />
          <NumInput label="Gharama ya kituo" value={inp.facilityCost} unit="USD" onChange={(v) => set('facilityCost', v)} />
          <NumInput label="Vikao / mhusika" value={inp.sessionsPerCase} unit="#" onChange={(v) => set('sessionsPerCase', v)} />
          <NumInput label="Tathmini / mhusika" value={inp.assessmentsPerCase} unit="#" onChange={(v) => set('assessmentsPerCase', v)} />
          <NumInput label="Kiwango cha kugundua" value={inp.caseDetectionRate} unit="%" onChange={(v) => set('caseDetectionRate', v)} />
          <NumInput label="Kuanza tiba" value={inp.treatmentInitiationRate} unit="%" onChange={(v) => set('treatmentInitiationRate', v)} />
          <NumInput label="Remission rate" value={inp.remissionRate} unit="%" onChange={(v) => set('remissionRate', v)} />
          <NumInput label="Routine care / kesi" value={inp.routineCarePerCase} unit="USD" onChange={(v) => set('routineCarePerCase', v)} />
        </div>
      </Card>

      <Card title="Matokeo — kwa USD na TZS" accent={BRAND.blue}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          <OutTile label="Gharama / mhusika" usd={calc.perCase} tzs={calc.perCase * TZS_PER_USD} />
          <OutTile label="Gharama / kesi iliyogunduliwa" usd={calc.costPerDetected} tzs={calc.costPerDetected * TZS_PER_USD} />
          <OutTile label="Gharama / kesi iliyotibiwa" usd={calc.costPerTreated} tzs={calc.costPerTreated * TZS_PER_USD} />
          <OutTile label="Gharama / remission" usd={calc.costPerRemission} tzs={calc.costPerRemission * TZS_PER_USD} note="Outcome ya msingi ya PhD" />
          <OutTile label="Routine care / remission" usd={calc.routineCostPerRemission} tzs={calc.routineCostPerRemission * TZS_PER_USD} note="Kulinganisha (comparator)" />
          <OutTile label="ICER vs routine" usd={calc.icer} tzs={calc.icer * TZS_PER_USD} note={icerVerdict} />
          <OutTile label="Markov 1-yr (booster + maint.)" usd={calc.markovYear1Cost} tzs={calc.markovYear1Cost * TZS_PER_USD} note="Sketch — full Markov ujenzini" />
        </div>

        <div style={{
          marginTop: 18, padding: 14, background: CREAM.cream, border: `1px solid ${ink(0.08)}`,
          borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          <div style={{ fontSize: 11, color: TEXT.muted, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>WHO-CHOICE Tanzania threshold bar</div>
          <div style={{ position: 'relative', height: 18, background: ink(0.06), borderRadius: 9 }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${Math.min(100, (THRESH_1X / THRESH_3X) * 100)}%`, background: hexToRgba(BRAND.green, 0.5), borderRadius: 9 }} />
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '100%', background: hexToRgba(BRAND.yellow, 0.2), borderRadius: 9 }} />
            {calc.icer > 0 ? (
              <div style={{
                position: 'absolute', top: -3, bottom: -3,
                left: `${Math.min(100, Math.max(0, (calc.icer / THRESH_3X) * 100))}%`,
                width: 3, background: NEUTRAL.ink,
              }} />
            ) : null}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: TEXT.muted }}>
            <span>0</span><span>1× GDP (USD {THRESH_1X})</span><span>3× GDP (USD {THRESH_3X})</span>
          </div>
        </div>
      </Card>
    </>
  )
}
