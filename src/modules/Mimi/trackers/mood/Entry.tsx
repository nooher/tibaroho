import { useState } from 'react';
import { Card, Chips, NumberField, TextField, TextArea, SaveBar, VoiceButton, useReading } from '../common';
import { useLang } from '../../../../lib/i18n/Provider';
import type { MoodReading } from './schema';

export default function Entry() {
  const { t } = useLang();
  const E = [
    { v: 'utulivu', label: t('mimi.tracker.mood.emo.utulivu', 'Utulivu') }, { v: 'furaha', label: t('mimi.tracker.mood.emo.furaha', 'Furaha') },
    { v: 'huzuni', label: t('mimi.tracker.mood.emo.huzuni', 'Huzuni') }, { v: 'hofu', label: t('mimi.tracker.mood.emo.hofu', 'Hofu') },
    { v: 'hasira', label: t('mimi.tracker.mood.emo.hasira', 'Hasira') }, { v: 'upweke', label: t('mimi.tracker.mood.emo.upweke', 'Upweke') },
    { v: 'uchovu', label: t('mimi.tracker.mood.emo.uchovu', 'Uchovu') }, { v: 'shukrani', label: t('mimi.tracker.mood.emo.shukrani', 'Shukrani') },
  ];
  const [score, setScore] = useState(5);
  const [emo, setEmo] = useState<string[]>([]);
  const [diary, setDiary] = useState('');
  const [note, setNote] = useState('');
  const save = useReading<MoodReading>('mood');
  const submit = (): void => { save({ score, emotions: emo, voice_diary: diary, note }); setEmo([]); setDiary(''); setNote(''); };
  return (
    <Card>
      <h3 style={{ margin: '0 0 10px', fontFamily: 'Georgia, serif', fontSize: 20 }}>{t('mimi.tracker.mood.title', 'Hali ya hisia')}</h3>
      <VoiceButton />
      <NumberField label={t('mimi.tracker.mood.score', 'Hali yako (0-10)')} value={score} onChange={setScore} />
      <Chips label={t('mimi.tracker.mood.feelings', 'Hisia')} value={emo} options={E} multi onChange={(v) => setEmo(v as string[])} />
      <TextArea label={t('mimi.tracker.mood.diary', 'Shajara fupi')} value={diary} onChange={setDiary} placeholder={t('mimi.tracker.mood.diary-ph', 'Niambie kidogo…')} />
      <TextField label={t('mimi.tracker.mood.note', 'Kumbukumbu')} value={note} onChange={setNote} />
      <SaveBar onSave={submit} />
    </Card>
  );
}
