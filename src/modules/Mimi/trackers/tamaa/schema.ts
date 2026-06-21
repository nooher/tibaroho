import type { Reading } from '../types';
export interface TamaaReading extends Reading {
  craving: number; episodes: number; triggers: string[]; substance: string; note?: string;
}
