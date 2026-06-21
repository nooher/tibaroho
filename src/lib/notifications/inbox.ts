// inbox.ts — local notification inbox + settings persisted in localStorage.

import { CATEGORIES, type NotificationCategory } from './index'

export interface InboxItem {
  id: string
  category: NotificationCategory
  title_sw: string
  body_sw: string
  ts: number
  read: boolean
}

export interface NotificationSettings {
  categories: Record<NotificationCategory, boolean>
  quietHours: { start: string; end: string }
}

const INBOX_KEY = 'tumaini.notifications.inbox'
const SETTINGS_KEY = 'tumaini.notifications.settings'

function readInbox(): InboxItem[] {
  try {
    const raw = localStorage.getItem(INBOX_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed as InboxItem[]
  } catch {
    // ignore
  }
  return []
}

function writeInbox(items: InboxItem[]): void {
  try {
    localStorage.setItem(INBOX_KEY, JSON.stringify(items.slice(-200)))
  } catch {
    // ignore
  }
}

export function listInbox(): InboxItem[] {
  return readInbox().sort((a, b) => b.ts - a.ts)
}

export function addToInbox(item: Omit<InboxItem, 'id' | 'ts' | 'read'>): InboxItem {
  const next: InboxItem = {
    ...item,
    id: `inbox_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    ts: Date.now(),
    read: false,
  }
  const cur = readInbox()
  cur.push(next)
  writeInbox(cur)
  return next
}

export function markRead(id: string): void {
  const cur = readInbox().map((i) => (i.id === id ? { ...i, read: true } : i))
  writeInbox(cur)
}

export function markAllRead(): void {
  const cur = readInbox().map((i) => ({ ...i, read: true }))
  writeInbox(cur)
}

export function unreadCount(): number {
  return readInbox().filter((i) => !i.read).length
}

function defaultSettings(): NotificationSettings {
  const categories = Object.fromEntries(CATEGORIES.map((c) => [c, true])) as Record<NotificationCategory, boolean>
  return { categories, quietHours: { start: '22:00', end: '06:00' } }
}

export function getSettings(): NotificationSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return defaultSettings()
    const parsed = JSON.parse(raw) as Partial<NotificationSettings>
    const base = defaultSettings()
    return {
      categories: { ...base.categories, ...(parsed.categories ?? {}) },
      quietHours: { ...base.quietHours, ...(parsed.quietHours ?? {}) },
    }
  } catch {
    return defaultSettings()
  }
}

export function setSettings(s: NotificationSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s))
  } catch {
    // ignore
  }
}
