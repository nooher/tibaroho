// memory.ts — long-term episodic memory. localStorage-backed v1. User-controlled.

import type { MemoryEntry } from './types';

const STORE_KEY = 'tibaroho.roho.memory.v1';

function storage(): Storage | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  } catch {
    /* fall through */
  }
  return null;
}

function readAll(): MemoryEntry[] {
  const s = storage();
  if (!s) return [];
  try {
    const raw = s.getItem(STORE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as MemoryEntry[];
    return [];
  } catch {
    return [];
  }
}

function writeAll(entries: MemoryEntry[]): void {
  const s = storage();
  if (!s) return;
  try {
    s.setItem(STORE_KEY, JSON.stringify(entries));
  } catch {
    /* full disk / blocked */
  }
}

export function remember(key: string, value: unknown, tags?: string[]): void {
  const entries = readAll().filter((e) => e.key !== key);
  entries.push({ key, value, ts: Date.now(), tags });
  // cap to 500 entries
  if (entries.length > 500) entries.splice(0, entries.length - 500);
  writeAll(entries);
}

export function recall(key: string): unknown | undefined {
  return readAll().find((e) => e.key === key)?.value;
}

export function recallByTag(tag: string): MemoryEntry[] {
  return readAll().filter((e) => e.tags?.includes(tag));
}

export function wipe(): void {
  const s = storage();
  if (!s) return;
  try {
    s.removeItem(STORE_KEY);
  } catch {
    /* ignore */
  }
}

export function summary(): {
  total: number;
  oldest?: number;
  newest?: number;
  tags: Record<string, number>;
} {
  const entries = readAll();
  const tags: Record<string, number> = {};
  for (const e of entries) {
    for (const t of e.tags ?? []) tags[t] = (tags[t] ?? 0) + 1;
  }
  if (entries.length === 0) return { total: 0, tags };
  const times = entries.map((e) => e.ts);
  return {
    total: entries.length,
    oldest: Math.min(...times),
    newest: Math.max(...times),
    tags,
  };
}

// ── In-memory session memory (turn-scoped) ──────────────────────────────────

import type { RafikiExchange, RafikiQuery, RafikiAnswer, RafikiDomain } from './types';

export interface RafikiMemory {
  lastDomain?: RafikiDomain;
  lastExpert?: string;
  entities: Record<string, string>;
  recentTurns: RafikiExchange[];
}

export function emptyMemory(): RafikiMemory {
  return { entities: {}, recentTurns: [] };
}

const FOLLOWUP_RX =
  /^(na\b|kuhusu\b|tena\b|halafu\b|then\b|and\b|what about\b|how about\b|hiyo\b|hilo\b|yake\b)/i;

export function looksLikeFollowUp(text: string): boolean {
  const t = (text ?? '').trim();
  if (!t) return false;
  if (t.split(/\s+/).length <= 6) {
    if (FOLLOWUP_RX.test(t)) return true;
  }
  return FOLLOWUP_RX.test(t);
}

export function updateMemory(
  mem: RafikiMemory,
  query: RafikiQuery,
  answer: RafikiAnswer,
  maxTurns: number,
): RafikiMemory {
  const exchange: RafikiExchange = { query, answer, ts: Date.now() };
  const recentTurns = [...mem.recentTurns, exchange].slice(-maxTurns);
  return {
    ...mem,
    lastDomain: answer.domain,
    lastExpert: answer.expert,
    recentTurns,
  };
}

export function injectContext(
  base: Record<string, unknown>,
  mem: RafikiMemory,
): Record<string, unknown> {
  return { ...base, memory: mem };
}
