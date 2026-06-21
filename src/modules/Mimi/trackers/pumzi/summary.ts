import type { PumziReading } from './schema';
export function summarize(list: PumziReading[]): string {
  if (!list.length) return 'Pumzi 5 dakika kila siku inajenga ukinzani wa kihisia.';
  const min = list.reduce((s, r) => s + r.minutes, 0);
  if (min >= 35) return `Umefanya pumzi ${min} dakika wiki hii — bora.`;
  return `Pumzi ${min} dakika wiki hii — lenga 5 dakika kwa siku.`;
}
