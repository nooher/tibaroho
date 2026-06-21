import type { BidiiReading } from './schema';
export function summarize(list: BidiiReading[]): string {
  if (!list.length) return 'Lenga 7,000 hatua kwa siku na saa 7 za usingizi.';
  const avgSteps = list.reduce((s, r) => s + r.steps, 0) / list.length;
  if (avgSteps >= 7000) return `Hatua wastani ${avgSteps.toFixed(0)} — bora.`;
  return `Hatua wastani ${avgSteps.toFixed(0)} — lenga 7,000.`;
}
