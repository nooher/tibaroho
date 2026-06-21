import { Card } from '../common';
import { loadReadings } from '../types';
import type { DialysisReading } from './schema';
import { summarize } from './summary';

export default function Views() {
  const list = loadReadings<DialysisReading>('dialysis').slice(0, 12);
  return (
    <Card>
      <h3 style={{ margin: '0 0 10px', fontFamily: 'Georgia, serif', fontSize: 20 }}>Dialysis — sessions 12 za mwisho</h3>
      <p style={{ margin: '0 0 12px', fontSize: 14 }}>{summarize(list)}</p>
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.6 }}>
        {list.map((r) => <li key={r.id}>{new Date(r.ts).toLocaleDateString('sw-TZ')} · UF {r.uf_ml}ml · BP {r.bp_pre} → {r.bp_post} · K {r.k_mmol ?? '—'}</li>)}
      </ul>
    </Card>
  );
}
