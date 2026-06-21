import { useState } from 'react';
import { Card, Chips, NumberField, TextField, SaveBar, VoiceButton, useReading } from '../common';
import type { MimbaReading } from './schema';

export default function Entry() {
  const [kicks, setKicks] = useState(0);
  const [epds, setEpds] = useState(0);
  const [partner, setPartner] = useState<'ndio' | 'hapana'>('ndio');
  const [t, setT] = useState<MimbaReading['trimester']>(2);
  const [note, setNote] = useState('');
  const save = useReading<MimbaReading>('mimba');
  const submit = (): void => {
    save({ kicks_2h: kicks, epds_week: epds || undefined, partner_checked: partner === 'ndio', trimester: t, note });
    setNote(''); setKicks(0);
  };
  return (
    <Card>
      <h3 style={{ margin: '0 0 10px', fontFamily: 'Georgia, serif', fontSize: 20 }}>Mimba</h3>
      <VoiceButton />
      <Chips label="Trimester" value={String(t)} onChange={(v) => setT(Number(v) as MimbaReading['trimester'])} options={[
        { v: '1', label: '1' }, { v: '2', label: '2' }, { v: '3', label: '3' },
      ]} />
      <NumberField label="Mwendo wa mtoto (kicks 2hrs)" value={kicks} onChange={setKicks} />
      <NumberField label="EPDS wiki (kama uliambiwa)" value={epds} onChange={setEpds} />
      <Chips<'ndio' | 'hapana'> label="Mpenzi ameuliza" value={partner} onChange={(v) => setPartner(v as 'ndio' | 'hapana')} options={[{ v: 'ndio', label: 'Ndio' }, { v: 'hapana', label: 'Hapana' }]} />
      <TextField label="Kumbukumbu" value={note} onChange={setNote} />
      <SaveBar onSave={submit} />
    </Card>
  );
}
