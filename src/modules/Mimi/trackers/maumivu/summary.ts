import type { MaumivuReading } from './schema';
export function summarize(list: MaumivuReading[]): string {
  if (!list.length) return 'Andika maumivu yanapotokea ili kupata muundo.';
  const avg = list.reduce((s, r) => s + r.vas, 0) / list.length;
  if (avg >= 7) return `Wastani ${avg.toFixed(1)} — makali. Ongea na daktari kuhusu analgesia.`;
  if (avg >= 4) return `Wastani ${avg.toFixed(1)} — ya kati. Tambua vichocheo.`;
  return `Wastani ${avg.toFixed(1)} — hafifu. Endelea.`;
}
