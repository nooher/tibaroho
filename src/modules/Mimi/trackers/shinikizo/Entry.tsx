import { useState } from 'react';
import { Card, NumberField, TextField, SaveBar, VoiceButton, useReading } from '../common';
import { useLang } from '../../../../lib/i18n/Provider';
import type { ShinikizoReading } from './schema';

export default function Entry() {
  const { t } = useLang();
  const [sbp, setSbp] = useState(120);
  const [dbp, setDbp] = useState(80);
  const [pulse, setPulse] = useState(70);
  const [note, setNote] = useState('');
  const save = useReading<ShinikizoReading>('shinikizo');
  const submit = (): void => { save({ sbp, dbp, pulse, note }); setNote(''); };
  return (
    <Card>
      <h3 style={{ margin: '0 0 10px', fontFamily: 'Georgia, serif', fontSize: 20 }}>{t('mimi.tracker.shinikizo.title', 'Shinikizo')}</h3>
      <VoiceButton />
      <NumberField label={t('mimi.tracker.shinikizo.systolic', 'Systolic')} value={sbp} onChange={setSbp} unit="mmHg" />
      <NumberField label={t('mimi.tracker.shinikizo.diastolic', 'Diastolic')} value={dbp} onChange={setDbp} unit="mmHg" />
      <NumberField label={t('mimi.tracker.shinikizo.pulse', 'Pulse')} value={pulse} onChange={setPulse} unit="bpm" />
      <TextField label={t('mimi.tracker.shinikizo.note', 'Kumbukumbu')} value={note} onChange={setNote} />
      <SaveBar onSave={submit} />
    </Card>
  );
}
