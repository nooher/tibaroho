/**
 * Append-only audit envelope for Ndani.
 *
 * - Every destructive action calls `logAction()` with reason, actor, prior-state snapshot.
 * - A simple FNV-1a hash chain is computed locally to make tampering visible
 *   (each entry includes the prev_hash + self hash); the DB row keeps the
 *   chain in `meta`.
 * - Founder principal-view reads route through `logPrincipalView()` which
 *   tags entries with 'PRINCIPAL VIEW' so they surface separately in the
 *   founder self-audit feed.
 */
import { audit as dbAudit } from '../../lib/db'
import { getActor } from './role'

export interface AuditEntry {
  ts: string
  actor: string
  action: string
  entity: string
  entity_id?: string
  reason?: string
  prior?: unknown
  prev_hash: string
  hash: string
  principal?: boolean
}

const CHAIN_KEY = 'ndani:audit:chain'
const FEED_KEY = 'ndani:audit:feed'
const SELF_KEY = 'ndani:audit:self'

function fnv1a(s: string): string {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0
  }
  return h.toString(16).padStart(8, '0')
}

function lastHash(): string {
  if (typeof window === 'undefined') return '00000000'
  return window.localStorage.getItem(CHAIN_KEY) ?? '00000000'
}

function pushFeed(key: string, e: AuditEntry): void {
  if (typeof window === 'undefined') return
  try {
    const raw = window.localStorage.getItem(key)
    const arr: AuditEntry[] = raw ? JSON.parse(raw) : []
    arr.unshift(e)
    window.localStorage.setItem(key, JSON.stringify(arr.slice(0, 500)))
  } catch { /* quota */ }
}

export async function logAction(args: {
  action: string
  entity: string
  entity_id?: string
  reason?: string
  prior?: unknown
  principal?: boolean
}): Promise<AuditEntry> {
  const actor = getActor()
  const ts = new Date().toISOString()
  const prev = lastHash()
  const body = `${prev}|${ts}|${actor}|${args.action}|${args.entity}|${args.entity_id ?? ''}|${JSON.stringify(args.prior ?? null)}`
  const hash = fnv1a(body)
  const entry: AuditEntry = {
    ts, actor,
    action: args.action,
    entity: args.entity,
    entity_id: args.entity_id,
    reason: args.reason,
    prior: args.prior,
    prev_hash: prev,
    hash,
    principal: args.principal,
  }
  if (typeof window !== 'undefined') window.localStorage.setItem(CHAIN_KEY, hash)
  pushFeed(FEED_KEY, entry)
  if (args.principal) pushFeed(SELF_KEY, entry)
  try {
    await dbAudit(args.action, args.entity, args.entity_id, {
      reason: args.reason, prior: args.prior, prev_hash: prev, hash, actor,
      principal: args.principal ?? false,
    })
  } catch { /* offline */ }
  return entry
}

export async function logPrincipalView(target: string, reason: string): Promise<AuditEntry> {
  return logAction({
    action: 'PRINCIPAL VIEW',
    entity: target,
    reason,
    principal: true,
  })
}

export function readFeed(): AuditEntry[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(window.localStorage.getItem(FEED_KEY) ?? '[]') } catch { return [] }
}

export function readSelfAudit(): AuditEntry[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(window.localStorage.getItem(SELF_KEY) ?? '[]') } catch { return [] }
}

export function exportCsv(rows: AuditEntry[]): string {
  const cols = ['ts', 'actor', 'action', 'entity', 'entity_id', 'reason', 'prev_hash', 'hash', 'principal']
  const head = cols.join(',')
  const esc = (v: unknown): string => {
    const s = v === undefined || v === null ? '' : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const body = rows.map((r) => cols.map((c) => esc((r as unknown as Record<string, unknown>)[c])).join(',')).join('\n')
  const envelope = `# tbhos-ndani-audit chain-tail=${rows[0]?.hash ?? '00000000'} exported=${new Date().toISOString()}\n`
  return envelope + head + '\n' + body + '\n'
}
