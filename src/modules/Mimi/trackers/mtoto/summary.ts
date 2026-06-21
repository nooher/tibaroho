import type { MtotoReading } from './schema';
export function summarize(list: MtotoReading[]): string {
  if (!list.length) return 'Anza kufuatilia milestones na chanjo.';
  const last = list[0];
  if (last.sdq_total && last.sdq_total >= 17) return 'SDQ juu — fikiria tathmini ya kitabia.';
  return `Mtoto wa miezi ${last.age_months} ana milestones ${last.milestones.length}. Hudhuria RCH.`;
}
