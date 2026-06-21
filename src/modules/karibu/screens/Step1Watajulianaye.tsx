// Step 1 — Tujulianaye: name, age, gender, region, language, literacy.

import { useState } from 'react';
import type { KaribuLang, KaribuLiteracy, KaribuGender, KaribuProfile, KaribuStep1 } from '../lib/storage';
import { cardStyle, chipStyle, inputStyle, labelStyle, primaryBtn, subStyle, titleStyle } from '../lib/ui';
import { MicButton } from '../../../components/MicButton';

const REGIONS = [
  'Arusha', 'Dar es Salaam', 'Dodoma', 'Geita', 'Iringa', 'Kagera', 'Katavi', 'Kigoma',
  'Kilimanjaro', 'Lindi', 'Manyara', 'Mara', 'Mbeya', 'Morogoro', 'Mtwara', 'Mwanza',
  'Njombe', 'Pwani', 'Rukwa', 'Ruvuma', 'Shinyanga', 'Simiyu', 'Singida', 'Songwe',
  'Tabora', 'Tanga', 'Pemba Kaskazini', 'Pemba Kusini', 'Unguja Kaskazini', 'Unguja Kusini', 'Unguja Mjini',
];

const LANGS: { v: KaribuLang; label: string }[] = [
  { v: 'sw', label: 'Kiswahili' },
  { v: 'en', label: 'English' },
  { v: 'ar', label: 'العربية' },
  { v: 'fr', label: 'Français' },
];

const GENDERS: { v: KaribuGender; label: string }[] = [
  { v: 'mke', label: 'Mke' },
  { v: 'mume', label: 'Mume' },
  { v: 'mwingine', label: 'Mwingine' },
  { v: 'sitakipa', label: 'Sitaki kusema' },
];

const LITERACY: { v: KaribuLiteracy; label: string }[] = [
  { v: 'kusoma_kwa_urahisi', label: 'Nasoma kwa urahisi' },
  { v: 'kusoma_polepole', label: 'Nasoma polepole' },
  { v: 'sauti_tu', label: 'Sauti tu nipendelee' },
];

interface Props {
  profile: KaribuProfile;
  update: (patch: Partial<KaribuProfile>) => void;
  next: () => void;
}

export default function Step1Watajulianaye({ profile, update, next }: Props) {
  const s = profile.step1;
  const [name, setName] = useState(s?.name ?? '');
  const [age, setAge] = useState<number>(s?.age ?? 25);
  const [gender, setGender] = useState<KaribuGender>(s?.gender ?? 'sitakipa');
  const [region, setRegion] = useState<string>(s?.region ?? 'Dar es Salaam');
  const [language, setLanguage] = useState<KaribuLang>(s?.language ?? 'sw');
  const [literacy, setLiteracy] = useState<KaribuLiteracy>(s?.literacy ?? 'kusoma_kwa_urahisi');

  const submit = (): void => {
    const step1: KaribuStep1 = { name: name.trim() || 'Rafiki', age, gender, region, language, literacy };
    update({ step1 });
    next();
  };

  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>Tujulianaye</h2>
      <p style={subStyle}>Tukufahamu kidogo — unaweza kutumia jina la utani. Maelezo yako yanabaki kwenye simu yako.</p>

      <div style={{ display: 'grid', gap: 14 }}>
        <div>
          <label style={labelStyle} htmlFor="k-name">Jina (au jina la utani)</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input id="k-name" style={{ ...inputStyle, flex: 1 }} value={name} onChange={(e) => setName(e.target.value)} placeholder="Mfano: Asha" aria-label="Jina" />
            <MicButton onTranscript={(t) => setName(t)} />
          </div>
        </div>

        <div>
          <label style={labelStyle} htmlFor="k-age">Umri</label>
          <input id="k-age" type="number" min={10} max={110} style={inputStyle} value={age} onChange={(e) => setAge(Number(e.target.value) || 0)} aria-label="Umri" />
        </div>

        <div>
          <label style={labelStyle}>Jinsia</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {GENDERS.map((g) => (
              <button key={g.v} type="button" onClick={() => setGender(g.v)} style={chipStyle(gender === g.v)} aria-pressed={gender === g.v}>{g.label}</button>
            ))}
          </div>
        </div>

        <div>
          <label style={labelStyle} htmlFor="k-region">Mkoa</label>
          <select id="k-region" style={inputStyle} value={region} onChange={(e) => setRegion(e.target.value)} aria-label="Mkoa">
            {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Lugha unayopendelea</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {LANGS.map((l) => (
              <button key={l.v} type="button" onClick={() => setLanguage(l.v)} style={chipStyle(language === l.v)} aria-pressed={language === l.v}>{l.label}</button>
            ))}
          </div>
        </div>

        <div>
          <label style={labelStyle}>Kusoma</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {LITERACY.map((l) => (
              <button key={l.v} type="button" onClick={() => setLiteracy(l.v)} style={chipStyle(literacy === l.v)} aria-pressed={literacy === l.v}>{l.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
        <button type="button" onClick={submit} style={primaryBtn()} aria-label="Endelea">Endelea →</button>
      </div>
    </div>
  );
}
