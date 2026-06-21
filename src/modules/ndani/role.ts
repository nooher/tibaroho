/**
 * Ndani role gating.
 * Reads the current admin/founder role from localStorage so the console
 * stays usable in dev without a full auth flow. The 'founder' role is
 * the highest privilege and gets the personal console plus principal-view
 * read-everything access.
 */
export type NdaniRole = 'admin' | 'founder' | 'guest'

const KEY = 'ndani:role'

export function getRole(): NdaniRole {
  if (typeof window === 'undefined') return 'guest'
  const v = window.localStorage.getItem(KEY)
  if (v === 'admin' || v === 'founder' || v === 'guest') return v
  // Dev default: founder. In prod this is set by auth.
  return 'founder'
}

export function setRole(r: NdaniRole): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(KEY, r)
}

export function getActor(): string {
  if (typeof window === 'undefined') return 'unknown'
  return window.localStorage.getItem('ndani:actor') ?? 'admin@laetoli'
}

export function canAdmin(r: NdaniRole): boolean { return r === 'admin' || r === 'founder' }
export function isFounder(r: NdaniRole): boolean { return r === 'founder' }
