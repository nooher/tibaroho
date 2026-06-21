import { useState } from 'react';
import { Card, Chips, NumberField, TextField, SaveBar, VoiceButton, useReading } from '../common';
import type { PumziReading } from './schema';

export default function Entry() {
  const [p, setP] = useState<PumziReading['pattern']>('box');
  const [m, setM] = useState(5);
  const [h, setH] = useState(0);
  const [note, setNote] = useState('');
  const save = useReading<PumziReading>('pumzi');
  const submit = (): void => { save({ pattern: p, minutes: m, hrv_proxy_rmssd: h || undefined, note }); setNote(''); };
  return (
    <Card>
      <h3 style={{ margin: '0 0 10px', fontFamily: 'Georgia, serif', fontSize: 20 }}>Pumzi</h3>
      <VoiceButton />
      <Chips<PumziReading['pattern']> label="Mtindo" value={p} onChange={(v) => setP(v as PumziReading['pattern'])} options={[
        { v: 'box', label: 'Sanduku 4-4-4-4' }, { v: '4-7-8', label: '4-7-8' }, { v: 'cohesive', label: 'Mvuto 5-5' },
      ]} />
      <NumberField label="Dakika" value={m} onChange={setM} />
      <NumberField label="HRV (RMSSD ikiwa unayo)" value={h} onChange={setH} unit="ms" />
      <TextField label="Kumbukumbu" value={note} onChange={setNote} />
      <SaveBar onSave={submit} />
    </Card>
  );
}
