import { Card } from '../common';
import { loadReadings } from '../types';
import type { SukariReading } from './schema';
import { summarize } from './summary';

export default function Views() {
  const list = loadReadings<SukariReading>('sukari').slice(0, 30);
  const avg = list.length ? list.reduce((s, r) => s + r.glucose_mmol, 0) / list.length : 0;
  return (
    <Card>
      <h3 style={{ margin: '0 0 6px', fontFamily: 'Georgia, serif', fontSize: 20 }}>Sukari — wastani: {avg.toFixed(1)} mmol/L</h3>
      <p style={{ margin: '0 0 12px', fontSize: 14 }}>{summarize(list)}</p>
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.6 }}>
        {list.slice(0, 14).map((r) => <li key={r.id}>{new Date(r.ts).toLocaleDateString('sw-TZ')} · {r.glucose_mmol} · {r.context}{r.hypo ? ' · hypo' : ''}</li>)}
      </ul>
    </Card>
  );
}
