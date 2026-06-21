import type { Reading } from '../types';
export interface HivReading extends Reading {
  art_taken: boolean;
  viral_load?: number;
  cd4?: number;
  side_effects: string[];
  note?: string;
}
