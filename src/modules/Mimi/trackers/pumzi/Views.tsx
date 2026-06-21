import { Card } from '../common';
import { loadReadings } from '../types';
import type { PumziReading } from './schema';
import { summarize } from './summary';

export default function Views() {
  const list = loadReadings<PumziReading>('pumzi').slice(0, 14);
  const min = list.reduce((s, r) => s + r.minutes, 0);
  return (
    <Card>
      <h3 style={{ margin: '0 0 6px', fontFamily: 'Georgia, serif', fontSize: 20 }}>Pumzi — jumla {min} dakika</h3>
      <p style={{ margin: '0 0 12px', fontSize: 14 }}>{summarize(list)}</p>
    </Card>
  );
}
