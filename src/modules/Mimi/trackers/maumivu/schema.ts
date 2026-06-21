import type { Reading } from '../types';
export interface MaumivuReading extends Reading {
  vas: number; site: string; triggers: string[]; note?: string;
}
