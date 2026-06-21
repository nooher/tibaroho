// Step 5 — Maisha: sleep, exercise, social, employment, housing, IPV.

import { useState } from 'react';
import { JEWEL, TEXT, hexToRgba, NEUTRAL } from '../../../lib/glass';
import type { KaribuProfile, KaribuStep5 } from '../lib/storage';
import { cardStyle, chipStyle, ghostBtn, inputStyle, labelStyle, primaryBtn, subStyle, titleStyle } from '../lib/ui';

interface Props { profile: KaribuProfile; update: (p: Partial<KaribuProfile>) => void; next: () => void; back: () => void; }

const SUPPORT: KaribuStep5['social_support'][] = ['nzuri', 'wastani', 'kidogo', 'sina'];
const EMP: KaribuStep5['employment'][] = ['ajira', 'biashara', 'kilimo', 'mwanafunzi', 'sina'];
const HOUSING: KaribuStep5['housing'][] = ['salama', 'wastani', 'shida'];
const IPV: KaribuStep5['ipv'][] = ['hapana', 'imewahi', 'sasa'];

const LABEL: Record<string, string> = {
  nzuri: 'Nzuri', wastani: 'Wastani', kidogo: 'Kidogo', sina: 'Sina',
  ajira: 'Ajira', biashara: 'Biashara', kilimo: 'Kilimo', mwanafunzi: 'Mwanafunzi',
  salama: 'Salama', shida: 'Shida',
  hapana: 'Hapana', imewahi: 'Imewahi tokea', 'sasa': 'Inaendelea sasa',
};

export default function Step5Maisha({ profile, update, next, back }: Props) {
  const s = profile.step5;
  const [sleep, setSleep] = useState<number>(s?.sleep_hours ?? 7);
  const [exercise, setExercise] = useState<number>(s?.exercise_days ?? 2);
  const [support, setSupport] = useState<KaribuStep5['social_support']>(s?.social_support ?? 'wastani');
  const [emp, setEmp] = useState<KaribuStep5['employment']>(s?.employment ?? 'ajira');
  const [housing, setHousing] = useState<KaribuStep5['housing']>(s?.housing ?? 'salama');
  const [ipv, setIpv] = useState<KaribuStep5['ipv']>(s?.ipv ?? 'hapana');

  const submit = (): void => {
    update({ step5: { sleep_hours: sleep, exercise_days: exercise, social_support: support, employment: emp, housing, ipv } });
    next();
  };

  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>Maisha yako</h2>
      <p style={subStyle}>Mambo madogo ya kila siku yana athari kubwa. Majibu ni ya siri.</p>

      <div style={{ display: 'grid', gap: 14 }}>
        <div>
          <label style={labelStyle} htmlFor="k-sleep">Unalala saa ngapi kwa usiku?</label>
          <input id="k-sleep" type="number" min={0} max={14} style={inputStyle} value={sleep} onChange={(e) => setSleep(Number(e.target.value) || 0)} />
        </div>
        <div>
          <label style={labelStyle} htmlFor="k-ex">Mazoezi siku ngapi kwa wiki?</label>
          <input id="k-ex" type="number" min={0} max={7} style={inputStyle} value={exercise} onChange={(e) => setExercise(Number(e.target.value) || 0)} />
        </div>

        <div>
          <label style={labelStyle}>Msaada kutoka kwa wengine</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {SUPPORT.map((v) => <button key={v} type="button" onClick={() => setSupport(v)} style={chipStyle(support === v)}>{LABEL[v]}</button>)}
          </div>
        </div>

        <div>
          <label style={labelStyle}>Ajira / kazi</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {EMP.map((v) => <button key={v} type="button" onClick={() => setEmp(v)} style={chipStyle(emp === v)}>{LABEL[v]}</button>)}
          </div>
        </div>

        <div>
          <label style={labelStyle}>Makazi</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {HOUSING.map((v) => <button key={v} type="button" onClick={() => setHousing(v)} style={chipStyle(housing === v)}>{LABEL[v]}</button>)}
          </div>
        </div>

        <div style={{ background: hexToRgba(JEWEL.maroonCrisis, 0.06), padding: 14, borderRadius: 14, border: `1px solid ${hexToRgba(JEWEL.maroonCrisis, 0.2)}` }}>
          <label style={{ ...labelStyle, color: JEWEL.maroonCrisis }}>
            Unyanyasaji wa kifamilia (swali nyeti — unaweza kuruka)
          </label>
          <p style={{ margin: '0 0 10px', fontSize: 13, color: TEXT.muted }}>
            Mtu yeyote kwenye nyumba yako amewahi kukudhuru au kukutisha?
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {IPV.map((v) => <button key={v} type="button" onClick={() => setIpv(v)} style={chipStyle(ipv === v)}>{LABEL[v]}</button>)}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
        <button type="button" onClick={back} style={ghostBtn()}>← Rudi</button>
        <button type="button" onClick={submit} style={primaryBtn()}>Endelea →</button>
      </div>
    </div>
  );
}
