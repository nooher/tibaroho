import { useState } from 'react';
import { Card, Chips, NumberField, TextField, SaveBar, VoiceButton, useReading } from '../common';
import { useLang } from '../../../../lib/i18n/Provider';
import type { SarataniReading } from './schema';

export default function Entry() {
  const { t } = useLang();
  const SX = [
    { v: 'kichefuchefu', label: t('mimi.saratani.sx.nausea', 'Kichefuchefu') },
    { v: 'kutapika', label: t('mimi.saratani.sx.vomit', 'Kutapika') },
    { v: 'uchovu', label: t('mimi.saratani.sx.fatigue', 'Uchovu') },
    { v: 'homa', label: t('mimi.saratani.sx.fever', 'Homa') },
    { v: 'kuhara', label: t('mimi.saratani.sx.diarrhea', 'Kuhara') },
    { v: 'vidonda_mdomo', label: t('mimi.saratani.sx.mouth-sores', 'Vidonda mdomoni') },
    { v: 'kupungua_uzito', label: t('mimi.saratani.sx.weight-loss', 'Kupungua uzito') },
  ];
  const ECOG: { v: SarataniReading['ecog']; label: string }[] = [
    { v: 0, label: t('mimi.saratani.ecog.0', '0 — kazi kawaida') },
    { v: 1, label: t('mimi.saratani.ecog.1', '1 — wepesi') },
    { v: 2, label: t('mimi.saratani.ecog.2', '2 — pumzika nusu siku') },
    { v: 3, label: t('mimi.saratani.ecog.3', '3 — kitanda zaidi') },
    { v: 4, label: t('mimi.saratani.ecog.4', '4 — kitanda kabisa') },
  ];
  const [cyc, setCyc] = useState(1);
  const [vas, setVas] = useState(0);
  const [ec, setEc] = useState<SarataniReading['ecog']>(0);
  const [sx, setSx] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const save = useReading<SarataniReading>('saratani');
  const submit = (): void => { save({ cycle: cyc, pain_vas: vas, ecog: ec, symptoms: sx, note }); setNote(''); setSx([]); };
  return (
    <Card>
      <h3 style={{ margin: '0 0 10px', fontFamily: 'Georgia, serif', fontSize: 20 }}>{t('mimi.saratani.title', 'Saratani')}</h3>
      <VoiceButton />
      <NumberField label={t('mimi.saratani.cycle', 'Chemo cycle namba')} value={cyc} onChange={setCyc} />
      <NumberField label={t('mimi.saratani.vas', 'Maumivu (VAS 0-10)')} value={vas} onChange={setVas} />
      <Chips label={t('mimi.saratani.ecog', 'ECOG')} value={String(ec)} options={ECOG.map((o) => ({ v: String(o.v), label: o.label }))} onChange={(v) => setEc(Number(v) as SarataniReading['ecog'])} />
      <Chips label={t('mimi.saratani.symptoms', 'Dalili')} value={sx} options={SX} multi onChange={(v) => setSx(v as string[])} />
      <TextField label={t('mimi.common.note', 'Kumbukumbu')} value={note} onChange={setNote} />
      <SaveBar onSave={submit} />
    </Card>
  );
}
