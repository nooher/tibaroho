import type { Reading } from '../types';
export interface ShinikizoReading extends Reading {
  sbp: number; dbp: number; pulse: number; note?: string;
}
