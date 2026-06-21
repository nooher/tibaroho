import { useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { JEWEL, NEUTRAL, RADII, TYPE, TEXT, hexToRgba } from '../../../lib/glass'
import { PageShell, Card } from '../components/Shell'
import { Pill } from '../components/Pill'
import { AssessmentRunner } from '../components/AssessmentRunner'
import { INSTRUMENTS, instrumentById, type Interpretation } from '../data/instruments'
import { saveResult, uid } from '../data/store'

export default function ScreenPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const inst = useMemo(() => (id ? instrumentById(id) : undefined), [id])
  const [done, setDone] = useState<null | { interpret: Interpretation; consent: boolean }>(null)

  if (!id) {
    return (
      <PageShell title="Vipimo" subtitle="Chagua kipimo cha kuanzia. Vyote vimethibitishwa kitaalamu." back={{ to: '/mimi' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {INSTRUMENTS.map((i) => (
            <button
              key={i.id}
              onClick={() => nav(`/mimi/vipimo/${i.id}`)}
              aria-label={`Anza kipimo ${i.name_sw}`}
              style={{
                textAlign: 'left',
                padding: 22,
                borderRadius: RADII.sheet,
                background: hexToRgba(JEWEL.tealRoho, 0.10),
                border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.10)}`,
                color: TEXT.body,
                cursor: 'pointer',
                fontFamily: TYPE.sans,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Pill tone="teal">{i.domain}</Pill>
                {!i.verified && <Pill tone="gold" ariaLabel="Inahitaji uthibitisho">Hakijahakikiwa</Pill>}
              </div>
              <h3 style={{ fontFamily: TYPE.serif, fontSize: 20, margin: '10px 0 4px', letterSpacing: TYPE.tighterTrack }}>{i.name_sw}</h3>
              <p style={{ margin: 0, fontSize: 12, color: TEXT.muted }}>{i.name_en} · maswali {i.items.length}</p>
            </button>
          ))}
        </div>
      </PageShell>
    )
  }

  if (!inst) {
    return (
      <PageShell title="Kipimo hakipatikani" back={{ to: '/mimi/vipimo' }}>
        <p>Kipimo cha aina hii hakipo. Rudi na uchague kingine.</p>
      </PageShell>
    )
  }

  if (done) {
    const { interpret, consent } = done
    return (
      <PageShell title="Matokeo yako" subtitle={inst.name_sw} back={{ to: '/mimi/vipimo' }}>
        <Card jewel={interpret.redFlag ? JEWEL.maroonCrisis : JEWEL.tealRoho}>
          <Pill tone={interpret.redFlag ? 'maroon' : 'teal'}>{interpret.label_sw}</Pill>
          <div style={{ fontFamily: TYPE.serif, fontSize: 56, lineHeight: 1, margin: '14px 0 4px', letterSpacing: TYPE.tighterTrack }}>
            {interpret.score}
            {interpret.redFlag && <span style={{ fontSize: 18, marginLeft: 12, color: JEWEL.goldSoft }}>· bendera nyekundu</span>}
          </div>
          <p style={{ color: TEXT.body, fontSize: 15, marginTop: 14 }}>{interpret.guidance_sw}</p>
          <p style={{ color: TEXT.muted, fontSize: 12, marginTop: 12 }}>{interpret.label_en} · {interpret.guidance_en}</p>

          <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
            {interpret.redFlag && (
              <a
                href="/mimi/dharura"
                style={{ padding: '12px 18px', borderRadius: RADII.chip, background: JEWEL.goldHope, color: NEUTRAL.ink, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}
              >
                Pata msaada wa dharura →
              </a>
            )}
            <a
              href="/mimi"
              style={{ padding: '12px 18px', borderRadius: RADII.chip, background: 'rgba(250,245,229,0.85)', border: '1px solid rgba(11,9,8,0.10)', color: TEXT.body, textDecoration: 'none', fontSize: 14 }}
            >
              Rudi nyumbani
            </a>
          </div>
          {!consent && <p style={{ marginTop: 14, fontSize: 12, color: TEXT.muted }}>Matokeo haya hayajahifadhiwa.</p>}
        </Card>

        <p style={{ marginTop: 22, color: TEXT.muted, fontSize: 12 }}>Chanzo: {inst.cite}</p>
      </PageShell>
    )
  }

  return (
    <PageShell title={inst.name_sw} subtitle="Jibu kwa uaminifu. Hakuna jibu sahihi au baya." back={{ to: '/mimi/vipimo' }}>
      <AssessmentRunner
        instrument={inst}
        onCancel={() => nav('/mimi/vipimo')}
        onDone={({ answers, interpret, consent }) => {
          if (consent) {
            saveResult({
              id: uid(),
              instrumentId: inst.id,
              takenAt: new Date().toISOString(),
              answers,
              score: interpret.score,
              severity: interpret.severity,
              label_sw: interpret.label_sw,
              redFlag: interpret.redFlag,
              consent,
            })
          }
          setDone({ interpret, consent })
        }}
      />
    </PageShell>
  )
}
