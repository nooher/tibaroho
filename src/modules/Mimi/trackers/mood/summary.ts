import type { MoodReading } from './schema';
export function summarize(list: MoodReading[]): string {
  if (!list.length) return 'Anza check-in fupi kila jioni.';
  const avg = list.reduce((s, r) => s + r.score, 0) / list.length;
  if (avg <= 3) return `Hisia ziko chini (wastani ${avg.toFixed(1)}). Mwenza yuko nawe — fikiria kuongea na mtaalamu.`;
  if (avg <= 5) return `Hisia ziko katikati (wastani ${avg.toFixed(1)}). Stadi 3 ndogo kwa siku zinaweza kusaidia.`;
  return `Hisia zinaonekana imara (wastani ${avg.toFixed(1)}). Endelea kufuatilia.`;
}
