// Done — profile summary + risk tier + recommended plan + download.

import { JEWEL, CREAM, NEUTRAL, TEXT, hexToRgba } from '../../../lib/glass';
import { printProfile } from '../lib/profilePdf';
import { classifyRisk } from '../lib/risk';
import { recommend } from '../lib/recommend';
import type { KaribuProfile } from '../lib/storage';
import { cardStyle, ghostBtn, primaryBtn, subStyle, titleStyle } from '../lib/ui';
import ResearchNotice from '../../../components/ResearchNotice';

const TIER_COLOR: Record<string, string> = {
  chini: '#1EB53A',
  wastani: '#B8951F',
  juu: JEWEL.maroonCrisis,
  dharura: JEWEL.maroonCrisis,
};

const TIER_LABEL: Record<string, string> = {
  chini: 'Hatari ya chini',
  wastani: 'Hatari ya wastani',
  juu: 'Hatari ya juu',
  dharura: 'Dharura',
};

interface Props { profile: KaribuProfile; finish: () => void }

export default function Done({ profile, finish }: Props) {
  const risk = classifyRisk(profile);
  const rec = recommend(profile);

  // Persist active trackers
  try {
    localStorage.setItem('tumaini.trackers.active', JSON.stringify(rec.trackers));
    localStorage.setItem('tumaini.mwenza.tone', rec.mwenza_mode);
    localStorage.setItem('tumaini.careplan', JSON.stringify(rec.care_plan));
  } catch { /* noop */ }

  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>Karibu, {profile.step1?.name ?? 'rafiki'}.</h2>
      <p style={subStyle}>Tumeandaa mpango wako mdogo. Unaweza kuubadilisha wakati wowote.</p>

      <div style={{ display: 'inline-block', padding: '6px 14px', borderRadius: 999, background: TIER_COLOR[risk.tier], color: '#fff', fontSize: 13, fontWeight: 700, marginBottom: 14 }}>
        {TIER_LABEL[risk.tier]}
      </div>

      <div style={{ display: 'grid', gap: 14, marginBottom: 16 }}>
        <Section title="Sababu za hatari">
          {risk.reasons_sw.length ? (
            <ul style={ulStyle}>{risk.reasons_sw.map((r) => <li key={r}>{r}</li>)}</ul>
          ) : <p style={{ margin: 0, fontSize: 14, color: TEXT.muted }}>Hakuna alama kubwa za hatari. Endelea kujihudumia.</p>}
        </Section>

        <Section title="Vifuatiliaji vilivyowashwa">
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {rec.trackers.map((t) => (
              <span key={t} style={{
                padding: '4px 10px', borderRadius: 999, background: JEWEL.tealMwenza,
                color: CREAM.milk, fontSize: 12, fontWeight: 600,
              }}>{t}</span>
            ))}
          </div>
        </Section>

        <Section title="Mpango wa huduma">
          {rec.care_plan.length ? (
            <ul style={ulStyle}>{rec.care_plan.map((c) => (
              <li key={c.id}>
                <strong>{c.title_sw}:</strong> {c.body_sw}
                <div style={{ fontSize: 11, color: TEXT.hint, marginTop: 2 }}>Chanzo: {c.source}</div>
              </li>
            ))}</ul>
          ) : <p style={{ margin: 0, fontSize: 14, color: TEXT.muted }}>Mwenza atakuongoza wakati wa hatari.</p>}
        </Section>

        <Section title="Sauti ya Mwenza">
          <p style={{ margin: 0, fontSize: 14 }}>{labelTone(rec.mwenza_mode)}</p>
        </Section>
      </div>

      {risk.ercRequired && (
        <div style={{
          padding: 14, marginBottom: 14,
          background: hexToRgba(JEWEL.maroonCrisis, 0.1),
          border: `1px solid ${JEWEL.maroonCrisis}`,
          borderRadius: 14,
        }}>
          <strong style={{ color: JEWEL.maroonCrisis }}>Tafadhali piga 112 sasa au nenda hospitali ya karibu.</strong>
          <p style={{ margin: '6px 0 0', fontSize: 13 }}>Mwenza wa Tumaini atakaa nawe wakati huo.</p>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <button type="button" onClick={() => printProfile(profile)} style={ghostBtn()}>Pakua profaili (PDF)</button>
        <button type="button" onClick={finish} style={primaryBtn()}>Ingia Tumaini →</button>
      </div>

      <div style={{ marginTop: 16, fontSize: 11, color: TEXT.hint }}>
        Si utambuzi wa kimatibabu. Wasiliana na daktari kwa uamuzi wa kiafya.
      </div>

      <ResearchNotice variant="karibu" />
    </div>
  );
}

const ulStyle = { margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.6 };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: JEWEL.tealMwenza, marginBottom: 6 }}>{title}</div>
      {children}
    </div>
  );
}

function labelTone(t: string): string {
  switch (t) {
    case 'shangazi': return 'Shangazi mwenye joto — atakukaribia kwa joto na heshima.';
    case 'rika': return 'Rika — atazungumza kama rafiki yako.';
    case 'mwalimu': return 'Mwalimu mkongwe — atakuelekeza kwa hekima.';
    case 'mtaalamu': return 'Mtaalamu — atakuwa wazi na wa kitaalamu.';
    default: return 'Rafiki wako yuko tayari.';
  }
}
