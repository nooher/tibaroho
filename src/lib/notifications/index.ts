// notifications/index.ts — push & local notification facade.

export type NotificationCategory =
  | 'appointment'
  | 'medication'
  | 'mood_check'
  | 'lab_result'
  | 'message'
  | 'crisis_followup'
  | 'supervisor'

export const CATEGORIES: NotificationCategory[] = [
  'appointment',
  'medication',
  'mood_check',
  'lab_result',
  'message',
  'crisis_followup',
  'supervisor',
]

export const CATEGORY_LABEL_SW: Record<NotificationCategory, string> = {
  appointment: 'Miadi',
  medication: 'Dawa',
  mood_check: 'Hisia za leo',
  lab_result: 'Matokeo ya maabara',
  message: 'Ujumbe',
  crisis_followup: 'Ufuatiliaji wa dharura',
  supervisor: 'Msimamizi',
}

export function isSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window
}

export async function requestPermission(): Promise<NotificationPermission> {
  if (!isSupported()) return 'denied'
  try {
    return await Notification.requestPermission()
  } catch {
    return 'denied'
  }
}

export interface PushSubscribeResult {
  subscription: PushSubscription | null
  reason?: string
}

export async function subscribePush(): Promise<PushSubscribeResult> {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
    return { subscription: null, reason: 'Kifaa hiki hakitumii Service Worker.' }
  }
  if (!('PushManager' in window)) {
    return { subscription: null, reason: 'Push API haipatikani kwenye kifaa hiki.' }
  }
  try {
    const reg = await navigator.serviceWorker.ready
    const existing = await reg.pushManager.getSubscription()
    if (existing) return { subscription: existing }
    return {
      subscription: null,
      reason: 'Hakuna VAPID public key iliyowekwa bado — usajili wa push utaanza baada ya kuunganishwa na seva.',
    }
  } catch (e) {
    return { subscription: null, reason: `Hitilafu: ${String(e)}` }
  }
}

export interface ScheduledNotification {
  id: string
  category: NotificationCategory
  payload: { title_sw: string; body_sw: string }
  atIso: string
}

const SCHED_KEY = 'tumaini.notifications.scheduled'

export function schedule(
  category: NotificationCategory,
  payload: { title_sw: string; body_sw: string },
  atIso: string,
): ScheduledNotification {
  const item: ScheduledNotification = {
    id: `sched_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    category,
    payload,
    atIso,
  }
  try {
    const raw = localStorage.getItem(SCHED_KEY)
    const list: ScheduledNotification[] = raw ? (JSON.parse(raw) as ScheduledNotification[]) : []
    list.push(item)
    localStorage.setItem(SCHED_KEY, JSON.stringify(list))
  } catch {
    // ignore
  }
  return item
}

export function listScheduled(): ScheduledNotification[] {
  try {
    const raw = localStorage.getItem(SCHED_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed as ScheduledNotification[]
  } catch {
    // ignore
  }
  return []
}
