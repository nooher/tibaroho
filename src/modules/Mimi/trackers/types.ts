// trackers/types.ts

import type { ReactNode } from 'react';

export type TrackerId =
  | 'dawa' | 'dialysis' | 'hiv' | 'sukari' | 'shinikizo' | 'saratani'
  | 'mood' | 'pumzi' | 'maumivu' | 'tamaa' | 'mimba' | 'mtoto' | 'bidii';

export interface Tracker<R = Reading> {
  id: TrackerId;
  name_sw: string;
  for_sw: string;            // who it's for, e.g. "Watu wenye VVU"
  entryComponent: () => ReactNode;
  viewsComponent: () => ReactNode;
  summarize(readings: R[]): string;
  source: string;
}

export interface Reading {
  id: string;
  ts: string;                // ISO date
  // arbitrary fields per tracker
  [key: string]: unknown;
}

const STORAGE_PREFIX = 'tumaini.tracker.';

export function loadReadings<R extends Reading>(id: TrackerId): R[] {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + id);
    if (!raw) return [];
    return JSON.parse(raw) as R[];
  } catch { return []; }
}

export function saveReading<R extends Reading>(id: TrackerId, r: R): void {
  try {
    const list = loadReadings<R>(id);
    list.unshift(r);
    localStorage.setItem(STORAGE_PREFIX + id, JSON.stringify(list.slice(0, 500)));
  } catch { /* noop */ }
}

export function newId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function activeTrackers(): TrackerId[] {
  try {
    const raw = localStorage.getItem('tumaini.trackers.active');
    if (!raw) return ['mood'];
    const arr = JSON.parse(raw) as string[];
    return arr as TrackerId[];
  } catch { return ['mood']; }
}

export function setActiveTrackers(ids: TrackerId[]): void {
  try {
    localStorage.setItem('tumaini.trackers.active', JSON.stringify(ids));
  } catch { /* noop */ }
}
