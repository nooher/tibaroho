// ratings.ts — weighted ratings persistence for Gundua.
//
// Backend: stored as tr_audit_log entries with entity='rating'.
// Each entry's meta jsonb holds the full Review payload. This avoids
// adding a new table while giving us a queryable, append-only feed.
//
// Local cache: keep a small localStorage mirror so the UI renders
// instantly on first paint; refresh from backend on mount.

import { list, insert, audit } from '../../../lib/db'
import { getMeId } from '../../../lib/me'

export interface Review {
  id: string
  providerId: string
  by: string
  ratingStars: number
  textSw: string
  ts: number
  visitCompleted?: boolean
  outcomeImproved?: boolean
}

const KEY = 'tumaini.gundua.reviews'

function readCache(): Review[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const p: unknown = JSON.parse(raw)
    if (Array.isArray(p)) return p as Review[]
  } catch { /* ignore */ }
  return []
}

function writeCache(items: Review[]): void {
  try { localStorage.setItem(KEY, JSON.stringify(items.slice(-1000))) } catch { /* ignore */ }
}

interface RatingMeta {
  providerId: string
  by: string
  ratingStars: number
  textSw: string
  ts: number
  visitCompleted?: boolean
  outcomeImproved?: boolean
}

function rowToReview(row: { id: string; entity_id?: string; meta?: unknown; at?: string }): Review | null {
  const m = (row.meta ?? {}) as Partial<RatingMeta>
  if (!m.providerId && !row.entity_id) return null
  return {
    id: row.id,
    providerId: m.providerId ?? row.entity_id ?? '',
    by: m.by ?? 'mtumiaji',
    ratingStars: m.ratingStars ?? 0,
    textSw: m.textSw ?? '',
    ts: m.ts ?? (row.at ? new Date(row.at).getTime() : Date.now()),
    visitCompleted: m.visitCompleted,
    outcomeImproved: m.outcomeImproved,
  }
}

/** Synchronous cached read — for first paint. */
export function listReviews(providerId: string): Review[] {
  return readCache()
    .filter((r) => r.providerId === providerId)
    .sort((a, b) => b.ts - a.ts)
}

/** Live refresh from backend (tr_audit_log entity='rating'). */
export async function listReviewsAsync(providerId: string): Promise<Review[]> {
  try {
    const rows = await list('tr_audit_log', { entity: 'rating', entity_id: providerId })
    const reviews = rows
      .map(rowToReview)
      .filter((r): r is Review => r !== null)
      .sort((a, b) => b.ts - a.ts)
    // refresh cache for this provider
    const others = readCache().filter((r) => r.providerId !== providerId)
    writeCache([...others, ...reviews])
    return reviews
  } catch {
    return listReviews(providerId)
  }
}

export async function addReview(r: Omit<Review, 'id' | 'ts'>): Promise<Review> {
  const ts = Date.now()
  const actor = await getMeId().catch(() => 'anon')
  const meta: RatingMeta = {
    providerId: r.providerId,
    by: r.by,
    ratingStars: r.ratingStars,
    textSw: r.textSw,
    ts,
    visitCompleted: r.visitCompleted,
    outcomeImproved: r.outcomeImproved,
  }
  try {
    const row = await insert('tr_audit_log', {
      actor_id: actor,
      action: 'rating.create',
      entity: 'rating',
      entity_id: r.providerId,
      meta,
      at: new Date(ts).toISOString(),
    })
    const next: Review = { ...r, id: row.id, ts }
    const cur = readCache()
    cur.push(next)
    writeCache(cur)
    return next
  } catch {
    // offline fallback
    const next: Review = { ...r, id: `rv_${ts}_${Math.random().toString(36).slice(2, 7)}`, ts }
    const cur = readCache()
    cur.push(next)
    writeCache(cur)
    try { await audit('rating.create.offline', 'rating', r.providerId, meta) } catch { /* ignore */ }
    return next
  }
}

/** Weight = 1.0 base + 0.5 if visit completed + 0.5 if outcome improved. */
export function weightedScore({ base, visitCompleted, outcomeImproved }: { base: number; visitCompleted?: boolean; outcomeImproved?: boolean }): number {
  let w = 1.0
  if (visitCompleted) w += 0.5
  if (outcomeImproved) w += 0.5
  return base * w
}

/** Returns weighted average capped at 5. */
export function aggregate(reviews: Review[]): number {
  if (reviews.length === 0) return 0
  let num = 0
  let den = 0
  for (const r of reviews) {
    let w = 1.0
    if (r.visitCompleted) w += 0.5
    if (r.outcomeImproved) w += 0.5
    num += r.ratingStars * w
    den += w
  }
  if (den === 0) return 0
  return Math.min(5, num / den)
}
