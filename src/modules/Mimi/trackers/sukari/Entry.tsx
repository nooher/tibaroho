import { useState } from 'react';
import { Card, Chips, NumberField, TextField, SaveBar, VoiceButton, useReading } from '../common';
import { useLang } from '../../../../lib/i18n/Provider';
import type { SukariReading } from './schema';

export default function Entry() {
  const { t } = useLang();
  const [g, setG] = useState(0);
  const [ctx, setCtx] = useState<SukariReading['context']>('fasting');
  const [a1c, setA1c] = useState(0);
  const [hypo, setHypo] = useState<'ndio' | 'hapana'>('hapana');
  const [note, setNote] = useState('');
  const save = useReading<SukariReading>('sukari');
  const submit = (): void => {
    save({ glucose_mmol: g, context: ctx, a1c: a1c || undefined, hypo: hypo === 'ndio', note });
    setG(0); setA1c(0); setNote('');
  };
  return (
    <Card>
      <h3 style={{ margin: '0 0 10px', fontFamily: 'Georgia, serif', fontSize: 20 }}>{t('mimi.tracker.sukari.title', 'Sukari')}</h3>
      <VoiceButton />
      <NumberField label={t('mimi.tracker.sukari.glucose', 'Sukari')} value={g} onChange={setG} unit="mmol/L" step={0.1} />
      <Chips<SukariReading['context']> label={t('mimi.tracker.sukari.when', 'Wakati')} value={ctx} onChange={(v) => setCtx(v as SukariReading['context'])} options={[
        { v: 'fasting', label: t('mimi.tracker.sukari.ctx.fasting', 'Asubuhi (njaa)') }, { v: 'baada', label: t('mimi.tracker.sukari.ctx.post', 'Baada ya chakula') },
        { v: 'random', label: t('mimi.tracker.sukari.ctx.random', 'Wakati wowote') }, { v: 'lala', label: t('mimi.tracker.sukari.ctx.bed', 'Kabla ya kulala') },
      ]} />
      <NumberField label={t('mimi.tracker.sukari.a1c', 'HbA1c (kama unayo)')} value={a1c} onChange={setA1c} unit="%" step={0.1} />
      <Chips<'ndio' | 'hapana'> label={t('mimi.tracker.sukari.hypo', 'Umepata hypo (jasho, mtetemeko)?')} value={hypo} options={[{ v: 'ndio', label: t('mimi.tracker.common.yes', 'Ndio') }, { v: 'hapana', label: t('mimi.tracker.common.no', 'Hapana') }]} onChange={(v) => setHypo(v as 'ndio' | 'hapana')} />
      <TextField label={t('mimi.tracker.sukari.note', 'Kumbukumbu')} value={note} onChange={setNote} />
      <SaveBar onSave={submit} />
    </Card>
  );
}
