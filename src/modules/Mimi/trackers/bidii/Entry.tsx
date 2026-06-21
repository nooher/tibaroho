import { useState } from 'react';
import { Card, NumberField, TextField, SaveBar, VoiceButton, useReading } from '../common';
import { useLang } from '../../../../lib/i18n/Provider';
import type { BidiiReading } from './schema';

export default function Entry() {
  const { t } = useLang();
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
      <h3 style={{ margin: '0 0 10px', fontFamily: 'Georgia, serif', fontSize: 20 }}>{t('mimi.bidii.title', 'Bidii')}</h3>
      <VoiceButton />
      <NumberField label={t('mimi.bidii.steps', 'Hatua')} value={steps} onChange={setSteps} unit="steps" />
      <NumberField label={t('mimi.bidii.sleep', 'Usingizi')} value={sleep} onChange={setSleep} unit={t('mimi.bidii.hours', 'saa')} step={0.1} />
      <NumberField label={t('mimi.bidii.exercise', 'Mazoezi')} value={ex} onChange={setEx} unit={t('mimi.bidii.minutes', 'dakika')} />
      <NumberField label={t('mimi.bidii.hr', 'Resting HR')} value={hr} onChange={setHr} unit="bpm" />
      <TextField label={t('mimi.bidii.watch', 'Smartwatch (chaguo)')} value={sw} onChange={setSw} placeholder={t('mimi.bidii.watch-ph', 'Garmin, Fitbit, n.k.')} />
      <TextField label={t('mimi.common.note', 'Kumbukumbu')} value={note} onChange={setNote} />
      <SaveBar onSave={submit} />
    </Card>
  );
}
