import { useEffect, useState } from 'react';
import { Card } from '../common';
import { loadReadings, loadReadingsAsync } from '../types';
import { useLang } from '../../../../lib/i18n/Provider';
import type { MoodReading } from './schema';
import { summarize } from './summary';

export default function Views() {
  const { t } = useLang();
  const [list, setList] = useState<MoodReading[]>(() => loadReadings<MoodReading>('mood').slice(0, 14));
  useEffect(() => {
    let on = true;
    void loadReadingsAsync<MoodReading>('mood').then((rows) => { if (on) setList(rows.slice(0, 14)); });
    return () => { on = false; };
  }, []);
  const avg = list.length ? list.reduce((s, r) => s + r.score, 0) / list.length : 0;
  return (
    <Card>
      <h3 style={{ margin: '0 0 6px', fontFamily: 'Georgia, serif', fontSize: 20 }}>{t('mimi.tracker.mood.views.title', 'Hisia')} — {t('mimi.tracker.mood.views.avg', 'wastani')} {avg.toFixed(1)} / 10</h3>
      <p style={{ margin: '0 0 12px', fontSize: 14 }}>{summarize(list)}</p>
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.6 }}>
        {list.map((r) => <li key={r.id}>{new Date(r.ts).toLocaleDateString('sw-TZ')} · {r.score}/10 · {r.emotions.join(', ')}</li>)}
      </ul>
    </Card>
  );
}
