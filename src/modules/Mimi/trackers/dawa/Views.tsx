import { Card } from '../common';
import { loadReadings } from '../types';
import { TEXT } from '../../../../lib/glass';
import type { DawaReading } from './schema';
import { summarize } from './summary';

export default function Views() {
  const list = loadReadings<DawaReading>('dawa').slice(0, 14);
  const taken = list.filter((l) => l.taken).length;
  return (
    <Card>
      <h3 style={{ margin: '0 0 6px', fontFamily: 'Georgia, serif', fontSize: 20 }}>Dawa — wiki 2</h3>
      <p style={{ margin: '0 0 8px', fontSize: 13, color: TEXT.muted }}>Kuchukua: {taken} / {list.length} kati ya rekodi.</p>
      <p style={{ margin: '0 0 12px', fontSize: 14 }}>{summarize(list)}</p>
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.6 }}>
        {list.map((r) => <li key={r.id}>{new Date(r.ts).toLocaleDateString('sw-TZ')} · {r.name} · {r.taken ? '✓ amemezwa' : `✗ ${r.skipped_reason || 'haikuchukuliwa'}`}</li>)}
      </ul>
    </Card>
  );
}
