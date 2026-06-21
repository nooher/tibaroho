import { useState } from 'react';
import { Card, Chips, NumberField, TextField, TextArea, SaveBar, VoiceButton, useReading } from '../common';
import type { MoodReading } from './schema';

const E = [
  { v: 'utulivu', label: 'Utulivu' }, { v: 'furaha', label: 'Furaha' },
  { v: 'huzuni', label: 'Huzuni' }, { v: 'hofu', label: 'Hofu' },
  { v: 'hasira', label: 'Hasira' }, { v: 'upweke', label: 'Upweke' },
  { v: 'uchovu', label: 'Uchovu' }, { v: 'shukrani', label: 'Shukrani' },
];

export default function Entry() {
  const [score, setScore] = useState(5);
  const [emo, setEmo] = useState<string[]>([]);
  const [diary, setDiary] = useState('');
  const [note, setNote] = useState('');
  const save = useReading<MoodReading>('mood');
  const submit = (): void => { save({ score, emotions: emo, voice_diary: diary, note }); setEmo([]); setDiary(''); setNote(''); };
  return (
    <Card>
      <h3 style={{ margin: '0 0 10px', fontFamily: 'Georgia, serif', fontSize: 20 }}>Hali ya hisia</h3>
      <VoiceButton />
      <NumberField label="Hali yako (0-10)" value={score} onChange={setScore} />
      <Chips label="Hisia" value={emo} options={E} multi onChange={(v) => setEmo(v as string[])} />
      <TextArea label="Shajara fupi" value={diary} onChange={setDiary} placeholder="Niambie kidogo…" />
      <TextField label="Kumbukumbu" value={note} onChange={setNote} />
      <SaveBar onSave={submit} />
    </Card>
  );
}
