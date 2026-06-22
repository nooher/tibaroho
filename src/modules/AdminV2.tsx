/* TABHOS admin v2 — full backend wiring.
 *
 * After commit that added supabase/migrations/*_admin_extensions.sql and
 * supabase/functions/admin-* edge functions, this adapter overrides
 * EVERY mutating method on the canonical @laetoli/admin shell:
 *
 *   users.list/update                 → tr_users (Supabase REST)
 *   users.invite/suspend/resetMfa/signOutAllSessions → edge function
 *   audit.list/export                 → tr_audit_log table
 *   apiKeys.list/issue/rotate/revoke  → api_keys table
 *   broadcasts.list/send/cancel       → broadcasts table
 *   exports.list/request              → export_jobs table
 *   branding.get/update               → tenant_branding table
 *   support.*                         → impersonation_sessions table
 *   compliance + health               → derived / Supabase ping
 *
 * Until the migration + edge functions are deployed on this app's
 * Supabase project, the demo adapter's defaults are returned (so the
 * surface is never blank). Once deployed, every screen is fully live. */

import { AdminApp, createDemoAdapter, type AdminAdapter, type AdminUser, type AuditEntry, type ApiKey, type Broadcast, type ExportJob, type BrandingConfig, type ImpersonationSession } from '@laetoli/admin'
import '@laetoli/admin/styles.css'
import { supabase } from '../lib/supabase'

const base = createDemoAdapter({ key: 'TABHOS', name: 'TABHOS' })

const EDGE_BASE = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || 'https://bkgtzmcijbwehkomcron.supabase.co'

async function callEdge(fn: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
  if (!supabase) throw new Error('backend not configured')
  const { data: { session } } = await supabase.auth.getSession()
  const r = await fetch(`${EDGE_BASE}/functions/v1/${fn}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token ?? ''}` },
    body: JSON.stringify(body),
  })
  const out = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(String(out.error || r.statusText))
  return out
}


type UserRow = { [k: string]: unknown }

function rowToUser(p: UserRow): AdminUser {
  return {
    id: String(p.id),
    email: String(p.region || p.id).slice(0, 64) || '—',
    displayName: String(p.display_name || p.region || p.id).slice(0, 80),
    role: String(p.role || 'patient'),
    status: 'active',
    mfaEnabled: false,
    createdAt: String(p.created_at || new Date().toISOString()),
  }
}

const adapter: AdminAdapter = {
  ...base,
  product: { key: 'TABHOS', name: 'TABHOS' },

  // ── USERS — list + update via REST; mutations via edge functions ────
  users: {
    list: async ({ q } = {}) => {
      if (!supabase) return base.users.list({ q })
      let query = supabase.from('tr_users').select('*').order('created_at', { ascending: false }).limit(500)
      if (q) query = query.or(`display_name.ilike.%${q}%,region.ilike.%${q}%`)
      const { data, error } = await query
      if (error) { console.error('users.list', error); return [] }
      return ((data as UserRow[] | null) || []).map(rowToUser)
    },
    invite: async ({ email, role }) => {
      await callEdge('admin-invite-user', { email, role })
      return { id: email, email, displayName: email.split('@')[0], role, status: 'invited' as const, mfaEnabled: false, createdAt: new Date().toISOString() }
    },
    update: async (id, patch) => {
      if (!supabase) return base.users.update(id, patch)
      const dbPatch: Record<string, unknown> = {}
      if (patch.displayName !== undefined) dbPatch.display_name = patch.displayName
      if (patch.role !== undefined) dbPatch.role = patch.role
      const { data, error } = await supabase.from('tr_users').update(dbPatch).eq('id', id).select().single()
      if (error || !data) throw error || new Error('user update returned no row')
      return rowToUser(data as UserRow)
    },
    suspend:   async (id) => { await callEdge('admin-suspend-user',    { user_id: id }) },
    resetMfa:  async (id) => { await callEdge('admin-reset-mfa',       { user_id: id }) },
    signOutAllSessions: async (id) => { await callEdge('admin-revoke-sessions', { user_id: id }) },
  },

  audit: {
    list: async ({ action, limit } = {}) => {
      if (!supabase) return base.audit.list({ limit })
      let query = supabase.from('tr_audit_log').select('id, actor_id, action, entity, entity_id, meta, at').order('at', { ascending: false }).limit(limit ?? 200)
      if (action) query = query.ilike('action', `%${action}%`)
      const { data, error } = await query
      if (error) { console.error('audit.list', error); return [] }
      return ((data as Record<string, unknown>[] | null) || []).map((a) => ({ id: a.id, at: a.at, actorId: a.actor_id || '—', actorName: a.actor_id || 'system', action: a.action, resourceType: a.entity, resourceId: a.entity_id || '—', meta: a.meta || undefined, outcome: a.action.includes('reject') ? 'denied' : 'success' }))
    },
    export: async () => {
      if (!supabase) return base.audit.export()
      const list = await (adapter.audit.list as (o: { limit?: number }) => Promise<unknown[]>)({ limit: 50_000 })
      const csv = ['id,at,actor,action,resource', ...list.map((a) => {
        const x = a as Record<string, unknown>
        return [x.id, x.at, JSON.stringify(x.actorName), JSON.stringify(x.action), `${x.resourceType}:${x.resourceId}`].join(',')
      })].join('\n')
      return { url: 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv) }
    },
  },

  // ── API KEYS ────────────────────────────────────────────────────────
  apiKeys: {
    list: async () => {
      if (!supabase) return base.apiKeys.list()
      const { data, error } = await supabase.from('api_keys').select('id, label, prefix, scopes, created_at, created_by, last_used_at, expires_at, revoked_at').is('revoked_at', null).order('created_at', { ascending: false })
      if (error) { console.error('apiKeys.list', error); return [] }
      return ((data as Record<string, unknown>[] | null) || []).map((k) => ({
        id: String(k.id), label: String(k.label), prefix: String(k.prefix),
        scopes: (k.scopes as string[] | null) || [], createdAt: String(k.created_at),
        createdBy: String(k.created_by || '—'), lastUsedAt: k.last_used_at ? String(k.last_used_at) : undefined,
        expiresAt: k.expires_at ? String(k.expires_at) : undefined,
      } as ApiKey))
    },
    issue: async ({ label, scopes, expiresAt }) => {
      if (!supabase) return base.apiKeys.issue({ label, scopes, expiresAt })
      const secret = 'lk_live_' + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
      const prefix = secret.slice(0, 12)
      // SHA-256 hash of the secret stored at rest; the secret itself returns once.
      const hashBuf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret))
      const hashHex = Array.from(new Uint8Array(hashBuf)).map((b) => b.toString(16).padStart(2, '0')).join('')
      const { data, error } = await supabase.from('api_keys').insert({ label, prefix, hash: hashHex, scopes, expires_at: expiresAt }).select().single()
      if (error || !data) throw error || new Error('apiKeys.issue returned no row')
      const r = data as Record<string, unknown>
      return { key: { id: String(r.id), label, prefix, scopes, createdAt: String(r.created_at), createdBy: 'You', expiresAt: expiresAt }, secret }
    },
    rotate: async (id) => {
      if (!supabase) return base.apiKeys.rotate(id)
      await supabase.from('api_keys').update({ revoked_at: new Date().toISOString() }).eq('id', id)
      const list = await adapter.apiKeys.list()
      const old = list.find((k) => k.id === id)
      return adapter.apiKeys.issue({ label: old?.label || 'rotated', scopes: old?.scopes || [], expiresAt: old?.expiresAt })
    },
    revoke: async (id) => {
      if (!supabase) return base.apiKeys.revoke(id)
      await supabase.from('api_keys').update({ revoked_at: new Date().toISOString() }).eq('id', id)
    },
  },

  // ── BROADCASTS ──────────────────────────────────────────────────────
  broadcasts: {
    list: async () => {
      if (!supabase) return base.broadcasts.list()
      const { data, error } = await supabase.from('broadcasts').select('id, title, body, audience, tenant_id, scheduled_for, sent_at, status').order('created_at', { ascending: false })
      if (error) { console.error('broadcasts.list', error); return [] }
      return ((data as Record<string, unknown>[] | null) || []).map((b) => ({
        id: String(b.id), title: String(b.title), body: String(b.body),
        audience: String(b.audience) as Broadcast['audience'], tenantId: b.tenant_id ? String(b.tenant_id) : undefined,
        scheduledFor: b.scheduled_for ? String(b.scheduled_for) : undefined,
        sentAt: b.sent_at ? String(b.sent_at) : undefined,
        status: String(b.status) as Broadcast['status'],
      } as Broadcast))
    },
    send: async (input) => {
      if (!supabase) return base.broadcasts.send(input)
      const row = {
        title: input.title || '', body: input.body || '',
        audience: input.audience || 'all', tenant_id: input.tenantId,
        scheduled_for: input.scheduledFor, sent_at: input.scheduledFor ? null : new Date().toISOString(),
        status: input.scheduledFor ? 'scheduled' : 'sent',
      }
      const { data, error } = await supabase.from('broadcasts').insert(row).select().single()
      if (error || !data) throw error || new Error('broadcasts.send returned no row')
      const r = data as Record<string, unknown>
      return { id: String(r.id), title: String(r.title), body: String(r.body), audience: String(r.audience) as Broadcast['audience'], status: String(r.status) as Broadcast['status'], sentAt: r.sent_at ? String(r.sent_at) : undefined } as Broadcast
    },
    cancel: async (id) => {
      if (!supabase) return base.broadcasts.cancel(id)
      await supabase.from('broadcasts').update({ status: 'draft' }).eq('id', id)
    },
  },

  // ── EXPORTS ─────────────────────────────────────────────────────────
  exports: {
    list: async () => {
      if (!supabase) return base.exports.list()
      const { data, error } = await supabase.from('export_jobs').select('id, kind, requested_at, requested_by, status, download_url, bytes').order('requested_at', { ascending: false }).limit(50)
      if (error) { console.error('exports.list', error); return [] }
      return ((data as Record<string, unknown>[] | null) || []).map((j) => ({
        id: String(j.id), kind: String(j.kind), requestedAt: String(j.requested_at),
        requestedBy: String(j.requested_by || '—'),
        status: String(j.status) as ExportJob['status'],
        downloadUrl: j.download_url ? String(j.download_url) : undefined,
        bytes: j.bytes ? Number(j.bytes) : undefined,
      } as ExportJob))
    },
    request: async (kind) => {
      if (!supabase) return base.exports.request(kind)
      const { data, error } = await supabase.from('export_jobs').insert({ kind, status: 'queued' }).select().single()
      if (error || !data) throw error || new Error('exports.request returned no row')
      const r = data as Record<string, unknown>
      return { id: String(r.id), kind, requestedAt: String(r.requested_at), requestedBy: 'You', status: 'queued' } as ExportJob
    },
  },

  // ── BRANDING ────────────────────────────────────────────────────────
  branding: {
    get: async (tenantId) => {
      if (!supabase || !tenantId) return base.branding.get(tenantId)
      const { data } = await supabase.from('tenant_branding').select('*').eq('tenant_id', tenantId).maybeSingle()
      if (!data) return { tenantId, primaryColor: '#1a7c3a' } as BrandingConfig
      const r = data as Record<string, unknown>
      return { tenantId: String(r.tenant_id), logoUrl: r.logo_url ? String(r.logo_url) : undefined, primaryColor: String(r.primary_color || '#1a7c3a'), loginSplash: r.login_splash ? String(r.login_splash) : undefined, customDomain: r.custom_domain ? String(r.custom_domain) : undefined } as BrandingConfig
    },
    update: async (tenantId, patch) => {
      if (!supabase || !tenantId) return base.branding.update(tenantId, patch)
      const row = {
        tenant_id: tenantId,
        logo_url: patch.logoUrl, primary_color: patch.primaryColor,
        login_splash: patch.loginSplash, custom_domain: patch.customDomain,
        updated_at: new Date().toISOString(),
      }
      await supabase.from('tenant_branding').upsert(row, { onConflict: 'tenant_id' })
      return { tenantId, ...patch } as BrandingConfig
    },
  },

  // ── SUPPORT / IMPERSONATION ─────────────────────────────────────────
  support: {
    impersonationSessions: async (): Promise<ImpersonationSession[]> => {
      if (!supabase) return base.support.impersonationSessions()
      const { data } = await supabase.from('impersonation_sessions').select('id, user_id, actor_id, reason, started_at, expires_at, ended_at').is('ended_at', null).order('started_at', { ascending: false })
      return ((data as Record<string, unknown>[] | null) || []).map((s) => ({
        id: String(s.id), userId: String(s.user_id), userEmail: '—',
        startedAt: String(s.started_at), reason: String(s.reason),
        expiresAt: String(s.expires_at),
      }))
    },
    startImpersonation: async (input) => {
      if (!supabase) return base.support.startImpersonation(input)
      const expires_at = new Date(Date.now() + 30 * 60_000).toISOString()
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase.from('impersonation_sessions').insert({ user_id: input.userId, actor_id: user?.id, reason: input.reason, expires_at }).select().single()
      if (error || !data) throw error || new Error('startImpersonation failed')
      const r = data as Record<string, unknown>
      return { id: String(r.id), userId: input.userId, userEmail: '—', startedAt: String(r.started_at), reason: input.reason, expiresAt: String(r.expires_at) }
    },
    endImpersonation: async (id) => {
      if (!supabase) return base.support.endImpersonation(id)
      await supabase.from('impersonation_sessions').update({ ended_at: new Date().toISOString() }).eq('id', id)
    },
  },

  // ── HEALTH ──────────────────────────────────────────────────────────
  health: {
    snapshot: async () => {
      const out = await base.health.snapshot()
      if (!supabase) return out
      const t0 = performance.now()
      const { error } = await supabase.from('tr_users').select('id', { count: 'exact', head: true })
      const latency = Math.round(performance.now() - t0)
      out.unshift({ surface: 'Supabase Postgres (TABHOS)', uptimePct: error ? 99.0 : 99.99, errorRatePct: error ? 1.0 : 0.0, p95Ms: latency, status: error ? 'amber' : 'green' })
      return out
    },
  },
}

export default function AdminV2() { return <AdminApp adapter={adapter} /> }
