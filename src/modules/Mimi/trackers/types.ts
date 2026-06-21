// trackers/types.ts

import type { ReactNode } from 'react';
import { db } from '../../../lib/db';
import type { TrJournalEntry } from '../../../lib/db';
import { getMeId } from '../../../lib/me';

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
  // Fire-and-forget remote persist when authed.
  void saveReadingAsync(id, r).catch(() => undefined);
}

/**
 * Persist a tracker reading to tr_journal_entries with tags
 * `['tracker', 'tracker:<id>']`. body is the JSON-encoded reading so the
 * existing per-tracker schemas survive a round-trip without new tables.
 */
export async function saveReadingAsync<R extends Reading>(id: TrackerId, r: R): Promise<void> {
  if (!db.supabase) return;
  try {
    const me = await getMeId();
    const mood = typeof (r as Record<string, unknown>).score === 'number'
      ? Math.max(0, Math.min(10, (r as Record<string, unknown>).score as number))
      : undefined;
    await db.insert('tr_journal_entries', {
      user_id: me,
      body: JSON.stringify(r),
      mood,
      tags: ['tracker', `tracker:${id}`],
      created_at: r.ts,
    } as Omit<TrJournalEntry, 'id'>);
  } catch { /* offline */ }
}

/**
 * Fetch tracker readings from Supabase, mirror into localStorage cache so
 * subsequent sync `loadReadings` calls paint instantly, return list.
 */
export async function loadReadingsAsync<R extends Reading>(id: TrackerId): Promise<R[]> {
  if (!db.supabase) return loadReadings<R>(id);
  try {
    const me = await getMeId();
    const rows = await db.list('tr_journal_entries', { user_id: me });
    const tag = `tracker:${id}`;
    const readings: R[] = rows
      .filter((row) => Array.isArray(row.tags) && row.tags?.includes(tag))
      .map((row) => {
        try {
          const parsed = JSON.parse(row.body) as R;
          return { ...parsed, id: parsed.id ?? row.id, ts: parsed.ts ?? row.created_at ?? new Date().toISOString() };
        } catch {
          return { id: row.id, ts: row.created_at ?? new Date().toISOString() } as R;
        }
      })
      .sort((a, b) => b.ts.localeCompare(a.ts));
    try {
      localStorage.setItem(STORAGE_PREFIX + id, JSON.stringify(readings.slice(0, 500)));
    } catch { /* quota */ }
    return readings;
  } catch {
    return loadReadings<R>(id);
  }
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
