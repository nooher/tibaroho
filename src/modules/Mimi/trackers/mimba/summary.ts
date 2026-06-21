import type { MimbaReading } from './schema';
export function summarize(list: MimbaReading[]): string {
  if (!list.length) return 'Anza kuhesabu mwendo wa mtoto kuanzia wiki 18.';
  const last = list[0];
  if (last.trimester === 3 && last.kicks_2h < 10) return 'Kicks chini ya 10/2h — nenda kituo cha uzazi.';
  if (last.epds_week && last.epds_week >= 13) return 'EPDS ≥13 — uwezekano wa mfadhaiko wa kuzaa. Mwambie mkunga.';
  return 'Ufuatiliaji unaendelea vyema. Hudhuria ANC.';
}
