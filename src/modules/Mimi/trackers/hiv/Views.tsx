import { Card } from '../common';
import { loadReadings } from '../types';
import { TEXT } from '../../../../lib/glass';
import type { HivReading } from './schema';
import { summarize } from './summary';

export default function Views() {
  const list = loadReadings<HivReading>('hiv').slice(0, 14);
  const adherence = list.length ? list.filter((l) => l.art_taken).length / list.length : 0;
  return (
    <Card>
      <h3 style={{ margin: '0 0 6px', fontFamily: 'Georgia, serif', fontSize: 20 }}>VVU — wiki 2</h3>
      <p style={{ margin: '0 0 8px', fontSize: 13, color: TEXT.muted }}>Adherence: {(adherence * 100).toFixed(0)}%</p>
      <p style={{ margin: '0 0 12px', fontSize: 14 }}>{summarize(list)}</p>
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.6 }}>
        {list.map((r) => <li key={r.id}>{new Date(r.ts).toLocaleDateString('sw-TZ')} · ART {r.art_taken ? '✓' : '✗'} · VL {r.viral_load ?? '—'}</li>)}
      </ul>
    </Card>
  );
}
