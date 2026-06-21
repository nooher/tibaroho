import { useState } from 'react';
import { Card, NumberField, TextField, SaveBar, VoiceButton, useReading } from '../common';
import type { BidiiReading } from './schema';

export default function Entry() {
  const [steps, setSteps] = useState(0);
  const [sleep, setSleep] = useState(0);
  const [ex, setEx] = useState(0);
  const [hr, setHr] = useState(0);
  const [sw, setSw] = useState('');
  const [note, setNote] = useState('');
  const save = useReading<BidiiReading>('bidii');
  const submit = (): void => {
    save({ steps, sleep_hours: sleep, exercise_min: ex, resting_hr: hr || undefined, smartwatch: sw || undefined, note });
    setNote('');
  };
  return (
    <Card>
      <h3 style={{ margin: '0 0 10px', fontFamily: 'Georgia, serif', fontSize: 20 }}>Bidii</h3>
      <VoiceButton />
      <NumberField label="Hatua" value={steps} onChange={setSteps} unit="steps" />
      <NumberField label="Usingizi" value={sleep} onChange={setSleep} unit="saa" step={0.1} />
      <NumberField label="Mazoezi" value={ex} onChange={setEx} unit="dakika" />
      <NumberField label="Resting HR" value={hr} onChange={setHr} unit="bpm" />
      <TextField label="Smartwatch (chaguo)" value={sw} onChange={setSw} placeholder="Garmin, Fitbit, n.k." />
      <TextField label="Kumbukumbu" value={note} onChange={setNote} />
      <SaveBar onSave={submit} />
    </Card>
  );
}
