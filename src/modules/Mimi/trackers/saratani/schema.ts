import type { Reading } from '../types';
export interface SarataniReading extends Reading {
  cycle: number; pain_vas: number; ecog: 0 | 1 | 2 | 3 | 4;
  symptoms: string[]; note?: string;
}
