/**
 * Tumaini realtime — thin wrapper over Supabase Channels.
 *
 * Pattern:
 *   const stop = subscribeTable('tr_appointments', { filter: 'provider_id=eq.<id>' }, (evt) => { ... })
 *   // ... later: stop()
 *
 * Each subscription gets its own channel so component unmounts don't cancel
 * unrelated subscriptions. The Supabase client multiplexes the underlying
 * WebSocket — there's no per-channel socket cost.
 */
import type { RealtimeChannel } from '@supabase/supabase-js'
import { hasBackend, supabase } from './supabase'

export type RealtimeEvent =
  | 'INSERT'
  | 'UPDATE'
  | 'DELETE'

export interface RealtimePayload<T = Record<string, unknown>> {
  event: RealtimeEvent
  table: string
  new: T | null
  old: T | null
}

export interface SubscribeOptions {
  /** PostgREST-style filter, e.g. "provider_id=eq.123e..." */
  filter?: string
  events?: RealtimeEvent[]
}

export function subscribeTable<T extends Record<string, unknown> = Record<string, unknown>>(
  table: string,
  options: SubscribeOptions,
  onEvent: (p: RealtimePayload<T>) => void,
): () => void {
  if (!hasBackend || !supabase) return () => {}
  const { filter, events = ['INSERT', 'UPDATE', 'DELETE'] } = options
  const channelName = `tr-${table}-${filter ?? 'all'}-${Math.random().toString(36).slice(2, 6)}`
  const channel: RealtimeChannel = supabase.channel(channelName)
  for (const ev of events) {
    channel.on(
      'postgres_changes' as never,
      // The Realtime SDK uses lowercase event names internally.
      { event: ev, schema: 'public', table, filter } as never,
      (payload: { new: T; old: T }) => {
        onEvent({
          event: ev,
          table,
          new: (payload.new ?? null) as T | null,
          old: (payload.old ?? null) as T | null,
        })
      },
    )
  }
  channel.subscribe()
  const client = supabase
  return () => { try { client?.removeChannel(channel) } catch { /* ignore */ } }
}

/** Higher-level helper: a presence channel that broadcasts the user's
 *  current screen — useful for "Daktari yuko mtandaoni" indicators. */
export function presence(
  channelKey: string,
  meta: Record<string, unknown>,
  onSync: (state: Record<string, Array<Record<string, unknown>>>) => void,
): () => void {
  if (!hasBackend || !supabase) return () => {}
  const channel = supabase.channel(`presence-${channelKey}`, {
    config: { presence: { key: (meta.id as string) ?? crypto.randomUUID() } },
  })
  channel.on('presence', { event: 'sync' }, () => {
    onSync(channel.presenceState() as Record<string, Array<Record<string, unknown>>>)
  })
  channel.subscribe(async (status) => {
    if (status === 'SUBSCRIBED') await channel.track(meta)
  })
  const client = supabase
  return () => { try { client?.removeChannel(channel) } catch { /* ignore */ } }
}
