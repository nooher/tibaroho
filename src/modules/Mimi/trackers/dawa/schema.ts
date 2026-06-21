import type { Reading } from '../types';

export interface DawaReading extends Reading {
  name: string;
  dose: string;
  taken: boolean;
  skipped_reason?: string;
  note?: string;
}
