import type { DawaReading } from './schema';

export function summarize(list: DawaReading[]): string {
  if (!list.length) return 'Bado hujarekodi dawa.';
  const adherence = list.filter((l) => l.taken).length / list.length;
  if (adherence >= 0.95) return 'Adherence yako ni bora sana. Endelea hivyo — viral suppression/control vinategemea hili.';
  if (adherence >= 0.85) return 'Adherence yako ni nzuri. Lengo: meza kila dosi kwa wakati ule ule kila siku.';
  if (adherence >= 0.7) return 'Adherence inaweza kuboreshwa. Weka kikumbusho cha simu na muulize Mwenza vidokezo.';
  return 'Adherence iko chini — hii inaweza kuathiri afya yako. Ongea na mtoa huduma haraka.';
}
