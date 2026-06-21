// smartwatch/index.ts — wearables abstraction. Adapters live in sibling files.
// Connections persist in localStorage so the Mimi shell can show status.

export type WatchScope =
  | 'hr'
  | 'hrv'
  | 'sleep'
  | 'steps'
  | 'spo2'
  | 'skin_temp'
  | 'menstrual'
  | 'activity'
  | 'calories'

export interface WatchSample {
  metric: WatchScope
  value: number
  unit: string
  ts: number
  source: string
}

export type WatchStatus = 'connected' | 'disconnected' | 'error'

export interface WatchAdapter {
  id: string
  label_sw: string
  label_en: string
  scopes: WatchScope[]
  connect(): Promise<{ ok: boolean; reason?: string }>
  disconnect(): void
  status(): WatchStatus
  pull(): Promise<WatchSample[]>
}

const STORAGE_KEY = 'tumaini.smartwatch.connected'

function readConnected(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') return parsed as Record<string, boolean>
  } catch {
    // ignore
  }
  return {}
}

function writeConnected(map: Record<string, boolean>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    // ignore
  }
}

export function isConnected(id: string): boolean {
  return !!readConnected()[id]
}

export function setConnected(id: string, on: boolean): void {
  const map = readConnected()
  if (on) map[id] = true
  else delete map[id]
  writeConnected(map)
}

import { appleHealthAdapter } from './apple'
import { googleFitAdapter } from './googleFit'
import { fitbitAdapter } from './fitbit'
import { genericAdapter } from './generic'

const REGISTRY: WatchAdapter[] = [
  appleHealthAdapter,
  googleFitAdapter,
  fitbitAdapter,
  genericAdapter,
]

export function listAdapters(): WatchAdapter[] {
  return [...REGISTRY]
}

export function getAdapter(id: string): WatchAdapter | undefined {
  return REGISTRY.find((a) => a.id === id)
}
