/**
 * Supabase client — gracefully degrades when env vars are absent.
 * `hasBackend` is the single feature flag the app should check.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim()
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim()

export const hasBackend: boolean = Boolean(url && anonKey)

export const supabase: SupabaseClient | null = hasBackend
  ? createClient(url as string, anonKey as string, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null

export function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error('TBHOS: Supabase backend not configured. Set VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY.')
  }
  return supabase
}
