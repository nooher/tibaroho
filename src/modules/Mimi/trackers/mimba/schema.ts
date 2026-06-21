import type { Reading } from '../types';
export interface MimbaReading extends Reading {
  kicks_2h: number; epds_week?: number; partner_checked: boolean;
  trimester: 1 | 2 | 3; note?: string;
}
