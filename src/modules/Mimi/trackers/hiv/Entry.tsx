import { useState } from 'react';
import { Card, Chips, NumberField, TextField, SaveBar, VoiceButton, useReading } from '../common';
import type { HivReading } from './schema';

const SX: { v: string; label: string }[] = [
  { v: 'kichefuchefu', label: 'Kichefuchefu' },
  { v: 'kichwa', label: 'Maumivu ya kichwa' },
  { v: 'usingizi', label: 'Kukosa usingizi' },
  { v: 'upele', label: 'Upele' },
  { v: 'uchovu', label: 'Uchovu' },
  { v: 'hakuna', label: 'Hakuna' },
];

export default function Entry() {
  const [art, setArt] = useState<'ndio' | 'hapana'>('ndio');
  const [vl, setVl] = useState(0);
  const [cd4, setCd4] = useState(0);
  const [sx, setSx] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const save = useReading<HivReading>('hiv');

  const submit = (): void => {
    save({ art_taken: art === 'ndio', viral_load: vl || undefined, cd4: cd4 || undefined, side_effects: sx, note });
    setVl(0); setCd4(0); setSx([]); setNote('');
  };

  return (
    <Card>
      <h3 style={{ margin: '0 0 10px', fontFamily: 'Georgia, serif', fontSize: 20 }}>VVU</h3>
      <VoiceButton />
      <Chips<'ndio' | 'hapana'> label="Umemeza ART leo?" value={art} options={[{ v: 'ndio', label: 'Ndio' }, { v: 'hapana', label: 'Hapana' }]} onChange={(v) => setArt(v as 'ndio' | 'hapana')} />
      <NumberField label="Viral load (kama unayo)" value={vl} onChange={setVl} unit="copies/mL" />
      <NumberField label="CD4 (kama unayo)" value={cd4} onChange={setCd4} unit="cells/mm³" />
      <Chips label="Madhara" value={sx} options={SX} multi onChange={(v) => setSx(v as string[])} />
      <TextField label="Kumbukumbu" value={note} onChange={setNote} />
      <SaveBar onSave={submit} />
    </Card>
  );
}
