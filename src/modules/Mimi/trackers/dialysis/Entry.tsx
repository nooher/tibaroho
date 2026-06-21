import { useState } from 'react';
import { Card, Chips, NumberField, TextField, SaveBar, VoiceButton, useReading } from '../common';
import { useLang } from '../../../../lib/i18n/Provider';
import type { DialysisReading } from './schema';

export default function Entry() {
  const { t } = useLang();
  const [fluid, setFluid] = useState(0);
  const [sess, setSess] = useState(240);
  const [uf, setUf] = useState(0);
  const [dw, setDw] = useState(0);
  const [pre, setPre] = useState('');
  const [post, setPost] = useState('');
  const [epo, setEpo] = useState<'ndio' | 'hapana'>('hapana');
  const [k, setK] = useState(0);
  const [ca, setCa] = useState(0);
  const [phos, setPhos] = useState(0);
  const [note, setNote] = useState('');
  const save = useReading<DialysisReading>('dialysis');

  const submit = (): void => {
    save({ fluid_in_ml: fluid, session_min: sess, uf_ml: uf, dry_weight_kg: dw, bp_pre: pre, bp_post: post, epo: epo === 'ndio', k_mmol: k || undefined, ca_mmol: ca || undefined, phos_mmol: phos || undefined, note });
    setFluid(0); setUf(0); setPre(''); setPost(''); setNote('');
  };

  return (
    <Card>
      <h3 style={{ margin: '0 0 10px', fontFamily: 'Georgia, serif', fontSize: 20 }}>{t('mimi.tracker.dialysis.title', 'Dialysis')}</h3>
      <VoiceButton />
      <NumberField label={t('mimi.tracker.dialysis.fluid', 'Ulaji wa maji')} value={fluid} onChange={setFluid} unit="ml" />
      <NumberField label={t('mimi.tracker.dialysis.session', 'Muda wa session')} value={sess} onChange={setSess} unit={t('mimi.tracker.dialysis.minutes', 'dakika')} />
      <NumberField label={t('mimi.tracker.dialysis.uf', 'UF (ultrafiltration)')} value={uf} onChange={setUf} unit="ml" />
      <NumberField label={t('mimi.tracker.dialysis.dry-weight', 'Dry weight')} value={dw} onChange={setDw} unit="kg" step={0.1} />
      <TextField label={t('mimi.tracker.dialysis.bp-pre', 'BP kabla (120/80)')} value={pre} onChange={setPre} />
      <TextField label={t('mimi.tracker.dialysis.bp-post', 'BP baada (120/80)')} value={post} onChange={setPost} />
      <Chips<'ndio' | 'hapana'> label={t('mimi.tracker.dialysis.epo', 'EPO leo?')} value={epo} options={[{ v: 'ndio', label: t('mimi.tracker.common.yes', 'Ndio') }, { v: 'hapana', label: t('mimi.tracker.common.no', 'Hapana') }]} onChange={(v) => setEpo(v as 'ndio' | 'hapana')} />
      <NumberField label="K (mmol/L)" value={k} onChange={setK} step={0.1} />
      <NumberField label="Ca (mmol/L)" value={ca} onChange={setCa} step={0.01} />
      <NumberField label="Phos (mmol/L)" value={phos} onChange={setPhos} step={0.1} />
      <TextField label={t('mimi.tracker.dialysis.note', 'Kumbukumbu')} value={note} onChange={setNote} />
      <SaveBar onSave={submit} />
    </Card>
  );
}
