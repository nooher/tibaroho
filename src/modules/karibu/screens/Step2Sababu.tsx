// Step 2 — Sababu: what brings you here today.

import { useState } from 'react';
import type { KaribuProfile } from '../lib/storage';
import { cardStyle, chipStyle, ghostBtn, primaryBtn, subStyle, titleStyle } from '../lib/ui';
import { useLang } from '../../../lib/i18n/Provider';

const CHIPS: { id: string; label: string }[] = [
  { id: 'huzuni', label: 'Huzuni' },
  { id: 'ulevi', label: 'Ulevi / vileo' },
  { id: 'sugu', label: 'Ugonjwa sugu' },
  { id: 'mimba', label: 'Mimba' },
  { id: 'kazi', label: 'Kazi / shinikizo' },
  { id: 'amani', label: 'Amani ya akili' },
  { id: 'mtu', label: 'Mtu wangu' },
  { id: 'najua_tu', label: 'Najua tu' },
];

interface Props { profile: KaribuProfile; update: (p: Partial<KaribuProfile>) => void; next: () => void; back: () => void; }

export default function Step2Sababu({ profile, update, next, back }: Props) {
  const { t } = useLang();
  const [picked, setPicked] = useState<string[]>(profile.step2?.reasons ?? []);

  const toggle = (id: string): void => {
    setPicked((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  };

  const submit = (): void => { update({ step2: { reasons: picked } }); next(); };

  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>{t('karibu.step2.heading', 'Nini imekuleta hapa leo?')}</h2>
      <p style={subStyle}>{t('karibu.step2.sub', 'Chagua kadiri unavyoweza. Hakuna jibu sahihi au baya.')}</p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {CHIPS.map((c) => (
          <button key={c.id} type="button" onClick={() => toggle(c.id)} style={chipStyle(picked.includes(c.id))} aria-pressed={picked.includes(c.id)}>
            {t(`karibu.step2.reason_${c.id}`, c.label)}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
        <button type="button" onClick={back} style={ghostBtn()}>{t('karibu.common.back', '← Rudi')}</button>
        <button type="button" onClick={submit} style={primaryBtn()}>{t('karibu.common.continue', 'Endelea →')}</button>
      </div>
    </div>
  );
}
