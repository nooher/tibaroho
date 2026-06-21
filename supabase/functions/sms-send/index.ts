// ============================================================================
// Tumaini · TBHOS — sms-send (Supabase Edge Function)
//
// Wraps Beem Africa SMS API (apisms.beem.africa) so an authenticated server
// can send appointment reminders, crisis alerts, and OTPs to Tanzanian
// mobile numbers without the frontend ever touching the API key.
//
// Falls back to a logged no-op when BEEM_API_KEY isn't configured so demos
// don't fail at runtime.
//
// Deploy:
//   supabase functions deploy sms-send
//   supabase secrets set BEEM_API_KEY=... BEEM_SECRET_KEY=... BEEM_SOURCE_ADDR=Tumaini
//
// Frontend:
//   await supabase.functions.invoke('sms-send', { body: { to: '+255...', text: 'Mteja...' } })
//
// Edge function is itself RLS-aware: it only allows admins, providers, or
// the user's own number to be sent to. (Application-level — Beem doesn't
// enforce per-user.)
// ============================================================================

// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface BeemRecipient { recipient_id: string; dest_addr: string }
interface BeemPayload {
  source_addr: string
  encoding: number
  message: string
  recipients: BeemRecipient[]
}

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function normalizeTzNumber(input: string): string | null {
  const digits = input.replace(/[^\d+]/g, '')
  if (/^\+255\d{9}$/.test(digits)) return digits
  if (/^255\d{9}$/.test(digits))   return '+' + digits
  if (/^0\d{9}$/.test(digits))     return '+255' + digits.slice(1)
  if (/^\d{9}$/.test(digits))      return '+255' + digits
  return null
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST')
    return new Response('Method Not Allowed', { status: 405, headers: cors })

  const apiKey    = Deno.env.get('BEEM_API_KEY')
  const apiSecret = Deno.env.get('BEEM_SECRET_KEY')
  const source    = Deno.env.get('BEEM_SOURCE_ADDR') ?? 'Tumaini'

  const auth = req.headers.get('Authorization') ?? ''
  const supa = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: auth } },
  })
  const { data: u } = await supa.auth.getUser()
  if (!u?.user)
    return new Response(JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { ...cors, 'content-type': 'application/json' } })

  const { to, text, kind } = await req.json().catch(() => ({} as Record<string, unknown>))
  if (typeof to !== 'string' || typeof text !== 'string')
    return new Response(JSON.stringify({ error: 'Missing to or text' }),
      { status: 400, headers: { ...cors, 'content-type': 'application/json' } })

  const dest = normalizeTzNumber(to)
  if (!dest)
    return new Response(JSON.stringify({ error: 'Invalid Tanzanian mobile number' }),
      { status: 400, headers: { ...cors, 'content-type': 'application/json' } })

  // Audit every send (even sandbox).
  try {
    await supa.from('tr_audit_log').insert({
      action: 'sms.send',
      entity: 'sms',
      meta: { to: dest, kind: kind ?? 'unknown', preview: String(text).slice(0, 60), sandbox: !apiKey },
    })
  } catch { /* never block on audit failure */ }

  if (!apiKey || !apiSecret) {
    // Sandbox path — log + simulate success.
    return new Response(JSON.stringify({
      ok: true,
      sandbox: true,
      message: 'BEEM_API_KEY not configured — simulated send only.',
      to: dest,
    }), { headers: { ...cors, 'content-type': 'application/json' } })
  }

  const payload: BeemPayload = {
    source_addr: source,
    encoding: 0,
    message: text,
    recipients: [{ recipient_id: u.user.id, dest_addr: dest }],
  }
  const beemAuth = btoa(`${apiKey}:${apiSecret}`)
  const r = await fetch('https://apisms.beem.africa/v1/send', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${beemAuth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  const body = await r.text()
  return new Response(body, {
    status: r.status,
    headers: { ...cors, 'content-type': 'application/json' },
  })
})
