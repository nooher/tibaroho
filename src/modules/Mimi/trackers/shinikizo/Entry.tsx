import { useState } from 'react';
import { Card, NumberField, TextField, SaveBar, VoiceButton, useReading } from '../common';
import type { ShinikizoReading } from './schema';

export default function Entry() {
  const [sbp, setSbp] = useState(120);
  const [dbp, setDbp] = useState(80);
  const [pulse, setPulse] = useState(70);
  const [note, setNote] = useState('');
  const save = useReading<ShinikizoReading>('shinikizo');
  const submit = (): void => { save({ sbp, dbp, pulse, note }); setNote(''); };
  return (
    <Card>
      <h3 style={{ margin: '0 0 10px', fontFamily: 'Georgia, serif', fontSize: 20 }}>Shinikizo</h3>
      <VoiceButton />
      <NumberField label="Systolic" value={sbp} onChange={setSbp} unit="mmHg" />
      <NumberField label="Diastolic" value={dbp} onChange={setDbp} unit="mmHg" />
      <NumberField label="Pulse" value={pulse} onChange={setPulse} unit="bpm" />
      <TextField label="Kumbukumbu" value={note} onChange={setNote} />
      <SaveBar onSave={submit} />
    </Card>
  );
}
