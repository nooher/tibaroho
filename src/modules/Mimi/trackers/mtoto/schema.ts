import type { Reading } from '../types';
export interface MtotoReading extends Reading {
  age_months: number;
  milestones: string[];
  immunizations: string[];
  sdq_total?: number;
  behavior: string;
  note?: string;
}
