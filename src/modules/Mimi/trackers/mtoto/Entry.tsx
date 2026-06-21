import { useState } from 'react';
import { Card, Chips, NumberField, TextField, SaveBar, VoiceButton, useReading } from '../common';
import type { MtotoReading } from './schema';

const MILES = [
  { v: 'tabasamu', label: 'Tabasamu (3mo)' }, { v: 'kukaa', label: 'Kukaa (6mo)' },
  { v: 'kuingia_kombe', label: 'Kombe (9mo)' }, { v: 'tembea', label: 'Tembea (12mo)' },
  { v: 'maneno_1', label: 'Maneno 1-3 (18mo)' }, { v: 'sentensi_2', label: 'Sentensi 2 maneno (24mo)' },
];
const VAX = [
  { v: 'bcg', label: 'BCG' }, { v: 'opv', label: 'OPV' },
  { v: 'penta', label: 'Penta' }, { v: 'pcv', label: 'PCV' },
  { v: 'rota', label: 'Rota' }, { v: 'measles9', label: 'Measles 9mo' }, { v: 'measles18', label: 'Measles 18mo' },
];

export default function Entry() {
  const [age, setAge] = useState(0);
  const [mile, setMile] = useState<string[]>([]);
  const [vax, setVax] = useState<string[]>([]);
  const [sdq, setSdq] = useState(0);
  const [beh, setBeh] = useState('');
  const [note, setNote] = useState('');
  const save = useReading<MtotoReading>('mtoto');
  const submit = (): void => { save({ age_months: age, milestones: mile, immunizations: vax, sdq_total: sdq || undefined, behavior: beh, note }); setNote(''); };
  return (
    <Card>
      <h3 style={{ margin: '0 0 10px', fontFamily: 'Georgia, serif', fontSize: 20 }}>Mtoto</h3>
      <VoiceButton />
      <NumberField label="Umri (miezi)" value={age} onChange={setAge} />
      <Chips label="Milestones zilizofikiwa" value={mile} options={MILES} multi onChange={(v) => setMile(v as string[])} />
      <Chips label="Chanjo" value={vax} options={VAX} multi onChange={(v) => setVax(v as string[])} />
      <NumberField label="SDQ (kama umechukua)" value={sdq} onChange={setSdq} />
      <TextField label="Tabia leo" value={beh} onChange={setBeh} placeholder="Kawaida / amri / huzuni…" />
      <TextField label="Kumbukumbu" value={note} onChange={setNote} />
      <SaveBar onSave={submit} />
    </Card>
  );
}
