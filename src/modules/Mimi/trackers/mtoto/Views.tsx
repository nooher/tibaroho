import { Card } from '../common';
import { loadReadings } from '../types';
import { useLang } from '../../../../lib/i18n/Provider';
import type { MtotoReading } from './schema';
import { summarize } from './summary';

export default function Views() {
  const { t } = useLang();
  const list = loadReadings<MtotoReading>('mtoto').slice(0, 12);
  return (
    <Card>
      <h3 style={{ margin: '0 0 6px', fontFamily: 'Georgia, serif', fontSize: 20 }}>{t('mimi.mtoto.title', 'Mtoto')}</h3>
      <p style={{ margin: '0 0 12px', fontSize: 14 }}>{summarize(list)}</p>
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.6 }}>
        {list.map((r) => <li key={r.id}>{new Date(r.ts).toLocaleDateString('sw-TZ')} · {r.age_months}mo · {r.milestones.length} milestones</li>)}
      </ul>
    </Card>
  );
}
