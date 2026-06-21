import { useState } from 'react';
import { Card, Chips, NumberField, TextField, SaveBar, VoiceButton, useReading } from '../common';
import type { MaumivuReading } from './schema';

const SITES = [
  { v: 'kichwa', label: 'Kichwa' }, { v: 'mgongo', label: 'Mgongo' },
  { v: 'tumbo', label: 'Tumbo' }, { v: 'kifua', label: 'Kifua' },
  { v: 'miguu', label: 'Miguu' }, { v: 'mikono', label: 'Mikono' },
  { v: 'mwili_wote', label: 'Mwili wote' },
];
const TRIG = [
  { v: 'stress', label: 'Mawazo' }, { v: 'baridi', label: 'Baridi' },
  { v: 'kazi', label: 'Kazi nzito' }, { v: 'kulala', label: 'Kulala' }, { v: 'chakula', label: 'Chakula' },
];

export default function Entry() {
  const [vas, setVas] = useState(0);
  const [site, setSite] = useState<string>('kichwa');
  const [trg, setTrg] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const save = useReading<MaumivuReading>('maumivu');
  const submit = (): void => { save({ vas, site, triggers: trg, note }); setNote(''); setTrg([]); };
  return (
    <Card>
      <h3 style={{ margin: '0 0 10px', fontFamily: 'Georgia, serif', fontSize: 20 }}>Maumivu</h3>
      <VoiceButton />
      <NumberField label="VAS 0-10" value={vas} onChange={setVas} />
      <Chips<string> label="Eneo" value={site} options={SITES} onChange={(v) => setSite(v as string)} />
      <Chips label="Vichocheo" value={trg} options={TRIG} multi onChange={(v) => setTrg(v as string[])} />
      <TextField label="Kumbukumbu" value={note} onChange={setNote} />
      <SaveBar onSave={submit} />
    </Card>
  );
}
