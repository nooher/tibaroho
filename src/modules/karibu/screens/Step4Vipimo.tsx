// Step 4 — Vipimo: auto-run PHQ-9, GAD-7, AUDIT, C-SSRS, EPDS (if pregnant), CRAFFT (if 12-21).

import { useState } from 'react';
import { JEWEL, NEUTRAL, TEXT, hexToRgba } from '../../../lib/glass';
import { AUDIT, CRAFFT, CSSRS, EPDS, GAD7, PHQ9, type Instrument } from '../lib/instruments';
import type { KaribuProfile } from '../lib/storage';
import { cardStyle, ghostBtn, primaryBtn, subStyle, titleStyle } from '../lib/ui';
import { useLang } from '../../../lib/i18n/Provider';

interface Props { profile: KaribuProfile; update: (p: Partial<KaribuProfile>) => void; next: () => void; back: () => void; }

interface ScoredAnswers { items: number[]; total: number }

function emptyAnswers(inst: Instrument): ScoredAnswers {
  return { items: inst.items.map(() => 0), total: 0 };
}

export default function Step4Vipimo({ profile, update, next, back }: Props) {
  const { t } = useLang();
  const isPregnant = !!profile.step3?.pregnant;
  const age = profile.step1?.age ?? 0;
  const isAdolescent = age >= 12 && age <= 21;

  const battery: Instrument[] = [PHQ9, GAD7, AUDIT, CSSRS];
  if (isPregnant) battery.push(EPDS);
  if (isAdolescent) battery.push(CRAFFT);

  const [answers, setAnswers] = useState<Record<string, ScoredAnswers>>(() => {
    const init: Record<string, ScoredAnswers> = {};
    for (const inst of battery) {
      const prev = profile.step4?.[inst.id as 'phq9' | 'gad7' | 'audit' | 'cssrs' | 'epds' | 'crafft'];
      init[inst.id] = prev ?? emptyAnswers(inst);
    }
    return init;
  });
  const [idx, setIdx] = useState(0);
  const [item, setItem] = useState(0);

  const inst = battery[idx];
  const current = answers[inst.id];

  const setVal = (v: number): void => {
    const items = [...current.items];
    items[item] = v;
    const total = items.reduce((s, n) => s + n, 0);
    setAnswers({ ...answers, [inst.id]: { items, total } });
    // advance
    if (item < inst.items.length - 1) {
      setItem(item + 1);
    } else if (idx < battery.length - 1) {
      setIdx(idx + 1);
      setItem(0);
    }
  };

  const allDone = idx === battery.length - 1 && item === inst.items.length - 1 && current.items[item] !== undefined;

  const submit = (): void => {
    const step4 = {
      phq9: answers.phq9,
      gad7: answers.gad7,
      audit: answers.audit,
      cssrs: answers.cssrs,
      epds: answers.epds,
      crafft: answers.crafft,
    };
    update({ step4 });
    next();
  };

  const q = inst.items[item];

  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>{t('karibu.step4.heading', 'Vipimo vichache')}</h2>
      <p style={subStyle}>
        {inst.name_sw} — {t('karibu.step4.question_word', 'swali')} {item + 1} / {inst.items.length}.{' '}
        {!inst.validated_sw && <span style={{ color: TEXT.hint }}>{t('karibu.step4.unofficial', '(Tafsiri ya mwongozo, si tafsiri rasmi ya Kiswahili)')}</span>}
      </p>

      <div style={{ background: hexToRgba(JEWEL.tealMwenza, 0.05), padding: 16, borderRadius: 14, marginBottom: 14 }}>
        <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5, color: NEUTRAL.ink }}>
          {t('karibu.step4.timeframe', 'Katika wiki 2 zilizopita')}: {q.text_sw}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {inst.scale.map((s) => (
          <button key={s.value} type="button" onClick={() => setVal(s.value)}
            style={{
              padding: '10px 16px', borderRadius: 999, cursor: 'pointer',
              border: `1px solid ${current.items[item] === s.value ? JEWEL.tealMwenza : hexToRgba(NEUTRAL.ink, 0.12)}`,
              background: current.items[item] === s.value ? JEWEL.tealMwenza : '#F8F2D8',
              color: current.items[item] === s.value ? '#FAF5E5' : NEUTRAL.ink,
              fontSize: 14, fontWeight: 500,
            }}>
            {s.label_sw}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 18, fontSize: 12, color: TEXT.muted }}>
        {t('karibu.step4.source', 'Chanzo')}: {inst.source}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
        <button type="button" onClick={back} style={ghostBtn()}>{t('karibu.common.back', '← Rudi')}</button>
        {allDone
          ? <button type="button" onClick={submit} style={primaryBtn()}>{t('karibu.step4.finish', 'Maliza vipimo →')}</button>
          : <button type="button" disabled style={{ ...primaryBtn(), opacity: 0.5, cursor: 'not-allowed' }}>{t('karibu.step4.continuing', 'Endelea kupima…')}</button>
        }
      </div>
    </div>
  );
}
