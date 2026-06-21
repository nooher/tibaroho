import { useState } from 'react';
import { Card, Chips, NumberField, TextField, SaveBar, VoiceButton, useReading } from '../common';
import type { SukariReading } from './schema';

export default function Entry() {
  const [g, setG] = useState(0);
  const [ctx, setCtx] = useState<SukariReading['context']>('fasting');
  const [a1c, setA1c] = useState(0);
  const [hypo, setHypo] = useState<'ndio' | 'hapana'>('hapana');
  const [note, setNote] = useState('');
  const save = useReading<SukariReading>('sukari');
  const submit = (): void => {
    save({ glucose_mmol: g, context: ctx, a1c: a1c || undefined, hypo: hypo === 'ndio', note });
    setG(0); setA1c(0); setNote('');
  };
  return (
    <Card>
      <h3 style={{ margin: '0 0 10px', fontFamily: 'Georgia, serif', fontSize: 20 }}>Sukari</h3>
      <VoiceButton />
      <NumberField label="Sukari" value={g} onChange={setG} unit="mmol/L" step={0.1} />
      <Chips<SukariReading['context']> label="Wakati" value={ctx} onChange={(v) => setCtx(v as SukariReading['context'])} options={[
        { v: 'fasting', label: 'Asubuhi (njaa)' }, { v: 'baada', label: 'Baada ya chakula' },
        { v: 'random', label: 'Wakati wowote' }, { v: 'lala', label: 'Kabla ya kulala' },
      ]} />
      <NumberField label="HbA1c (kama unayo)" value={a1c} onChange={setA1c} unit="%" step={0.1} />
      <Chips<'ndio' | 'hapana'> label="Umepata hypo (jasho, mtetemeko)?" value={hypo} options={[{ v: 'ndio', label: 'Ndio' }, { v: 'hapana', label: 'Hapana' }]} onChange={(v) => setHypo(v as 'ndio' | 'hapana')} />
      <TextField label="Kumbukumbu" value={note} onChange={setNote} />
      <SaveBar onSave={submit} />
    </Card>
  );
}
