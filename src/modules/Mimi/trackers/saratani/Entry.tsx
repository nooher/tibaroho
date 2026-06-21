import { useState } from 'react';
import { Card, Chips, NumberField, TextField, SaveBar, VoiceButton, useReading } from '../common';
import type { SarataniReading } from './schema';

const SX = [
  { v: 'kichefuchefu', label: 'Kichefuchefu' }, { v: 'kutapika', label: 'Kutapika' },
  { v: 'uchovu', label: 'Uchovu' }, { v: 'homa', label: 'Homa' },
  { v: 'kuhara', label: 'Kuhara' }, { v: 'vidonda_mdomo', label: 'Vidonda mdomoni' },
  { v: 'kupungua_uzito', label: 'Kupungua uzito' },
];
const ECOG: { v: SarataniReading['ecog']; label: string }[] = [
  { v: 0, label: '0 — kazi kawaida' },
  { v: 1, label: '1 — wepesi' },
  { v: 2, label: '2 — pumzika nusu siku' },
  { v: 3, label: '3 — kitanda zaidi' },
  { v: 4, label: '4 — kitanda kabisa' },
];

export default function Entry() {
  const [cyc, setCyc] = useState(1);
  const [vas, setVas] = useState(0);
  const [ec, setEc] = useState<SarataniReading['ecog']>(0);
  const [sx, setSx] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const save = useReading<SarataniReading>('saratani');
  const submit = (): void => { save({ cycle: cyc, pain_vas: vas, ecog: ec, symptoms: sx, note }); setNote(''); setSx([]); };
  return (
    <Card>
      <h3 style={{ margin: '0 0 10px', fontFamily: 'Georgia, serif', fontSize: 20 }}>Saratani</h3>
      <VoiceButton />
      <NumberField label="Chemo cycle namba" value={cyc} onChange={setCyc} />
      <NumberField label="Maumivu (VAS 0-10)" value={vas} onChange={setVas} />
      <Chips label="ECOG" value={String(ec)} options={ECOG.map((o) => ({ v: String(o.v), label: o.label }))} onChange={(v) => setEc(Number(v) as SarataniReading['ecog'])} />
      <Chips label="Dalili" value={sx} options={SX} multi onChange={(v) => setSx(v as string[])} />
      <TextField label="Kumbukumbu" value={note} onChange={setNote} />
      <SaveBar onSave={submit} />
    </Card>
  );
}
