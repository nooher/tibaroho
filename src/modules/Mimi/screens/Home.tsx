import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { JEWEL, NEUTRAL, RADII, TYPE, TEXT, hexToRgba } from '../../../lib/glass'
import { Card, PageShell } from '../components/Shell'
import { MoodCheck } from '../components/MoodCheck'
import { Pill } from '../components/Pill'
import { PatientTimeline } from '../components/PatientTimeline'
import { ArchitectureBadge } from '../../../components/ArchitectureBadge'
import { listResults, listMoods, getCarePlan } from '../data/store'

export default function Home() {
  const [tick, setTick] = useState(0)
  const moods = useMemo(() => listMoods().slice(0, 7), [tick])
  const results = useMemo(() => listResults().slice(0, 4), [tick])
  const plan = useMemo(() => getCarePlan(), [tick])

  const avgMood = moods.length ? (moods.reduce((s, m) => s + m.score, 0) / moods.length).toFixed(1) : '—'

  return (
    <PageShell title="Karibu, Mimi" subtitle="Nafasi yako salama ya afya ya akili — Mwenza yuko hapa.">
      <div style={{ marginBottom: 16 }}>
        <ArchitectureBadge moduleSlug="mimi" />
      </div>
      <div style={{ marginBottom: 16 }}>
        <PatientTimeline />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <MoodCheck onSaved={() => setTick((t) => t + 1)} />
        </div>

        <Card jewel={JEWEL.indigoWisdom}>
          <Pill tone="indigo">Vipimo</Pill>
          <h3 style={{ fontFamily: TYPE.serif, fontSize: 22, margin: '8px 0 4px', letterSpacing: TYPE.tighterTrack }}>Vipimo vilivyokamilika</h3>
          <p style={{ margin: '0 0 12px', color: TEXT.muted, fontSize: 13 }}>
            {results.length ? `Umekamilisha vipimo ${results.length} hivi karibuni.` : 'Bado hujachukua kipimo. Anza wakati wowote.'}
          </p>
          {results.map((r) => (
            <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: `1px solid ${hexToRgba(NEUTRAL.ink, 0.08)}`, fontSize: 14 }}>
              <span>{r.instrumentId.toUpperCase()}</span>
              <span style={{ color: TEXT.muted }}>{r.label_sw} · {r.score}</span>
            </div>
          ))}
          <Link to="/mimi/vipimo" style={linkBtn(JEWEL.indigoWisdom)}>Chukua kipimo →</Link>
        </Card>

        <Card jewel={JEWEL.tealRoho}>
          <Pill tone="teal">Huduma</Pill>
          <h3 style={{ fontFamily: TYPE.serif, fontSize: 22, margin: '8px 0 4px', letterSpacing: TYPE.tighterTrack }}>Mpango wangu wa huduma</h3>
          <p style={{ margin: '0 0 12px', color: TEXT.muted, fontSize: 13 }}>
            {plan.programs.length ? `${plan.programs.length} programu hai.` : 'Bado hakuna programu hai. Tunaweza kuanza pamoja.'}
          </p>
          <Link to="/mimi/mpango" style={linkBtn(JEWEL.tealRoho)}>Ona mpango →</Link>
        </Card>

        <Card jewel={JEWEL.goldHope} alpha={0.16}>
          <Pill tone="gold">Madawa</Pill>
          <h3 style={{ fontFamily: TYPE.serif, fontSize: 22, margin: '8px 0 4px', letterSpacing: TYPE.tighterTrack, color: TEXT.heading }}>Madawa yangu</h3>
          <p style={{ margin: '0 0 12px', color: TEXT.muted, fontSize: 13 }}>
            Tazama orodha ya madawa, vikumbusho, na uhakikisho wa mwingiliano (kupitia TibaAfya).
          </p>
          <Link to="/mimi/madawa" style={linkBtn(JEWEL.goldHope)}>Fungua TibaAfya →</Link>
        </Card>

        <Card jewel={JEWEL.indigoWisdom}>
          <Pill tone="indigo">Mwenza</Pill>
          <h3 style={{ fontFamily: TYPE.serif, fontSize: 22, margin: '8px 0 4px', letterSpacing: TYPE.tighterTrack }}>Rafiki wako</h3>
          <p style={{ margin: '0 0 12px', color: TEXT.muted, fontSize: 13 }}>
            Mwenza wa AI kwa Kiswahili — akili nzuri, busara, na uangalifu.
          </p>
          <Link to="/rafiki" style={linkBtn(JEWEL.indigoWisdom)}>Zungumza na Rafiki →</Link>
        </Card>

        <Card jewel={JEWEL.tealRoho}>
          <Pill tone="teal">Familia</Pill>
          <h3 style={{ fontFamily: TYPE.serif, fontSize: 22, margin: '8px 0 4px', letterSpacing: TYPE.tighterTrack }}>Watu wangu</h3>
          <p style={{ margin: '0 0 12px', color: TEXT.muted, fontSize: 13 }}>
            Alika familia/wahudumu kushiriki — wewe unadhibiti ridhaa.
          </p>
          <Link to="/mimi/familia" style={linkBtn(JEWEL.tealRoho)}>Tazama mduara →</Link>
        </Card>

        <Card jewel={JEWEL.indigoWisdom}>
          <Pill tone="indigo">Hifadhi</Pill>
          <h3 style={{ fontFamily: TYPE.serif, fontSize: 22, margin: '8px 0 4px', letterSpacing: TYPE.tighterTrack }}>Hifadhi yangu</h3>
          <p style={{ margin: '0 0 12px', color: TEXT.muted, fontSize: 13 }}>Rufaa, vidonge, ripoti za maabara — zote mahali pamoja.</p>
          <Link to="/mimi/hifadhi" style={linkBtn(JEWEL.indigoWisdom)}>Tazama hifadhi →</Link>
        </Card>

        <Card jewel={JEWEL.tealRoho}>
          <Pill tone="teal">Kalenda</Pill>
          <h3 style={{ fontFamily: TYPE.serif, fontSize: 22, margin: '8px 0 4px', letterSpacing: TYPE.tighterTrack }}>Kalenda yangu</h3>
          <p style={{ margin: '0 0 12px', color: TEXT.muted, fontSize: 13 }}>Miadi, vikumbusho, na vipimo vya mara kwa mara.</p>
          <Link to="/mimi/kalenda" style={linkBtn(JEWEL.tealRoho)}>Fungua kalenda →</Link>
        </Card>

        <Card jewel={JEWEL.indigoWisdom}>
          <Pill tone="indigo">Shajara</Pill>
          <h3 style={{ fontFamily: TYPE.serif, fontSize: 22, margin: '8px 0 4px', letterSpacing: TYPE.tighterTrack }}>Shajara yangu</h3>
          <p style={{ margin: '0 0 12px', color: TEXT.muted, fontSize: 13 }}>Andika, sema, piga picha — historia yako.</p>
          <Link to="/mimi/shajara" style={linkBtn(JEWEL.indigoWisdom)}>Fungua shajara →</Link>
        </Card>

        <Card jewel={JEWEL.tealRoho}>
          <Pill tone="teal">Muhtasari</Pill>
          <h3 style={{ fontFamily: TYPE.serif, fontSize: 22, margin: '8px 0 4px', letterSpacing: TYPE.tighterTrack }}>Hisia za wiki</h3>
          <p style={{ margin: 0, fontSize: 13, color: TEXT.muted }}>Wastani wa hisia</p>
          <div style={{ fontFamily: TYPE.serif, fontSize: 48, lineHeight: 1, margin: '6px 0' }}>{avgMood}</div>
          <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 40 }}>
            {moods.length === 0 && <span style={{ color: TEXT.muted, fontSize: 13 }}>Hakuna data bado</span>}
            {moods.slice().reverse().map((m, i) => (
              <div key={m.id} title={`${m.score}/10`} style={{
                flex: 1, height: `${(m.score / 10) * 100}%`, background: m.score >= 7 ? JEWEL.goldHope : m.score >= 4 ? JEWEL.tealRoho : JEWEL.maroonCrisis,
                borderRadius: 4, opacity: 0.5 + i * 0.07,
              }} />
            ))}
          </div>
        </Card>

        <div style={{ gridColumn: '1 / -1' }}>
          <Link
            to="/mimi/dharura"
            aria-label="Kitufe cha dharura — msaada wa haraka"
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: JEWEL.maroonCrisis, color: TEXT.onJewel,
              padding: '22px 28px', borderRadius: RADII.sheet, textDecoration: 'none',
              border: `1px solid ${hexToRgba(JEWEL.goldHope, 0.45)}`,
            }}
          >
            <div>
              <div style={{ fontFamily: TYPE.serif, fontSize: 26, letterSpacing: TYPE.tighterTrack }}>Dharura · msaada wa haraka</div>
              <div style={{ color: TEXT.onJewel, fontSize: 13, marginTop: 4 }}>Bonyeza ukihitaji msaada wa haraka. Mwenza atakuwa mlinzi wako.</div>
            </div>
            <span style={{ fontSize: 30 }}>→</span>
          </Link>
        </div>
      </div>
    </PageShell>
  )
}

function linkBtn(jewel: string) {
  return {
    display: 'inline-block', marginTop: 8, padding: '9px 14px',
    background: jewel, borderRadius: RADII.chip,
    color: TEXT.onJewel, textDecoration: 'none', fontSize: 13,
    border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.12)}`,
  } as const
}
