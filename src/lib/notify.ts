/**
 * Tumaini · TBHOS — unified notifications layer.
 *
 * Three channels:
 *   1. In-app toasts (always available; rendered by <ToastHost/>)
 *   2. Web Push (browser, VAPID — requires user permission + service worker)
 *   3. SMS via Beem Africa (server-side, gated by Edge Function 'sms-send')
 *
 * Usage:
 *   import { toast, sendSms, ensurePushPermission } from './notify'
 *   toast('Appointment confirmed', 'success')
 *   await sendSms('+255712345678', 'Kumbukumbu ya miadi yako kesho 09:00.')
 *   await ensurePushPermission()
 */
import { hasBackend, supabase } from './supabase'

// ─── In-app toast bus ─────────────────────────────────────────────────────
export type ToastVariant = 'info' | 'success' | 'warning' | 'error'
export interface ToastEvent {
  id: string
  message: string
  variant: ToastVariant
  ttlMs: number
}

type ToastListener = (e: ToastEvent) => void
const toastListeners = new Set<ToastListener>()

export function onToast(fn: ToastListener): () => void {
  toastListeners.add(fn)
  return () => toastListeners.delete(fn)
}

export function toast(message: string, variant: ToastVariant = 'info', ttlMs = 4200): void {
  const e: ToastEvent = {
    id: crypto.randomUUID(),
    message,
    variant,
    ttlMs,
  }
  for (const fn of toastListeners) {
    try { fn(e) } catch { /* listener errors must not break sender */ }
  }
}

// ─── SMS via edge function ─────────────────────────────────────────────────
export interface SmsOptions {
  to: string
  text: string
  kind?: 'appointment_reminder' | 'crisis_alert' | 'otp' | 'general'
}

export interface SmsResult {
  ok: boolean
  sandbox?: boolean
  error?: string
  raw?: unknown
}

export async function sendSms(opts: SmsOptions): Promise<SmsResult> {
  if (!hasBackend || !supabase) return { ok: false, error: 'Backend not configured' }
  try {
    const { data, error } = await supabase.functions.invoke('sms-send', { body: opts })
    if (error) return { ok: false, error: error.message }
    const d = (data ?? {}) as { ok?: boolean; sandbox?: boolean; error?: string }
    return { ok: d.ok !== false && !d.error, sandbox: d.sandbox, error: d.error, raw: data }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) }
  }
}

// ─── Web Push (VAPID) ──────────────────────────────────────────────────────
// VAPID key is delivered to the browser via the public env var.
const VAPID_KEY = (import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined) ?? ''

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(b64)
  const out = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i)
  return out
}

export type PushPermission = 'granted' | 'denied' | 'default' | 'unsupported'

export function currentPushPermission(): PushPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported'
  return Notification.permission as PushPermission
}

export async function ensurePushPermission(): Promise<PushPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported'
  if (Notification.permission === 'granted') return 'granted'
  if (Notification.permission === 'denied')  return 'denied'
  const p = await Notification.requestPermission()
  return p as PushPermission
}

/** Subscribe the current browser to push and persist the subscription
 *  metadata to tr_audit_log (we'll add a dedicated table later). */
export async function subscribeToPush(): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!('serviceWorker' in navigator) || !('PushManager' in window))
      return { ok: false, error: 'Push API not supported' }
    if (!VAPID_KEY) return { ok: false, error: 'VAPID key not configured (VITE_VAPID_PUBLIC_KEY)' }
    const perm = await ensurePushPermission()
    if (perm !== 'granted') return { ok: false, error: `Permission ${perm}` }
    const reg = await navigator.serviceWorker.ready
    const existing = await reg.pushManager.getSubscription()
    const sub = existing ?? await reg.pushManager.subscribe({
      userVisibleOnly: true,
      // PushSubscriptionOptions wants BufferSource; copy into a fresh
      // ArrayBuffer-backed Uint8Array so we don't trip the SharedArrayBuffer
      // type narrowing TS now applies to Uint8Array literals.
      applicationServerKey: new Uint8Array(urlBase64ToUint8Array(VAPID_KEY)).buffer,
    })
    if (hasBackend && supabase) {
      try {
        await supabase.from('tr_audit_log').insert({
          action: 'push.subscribe',
          entity: 'push',
          meta: { endpoint: sub.endpoint, expirationTime: sub.expirationTime },
        })
      } catch { /* non-blocking */ }
    }
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) }
  }
}
