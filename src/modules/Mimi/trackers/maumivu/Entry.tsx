import { useState } from 'react';
import { Card, Chips, NumberField, TextField, SaveBar, VoiceButton, useReading } from '../common';
import { useLang } from '../../../../lib/i18n/Provider';
import type { MaumivuReading } from './schema';

export default function Entry() {
  const { t } = useLang();
  const SITES = [
    { v: 'kichwa', label: t('mimi.maumivu.site.head', 'Kichwa') },
    { v: 'mgongo', label: t('mimi.maumivu.site.back', 'Mgongo') },
    { v: 'tumbo', label: t('mimi.maumivu.site.belly', 'Tumbo') },
    { v: 'kifua', label: t('mimi.maumivu.site.chest', 'Kifua') },
    { v: 'miguu', label: t('mimi.maumivu.site.legs', 'Miguu') },
    { v: 'mikono', label: t('mimi.maumivu.site.arms', 'Mikono') },
    { v: 'mwili_wote', label: t('mimi.maumivu.site.all', 'Mwili wote') },
  ];
  const TRIG = [
    { v: 'stress', label: t('mimi.maumivu.trig.stress', 'Mawazo') },
    { v: 'baridi', label: t('mimi.maumivu.trig.cold', 'Baridi') },
    { v: 'kazi', label: t('mimi.maumivu.trig.work', 'Kazi nzito') },
    { v: 'kulala', label: t('mimi.maumivu.trig.sleep', 'Kulala') },
    { v: 'chakula', label: t('mimi.maumivu.trig.food', 'Chakula') },
  ];
  const [vas, setVas] = useState(0);
  const [site, setSite] = useState<string>('kichwa');
  const [trg, setTrg] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const save = useReading<MaumivuReading>('maumivu');
  const submit = (): void => { save({ vas, site, triggers: trg, note }); setNote(''); setTrg([]); };
  return (
    <Card>
      <h3 style={{ margin: '0 0 10px', fontFamily: 'Georgia, serif', fontSize: 20 }}>{t('mimi.maumivu.title', 'Maumivu')}</h3>
      <VoiceButton />
      <NumberField label={t('mimi.maumivu.vas', 'VAS 0-10')} value={vas} onChange={setVas} />
      <Chips<string> label={t('mimi.maumivu.site', 'Eneo')} value={site} options={SITES} onChange={(v) => setSite(v as string)} />
      <Chips label={t('mimi.maumivu.triggers', 'Vichocheo')} value={trg} options={TRIG} multi onChange={(v) => setTrg(v as string[])} />
      <TextField label={t('mimi.common.note', 'Kumbukumbu')} value={note} onChange={setNote} />
      <SaveBar onSave={submit} />
    </Card>
  );
}
