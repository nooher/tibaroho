/**
 * Append-only audit envelope for Ndani.
 *
 * - Every destructive action calls `logAction()` with reason, actor, prior-state snapshot.
 * - A FNV-1a hash chain is computed so tampering is visible (each entry includes
 *   prev_hash + self hash); both are persisted on tr_audit_log.meta.
 * - Reads pull from the real tr_audit_log table via db.list — localStorage is
 *   used only as a write-through cache so offline + first-paint still work.
 * - Founder principal-view reads route through `logPrincipalView()` and surface
 *   in the founder self-audit feed via the `principal:true` meta flag.
 */
import { list, insert, audit as dbAudit } from '../../lib/db'
import type { TrAuditLog } from '../../lib/db'
import { getMeId } from '../../lib/me'
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

interface AuditMeta {
  reason?: string
  prior?: unknown
  prev_hash: string
  hash: string
  actor: string
  principal?: boolean
}

function rowToEntry(row: TrAuditLog): AuditEntry {
  const m = (row.meta ?? {}) as Partial<AuditMeta>
  return {
    ts: row.at ?? new Date().toISOString(),
    actor: m.actor ?? (row.actor_id ?? 'unknown'),
    action: row.action,
    entity: row.entity,
    entity_id: row.entity_id,
    reason: m.reason,
    prior: m.prior,
    prev_hash: m.prev_hash ?? '00000000',
    hash: m.hash ?? row.id,
    principal: m.principal,
  }
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
    const actorId = await getMeId().catch(() => undefined)
    await insert('tr_audit_log', {
      actor_id: actorId,
      action: args.action,
      entity: args.entity,
      entity_id: args.entity_id,
      meta: {
        reason: args.reason, prior: args.prior, prev_hash: prev, hash, actor,
        principal: args.principal ?? false,
      },
      at: ts,
    })
  } catch { /* offline */ }
  return entry
}

/**
 * Lightweight audit helper — fire-and-forget event log without prior-state
 * snapshot. Use this for non-destructive observations (views, filter changes,
 * report exports). Returns the chained entry.
 */
export async function auditEvent(
  action: string,
  entity: string,
  entity_id?: string,
  meta?: Record<string, unknown>,
): Promise<AuditEntry> {
  return logAction({
    action,
    entity,
    entity_id,
    reason: typeof meta?.reason === 'string' ? meta.reason : undefined,
    prior: meta,
  })
}

export async function logPrincipalView(target: string, reason: string): Promise<AuditEntry> {
  return logAction({
    action: 'PRINCIPAL VIEW',
    entity: target,
    reason,
    principal: true,
  })
}

/** Synchronous cached read for instant first paint. */
export function readFeed(): AuditEntry[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(window.localStorage.getItem(FEED_KEY) ?? '[]') } catch { return [] }
}

/** Live read from tr_audit_log (newest first). */
export async function readFeedAsync(opts?: { actorOnly?: boolean }): Promise<AuditEntry[]> {
  try {
    const rows = await list('tr_audit_log')
    let entries = (rows as TrAuditLog[]).map(rowToEntry)
    if (opts?.actorOnly) {
      const me = await getMeId().catch(() => null)
      if (me) entries = entries.filter((e) => e.actor === me || (rows.find((r) => r.id === e.hash)?.actor_id === me))
    }
    entries.sort((a, b) => (b.ts > a.ts ? 1 : -1))
    if (typeof window !== 'undefined') {
      try { window.localStorage.setItem(FEED_KEY, JSON.stringify(entries.slice(0, 500))) } catch { /* quota */ }
    }
    return entries
  } catch {
    return readFeed()
  }
}

export function readSelfAudit(): AuditEntry[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(window.localStorage.getItem(SELF_KEY) ?? '[]') } catch { return [] }
}

export async function readSelfAuditAsync(): Promise<AuditEntry[]> {
  try {
    const rows = (await list('tr_audit_log')) as TrAuditLog[]
    const entries = rows.map(rowToEntry).filter((e) => e.principal)
    entries.sort((a, b) => (b.ts > a.ts ? 1 : -1))
    if (typeof window !== 'undefined') {
      try { window.localStorage.setItem(SELF_KEY, JSON.stringify(entries.slice(0, 500))) } catch { /* quota */ }
    }
    return entries
  } catch {
    return readSelfAudit()
  }
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

// Silence unused-import on lean builds
void dbAudit
