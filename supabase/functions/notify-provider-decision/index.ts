// ============================================================================
// TABHOS — notify-provider-decision (Supabase Edge Function)
//
// Sends an email to a provider when an admin approves or rejects their
// onboarding application. Triggered from Ndani's verification inbox after a
// row in tr_provider_credentials is updated.
//
// Deploy:
//   supabase functions deploy notify-provider-decision
//   supabase secrets set TABHOS_RESEND_API_KEY=<resend api key> \
//                        TABHOS_FROM_EMAIL="TABHOS <noreply@laetoli.africa>"
//
// Frontend:
//   await supabase.functions.invoke('notify-provider-decision', {
//     body: { providerId: '...', decision: 'verified' | 'rejected', reason?: '...' }
//   })
//
// Honesty: if TABHOS_RESEND_API_KEY is absent we no-op with status 'skipped'
// so dev environments don't fail loudly. Production must set the secret.
// ============================================================================

// @ts-nocheck — Deno (Edge runtime), not the Vite/TS build.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type, x-client-info, apikey',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface Body {
  providerId?: string
  decision?: 'verified' | 'rejected'
  reason?: string
}

function bodySw(displayName: string, decision: 'verified' | 'rejected', reason?: string): string {
  if (decision === 'verified') {
    return [
      `Habari ${displayName},`,
      '',
      'Maombi yako ya kujisajili kama mtoa-huduma kwenye TABHOS yamethibitishwa.',
      'Jina lako sasa linaonekana kwa wagonjwa kwenye Gundua, na watumiaji wanaweza kukubook.',
      '',
      'Karibu sana kwenye familia ya wataalam wa TABHOS.',
      '',
      '— Laetoli (T) Ltd',
      'tibaroho.vercel.app',
    ].join('\n')
  }
  return [
    `Habari ${displayName},`,
    '',
    'Tunashukuru kwa maombi yako ya kujisajili kama mtoa-huduma kwenye TABHOS.',
    'Kwa sasa, maombi yako hayajakubaliwa.',
    reason ? `\nSababu: ${reason}\n` : '',
    'Unaweza kuwasiliana nasi kwa noreply@laetoli.africa kwa maelezo zaidi au kutuma maombi mapya.',
    '',
    '— Laetoli (T) Ltd',
  ].join('\n')
}

function bodyEn(displayName: string, decision: 'verified' | 'rejected', reason?: string): string {
  if (decision === 'verified') {
    return [
      `Hello ${displayName},`,
      '',
      'Your TABHOS provider application has been approved.',
      'Your profile is now visible to patients in Gundua and they can book sessions with you.',
      '',
      'Welcome to the TABHOS provider community.',
      '',
      '— Laetoli (T) Ltd',
      'tibaroho.vercel.app',
    ].join('\n')
  }
  return [
    `Hello ${displayName},`,
    '',
    'Thank you for applying as a TABHOS provider.',
    'At this time your application has not been approved.',
    reason ? `\nReason: ${reason}\n` : '',
    'You can reach us at noreply@laetoli.africa for more information or to submit a fresh application.',
    '',
    '— Laetoli (T) Ltd',
  ].join('\n')
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'method_not_allowed' }), {
      status: 405, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  let body: Body
  try { body = await req.json() } catch {
    return new Response(JSON.stringify({ error: 'bad_json' }), {
      status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }
  const { providerId, decision, reason } = body
  if (!providerId || (decision !== 'verified' && decision !== 'rejected')) {
    return new Response(JSON.stringify({ error: 'bad_params' }), {
      status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  // Resolve provider's email + display_name + preferred language via service-role client.
  const sb = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )
  const { data: prov, error: e1 } = await sb
    .from('tr_providers')
    .select('user_id, tr_users!inner(display_name, lang, auth_id)')
    .eq('id', providerId)
    .single()
  if (e1 || !prov) {
    return new Response(JSON.stringify({ error: 'provider_not_found', detail: e1?.message }), {
      status: 404, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const displayName = prov.tr_users?.display_name ?? 'mtaalam'
  const langPref = (prov.tr_users?.lang ?? 'sw').startsWith('en') ? 'en' : 'sw'
  const authId = prov.tr_users?.auth_id

  // Look up email via auth.admin API. RLS does not expose auth.users.
  let toEmail: string | null = null
  if (authId) {
    const { data: u } = await sb.auth.admin.getUserById(authId)
    toEmail = u?.user?.email ?? null
  }
  if (!toEmail) {
    return new Response(JSON.stringify({ status: 'skipped', reason: 'no_email_on_record' }), {
      status: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  // If Resend isn't configured, log + skip gracefully.
  const resendKey = Deno.env.get('TABHOS_RESEND_API_KEY')
  const fromAddr = Deno.env.get('TABHOS_FROM_EMAIL') ?? 'TABHOS <noreply@laetoli.africa>'
  if (!resendKey) {
    return new Response(JSON.stringify({ status: 'skipped', reason: 'resend_not_configured', to: toEmail }), {
      status: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const subjectSw = decision === 'verified'
    ? 'TABHOS — maombi yako yamethibitishwa'
    : 'TABHOS — kuhusu maombi yako'
  const subjectEn = decision === 'verified'
    ? 'TABHOS — your provider application is approved'
    : 'TABHOS — about your provider application'

  const subject = langPref === 'en' ? subjectEn : subjectSw
  const text = langPref === 'en'
    ? bodyEn(displayName, decision, reason)
    : bodySw(displayName, decision, reason)

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendKey}` },
    body: JSON.stringify({ from: fromAddr, to: toEmail, subject, text }),
  })

  if (!res.ok) {
    const detail = await res.text()
    return new Response(JSON.stringify({ status: 'send_failed', detail }), {
      status: 502, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }
  const sent = await res.json()
  return new Response(JSON.stringify({ status: 'sent', id: sent.id, to: toEmail }), {
    status: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
  })
})
