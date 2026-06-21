import { useState } from 'react';
import { Card, Chips, NumberField, TextField, SaveBar, VoiceButton, useReading } from '../common';
import { useLang } from '../../../../lib/i18n/Provider';
import type { HivReading } from './schema';

export default function Entry() {
  const { t } = useLang();
  const SX: { v: string; label: string }[] = [
    { v: 'kichefuchefu', label: t('mimi.tracker.hiv.sx.nausea', 'Kichefuchefu') },
    { v: 'kichwa', label: t('mimi.tracker.hiv.sx.headache', 'Maumivu ya kichwa') },
    { v: 'usingizi', label: t('mimi.tracker.hiv.sx.insomnia', 'Kukosa usingizi') },
    { v: 'upele', label: t('mimi.tracker.hiv.sx.rash', 'Upele') },
    { v: 'uchovu', label: t('mimi.tracker.hiv.sx.fatigue', 'Uchovu') },
    { v: 'hakuna', label: t('mimi.tracker.hiv.sx.none', 'Hakuna') },
  ];
  const [art, setArt] = useState<'ndio' | 'hapana'>('ndio');
  const [vl, setVl] = useState(0);
  const [cd4, setCd4] = useState(0);
  const [sx, setSx] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const save = useReading<HivReading>('hiv');

  const submit = (): void => {
    save({ art_taken: art === 'ndio', viral_load: vl || undefined, cd4: cd4 || undefined, side_effects: sx, note });
    setVl(0); setCd4(0); setSx([]); setNote('');
  };

  return (
    <Card>
      <h3 style={{ margin: '0 0 10px', fontFamily: 'Georgia, serif', fontSize: 20 }}>{t('mimi.tracker.hiv.title', 'VVU')}</h3>
      <VoiceButton />
      <Chips<'ndio' | 'hapana'> label={t('mimi.tracker.hiv.art', 'Umemeza ART leo?')} value={art} options={[{ v: 'ndio', label: t('mimi.tracker.common.yes', 'Ndio') }, { v: 'hapana', label: t('mimi.tracker.common.no', 'Hapana') }]} onChange={(v) => setArt(v as 'ndio' | 'hapana')} />
      <NumberField label={t('mimi.tracker.hiv.vl', 'Viral load (kama unayo)')} value={vl} onChange={setVl} unit="copies/mL" />
      <NumberField label={t('mimi.tracker.hiv.cd4', 'CD4 (kama unayo)')} value={cd4} onChange={setCd4} unit="cells/mm³" />
      <Chips label={t('mimi.tracker.hiv.sx-label', 'Madhara')} value={sx} options={SX} multi onChange={(v) => setSx(v as string[])} />
      <TextField label={t('mimi.tracker.hiv.note', 'Kumbukumbu')} value={note} onChange={setNote} />
      <SaveBar onSave={submit} />
    </Card>
  );
}
