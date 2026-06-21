// Step 3 — Hali: chronic conditions.

import { useState } from 'react';
import type { KaribuProfile } from '../lib/storage';
import { cardStyle, chipStyle, ghostBtn, primaryBtn, subStyle, titleStyle } from '../lib/ui';
import { useLang } from '../../../lib/i18n/Provider';

const CONDITIONS: { id: string; label: string }[] = [
  { id: 'hiv', label: 'VVU / UKIMWI' },
  { id: 'kisukari', label: 'Kisukari' },
  { id: 'shinikizo', label: 'Shinikizo la juu' },
  { id: 'pumu', label: 'Pumu' },
  { id: 'copd', label: 'COPD' },
  { id: 'saratani', label: 'Saratani' },
  { id: 'figo', label: 'Ugonjwa wa figo' },
  { id: 'tb', label: 'Kifua kikuu (TB)' },
  { id: 'sicklecell', label: 'Sickle cell' },
  { id: 'kifafa', label: 'Kifafa' },
  { id: 'moyo', label: 'Ugonjwa wa moyo' },
  { id: 'anemia', label: 'Anemia' },
  { id: 'hakuna', label: 'Hakuna' },
];

interface Props { profile: KaribuProfile; update: (p: Partial<KaribuProfile>) => void; next: () => void; back: () => void; }

export default function Step3Hali({ profile, update, next, back }: Props) {
  const { t } = useLang();
  const init = profile.step3;
  const [picked, setPicked] = useState<string[]>(init?.conditions ?? []);
  const [pregnant, setPregnant] = useState<boolean>(init?.pregnant ?? false);
  const [trimester, setTrimester] = useState<1 | 2 | 3>(init?.trimester ?? 2);
  const [dialysis, setDialysis] = useState<boolean>(init?.dialysis ?? false);

  const toggle = (id: string): void => {
    setPicked((p) => {
      if (id === 'hakuna') return p.includes('hakuna') ? [] : ['hakuna'];
      const without = p.filter((x) => x !== 'hakuna');
      return without.includes(id) ? without.filter((x) => x !== id) : [...without, id];
    });
  };

  const submit = (): void => {
    update({ step3: { conditions: picked, pregnant, trimester: pregnant ? trimester : undefined, dialysis: picked.includes('figo') ? dialysis : undefined } });
    next();
  };

  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>{t('karibu.step3.heading', 'Hali za kiafya')}</h2>
      <p style={subStyle}>{t('karibu.step3.sub', 'Kuchagua hapa kunatusaidia kupata vifuatiliaji na ushauri sahihi.')}</p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {CONDITIONS.map((c) => (
          <button key={c.id} type="button" onClick={() => toggle(c.id)} style={chipStyle(picked.includes(c.id))} aria-pressed={picked.includes(c.id)}>
            {t(`karibu.step3.cond_${c.id}`, c.label)}
          </button>
        ))}
      </div>

      {picked.includes('figo') && (
        <div style={{ marginTop: 16 }}>
          <label style={{ fontSize: 14, color: '#1A3E44', fontWeight: 600 }}>
            <input type="checkbox" checked={dialysis} onChange={(e) => setDialysis(e.target.checked)} style={{ marginRight: 8 }} />
            {t('karibu.step3.dialysis', 'Niko kwenye dialysis')}
          </label>
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <label style={{ fontSize: 14, color: '#1A3E44', fontWeight: 600 }}>
          <input type="checkbox" checked={pregnant} onChange={(e) => setPregnant(e.target.checked)} style={{ marginRight: 8 }} />
          {t('karibu.step3.pregnant', 'Nina mimba')}
        </label>
        {pregnant && (
          <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
            {[1, 2, 3].map((tr) => (
              <button key={tr} type="button" onClick={() => setTrimester(tr as 1 | 2 | 3)} style={chipStyle(trimester === tr)}>
                {t('karibu.step3.trimester', 'Trimester')} {tr}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
        <button type="button" onClick={back} style={ghostBtn()}>{t('karibu.common.back', '← Rudi')}</button>
        <button type="button" onClick={submit} style={primaryBtn()}>{t('karibu.common.continue', 'Endelea →')}</button>
      </div>
    </div>
  );
}
