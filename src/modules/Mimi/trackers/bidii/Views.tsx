import { Card } from '../common';
import { loadReadings } from '../types';
import type { BidiiReading } from './schema';
import { summarize } from './summary';

export default function Views() {
  const list = loadReadings<BidiiReading>('bidii').slice(0, 14);
  const stepsAvg = list.length ? list.reduce((s, r) => s + r.steps, 0) / list.length : 0;
  return (
    <Card>
      <h3 style={{ margin: '0 0 6px', fontFamily: 'Georgia, serif', fontSize: 20 }}>Bidii — wastani {stepsAvg.toFixed(0)} steps</h3>
      <p style={{ margin: '0 0 12px', fontSize: 14 }}>{summarize(list)}</p>
    </Card>
  );
}
