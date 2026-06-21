import { useState } from 'react';
import { Card, Chips, NumberField, TextField, SaveBar, VoiceButton, useReading } from '../common';
import { useLang } from '../../../../lib/i18n/Provider';
import type { PumziReading } from './schema';

export default function Entry() {
  const { t } = useLang();
  const [p, setP] = useState<PumziReading['pattern']>('box');
  const [m, setM] = useState(5);
  const [h, setH] = useState(0);
  const [note, setNote] = useState('');
  const save = useReading<PumziReading>('pumzi');
  const submit = (): void => { save({ pattern: p, minutes: m, hrv_proxy_rmssd: h || undefined, note }); setNote(''); };
  return (
    <Card>
      <h3 style={{ margin: '0 0 10px', fontFamily: 'Georgia, serif', fontSize: 20 }}>{t('mimi.pumzi.title', 'Pumzi')}</h3>
      <VoiceButton />
      <Chips<PumziReading['pattern']> label={t('mimi.pumzi.pattern', 'Mtindo')} value={p} onChange={(v) => setP(v as PumziReading['pattern'])} options={[
        { v: 'box', label: t('mimi.pumzi.pattern.box', 'Sanduku 4-4-4-4') },
        { v: '4-7-8', label: t('mimi.pumzi.pattern.478', '4-7-8') },
        { v: 'cohesive', label: t('mimi.pumzi.pattern.cohesive', 'Mvuto 5-5') },
      ]} />
      <NumberField label={t('mimi.pumzi.minutes', 'Dakika')} value={m} onChange={setM} />
      <NumberField label={t('mimi.pumzi.hrv', 'HRV (RMSSD ikiwa unayo)')} value={h} onChange={setH} unit="ms" />
      <TextField label={t('mimi.common.note', 'Kumbukumbu')} value={note} onChange={setNote} />
      <SaveBar onSave={submit} />
    </Card>
  );
}
