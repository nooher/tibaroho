import type { SarataniReading } from './schema';
export function summarize(list: SarataniReading[]): string {
  if (!list.length) return 'Andika dalili kila siku ili mtaalamu wako aweze kurekebisha chemo.';
  const vas = list.reduce((s, r) => s + r.pain_vas, 0) / list.length;
  const parts: string[] = [];
  if (vas >= 7) parts.push('Maumivu makali — ongea na mtaalamu kuhusu palliative pain control.');
  else if (vas >= 4) parts.push('Maumivu ya wastani — tumia analgesia za hatua ya 2.');
  const ec = list[0]?.ecog ?? 0;
  if (ec >= 3) parts.push('ECOG juu — fikiria kurekebisha mpango wa chemo.');
  if (!parts.length) parts.push('Dalili zinaeleweka. Endelea kuandika.');
  return parts.join(' ');
}
