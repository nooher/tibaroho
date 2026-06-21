import type { ShinikizoReading } from './schema';
export function summarize(list: ShinikizoReading[]): string {
  if (!list.length) return 'Pima BP mara 1 kwa siku, asubuhi, kabla ya dawa.';
  const avgS = list.reduce((s, r) => s + r.sbp, 0) / list.length;
  const avgD = list.reduce((s, r) => s + r.dbp, 0) / list.length;
  if (avgS >= 160 || avgD >= 100) return `BP wastani ${avgS.toFixed(0)}/${avgD.toFixed(0)} — juu sana. Wasiliana na daktari haraka.`;
  if (avgS >= 140 || avgD >= 90) return `BP wastani ${avgS.toFixed(0)}/${avgD.toFixed(0)} — juu ya lengo (<140/90).`;
  return `BP wastani ${avgS.toFixed(0)}/${avgD.toFixed(0)} — ndani ya lengo. Endelea.`;
}
