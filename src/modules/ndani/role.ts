/**
 * Ndani role gating.
 *
 * Source of truth: tr_users.role for the signed-in user (resolved via
 * src/lib/me). The localStorage override remains for dev/demo so the
 * console stays usable without a full auth flow, but `getRoleAsync()`
 * pulls the real backend role.
 *
 * Maps the platform-wide Role enum onto Ndani's narrower trio
 * (admin/founder/guest):
 *   - 'admin'      → admin
 *   - 'researcher' → admin (read-only data plane access)
 *   - founder is set explicitly via setRole() — there is no DB column.
 *   - everything else → guest.
 */
import { getMe } from '../../lib/me'
import type { Role } from '../../lib/db'

export type NdaniRole = 'admin' | 'founder' | 'guest'

const KEY = 'ndani:role'
const ACTOR_KEY = 'ndani:actor'

export function getRole(): NdaniRole {
  if (typeof window === 'undefined') return 'guest'
  const v = window.localStorage.getItem(KEY)
  if (v === 'admin' || v === 'founder' || v === 'guest') return v
  // Dev default: founder. In prod this is set by auth/setRole.
  return 'founder'
}

function mapPlatformRole(r: Role | null | undefined): NdaniRole {
  if (r === 'admin' || r === 'researcher') return 'admin'
  return 'guest'
}

/**
 * Live role — checks tr_users.role first, falls back to localStorage.
 * 'founder' is never set from the DB; it must be set explicitly via
 * setRole() (this is by design — there is no founder column).
 */
export async function getRoleAsync(): Promise<NdaniRole> {
  // Explicit founder override wins so the personal console stays reachable.
  if (typeof window !== 'undefined' && window.localStorage.getItem(KEY) === 'founder') {
    return 'founder'
  }
  try {
    const me = await getMe()
    if (me) {
      const mapped = mapPlatformRole(me.role)
      if (mapped !== 'guest') return mapped
    }
  } catch { /* offline */ }
  return getRole()
}

export function setRole(r: NdaniRole): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(KEY, r)
}

export function getActor(): string {
  if (typeof window === 'undefined') return 'unknown'
  return window.localStorage.getItem(ACTOR_KEY) ?? 'admin@laetoli'
}

/** Async actor resolution — prefers signed-in user display_name, falls back to localStorage. */
export async function getActorAsync(): Promise<string> {
  try {
    const me = await getMe()
    if (me?.display_name) return me.display_name
    if (me?.id) return me.id
  } catch { /* offline */ }
  return getActor()
}

export function canAdmin(r: NdaniRole): boolean { return r === 'admin' || r === 'founder' }
export function isFounder(r: NdaniRole): boolean { return r === 'founder' }
