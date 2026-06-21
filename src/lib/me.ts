/**
 * Current-user resolver.
 *
 * Maps `auth.uid()` (Supabase) → the matching `tr_users.id` row.
 * Cached in-memory for the session lifetime so every screen pays
 * the join cost at most once.
 *
 * When no backend session is active (dev/demo), returns a stable
 * pseudo-id derived from localStorage so audit + writes still chain.
 */
import { supabase, hasBackend } from './supabase'
import type { TrUser } from './db'

let cached: { user: TrUser | null; id: string | null } | null = null
let pending: Promise<TrUser | null> | null = null

const LS_KEY = 'tr:me:fallback_id'

function fallbackId(): string {
  if (typeof window === 'undefined') return 'anon'
  let v = window.localStorage.getItem(LS_KEY)
  if (!v) {
    v = (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
      ? crypto.randomUUID()
      : 'anon-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
    try { window.localStorage.setItem(LS_KEY, v) } catch { /* quota */ }
  }
  return v
}

export async function getMe(): Promise<TrUser | null> {
  if (cached) return cached.user
  if (pending) return pending
  pending = (async () => {
    if (!hasBackend || !supabase) {
      cached = { user: null, id: fallbackId() }
      return null
    }
    const { data: auth } = await supabase.auth.getUser()
    const authId = auth.user?.id
    if (!authId) {
      cached = { user: null, id: fallbackId() }
      return null
    }
    const { data, error } = await supabase
      .from('tr_users').select('*').eq('auth_id', authId).maybeSingle()
    if (error || !data) {
      cached = { user: null, id: fallbackId() }
      return null
    }
    const u = data as TrUser
    cached = { user: u, id: u.id }
    return u
  })()
  try { return await pending } finally { pending = null }
}

export async function getMeId(): Promise<string> {
  const u = await getMe()
  if (u?.id) return u.id
  return cached?.id ?? fallbackId()
}

export async function getMeRole(): Promise<string | null> {
  const u = await getMe()
  return u?.role ?? null
}

export function clearMeCache(): void {
  cached = null
  pending = null
  providerCached = null
  providerPending = null
}

// ─── Provider mapping (tr_users.id → tr_providers.id) ─────────────────────────
let providerCached: string | null | undefined
let providerPending: Promise<string | null> | null = null

/** tr_providers.id for the signed-in provider, or null if the user is not a
 *  provider or there's no backend. */
export async function getMyProviderId(): Promise<string | null> {
  if (providerCached !== undefined) return providerCached
  if (providerPending) return providerPending
  providerPending = (async () => {
    if (!hasBackend || !supabase) { providerCached = null; return null }
    const meId = await getMeId()
    const { data } = await supabase
      .from('tr_providers').select('id').eq('user_id', meId).maybeSingle()
    providerCached = (data?.id as string | undefined) ?? null
    return providerCached
  })()
  try { return await providerPending } finally { providerPending = null }
}
