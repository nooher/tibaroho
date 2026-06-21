import { Card } from '../common';
import { loadReadings } from '../types';
import { useLang } from '../../../../lib/i18n/Provider';
import type { BidiiReading } from './schema';
import { summarize } from './summary';

export default function Views() {
  const { t } = useLang();
  const list = loadReadings<BidiiReading>('bidii').slice(0, 14);
  const stepsAvg = list.length ? list.reduce((s, r) => s + r.steps, 0) / list.length : 0;
  return (
    <Card>
      <h3 style={{ margin: '0 0 6px', fontFamily: 'Georgia, serif', fontSize: 20 }}>{t('mimi.bidii.title', 'Bidii')} — {t('mimi.bidii.avg', 'wastani')} {stepsAvg.toFixed(0)} steps</h3>
      <p style={{ margin: '0 0 12px', fontSize: 14 }}>{summarize(list)}</p>
    </Card>
  );
}
