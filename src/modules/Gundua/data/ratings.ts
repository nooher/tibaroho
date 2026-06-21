// ratings.ts — weighted ratings persistence for Gundua.

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

function read(): Review[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const p: unknown = JSON.parse(raw)
    if (Array.isArray(p)) return p as Review[]
  } catch { /* ignore */ }
  return []
}

function write(items: Review[]): void {
  try { localStorage.setItem(KEY, JSON.stringify(items.slice(-1000))) } catch { /* ignore */ }
}

export function addReview(r: Omit<Review, 'id' | 'ts'>): Review {
  const next: Review = { ...r, id: `rv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, ts: Date.now() }
  const cur = read()
  cur.push(next)
  write(cur)
  return next
}

export function listReviews(providerId: string): Review[] {
  return read().filter((r) => r.providerId === providerId).sort((a, b) => b.ts - a.ts)
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
