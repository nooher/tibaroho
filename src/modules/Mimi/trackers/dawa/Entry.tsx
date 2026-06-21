import { useState } from 'react';
import { Card, Chips, TextField, SaveBar, VoiceButton, useReading } from '../common';
import { useLang } from '../../../../lib/i18n/Provider';
import type { DawaReading } from './schema';

export default function Entry() {
  const { t } = useLang();
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
      <h3 style={{ margin: '0 0 10px', fontFamily: 'Georgia, serif', fontSize: 20 }}>{t('mimi.tracker.dawa.title', 'Dawa')}</h3>
      <VoiceButton />
      <TextField label={t('mimi.tracker.dawa.name', 'Jina la dawa')} value={name} onChange={setName} placeholder={t('mimi.tracker.dawa.name-ph', 'Mfano: TDF/3TC/DTG')} />
      <TextField label={t('mimi.tracker.dawa.dose', 'Dosi')} value={dose} onChange={setDose} placeholder={t('mimi.tracker.dawa.dose-ph', '1 kibao asubuhi')} />
      <Chips<'ndio' | 'hapana'> label={t('mimi.tracker.dawa.taken', 'Umemeza?')} value={taken} options={[{ v: 'ndio', label: t('mimi.tracker.common.yes', 'Ndio') }, { v: 'hapana', label: t('mimi.tracker.common.no', 'Hapana') }]} onChange={(v) => setTaken(v as 'ndio' | 'hapana')} />
      {taken === 'hapana' && <TextField label={t('mimi.tracker.dawa.reason', 'Sababu (chaguo)')} value={reason} onChange={setReason} placeholder={t('mimi.tracker.dawa.reason-ph', 'Nilisahau / nilikuwa safarini…')} />}
      <TextField label={t('mimi.tracker.dawa.note', 'Kumbukumbu')} value={note} onChange={setNote} />
      <SaveBar onSave={submit} disabled={!name.trim()} />
    </Card>
  );
}
