import { useState } from 'react';
import { Card, Chips, NumberField, TextField, SaveBar, VoiceButton, useReading } from '../common';
import type { TamaaReading } from './schema';

const SUB = [
  { v: 'pombe', label: 'Pombe' }, { v: 'sigara', label: 'Sigara' },
  { v: 'bangi', label: 'Bangi' }, { v: 'mihadarati', label: 'Mihadarati' }, { v: 'kingine', label: 'Kingine' },
];
const TRIG = [
  { v: 'mawazo', label: 'Mawazo' }, { v: 'rafiki', label: 'Rafiki' },
  { v: 'baada_ya_kula', label: 'Baada ya kula' }, { v: 'jioni', label: 'Jioni' },
  { v: 'mahali', label: 'Mahali' }, { v: 'fedha', label: 'Fedha' },
];

export default function Entry() {
  const [c, setC] = useState(0);
  const [ep, setEp] = useState(0);
  const [sub, setSub] = useState<string>('pombe');
  const [trg, setTrg] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const save = useReading<TamaaReading>('tamaa');
  const submit = (): void => { save({ craving: c, episodes: ep, triggers: trg, substance: sub, note }); setNote(''); setTrg([]); };
  return (
    <Card>
      <h3 style={{ margin: '0 0 10px', fontFamily: 'Georgia, serif', fontSize: 20 }}>Tamaa</h3>
      <VoiceButton />
      <NumberField label="Tamaa (0-10)" value={c} onChange={setC} />
      <NumberField label="Mara ngapi umetumia leo" value={ep} onChange={setEp} />
      <Chips<string> label="Aina" value={sub} options={SUB} onChange={(v) => setSub(v as string)} />
      <Chips label="Vichocheo" value={trg} options={TRIG} multi onChange={(v) => setTrg(v as string[])} />
      <TextField label="Hatua niliyochukua badala yake" value={note} onChange={setNote} />
      <SaveBar onSave={submit} />
    </Card>
  );
}
