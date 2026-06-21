// ============================================================================
// Tumaini · TBHOS — telehealth-token (Supabase Edge Function)
//
// Mints a short-lived Jitsi JWT (HS256) so an authenticated Tumaini user can
// join a sovereign telehealth room (default: telehealth.tumaini.tz). The
// browser never sees the Jitsi app secret — only this function does.
//
// Deploy:
//   supabase functions deploy telehealth-token
//   supabase secrets set TUMAINI_JITSI_SECRET=<jitsi JWT_APP_SECRET> \
//                        TUMAINI_JITSI_DOMAIN=telehealth.tumaini.tz \
//                        TUMAINI_JITSI_APP_ID=tumaini
//
// Frontend:
//   await supabase.functions.invoke('telehealth-token', { body: { appointmentId } })
// ============================================================================

// @ts-nocheck — Deno (Edge runtime), not the Vite/TS build.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const enc = new TextEncoder()
const b64url = (data: ArrayBuffer | string) => {
  const bytes = typeof data === 'string' ? enc.encode(data) : new Uint8Array(data)
  const s = btoa(String.fromCharCode(...bytes))
  return s.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function signJwt(payload: Record<string, unknown>, secret: string): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' }
  const body = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(payload))}`
  const key = await crypto.subtle.importKey('raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(body))
  return `${body}.${b64url(sig)}`
}

Deno.serve(async (req: Request) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST')
    return new Response('Method Not Allowed', { status: 405, headers: cors })

  const secret = Deno.env.get('TUMAINI_JITSI_SECRET')
  const domain = Deno.env.get('TUMAINI_JITSI_DOMAIN') ?? 'meet.jit.si'
  const appId  = Deno.env.get('TUMAINI_JITSI_APP_ID') ?? 'tumaini'

  const auth = req.headers.get('Authorization') ?? ''
  const supa = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: auth } },
  })
  const { data: u } = await supa.auth.getUser()
  if (!u?.user)
    return new Response(JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { ...cors, 'content-type': 'application/json' } })

  const { appointmentId } = await req.json().catch(() => ({}))
  const room = `tumaini-${String(appointmentId ?? crypto.randomUUID()).toLowerCase().replace(/[^a-z0-9-]/g, '-')}`
  const now = Math.floor(Date.now() / 1000)
  const exp = now + 2 * 60 * 60  // 2 hours

  let name = u.user.email ?? 'Mtumiaji wa Tumaini'
  try {
    const { data: p } = await supa.from('tr_users').select('display_name').eq('auth_id', u.user.id).maybeSingle()
    if (p?.display_name) name = p.display_name
  } catch { /* ignore */ }

  // If Jitsi isn't configured for JWT (default public meet.jit.si), return
  // the room URL without a token — guest mode. Production should set the
  // TUMAINI_JITSI_SECRET to a sovereign self-hosted Jitsi instance.
  if (!secret) {
    return new Response(JSON.stringify({
      server: `https://${domain}`,
      room,
      token: null,
      guest: true,
      expires: new Date(exp * 1000).toISOString(),
    }), { headers: { ...cors, 'content-type': 'application/json' } })
  }

  const token = await signJwt({
    aud: 'jitsi',
    iss: appId,
    sub: domain,
    room,
    iat: now,
    nbf: now - 5,
    exp,
    context: { user: { id: u.user.id, name } },
  }, secret)

  return new Response(JSON.stringify({
    server: `https://${domain}`,
    room,
    token,
    expires: new Date(exp * 1000).toISOString(),
  }), { headers: { ...cors, 'content-type': 'application/json' } })
})
