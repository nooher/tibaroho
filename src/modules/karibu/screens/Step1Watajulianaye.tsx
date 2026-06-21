// Step 1 — Tujulianaye: name, age, gender, region, language, literacy.

import { useState } from 'react';
import type { KaribuLang, KaribuLiteracy, KaribuGender, KaribuProfile, KaribuStep1 } from '../lib/storage';
import { cardStyle, chipStyle, inputStyle, labelStyle, primaryBtn, subStyle, titleStyle } from '../lib/ui';
import { MicButton } from '../../../components/MicButton';
import { useLang } from '../../../lib/i18n/Provider';

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
  const { t } = useLang();
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
      <h2 style={titleStyle}>{t('karibu.step1.heading', 'Tujulianaye')}</h2>
      <p style={subStyle}>{t('karibu.step1.sub', 'Tukufahamu kidogo — unaweza kutumia jina la utani. Maelezo yako yanabaki kwenye simu yako.')}</p>

      <div style={{ display: 'grid', gap: 14 }}>
        <div>
          <label style={labelStyle} htmlFor="k-name">{t('karibu.step1.name_label', 'Jina (au jina la utani)')}</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input id="k-name" style={{ ...inputStyle, flex: 1 }} value={name} onChange={(e) => setName(e.target.value)} placeholder={t('karibu.step1.name_placeholder', 'Mfano: Asha')} aria-label={t('karibu.step1.name_aria', 'Jina')} />
            <MicButton onTranscript={(tx) => setName(tx)} />
          </div>
        </div>

        <div>
          <label style={labelStyle} htmlFor="k-age">{t('karibu.step1.age_label', 'Umri')}</label>
          <input id="k-age" type="number" min={10} max={110} style={inputStyle} value={age} onChange={(e) => setAge(Number(e.target.value) || 0)} aria-label={t('karibu.step1.age_label', 'Umri')} />
        </div>

        <div>
          <label style={labelStyle}>{t('karibu.step1.gender_label', 'Jinsia')}</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {GENDERS.map((g) => (
              <button key={g.v} type="button" onClick={() => setGender(g.v)} style={chipStyle(gender === g.v)} aria-pressed={gender === g.v}>{t(`karibu.step1.gender_${g.v}`, g.label)}</button>
            ))}
          </div>
        </div>

        <div>
          <label style={labelStyle} htmlFor="k-region">{t('karibu.step1.region_label', 'Mkoa')}</label>
          <select id="k-region" style={inputStyle} value={region} onChange={(e) => setRegion(e.target.value)} aria-label={t('karibu.step1.region_label', 'Mkoa')}>
            {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div>
          <label style={labelStyle}>{t('karibu.step1.language_label', 'Lugha unayopendelea')}</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {LANGS.map((l) => (
              <button key={l.v} type="button" onClick={() => setLanguage(l.v)} style={chipStyle(language === l.v)} aria-pressed={language === l.v}>{l.label}</button>
            ))}
          </div>
        </div>

        <div>
          <label style={labelStyle}>{t('karibu.step1.literacy_label', 'Kusoma')}</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {LITERACY.map((l) => (
              <button key={l.v} type="button" onClick={() => setLiteracy(l.v)} style={chipStyle(literacy === l.v)} aria-pressed={literacy === l.v}>{t(`karibu.step1.literacy_${l.v}`, l.label)}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
        <button type="button" onClick={submit} style={primaryBtn()} aria-label={t('karibu.common.continue_aria', 'Endelea')}>{t('karibu.common.continue', 'Endelea →')}</button>
      </div>
    </div>
  );
}
