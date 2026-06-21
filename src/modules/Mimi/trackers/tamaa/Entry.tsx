import { useState } from 'react';
import { Card, Chips, NumberField, TextField, SaveBar, VoiceButton, useReading } from '../common';
import { useLang } from '../../../../lib/i18n/Provider';
import type { TamaaReading } from './schema';

export default function Entry() {
  const { t } = useLang();
  const SUB = [
    { v: 'pombe', label: t('mimi.tamaa.sub.alcohol', 'Pombe') },
    { v: 'sigara', label: t('mimi.tamaa.sub.tobacco', 'Sigara') },
    { v: 'bangi', label: t('mimi.tamaa.sub.cannabis', 'Bangi') },
    { v: 'mihadarati', label: t('mimi.tamaa.sub.drugs', 'Mihadarati') },
    { v: 'kingine', label: t('mimi.tamaa.sub.other', 'Kingine') },
  ];
  const TRIG = [
    { v: 'mawazo', label: t('mimi.tamaa.trig.thoughts', 'Mawazo') },
    { v: 'rafiki', label: t('mimi.tamaa.trig.friends', 'Rafiki') },
    { v: 'baada_ya_kula', label: t('mimi.tamaa.trig.after-meal', 'Baada ya kula') },
    { v: 'jioni', label: t('mimi.tamaa.trig.evening', 'Jioni') },
    { v: 'mahali', label: t('mimi.tamaa.trig.place', 'Mahali') },
    { v: 'fedha', label: t('mimi.tamaa.trig.money', 'Fedha') },
  ];
  const [c, setC] = useState(0);
  const [ep, setEp] = useState(0);
  const [sub, setSub] = useState<string>('pombe');
  const [trg, setTrg] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const save = useReading<TamaaReading>('tamaa');
  const submit = (): void => { save({ craving: c, episodes: ep, triggers: trg, substance: sub, note }); setNote(''); setTrg([]); };
  return (
    <Card>
      <h3 style={{ margin: '0 0 10px', fontFamily: 'Georgia, serif', fontSize: 20 }}>{t('mimi.tamaa.title', 'Tamaa')}</h3>
      <VoiceButton />
      <NumberField label={t('mimi.tamaa.craving', 'Tamaa (0-10)')} value={c} onChange={setC} />
      <NumberField label={t('mimi.tamaa.episodes', 'Mara ngapi umetumia leo')} value={ep} onChange={setEp} />
      <Chips<string> label={t('mimi.tamaa.type', 'Aina')} value={sub} options={SUB} onChange={(v) => setSub(v as string)} />
      <Chips label={t('mimi.maumivu.triggers', 'Vichocheo')} value={trg} options={TRIG} multi onChange={(v) => setTrg(v as string[])} />
      <TextField label={t('mimi.tamaa.action', 'Hatua niliyochukua badala yake')} value={note} onChange={setNote} />
      <SaveBar onSave={submit} />
    </Card>
  );
}
