/* admin-invite-user — admin invite a new user by email.
 *
 * Verifies the caller is authenticated and holds an admin role on this
 * app, then performs the corresponding auth-admin operation using the
 * service-role key. Writes a row to admin_audit before returning.
 *
 * Deployed per-app: each Laetoli product has its own Supabase project,
 * its own user table, its own admin-role predicate. The shape of the
 * request body and the response is identical across apps. */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'content-type': 'application/json',
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const ANON_KEY     = Deno.env.get('SUPABASE_ANON_KEY')!

const USER_TABLE   = 'tr_users'
const USER_ID_COL  = 'auth_id'
const ADMIN_CHECK  = (row: Record<string, unknown>) => ['admin','executive','provider'].includes(String(row.role))

async function assertAdmin(req: Request) {
  const auth = req.headers.get('Authorization') || ''
  const user = createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: auth } } })
  const { data: { user: u } } = await user.auth.getUser()
  if (!u) throw new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: CORS })
  const { data: profile } = await user.from(USER_TABLE).select('*').eq(USER_ID_COL, u.id).maybeSingle()
  if (!profile || !ADMIN_CHECK(profile as Record<string, unknown>)) {
    throw new Response(JSON.stringify({ error: 'forbidden' }), { status: 403, headers: CORS })
  }
  return { caller: u, profile }
}

async function audit(actor_id: string, actor_label: string, action: string, target_id: string, meta: Record<string, unknown>, outcome: 'success' | 'denied' | 'error' = 'success') {
  const admin = createClient(SUPABASE_URL, SERVICE_KEY)
  await admin.from('admin_audit').insert({ actor_id, actor_label, action, target_id, meta, outcome })
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS })
  if (req.method !== 'POST')    return new Response(JSON.stringify({ error: 'method not allowed' }), { status: 405, headers: CORS })

  try {
    const { caller, profile } = await assertAdmin(req)
    const body = await req.json() as Record<string, unknown>
    const admin = createClient(SUPABASE_URL, SERVICE_KEY)

    const email = String(body.email || '')
    const role  = String(body.role  || '')
    if (!email.includes('@')) {
      await audit(caller.id, String((profile as Record<string, unknown>).name || caller.id), 'user.invite', email, body, 'error')
      return new Response(JSON.stringify({ error: 'invalid email' }), { status: 400, headers: CORS })
    }
    const { data, error } = await admin.auth.admin.inviteUserByEmail(email, { data: { role } })
    if (error) {
      await audit(caller.id, String((profile as Record<string, unknown>).name || caller.id), 'user.invite', email, { ...body, error: error.message }, 'error')
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: CORS })
    }
    await audit(caller.id, String((profile as Record<string, unknown>).name || caller.id), 'user.invite', String(data.user?.id || email), { email, role })
    return new Response(JSON.stringify({ ok: true, user_id: data.user?.id }), { headers: CORS })

  } catch (e) {
    if (e instanceof Response) return e
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: CORS })
  }
}

Deno.serve(handler)
