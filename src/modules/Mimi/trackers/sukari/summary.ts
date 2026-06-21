import type { SukariReading } from './schema';
export function summarize(list: SukariReading[]): string {
  if (!list.length) return 'Anza kupima sukari mara 2 kwa siku.';
  const fasting = list.filter((r) => r.context === 'fasting');
  const hypos = list.filter((r) => r.hypo).length;
  const parts: string[] = [];
  if (fasting.length) {
    const avg = fasting.reduce((s, r) => s + r.glucose_mmol, 0) / fasting.length;
    if (avg > 8) parts.push(`Fasting wastani ${avg.toFixed(1)} — juu ya lengo (4-7).`);
    else if (avg < 4) parts.push(`Fasting wastani ${avg.toFixed(1)} — chini ya lengo. Hypos zinawezekana.`);
    else parts.push(`Fasting wastani ${avg.toFixed(1)} — ndani ya lengo.`);
  }
  if (hypos >= 2) parts.push(`Hypos ${hypos} hivi karibuni — ongea na daktari kupunguza dosi.`);
  return parts.join(' ');
}
