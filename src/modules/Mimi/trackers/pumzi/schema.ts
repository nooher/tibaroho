import type { Reading } from '../types';
export interface PumziReading extends Reading {
  pattern: 'box' | '4-7-8' | 'cohesive';
  minutes: number; hrv_proxy_rmssd?: number; note?: string;
}
