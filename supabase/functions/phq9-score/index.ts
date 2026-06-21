// ============================================================================
// Tumaini · TBHOS — phq9-score (Supabase Edge Function)
//
// Server-side scoring + severity grading + crisis flag detection for the
// Patient Health Questionnaire (PHQ-9). Doing this on the edge means the
// client can't fake the severity or skip the suicidality gate (Q9).
//
// Deploy:
//   supabase functions deploy phq9-score
//
// Frontend:
//   const { data } = await supabase.functions.invoke('phq9-score', {
//     body: { answers: [n0..n8] }
//   })
//   // data: { score, severity, q9_flag, row_id }
//   // The row is inserted into tr_screen_results automatically.
// ============================================================================

// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function severityFor(score: number): string {
  if (score >= 20) return 'severe'
  if (score >= 15) return 'moderately_severe'
  if (score >= 10) return 'moderate'
  if (score >=  5) return 'mild'
  return 'minimal'
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST')
    return new Response('Method Not Allowed', { status: 405, headers: cors })

  const auth = req.headers.get('Authorization') ?? ''
  const supa = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: auth } },
  })
  const { data: u } = await supa.auth.getUser()
  if (!u?.user)
    return new Response(JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { ...cors, 'content-type': 'application/json' } })

  const body = await req.json().catch(() => ({} as Record<string, unknown>))
  const answers = body?.answers
  if (!Array.isArray(answers) || answers.length !== 9
      || answers.some((a) => typeof a !== 'number' || a < 0 || a > 3))
    return new Response(JSON.stringify({ error: 'answers must be 9 integers in [0..3]' }),
      { status: 400, headers: { ...cors, 'content-type': 'application/json' } })

  const score = (answers as number[]).reduce((acc, n) => acc + n, 0)
  const severity = severityFor(score)
  const q9 = (answers as number[])[8] ?? 0
  const q9_flag = q9 >= 1  // Any positive answer to suicidality item → flag

  // Look up tr_users.id for the auth user.
  const { data: me } = await supa.from('tr_users').select('id').eq('auth_id', u.user.id).maybeSingle()
  if (!me?.id)
    return new Response(JSON.stringify({ error: 'tr_users row missing for current auth user' }),
      { status: 500, headers: { ...cors, 'content-type': 'application/json' } })

  const { data: row, error } = await supa.from('tr_screen_results').insert({
    user_id: me.id,
    instrument: 'phq9',
    score,
    severity,
    raw: { answers, q9_flag },
  }).select('id').single()
  if (error)
    return new Response(JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...cors, 'content-type': 'application/json' } })

  // If Q9 positive, write a crisis audit entry so admins can route a check-in.
  if (q9_flag) {
    try {
      await supa.from('tr_audit_log').insert({
        action: 'crisis.phq9_q9',
        entity: 'tr_screen_results',
        entity_id: row?.id,
        meta: { score, severity },
      })
    } catch { /* ignore */ }
  }

  return new Response(JSON.stringify({
    score, severity, q9_flag, row_id: row?.id,
  }), { headers: { ...cors, 'content-type': 'application/json' } })
})
