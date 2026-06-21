import { useState } from 'react'
import { Link } from 'react-router-dom'
import { JEWEL, NEUTRAL, RADII, TYPE, TZ_FLAG, TEXT, hexToRgba, glass } from '../../../lib/glass'
import { PageShell } from '../components/Shell'
import { Pill } from '../components/Pill'
import { AssessmentRunner } from '../components/AssessmentRunner'
import { CSSRS, type Interpretation } from '../data/instruments'
import { saveResult, uid } from '../data/store'

type Hotline = { name_sw: string; name_en: string; number: string; verified: boolean }

const HOTLINES: Hotline[] = [
  { name_sw: 'Huduma za Dharura (Polisi/Afya) Tanzania', name_en: 'TZ Emergency', number: '112', verified: true },
  { name_sw: 'Lifeline Tanzania — msaada wa afya ya akili', name_en: 'Lifeline TZ', number: '0800 12 0030', verified: false },
  { name_sw: 'Mtandao wa Kupinga Ukatili (TGNP)', name_en: 'GBV/IPV hotline', number: '116', verified: false },
  { name_sw: 'Ulinzi wa Mtoto (Dawati la Jinsia na Watoto)', name_en: 'Child Protection', number: '116', verified: false },
  { name_sw: 'Muhimbili National Hospital — dharura ya akili', name_en: 'Muhimbili psychiatric ER', number: '+255 22 215 1591', verified: false },
]

export default function EmergencyPage() {
  const [phase, setPhase] = useState<'hub' | 'cssrs' | 'result'>('hub')
  const [out, setOut] = useState<Interpretation | null>(null)

  return (
    <PageShell title="Dharura · msaada wa haraka" subtitle="Sio peke yako. Mwenza yuko nawe sasa." back={{ to: '/mimi' }} flagBar>
      {/* Red glass band */}
      <section
        style={{
          ...glass(JEWEL.maroonCrisis, 0.32),
          padding: 22,
          borderRadius: RADII.sheet,
          marginBottom: 20,
          border: `1px solid ${hexToRgba(JEWEL.goldHope, 0.45)}`,
        }}
        aria-live="assertive"
      >
        <Pill tone="maroon">Hatua za mara moja</Pill>
        <h2 style={{ fontFamily: TYPE.serif, fontSize: 28, margin: '10px 0 6px', letterSpacing: TYPE.tighterTrack }}>Pumua. Wewe ni salama hapa.</h2>
        <p style={{ margin: 0, color: TEXT.body, fontSize: 14 }}>
          Kama unawaza kujidhuru au mtu mwingine yuko hatarini, tafadhali piga simu sasa. Mwenza atakuwa mlinzi wako.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 16 }}>
          <a href="tel:112" style={primaryBtn}>📞 Piga 112 — Dharura</a>
          <Link to="/rafiki?mode=mlinzi" style={secondaryBtn}>Mwenza · mlinzi mode →</Link>
        </div>
      </section>

      {/* Hotlines list */}
      <section
        style={{ ...glass(JEWEL.tealRoho, 0.14), padding: 22, borderRadius: RADII.sheet, marginBottom: 20 }}
        aria-label="Namba za msaada"
      >
        <Pill tone="teal">Namba za msaada</Pill>
        <h3 style={{ fontFamily: TYPE.serif, fontSize: 22, margin: '10px 0 14px', letterSpacing: TYPE.tighterTrack }}>Piga simu — bure</h3>
        {HOTLINES.map((h) => (
          <a
            key={h.number}
            href={`tel:${h.number.replace(/\s/g, '')}`}
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 0', borderTop: `1px solid ${hexToRgba(NEUTRAL.ink, 0.10)}`,
              color: TEXT.body, textDecoration: 'none',
            }}
          >
            <div>
              <div style={{ fontFamily: TYPE.serif, fontSize: 16 }}>{h.name_sw}</div>
              <div style={{ color: TEXT.muted, fontSize: 12 }}>{h.name_en}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {!h.verified && <Pill tone="gold" ariaLabel="Hakijahakikishwa">thibitisha</Pill>}
              <span style={{ fontFamily: TYPE.serif, fontSize: 18, color: JEWEL.tealDeep }}>{h.number}</span>
            </div>
          </a>
        ))}
        <p style={{ marginTop: 12, color: TEXT.muted, fontSize: 11 }}>
          Namba zilizo na "thibitisha" zinahitaji uthibitisho wa hivi karibuni kabla ya matumizi ya mwisho.
        </p>
      </section>

      {/* C-SSRS screener */}
      {phase === 'hub' && (
        <section style={{ ...glass(JEWEL.indigoWisdom, 0.18), padding: 22, borderRadius: RADII.sheet, marginBottom: 20 }}>
          <Pill tone="indigo">Uchunguzi wa haraka</Pill>
          <h3 style={{ fontFamily: TYPE.serif, fontSize: 22, margin: '10px 0 6px', letterSpacing: TYPE.tighterTrack }}>C-SSRS kifupi</h3>
          <p style={{ color: TEXT.muted, fontSize: 14, margin: '0 0 14px' }}>
            Maswali 6 mafupi yatasaidia kupima usalama wako sasa. Hakuna jibu sahihi au baya.
          </p>
          <button onClick={() => setPhase('cssrs')} style={primaryBtn}>Anza C-SSRS →</button>
        </section>
      )}

      {phase === 'cssrs' && (
        <AssessmentRunner
          instrument={CSSRS}
          onCancel={() => setPhase('hub')}
          onDone={({ answers, interpret, consent }) => {
            if (consent) {
              saveResult({
                id: uid(),
                instrumentId: 'cssrs',
                takenAt: new Date().toISOString(),
                answers,
                score: interpret.score,
                severity: interpret.severity,
                label_sw: interpret.label_sw,
                redFlag: interpret.redFlag,
                consent,
              })
            }
            setOut(interpret); setPhase('result')
          }}
        />
      )}

      {phase === 'result' && out && (
        <section style={{ ...glass(out.redFlag ? JEWEL.maroonCrisis : JEWEL.tealRoho, 0.3), padding: 22, borderRadius: RADII.sheet }}>
          <Pill tone={out.redFlag ? 'maroon' : 'teal'}>{out.label_sw}</Pill>
          <p style={{ fontFamily: TYPE.serif, fontSize: 20, margin: '10px 0 6px' }}>{out.guidance_sw}</p>
          <p style={{ color: TEXT.muted, fontSize: 12 }}>{out.guidance_en}</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
            {out.redFlag && <a href="tel:112" style={primaryBtn}>📞 Piga 112 sasa</a>}
            <Link to="/rafiki?mode=mlinzi" style={secondaryBtn}>Zungumza na Rafiki</Link>
            <button onClick={() => setPhase('hub')} style={secondaryBtn}>Rudi</button>
          </div>
        </section>
      )}

      {/* Tiny flag accent */}
      <div aria-hidden style={{ display: 'flex', height: 2, marginTop: 28, opacity: 0.7 }}>
        <div style={{ flex: 1, background: TZ_FLAG.green }} />
        <div style={{ flex: 1, background: TZ_FLAG.yellow }} />
        <div style={{ flex: 1, background: TZ_FLAG.black }} />
        <div style={{ flex: 1, background: TZ_FLAG.yellow }} />
        <div style={{ flex: 1, background: TZ_FLAG.blue }} />
      </div>
    </PageShell>
  )
}

const primaryBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  padding: '14px 22px', borderRadius: RADII.chip,
  background: JEWEL.goldHope, color: NEUTRAL.ink, fontWeight: 700,
  textDecoration: 'none', border: 'none', cursor: 'pointer', fontSize: 14,
}
const secondaryBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  padding: '14px 22px', borderRadius: RADII.chip,
  background: 'rgba(250,245,229,0.85)', border: '1px solid rgba(11,9,8,0.10)', color: TEXT.body,
  textDecoration: 'none', cursor: 'pointer', fontSize: 14,
}
