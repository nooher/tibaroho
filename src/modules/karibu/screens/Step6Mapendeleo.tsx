// Step 6 — Mapendeleo: Mwenza tone, faith opt-in, trust circle, contact preference.

import { useState } from 'react';
import { JEWEL, TEXT } from '../../../lib/glass';
import type { KaribuContactMode, KaribuFaith, KaribuProfile, KaribuTone, KaribuTrustContact } from '../lib/storage';
import { cardStyle, chipStyle, ghostBtn, inputStyle, labelStyle, primaryBtn, subStyle, titleStyle } from '../lib/ui';
import { useLang } from '../../../lib/i18n/Provider';

const TONES: { v: KaribuTone; label: string; desc: string }[] = [
  { v: 'shangazi', label: 'Shangazi mwenye joto', desc: 'Hisia, joto, kunisikiliza' },
  { v: 'rika', label: 'Rika langu', desc: 'Rahisi, kama rafiki' },
  { v: 'mwalimu', label: 'Mwalimu mkongwe', desc: 'Hekima, taratibu' },
  { v: 'mtaalamu', label: 'Mtaalamu', desc: 'Kibalozi, kitaalamu' },
];

const FAITHS: { v: KaribuFaith; label: string }[] = [
  { v: 'none', label: 'Sitaki dini ihusike' },
  { v: 'christian', label: 'Mkristo' },
  { v: 'muslim', label: 'Mwislamu' },
  { v: 'mila', label: 'Mila/asili' },
];

const CONTACT: { v: KaribuContactMode; label: string }[] = [
  { v: 'simu', label: 'Simu' },
  { v: 'sms', label: 'SMS' },
  { v: 'app', label: 'Ndani ya app' },
];

interface Props { profile: KaribuProfile; update: (p: Partial<KaribuProfile>) => void; next: () => void; back: () => void; }

export default function Step6Mapendeleo({ profile, update, next, back }: Props) {
  const { t } = useLang();
  const s = profile.step6;
  const [tone, setTone] = useState<KaribuTone>(s?.tone ?? 'shangazi');
  const [faith, setFaith] = useState<KaribuFaith>(s?.faith ?? 'none');
  const [trust, setTrust] = useState<KaribuTrustContact[]>(s?.trust ?? [{ name: '', relation: '', phone: '' }]);
  const [contact, setContact] = useState<KaribuContactMode>(s?.contact_mode ?? 'app');

  const addTrust = (): void => setTrust((t) => t.length >= 3 ? t : [...t, { name: '', relation: '', phone: '' }]);
  const updateTrust = (i: number, field: keyof KaribuTrustContact, v: string): void => {
    setTrust((t) => t.map((c, idx) => idx === i ? { ...c, [field]: v } : c));
  };

  const submit = (): void => {
    update({ step6: { tone, faith, trust: trust.filter((t) => t.name && t.phone), contact_mode: contact } });
    next();
  };

  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>{t('karibu.step6.heading', 'Mapendeleo')}</h2>
      <p style={subStyle}>{t('karibu.step6.sub', 'Mwenza ataenda kwa sauti unayopendelea.')}</p>

      <div style={{ display: 'grid', gap: 16 }}>
        <div>
          <label style={labelStyle}>{t('karibu.step6.tone_label', 'Sauti ya Mwenza')}</label>
          <div style={{ display: 'grid', gap: 8 }}>
            {TONES.map((tn) => (
              <button key={tn.v} type="button" onClick={() => setTone(tn.v)} style={{
                ...chipStyle(tone === tn.v), textAlign: 'left', padding: '12px 16px', borderRadius: 14,
              }}>
                <div style={{ fontWeight: 700 }}>{t(`karibu.step6.tone_${tn.v}_label`, tn.label)}</div>
                <div style={{ fontSize: 12, opacity: 0.85 }}>{t(`karibu.step6.tone_${tn.v}_desc`, tn.desc)}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={labelStyle}>{t('karibu.step6.faith_label', 'Imani (chaguo, sio lazima)')}</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {FAITHS.map((f) => <button key={f.v} type="button" onClick={() => setFaith(f.v)} style={chipStyle(faith === f.v)}>{t(`karibu.step6.faith_${f.v}`, f.label)}</button>)}
          </div>
        </div>

        <div>
          <label style={labelStyle}>{t('karibu.step6.trust_label', 'Duara la usalama (hadi watu 3 wa kuaminika)')}</label>
          {trust.map((c, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
              <input style={inputStyle} placeholder={t('karibu.step6.trust_name', 'Jina')} value={c.name} onChange={(e) => updateTrust(i, 'name', e.target.value)} aria-label={t('karibu.step6.trust_name_aria', 'Jina la mtu wa kuaminika')} />
              <input style={inputStyle} placeholder={t('karibu.step6.trust_relation', 'Uhusiano')} value={c.relation} onChange={(e) => updateTrust(i, 'relation', e.target.value)} aria-label={t('karibu.step6.trust_relation', 'Uhusiano')} />
              <input style={inputStyle} placeholder="+255…" value={c.phone} onChange={(e) => updateTrust(i, 'phone', e.target.value)} aria-label={t('karibu.step6.trust_phone', 'Simu')} />
            </div>
          ))}
          {trust.length < 3 && (
            <button type="button" onClick={addTrust} style={{
              padding: '8px 14px', border: `1px dashed ${JEWEL.tealMwenza}`, background: 'transparent',
              color: JEWEL.tealMwenza, borderRadius: 999, fontSize: 13, cursor: 'pointer',
            }}>{t('karibu.common.add', '+ Ongeza')}</button>
          )}
        </div>

        <div>
          <label style={labelStyle}>{t('karibu.step6.contact_label', 'Njia ya mawasiliano')}</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CONTACT.map((c) => <button key={c.v} type="button" onClick={() => setContact(c.v)} style={chipStyle(contact === c.v)}>{t(`karibu.step6.contact_${c.v}`, c.label)}</button>)}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
        <button type="button" onClick={back} style={ghostBtn()}>{t('karibu.common.back', '← Rudi')}</button>
        <button type="button" onClick={submit} style={primaryBtn()}>{t('karibu.common.continue', 'Endelea →')}</button>
      </div>

      <div style={{ marginTop: 10, fontSize: 11, color: TEXT.hint }}>
        {t('karibu.step6.footer', 'Mawasiliano yote yanabaki Tanzania. Hatuuzi data.')}
      </div>
    </div>
  );
}
