import { useState } from 'react';
import { Card, Chips, NumberField, TextField, SaveBar, VoiceButton, useReading } from '../common';
import { useLang } from '../../../../lib/i18n/Provider';
import type { MtotoReading } from './schema';

export default function Entry() {
  const { t } = useLang();
  const MILES = [
    { v: 'tabasamu', label: t('mimi.mtoto.mile.smile', 'Tabasamu (3mo)') },
    { v: 'kukaa', label: t('mimi.mtoto.mile.sit', 'Kukaa (6mo)') },
    { v: 'kuingia_kombe', label: t('mimi.mtoto.mile.cup', 'Kombe (9mo)') },
    { v: 'tembea', label: t('mimi.mtoto.mile.walk', 'Tembea (12mo)') },
    { v: 'maneno_1', label: t('mimi.mtoto.mile.words', 'Maneno 1-3 (18mo)') },
    { v: 'sentensi_2', label: t('mimi.mtoto.mile.sentence', 'Sentensi 2 maneno (24mo)') },
  ];
  const VAX = [
    { v: 'bcg', label: 'BCG' }, { v: 'opv', label: 'OPV' },
    { v: 'penta', label: 'Penta' }, { v: 'pcv', label: 'PCV' },
    { v: 'rota', label: 'Rota' }, { v: 'measles9', label: 'Measles 9mo' }, { v: 'measles18', label: 'Measles 18mo' },
  ];
  const [age, setAge] = useState(0);
  const [mile, setMile] = useState<string[]>([]);
  const [vax, setVax] = useState<string[]>([]);
  const [sdq, setSdq] = useState(0);
  const [beh, setBeh] = useState('');
  const [note, setNote] = useState('');
  const save = useReading<MtotoReading>('mtoto');
  const submit = (): void => { save({ age_months: age, milestones: mile, immunizations: vax, sdq_total: sdq || undefined, behavior: beh, note }); setNote(''); };
  return (
    <Card>
      <h3 style={{ margin: '0 0 10px', fontFamily: 'Georgia, serif', fontSize: 20 }}>{t('mimi.mtoto.title', 'Mtoto')}</h3>
      <VoiceButton />
      <NumberField label={t('mimi.mtoto.age', 'Umri (miezi)')} value={age} onChange={setAge} />
      <Chips label={t('mimi.mtoto.milestones', 'Milestones zilizofikiwa')} value={mile} options={MILES} multi onChange={(v) => setMile(v as string[])} />
      <Chips label={t('mimi.mtoto.vax', 'Chanjo')} value={vax} options={VAX} multi onChange={(v) => setVax(v as string[])} />
      <NumberField label={t('mimi.mtoto.sdq', 'SDQ (kama umechukua)')} value={sdq} onChange={setSdq} />
      <TextField label={t('mimi.mtoto.behavior', 'Tabia leo')} value={beh} onChange={setBeh} placeholder={t('mimi.mtoto.behavior-ph', 'Kawaida / amri / huzuni…')} />
      <TextField label={t('mimi.common.note', 'Kumbukumbu')} value={note} onChange={setNote} />
      <SaveBar onSave={submit} />
    </Card>
  );
}
