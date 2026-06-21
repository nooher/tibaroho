import type { TamaaReading } from './schema';
export function summarize(list: TamaaReading[]): string {
  if (!list.length) return 'Andika tamaa, hata kama hujatumia. Hii ni stadi ya MI.';
  const sober = list.filter((r) => r.episodes === 0).length;
  return `Siku ${sober}/${list.length} hukutumia. Kila siku ni ushindi. Tafakari thamani inayokuongoza.`;
}
