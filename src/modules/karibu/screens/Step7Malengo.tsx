// Step 7 — Malengo: 1-3 goals + consent.

import { useState } from 'react';
import { JEWEL } from '../../../lib/glass';
import type { KaribuProfile } from '../lib/storage';
import { cardStyle, ghostBtn, inputStyle, labelStyle, primaryBtn, subStyle, titleStyle } from '../lib/ui';
import { MicButton } from '../../../components/MicButton';

interface Props { profile: KaribuProfile; update: (p: Partial<KaribuProfile>) => void; next: () => void; back: () => void; }

const SUGGEST: string[] = [
  'Nilale usingizi mzuri wa saa 7',
  'Nipunguze pombe nusu',
  'Nichukue dawa kwa wakati kila siku',
  'Niwe na mazoezi mara 3 kwa wiki',
  'Niongee na rafiki mmoja kila wiki',
  'Niandike shukrani moja kila siku',
];

export default function Step7Malengo({ profile, update, next, back }: Props) {
  const s = profile.step7;
  const [goals, setGoals] = useState<string[]>(s?.goals ?? ['']);
  const [consent, setConsent] = useState<boolean>(s?.consent_plan ?? true);

  const set = (i: number, v: string): void => setGoals((g) => g.map((x, idx) => idx === i ? v : x));
  const add = (): void => setGoals((g) => g.length >= 3 ? g : [...g, '']);
  const pickSuggest = (text: string): void => {
    const next = goals.filter((g) => g.trim());
    if (next.length >= 3) return;
    setGoals([...next, text]);
  };

  const submit = (): void => {
    update({ step7: { goals: goals.filter((g) => g.trim()), consent_plan: consent } });
    next();
  };

  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>Malengo madogo</h2>
      <p style={subStyle}>Andika lengo 1 hadi 3. Madogo na yenye kupimika ndio bora.</p>

      <div style={{ display: 'grid', gap: 10 }}>
        {goals.map((g, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input style={{ ...inputStyle, flex: 1 }} value={g} onChange={(e) => set(i, e.target.value)} placeholder={`Lengo ${i + 1}`} aria-label={`Lengo ${i + 1}`} />
            <MicButton onTranscript={(t) => set(i, (g ? g + ' ' : '') + t)} />
          </div>
        ))}
        {goals.length < 3 && <button type="button" onClick={add} style={{
          padding: '8px 14px', border: `1px dashed ${JEWEL.tealMwenza}`, background: 'transparent',
          color: JEWEL.tealMwenza, borderRadius: 999, fontSize: 13, cursor: 'pointer', alignSelf: 'flex-start',
        }}>+ Ongeza lengo</button>}
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={labelStyle}>Pendekezo</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {SUGGEST.map((t) => (
            <button key={t} type="button" onClick={() => pickSuggest(t)} style={{
              padding: '6px 12px', borderRadius: 999, fontSize: 12, background: '#F4EAC9',
              border: `1px solid ${JEWEL.tealMwenza}40`, color: JEWEL.tealMwenza, cursor: 'pointer',
            }}>+ {t}</button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 18, padding: 12, background: '#F4EAC9', borderRadius: 12 }}>
        <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, color: JEWEL.tealMwenza, fontWeight: 600 }}>
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ marginTop: 2 }} />
          Nakubali Tumaini iandae mpango wa huduma kulingana na maelezo yangu (siyo utambuzi wa kimatibabu).
        </label>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
        <button type="button" onClick={back} style={ghostBtn()}>← Rudi</button>
        <button type="button" onClick={submit} disabled={!consent} style={{ ...primaryBtn(), opacity: consent ? 1 : 0.5 }}>Maliza →</button>
      </div>
    </div>
  );
}
