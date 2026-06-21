import { useState } from 'react';
import { Card, Chips, TextField, SaveBar, VoiceButton, useReading } from '../common';
import type { DawaReading } from './schema';

export default function Entry() {
  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [taken, setTaken] = useState<'ndio' | 'hapana'>('ndio');
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const save = useReading<DawaReading>('dawa');

  const submit = (): void => {
    save({ name, dose, taken: taken === 'ndio', skipped_reason: taken === 'hapana' ? reason : undefined, note });
    setName(''); setDose(''); setReason(''); setNote('');
  };

  return (
    <Card>
      <h3 style={{ margin: '0 0 10px', fontFamily: 'Georgia, serif', fontSize: 20 }}>Dawa</h3>
      <VoiceButton />
      <TextField label="Jina la dawa" value={name} onChange={setName} placeholder="Mfano: TDF/3TC/DTG" />
      <TextField label="Dosi" value={dose} onChange={setDose} placeholder="1 kibao asubuhi" />
      <Chips<'ndio' | 'hapana'> label="Umemeza?" value={taken} options={[{ v: 'ndio', label: 'Ndio' }, { v: 'hapana', label: 'Hapana' }]} onChange={(v) => setTaken(v as 'ndio' | 'hapana')} />
      {taken === 'hapana' && <TextField label="Sababu (chaguo)" value={reason} onChange={setReason} placeholder="Nilisahau / nilikuwa safarini…" />}
      <TextField label="Kumbukumbu" value={note} onChange={setNote} />
      <SaveBar onSave={submit} disabled={!name.trim()} />
    </Card>
  );
}
