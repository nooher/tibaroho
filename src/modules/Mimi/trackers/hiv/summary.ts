import type { HivReading } from './schema';
export function summarize(list: HivReading[]): string {
  if (!list.length) return 'Bado hujaanza ufuatiliaji. Andika kila siku — adherence ndio kila kitu.';
  const adh = list.filter((l) => l.art_taken).length / list.length;
  const lastVL = list.find((l) => l.viral_load !== undefined)?.viral_load;
  const parts: string[] = [];
  if (adh >= 0.95) parts.push('Adherence ya 95%+ — vizuri sana, U=U inawezekana.'); else parts.push('Adherence chini ya 95% — viral load inaweza kupanda.');
  if (lastVL !== undefined) parts.push(lastVL < 50 ? `Viral load isiyoonekana (${lastVL}) — bora.` : `Viral load ${lastVL} — ongea na CTC kwa tathmini.`);
  return parts.join(' ');
}
