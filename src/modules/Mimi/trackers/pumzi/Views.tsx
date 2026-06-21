import { Card } from '../common';
import { loadReadings } from '../types';
import { useLang } from '../../../../lib/i18n/Provider';
import type { PumziReading } from './schema';
import { summarize } from './summary';

export default function Views() {
  const { t } = useLang();
  const list = loadReadings<PumziReading>('pumzi').slice(0, 14);
  const min = list.reduce((s, r) => s + r.minutes, 0);
  return (
    <Card>
      <h3 style={{ margin: '0 0 6px', fontFamily: 'Georgia, serif', fontSize: 20 }}>{t('mimi.pumzi.title', 'Pumzi')} — {t('mimi.pumzi.total', 'jumla')} {min} {t('mimi.pumzi.minutes-short', 'dakika')}</h3>
      <p style={{ margin: '0 0 12px', fontSize: 14 }}>{summarize(list)}</p>
    </Card>
  );
}
