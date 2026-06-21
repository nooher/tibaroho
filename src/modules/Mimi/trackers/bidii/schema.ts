import type { Reading } from '../types';
export interface BidiiReading extends Reading {
  steps: number; sleep_hours: number; exercise_min: number; resting_hr?: number;
  smartwatch?: string; note?: string;
}
