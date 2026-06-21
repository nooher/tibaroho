import { Card } from '../common';
import { loadReadings } from '../types';
import { useLang } from '../../../../lib/i18n/Provider';
import type { ShinikizoReading } from './schema';
import { summarize } from './summary';

export default function Views() {
  const { t } = useLang();
  const list = loadReadings<ShinikizoReading>('shinikizo').slice(0, 14);
  return (
    <Card>
      <h3 style={{ margin: '0 0 6px', fontFamily: 'Georgia, serif', fontSize: 20 }}>{t('mimi.tracker.shinikizo.views.title', 'Shinikizo — siku 14')}</h3>
      <p style={{ margin: '0 0 12px', fontSize: 14 }}>{summarize(list)}</p>
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.6 }}>
        {list.map((r) => <li key={r.id}>{new Date(r.ts).toLocaleDateString('sw-TZ')} · {r.sbp}/{r.dbp} · {t('mimi.tracker.shinikizo.views.pulse', 'pulse')} {r.pulse}</li>)}
      </ul>
    </Card>
  );
}
