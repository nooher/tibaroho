import type { Reading } from '../types';
export interface SukariReading extends Reading {
  glucose_mmol: number; context: 'fasting' | 'baada' | 'random' | 'lala';
  a1c?: number; hypo: boolean; note?: string;
}
