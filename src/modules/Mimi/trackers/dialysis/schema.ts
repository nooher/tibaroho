import type { Reading } from '../types';
export interface DialysisReading extends Reading {
  fluid_in_ml: number; session_min: number; uf_ml: number; dry_weight_kg: number;
  bp_pre: string; bp_post: string; epo: boolean;
  k_mmol?: number; ca_mmol?: number; phos_mmol?: number; note?: string;
}
