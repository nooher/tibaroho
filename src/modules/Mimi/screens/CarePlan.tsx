import { useEffect, useState } from 'react'
import { JEWEL, NEUTRAL, RADII, TYPE, TEXT, CREAM, hexToRgba } from '../../../lib/glass'
import { PageShell, Card } from '../components/Shell'
import { Pill } from '../components/Pill'
import { getCarePlan, getCarePlanAsync, saveCarePlan, uid, type CarePlan } from '../data/store'

export default function CarePlanPage() {
  const [plan, setPlan] = useState<CarePlan>(() => getCarePlan())
  const [newStep, setNewStep] = useState('')

  useEffect(() => {
    let on = true
    void getCarePlanAsync().then((p) => { if (on) setPlan(p) })
    return () => { on = false }
  }, [])

  function commit(next: CarePlan) {
    saveCarePlan(next)
    setPlan(next)
  }

  function toggleStep(id: string) {
    commit({
      ...plan,
      nextSteps: plan.nextSteps.map((s) => (s.id === id ? { ...s, done: !s.done } : s)),
    })
  }

  function addStep() {
    if (!newStep.trim()) return
    commit({
      ...plan,
      nextSteps: [
        ...plan.nextSteps,
        { id: uid(), text_sw: newStep.trim(), done: false },
      ],
    })
    setNewStep('')
  }

  return (
    <PageShell title="Mpango wangu wa huduma" subtitle="Programu, watoa huduma, hatua zinazofuata, na mafanikio." back={{ to: '/mimi' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        <Card jewel={JEWEL.tealRoho}>
          <Pill tone="teal">Programu</Pill>
          <h3 style={{ fontFamily: TYPE.serif, fontSize: 22, margin: '10px 0 12px', letterSpacing: TYPE.tighterTrack }}>Programu zilizojumuishwa</h3>
          {plan.programs.length === 0 && <p style={{ color: TEXT.muted, fontSize: 14 }}>Hakuna programu hai bado. Mtaalamu wako atapeleka mpango hapa.</p>}
          {plan.programs.map((p) => (
            <div key={p.id} style={row}>
              <span>{p.name_sw}</span>
              <Pill tone={p.status === 'active' ? 'teal' : p.status === 'paused' ? 'gold' : 'indigo'}>{p.status}</Pill>
            </div>
          ))}
        </Card>

        <Card jewel={JEWEL.indigoWisdom}>
          <Pill tone="indigo">Watoa huduma</Pill>
          <h3 style={{ fontFamily: TYPE.serif, fontSize: 22, margin: '10px 0 12px', letterSpacing: TYPE.tighterTrack }}>Timu yangu</h3>
          {plan.providers.length === 0 && <p style={{ color: TEXT.muted, fontSize: 14 }}>Bado hakuna mtoa huduma aliyeunganishwa.</p>}
          {plan.providers.map((p) => (
            <div key={p.id} style={row}>
              <div>
                <div>{p.name}</div>
                <div style={{ color: TEXT.muted, fontSize: 12 }}>{p.role_sw}{p.org ? ` · ${p.org}` : ''}</div>
              </div>
            </div>
          ))}
        </Card>

        <Card jewel={JEWEL.tealRoho} style={{ gridColumn: '1 / -1' }}>
          <Pill tone="teal">Hatua zinazofuata</Pill>
          <h3 style={{ fontFamily: TYPE.serif, fontSize: 22, margin: '10px 0 12px', letterSpacing: TYPE.tighterTrack }}>Nini kifuatacho</h3>
          {plan.nextSteps.map((s) => (
            <label key={s.id} style={{ ...row, cursor: 'pointer' }}>
              <input type="checkbox" checked={s.done} onChange={() => toggleStep(s.id)} aria-label={`Maliza: ${s.text_sw}`} />
              <span style={{ textDecoration: s.done ? 'line-through' : 'none', color: s.done ? TEXT.muted : TEXT.body, flex: 1, marginLeft: 12 }}>
                {s.text_sw}
              </span>
              {s.due && <span style={{ color: TEXT.muted, fontSize: 12 }}>{s.due}</span>}
            </label>
          ))}
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <input
              value={newStep}
              onChange={(e) => setNewStep(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addStep()}
              placeholder="Mfano: Piga simu kliniki Jumatatu"
              aria-label="Ongeza hatua mpya"
              style={{
                flex: 1, padding: 12, borderRadius: RADII.chip,
                background: CREAM.milk,
                border: '1px solid rgba(11,9,8,0.22)',
                color: TEXT.body, fontFamily: TYPE.sans, fontSize: 14,
              }}
            />
            <button
              onClick={addStep}
              style={{ padding: '10px 18px', borderRadius: RADII.chip, background: JEWEL.goldHope, color: NEUTRAL.ink, fontWeight: 700, border: 'none', cursor: 'pointer' }}
            >
              Ongeza
            </button>
          </div>
        </Card>

        <Card jewel={JEWEL.goldHope} alpha={0.14} style={{ gridColumn: '1 / -1' }}>
          <Pill tone="gold">Mafanikio</Pill>
          <h3 style={{ fontFamily: TYPE.serif, fontSize: 22, margin: '10px 0 12px', letterSpacing: TYPE.tighterTrack }}>Mafanikio yangu</h3>
          {plan.milestones.length === 0 && <p style={{ color: TEXT.muted, fontSize: 14 }}>Mafanikio yako yatatambuliwa hapa unapoendelea.</p>}
          {plan.milestones.map((m) => (
            <div key={m.id} style={row}>
              <span>★ {m.text_sw}</span>
              {m.achievedAt && <span style={{ color: TEXT.muted, fontSize: 12 }}>{m.achievedAt.slice(0, 10)}</span>}
            </div>
          ))}
        </Card>
      </div>
    </PageShell>
  )
}

const row: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '10px 0', borderTop: `1px solid ${hexToRgba(NEUTRAL.ink, 0.08)}`, fontSize: 14,
}
