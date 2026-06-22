// ============================================================================
// TABHOS — mpesa-b2c-payout (Supabase Edge Function)
//
// Disburses a one-off payout to a provider via the M-Pesa B2C rail or the
// configured aggregator (Selcom / Beem / Pesapal). The frontend never sees
// the aggregator credentials; only this function does.
//
// Honesty: M-Pesa B2C requires (a) a Safaricom organisation shortcode + an
// initiator passkey, or (b) an aggregator account (Selcom is the common
// Tanzanian rail). Neither is provisioned by default. This function
// gracefully no-ops with `{status:'skipped'}` when env is absent so dev
// environments keep working; production must set the secrets below.
//
// Required secrets (set with `supabase secrets set …`):
//   TABHOS_MPESA_BASE_URL   — aggregator base (e.g. https://apigw.selcommobile.com)
//   TABHOS_MPESA_API_KEY    — aggregator API key / consumer key
//   TABHOS_MPESA_API_SECRET — aggregator API secret / consumer secret
//   TABHOS_MPESA_SHORTCODE  — TABHOS/Laetoli paybill or organisation shortcode
//   TABHOS_MPESA_RAIL       — 'selcom' | 'beem' | 'pesapal' | 'safaricom' (selcom default)
//
// Frontend:
//   await supabase.functions.invoke('mpesa-b2c-payout', {
//     body: { appointmentId, providerId, amountTzs, msisdn }
//   })
// ============================================================================

// @ts-nocheck — Deno (Edge runtime), not the Vite/TS build.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type, x-client-info, apikey',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface Body {
  appointmentId?: string
  providerId?: string
  amountTzs?: number
  msisdn?: string         // E.164 e.g. +255712345678
  reference?: string       // human-readable memo
}

function normMsisdn(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.startsWith('255')) return digits
  if (digits.startsWith('0'))   return '255' + digits.slice(1)
  return digits
}

async function callSelcom(payload: {
  amount: number; msisdn: string; reference: string;
}): Promise<{ ok: boolean; rail_ref?: string; detail?: string }> {
  const base = Deno.env.get('TABHOS_MPESA_BASE_URL')
  const key  = Deno.env.get('TABHOS_MPESA_API_KEY')
  const sec  = Deno.env.get('TABHOS_MPESA_API_SECRET')
  if (!base || !key || !sec) return { ok: false, detail: 'mpesa_not_configured' }

  // Selcom requires an HMAC over the canonicalised payload. This is a
  // placeholder for the production signing routine; real Selcom code goes
  // here once credentials are issued.
  const auth = btoa(`${key}:${sec}`)
  const res = await fetch(`${base.replace(/\/$/, '')}/v1/disburse`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: payload.amount,
      msisdn: payload.msisdn,
      transactionReference: payload.reference,
      currency: 'TZS',
    }),
  })
  if (!res.ok) return { ok: false, detail: await res.text() }
  const data = await res.json().catch(() => ({}))
  return { ok: true, rail_ref: data.transactionId ?? data.reference }
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
  const { appointmentId, providerId, amountTzs, msisdn, reference } = body
  if (!providerId || !amountTzs || amountTzs <= 0 || !msisdn) {
    return new Response(JSON.stringify({ error: 'bad_params' }), {
      status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const rail = (Deno.env.get('TABHOS_MPESA_RAIL') ?? 'selcom').toLowerCase()

  // If rail is unconfigured, return skipped (200) so the caller can record a
  // pending payout row instead of throwing.
  if (!Deno.env.get('TABHOS_MPESA_BASE_URL')) {
    return new Response(JSON.stringify({
      status: 'skipped',
      reason: 'mpesa_not_configured',
      provider_id: providerId,
      amount_tzs: amountTzs,
      msisdn,
    }), { status: 200, headers: { ...CORS, 'Content-Type': 'application/json' } })
  }

  const memo = reference ?? `TABHOS appt ${appointmentId ?? '—'}`
  const result = rail === 'selcom'
    ? await callSelcom({ amount: amountTzs, msisdn: normMsisdn(msisdn), reference: memo })
    : { ok: false, detail: `unsupported_rail:${rail}` }

  // Log to tr_audit_log via service role.
  try {
    const sb = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )
    await sb.from('tr_audit_log').insert({
      action: result.ok ? 'mpesa.payout.sent' : 'mpesa.payout.failed',
      entity: 'tr_appointments',
      entity_id: appointmentId ?? null,
      meta: { provider_id: providerId, amount_tzs: amountTzs, msisdn, rail, rail_ref: result.rail_ref, detail: result.detail },
    })
  } catch { /* audit best-effort */ }

  if (!result.ok) {
    return new Response(JSON.stringify({ status: 'failed', detail: result.detail }), {
      status: 502, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }
  return new Response(JSON.stringify({ status: 'sent', rail, rail_ref: result.rail_ref }), {
    status: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
  })
})
