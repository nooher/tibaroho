import type { DialysisReading } from './schema';

export function summarize(list: DialysisReading[]): string {
  if (!list.length) return 'Bado hakuna session iliyorekodiwa. Andika kila session — uzito kabla/baada na BP.';
  const k = list.filter((r) => r.k_mmol).map((r) => r.k_mmol as number);
  const phos = list.filter((r) => r.phos_mmol).map((r) => r.phos_mmol as number);
  const avgK = k.length ? k.reduce((a, b) => a + b, 0) / k.length : 0;
  const avgPhos = phos.length ? phos.reduce((a, b) => a + b, 0) / phos.length : 0;
  const parts: string[] = [];
  if (avgK > 5.5) parts.push('Potassium iko juu — punguza ndizi, nyanya, nazi.');
  if (avgPhos > 5) parts.push('Phosphorus iko juu — kumbuka phosphate binders na meal.');
  if (!parts.length) parts.push('Vipimo viko ndani ya malengo. Endelea.');
  return parts.join(' ');
}
