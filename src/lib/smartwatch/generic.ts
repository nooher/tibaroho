// generic.ts — manual CSV/JSON import. Always succeeds at connect.

import type { WatchAdapter, WatchSample, WatchScope } from './index'
import { isConnected, setConnected } from './index'

const ALLOWED: WatchScope[] = ['hr', 'hrv', 'sleep', 'steps', 'spo2', 'skin_temp', 'menstrual', 'activity', 'calories']

function asScope(s: string): WatchScope | undefined {
  const v = s.trim().toLowerCase() as WatchScope
  return ALLOWED.includes(v) ? v : undefined
}

export function parseCsv(text: string): WatchSample[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  if (lines.length === 0) return []
  const header = lines[0].split(',').map((h) => h.trim().toLowerCase())
  const idxMetric = header.indexOf('metric')
  const idxValue = header.indexOf('value')
  const idxUnit = header.indexOf('unit')
  const idxTs = header.indexOf('ts')
  if (idxMetric < 0 || idxValue < 0) return []
  const out: WatchSample[] = []
  for (const line of lines.slice(1)) {
    const cells = line.split(',').map((c) => c.trim())
    const metric = asScope(cells[idxMetric] ?? '')
    const value = Number(cells[idxValue] ?? '')
    if (!metric || !Number.isFinite(value)) continue
    const unit = idxUnit >= 0 ? cells[idxUnit] ?? '' : ''
    const tsRaw = idxTs >= 0 ? cells[idxTs] ?? '' : ''
    const ts = tsRaw ? Date.parse(tsRaw) || Date.now() : Date.now()
    out.push({ metric, value, unit, ts, source: 'generic_csv' })
  }
  return out
}

export function parseJson(text: string): WatchSample[] {
  try {
    const parsed: unknown = JSON.parse(text)
    if (!Array.isArray(parsed)) return []
    const out: WatchSample[] = []
    for (const item of parsed) {
      if (typeof item !== 'object' || item === null) continue
      const obj = item as Record<string, unknown>
      const metric = asScope(String(obj.metric ?? ''))
      const value = Number(obj.value)
      if (!metric || !Number.isFinite(value)) continue
      const unit = typeof obj.unit === 'string' ? obj.unit : ''
      const tsRaw = obj.ts
      const ts = typeof tsRaw === 'number' ? tsRaw : typeof tsRaw === 'string' ? Date.parse(tsRaw) || Date.now() : Date.now()
      out.push({ metric, value, unit, ts, source: 'generic_json' })
    }
    return out
  } catch {
    return []
  }
}

const BUFFER_KEY = 'tumaini.smartwatch.generic.buffer'

function readBuffer(): WatchSample[] {
  try {
    const raw = localStorage.getItem(BUFFER_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed as WatchSample[]
  } catch {
    // ignore
  }
  return []
}

export function appendSamples(samples: WatchSample[]): void {
  const current = readBuffer()
  const next = [...current, ...samples].slice(-2000)
  try {
    localStorage.setItem(BUFFER_KEY, JSON.stringify(next))
  } catch {
    // ignore
  }
}

export const genericAdapter: WatchAdapter = {
  id: 'generic',
  label_sw: 'CSV / JSON ya kawaida',
  label_en: 'Generic CSV / JSON',
  scopes: ALLOWED,
  async connect() {
    setConnected('generic', true)
    return { ok: true }
  },
  disconnect() {
    setConnected('generic', false)
  },
  status() {
    return isConnected('generic') ? 'connected' : 'disconnected'
  },
  async pull(): Promise<WatchSample[]> {
    return readBuffer()
  },
}
