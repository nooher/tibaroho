import { Card } from '../common';
import { loadReadings } from '../types';
import { TEXT } from '../../../../lib/glass';
import { useLang } from '../../../../lib/i18n/Provider';
import type { DawaReading } from './schema';
import { summarize } from './summary';

export default function Views() {
  const { t } = useLang();
  const list = loadReadings<DawaReading>('dawa').slice(0, 14);
  const taken = list.filter((l) => l.taken).length;
  return (
    <Card>
      <h3 style={{ margin: '0 0 6px', fontFamily: 'Georgia, serif', fontSize: 20 }}>{t('mimi.tracker.dawa.views.title', 'Dawa — wiki 2')}</h3>
      <p style={{ margin: '0 0 8px', fontSize: 13, color: TEXT.muted }}>{t('mimi.tracker.dawa.views.adherence', 'Kuchukua')}: {taken} / {list.length} {t('mimi.tracker.dawa.views.of-records', 'kati ya rekodi.')}</p>
      <p style={{ margin: '0 0 12px', fontSize: 14 }}>{summarize(list)}</p>
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.6 }}>
        {list.map((r) => <li key={r.id}>{new Date(r.ts).toLocaleDateString('sw-TZ')} · {r.name} · {r.taken ? t('mimi.tracker.dawa.views.took', '✓ amemezwa') : `✗ ${r.skipped_reason || t('mimi.tracker.dawa.views.missed', 'haikuchukuliwa')}`}</li>)}
      </ul>
    </Card>
  );
}
