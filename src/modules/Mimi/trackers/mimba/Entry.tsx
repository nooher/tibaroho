import { useState } from 'react';
import { Card, Chips, NumberField, TextField, SaveBar, VoiceButton, useReading } from '../common';
import { useLang } from '../../../../lib/i18n/Provider';
import type { MimbaReading } from './schema';

export default function Entry() {
  const { t } = useLang();
  const [kicks, setKicks] = useState(0);
  const [epds, setEpds] = useState(0);
  const [partner, setPartner] = useState<'ndio' | 'hapana'>('ndio');
  const [tri, setTri] = useState<MimbaReading['trimester']>(2);
  const [note, setNote] = useState('');
  const save = useReading<MimbaReading>('mimba');
  const submit = (): void => {
    save({ kicks_2h: kicks, epds_week: epds || undefined, partner_checked: partner === 'ndio', trimester: tri, note });
    setNote(''); setKicks(0);
  };
  return (
    <Card>
      <h3 style={{ margin: '0 0 10px', fontFamily: 'Georgia, serif', fontSize: 20 }}>{t('mimi.mimba.title', 'Mimba')}</h3>
      <VoiceButton />
      <Chips label={t('mimi.mimba.trimester', 'Trimester')} value={String(tri)} onChange={(v) => setTri(Number(v) as MimbaReading['trimester'])} options={[
        { v: '1', label: '1' }, { v: '2', label: '2' }, { v: '3', label: '3' },
      ]} />
      <NumberField label={t('mimi.mimba.kicks', 'Mwendo wa mtoto (kicks 2hrs)')} value={kicks} onChange={setKicks} />
      <NumberField label={t('mimi.mimba.epds', 'EPDS wiki (kama uliambiwa)')} value={epds} onChange={setEpds} />
      <Chips<'ndio' | 'hapana'> label={t('mimi.mimba.partner', 'Mpenzi ameuliza')} value={partner} onChange={(v) => setPartner(v as 'ndio' | 'hapana')} options={[
        { v: 'ndio', label: t('mimi.common.yes', 'Ndio') },
        { v: 'hapana', label: t('mimi.common.no', 'Hapana') },
      ]} />
      <TextField label={t('mimi.common.note', 'Kumbukumbu')} value={note} onChange={setNote} />
      <SaveBar onSave={submit} />
    </Card>
  );
}
