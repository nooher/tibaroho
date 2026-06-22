/* TABHOS admin v2 — canonical @laetoli/admin shell wired to live Supabase.
 *
 * Users → tr_users; Audit → tr_audit_log; Health → Supabase ping.
 * Remaining modules use demo data until counterparts are built. */

import { AdminApp, createDemoAdapter, type AdminAdapter, type AdminUser, type AuditEntry } from '@laetoli/admin'
import '@laetoli/admin/styles.css'
import { supabase } from '../lib/supabase'

const base = createDemoAdapter({ key: 'TABHOS', name: 'TABHOS' })

type UserRow = {
  id: string
  auth_id?: string | null
  role: string
  display_name?: string | null
  lang: string
  region?: string | null
  created_at: string
}

type AuditRow = {
  id: string
  actor_id?: string | null
  action: string
  entity: string
  entity_id?: string | null
  meta?: Record<string, unknown> | null
  at: string
}

function userRow(u: UserRow): AdminUser {
  return {
    id: u.id,
    email: u.region || '(no email)',
    displayName: u.display_name || u.id.slice(0, 8),
    role: u.role,
    status: 'active',
    mfaEnabled: false,
    createdAt: u.created_at,
  }
}

function auditRow(a: AuditRow): AuditEntry {
  return {
    id: a.id,
    at: a.at,
    actorId: a.actor_id || '—',
    actorName: a.actor_id || 'system',
    action: a.action,
    resourceType: a.entity,
    resourceId: a.entity_id || '—',
    meta: a.meta || undefined,
    outcome: a.action.includes('reject') || a.action.includes('deny') ? 'denied' : 'success',
  }
}

const adapter: AdminAdapter = {
  ...base,
  product: { key: 'TABHOS', name: 'TABHOS' },
  users: {
    ...base.users,
    list: async ({ q } = {}) => {
      if (!supabase) return base.users.list({ q })
      let query = supabase.from('tr_users').select('id, auth_id, role, display_name, lang, region, created_at').order('created_at', { ascending: false }).limit(500)
      if (q) query = query.or(`display_name.ilike.%${q}%,region.ilike.%${q}%`)
      const { data, error } = await query
      if (error) { console.error('users.list', error); return [] }
      return (data as UserRow[] | null || []).map(userRow)
    },
    update: async (id, patch) => {
      if (!supabase) return base.users.update(id, patch)
      const dbPatch: Record<string, unknown> = {}
      if (patch.displayName !== undefined) dbPatch.display_name = patch.displayName
      if (patch.role !== undefined) dbPatch.role = patch.role
      const { data, error } = await supabase.from('tr_users').update(dbPatch).eq('id', id).select().single()
      if (error || !data) throw error || new Error('user update returned no row')
      return userRow(data as UserRow)
    },
  },
  audit: {
    list: async ({ action, limit } = {}) => {
      if (!supabase) return base.audit.list({ limit })
      let query = supabase.from('tr_audit_log').select('id, actor_id, action, entity, entity_id, meta, at').order('at', { ascending: false }).limit(limit ?? 200)
      if (action) query = query.ilike('action', `%${action}%`)
      const { data, error } = await query
      if (error) { console.error('audit.list', error); return [] }
      return (data as AuditRow[] | null || []).map(auditRow)
    },
    export: async () => {
      if (!supabase) return base.audit.export()
      const list = await adapter.audit.list({ limit: 50_000 })
      const header = ['id', 'at', 'actor', 'action', 'entity', 'entity_id', 'outcome'].join(',')
      const csv = [header, ...list.map((a) => [a.id, a.at, a.actorName, JSON.stringify(a.action), a.resourceType, a.resourceId, a.outcome].join(','))].join('\n')
      return { url: 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv) }
    },
  },
  health: {
    snapshot: async () => {
      const out = await base.health.snapshot()
      if (!supabase) return out
      const t0 = performance.now()
      const { error } = await supabase.from('tr_users').select('id', { count: 'exact', head: true })
      const latency = Math.round(performance.now() - t0)
      out.unshift({ surface: 'Supabase Postgres', uptimePct: error ? 99.0 : 99.99, errorRatePct: error ? 1.0 : 0.0, p95Ms: latency, status: error ? 'amber' : 'green' })
      return out
    },
  },
}

export default function AdminV2() { return <AdminApp adapter={adapter} /> }
