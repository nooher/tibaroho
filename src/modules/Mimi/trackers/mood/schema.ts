import type { Reading } from '../types';
export interface MoodReading extends Reading {
  score: number;          // 0-10
  emotions: string[];
  voice_diary?: string;
  note?: string;
}
