/**
 * Complete Session — closes the loop on an appointment.
 *
 * Single screen that:
 *   1. Loads the specific appointment (route param `:appointmentId`)
 *   2. Renders a SOAP form (Subjective, Objective, Assessment, Plan)
 *   3. On submit:
 *      - Inserts the note as a `tr_audit_log` row (entity='session_note',
 *        entity_id=appointmentId, meta={template:'SOAP', fields, signed_at})
 *      - Marks the appointment `status='completed'`
 *      - Optionally captures a follow-up outcome (PHQ-9 follow-up score)
 *      - Optionally drafts a `tr_claims` row when 'Tuma kwa bima' is checked
 *   4. Navigates back to /wataalam with a toast
 *
 * Sovereign + real: writes to Supabase via the typed db.* helpers.
 */
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLang } from '../../../lib/i18n/Provider'
import { Card, FieldLabel, H1, buttonStyle, fieldStyle } from '../components/Card'
import { db } from '../../../lib/db'
import { getMeId, getMyProviderId } from '../../../lib/me'
import { toast } from '../../../lib/notify'
import { JEWEL, BRAND, CREAM, RADII, TEXT, TYPE, hexToRgba } from '../../../lib/glass'

type SoapKey = 'S' | 'O' | 'A' | 'P'

interface ApptSummary {
  id: string
  patient_id: string
  scheduled_at: string
  duration_min: number
  modality: string
  status: string
  notes?: string | null
  patient_label?: string
}

const SOAP: Array<{ key: SoapKey; sw: string; en: string; hint: string }> = [
  { key: 'S', sw: 'Maelezo ya mteja', en: 'Subjective', hint: 'Anachosema mteja kwa maneno yake.' },
  { key: 'O', sw: 'Uchunguzi',        en: 'Objective',  hint: 'Mienendo, sauti, mwonekano, alama za kimwili.' },
  { key: 'A', sw: 'Tathmini',         en: 'Assessment', hint: 'Hukumu ya kitabibu, ICD-11 ikiwezekana.' },
  { key: 'P', sw: 'Mpango',           en: 'Plan',       hint: 'Hatua zinazofuata, dawa, vipindi, rufaa.' },
]

export default function CompleteSession() {
  const { t } = useLang()
  const nav = useNavigate()
  const params = useParams<{ appointmentId: string }>()
  const appointmentId = params.appointmentId ?? ''
  const [appt, setAppt] = useState<ApptSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [fields, setFields] = useState<Record<SoapKey, string>>({ S: '', O: '', A: '', P: '' })
  const [icd11, setIcd11] = useState('')
  const [phqFollowup, setPhqFollowup] = useState('')
  const [submitClaim, setSubmitClaim] = useState(false)
  const [amount, setAmount] = useState('50000')
  const [patientSummary, setPatientSummary] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    void (async () => {
      try {
        const row = await db.get('tr_appointments', appointmentId)
        if (!mounted) return
        if (!row) { setErr(t('wataalam.complete.not_found', 'Miadi hii haipatikani.')); setLoading(false); return }
        // Try to enrich with patient display_name (one extra fetch).
        let label: string | undefined
        try {
          const pat = await db.get('tr_users', (row as ApptSummary).patient_id)
          label = (pat as { display_name?: string } | null)?.display_name
        } catch { /* ignore */ }
        setAppt({ ...(row as ApptSummary), patient_label: label })
      } catch (e) {
        setErr(e instanceof Error ? e.message : String(e))
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [appointmentId, t])

  const canSubmit =
    !!appt && !busy &&
    fields.S.trim().length > 0 && fields.A.trim().length > 0 && fields.P.trim().length > 0

  async function complete() {
    if (!appt || !canSubmit) return
    setBusy(true); setErr(null)
    try {
      const me = await getMeId()
      const providerId = await getMyProviderId()

      // 1) Note row (tr_audit_log entity='session_note')
      await db.insert('tr_audit_log', {
        actor_id: me,
        action: 'session.complete',
        entity: 'session_note',
        entity_id: appt.id,
        meta: {
          template: 'SOAP',
          fields,
          icd11: icd11 || null,
          patient_id: appt.patient_id,
          provider_id: providerId,
          signed_at: new Date().toISOString(),
        },
      } as never)

      // 2) Status update + patient-facing summary persisted on tr_appointments.notes
      //    Preserve any existing provider_slug marker (Book.tsx writes that).
      let mergedNotes: string | undefined
      const existing = appt.notes ?? ''
      const slugMatch = /provider_slug=([^;\s]+)/.exec(existing)
      const parts: string[] = []
      if (slugMatch) parts.push(`provider_slug=${slugMatch[1]}`)
      if (patientSummary.trim()) parts.push(`summary=${patientSummary.trim().replace(/\n+/g, ' ')}`)
      if (parts.length) mergedNotes = parts.join('; ')
      await db.update('tr_appointments', appt.id, {
        status: 'completed',
        ...(mergedNotes ? { notes: mergedNotes } : {}),
      } as never)

      // 3) Optional follow-up PHQ-9 outcome
      const score = phqFollowup.trim() ? parseInt(phqFollowup, 10) : NaN
      if (!isNaN(score) && score >= 0 && score <= 27) {
        await db.insert('tr_outcomes', {
          patient_id: appt.patient_id,
          instrument: 'PHQ-9',
          score,
          measured_at: new Date().toISOString(),
        } as never)
      }

      // 4) Optional draft claim
      if (submitClaim && providerId) {
        const tzs = parseInt(amount, 10)
        if (!isNaN(tzs) && tzs > 0) {
          await db.insert('tr_claims', {
            patient_id: appt.patient_id,
            provider_id: providerId,
            appointment_id: appt.id,
            amount_tzs: tzs,
            icd11: icd11 || undefined,
            status: 'draft',
          } as never)
        }
      }

      toast(t('wataalam.complete.done', 'Kipindi kimekamilika · imeandikishwa'), 'success')
      nav('/wataalam')
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <div>
        <H1 english="Complete session">{t('wataalam.complete.title', 'Maliza kipindi')}</H1>
        <p style={{ color: TEXT.muted }}>{t('wataalam.complete.loading', 'Inapakia…')}</p>
      </div>
    )
  }
  if (err || !appt) {
    return (
      <div>
        <H1 english="Complete session">{t('wataalam.complete.title', 'Maliza kipindi')}</H1>
        <Card title={t('wataalam.complete.err_card', 'Hitilafu')} accent={BRAND.ink}>
          <p style={{ color: TEXT.body, margin: 0 }}>{err ?? t('wataalam.complete.not_found', 'Miadi hii haipatikani.')}</p>
          <button style={{ ...buttonStyle(JEWEL.tealDeep, false), marginTop: 12 }} onClick={() => nav('/wataalam')}>
            {t('wataalam.complete.back', '← Rudi')}
          </button>
        </Card>
      </div>
    )
  }

  const when = new Date(appt.scheduled_at)

  return (
    <div>
      <H1 english="Complete session">{t('wataalam.complete.title', 'Maliza kipindi')}</H1>

      <Card title={t('wataalam.complete.appt_card', 'Miadi')} accent={JEWEL.tealMwenza}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: 10 }}>
          <KV label={t('wataalam.complete.patient', 'Mteja')} value={appt.patient_label ?? t('wataalam.complete.anon', 'Bila jina')} />
          <KV label={t('wataalam.complete.when', 'Wakati')} value={when.toLocaleString('sw-TZ')} />
          <KV label={t('wataalam.complete.modality', 'Aina')} value={appt.modality === 'virtual' ? t('wataalam.common.virtual','Mtandaoni') : t('wataalam.common.in_person','Ana kwa ana')} />
          <KV label={t('wataalam.complete.status', 'Hali')} value={appt.status} />
        </div>
      </Card>

      <Card title={t('wataalam.complete.soap', 'SOAP note')} style={{ marginTop: 14 }}>
        <div style={{ display: 'grid', gap: 12 }}>
          {SOAP.map(f => (
            <div key={f.key}>
              <FieldLabel>{f.key} — {t(`wataalam.complete.soap.${f.key}_sw`, f.sw)} <span style={{ color: TEXT.muted }}>· {f.en}</span></FieldLabel>
              <textarea
                rows={3}
                value={fields[f.key]}
                onChange={e => setFields({ ...fields, [f.key]: e.target.value })}
                placeholder={f.hint}
                style={{
                  width: '100%',
                  background: CREAM.milk,
                  color: TEXT.body,
                  border: '1px solid rgba(11,9,8,0.22)',
                  borderRadius: RADII.card,
                  padding: 12,
                  fontFamily: TYPE.serif,
                  fontSize: 14,
                  resize: 'vertical',
                  outline: 'none',
                }}
              />
            </div>
          ))}

          <div>
            <FieldLabel>{t('wataalam.complete.icd11', 'ICD-11 (hiari)')}</FieldLabel>
            <input
              value={icd11}
              onChange={e => setIcd11(e.target.value)}
              placeholder="e.g. 6A70 — Single episode depressive disorder"
              style={fieldStyle()}
            />
          </div>

          <div>
            <FieldLabel>{t('wataalam.complete.phq', 'PHQ-9 ya leo (hiari, 0–27)')}</FieldLabel>
            <input
              value={phqFollowup}
              onChange={e => setPhqFollowup(e.target.value.replace(/[^\d]/g, ''))}
              placeholder="0–27"
              style={fieldStyle()}
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
            <input type="checkbox" checked={submitClaim} onChange={e => setSubmitClaim(e.target.checked)} />
            <span style={{ color: TEXT.body, fontSize: 14 }}>{t('wataalam.complete.submit_claim', 'Andaa madai ya bima (draft)')}</span>
          </label>

          {submitClaim && (
            <div>
              <FieldLabel>{t('wataalam.complete.amount', 'Kiasi (TZS)')}</FieldLabel>
              <input
                value={amount}
                onChange={e => setAmount(e.target.value.replace(/[^\d]/g, ''))}
                style={fieldStyle()}
              />
            </div>
          )}

          <div>
            <FieldLabel>{t('wataalam.complete.patient_summary', 'Muhtasari kwa mteja (anaweza kuusoma kwenye Mimi)')}</FieldLabel>
            <textarea
              rows={3}
              value={patientSummary}
              onChange={e => setPatientSummary(e.target.value)}
              placeholder={t('wataalam.complete.patient_summary_ph', 'Mfano: Tumeongelea sonona ya kati. Endelea na PHQ-9 wiki ijayo. Anza zoezi la kupumua dakika 5 kila asubuhi.')}
              style={{
                width: '100%', background: CREAM.milk, color: TEXT.body,
                border: '1px solid rgba(11,9,8,0.22)', borderRadius: RADII.card,
                padding: 12, fontFamily: TYPE.serif, fontSize: 14, resize: 'vertical', outline: 'none',
              }}
            />
            <p style={{ fontSize: 11, color: TEXT.muted, marginTop: 4 }}>
              {t('wataalam.complete.patient_summary_hint', 'Hii inahifadhiwa kwenye miadi na inaonekana kwa mteja. SOAP note kamili haionekani — ni ya wahudumu tu.')}
            </p>
          </div>

          {err && (
            <div role="alert" style={{
              padding: '8px 12px', borderRadius: 10,
              background: hexToRgba(BRAND.ink, 0.06), border: `1px solid ${hexToRgba(BRAND.ink, 0.2)}`,
              color: BRAND.ink, fontSize: 13,
            }}>{err}</div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button
              onClick={complete}
              disabled={!canSubmit}
              style={{
                ...buttonStyle(BRAND.green, true),
                opacity: canSubmit ? 1 : 0.55,
                cursor: busy ? 'wait' : canSubmit ? 'pointer' : 'not-allowed',
              }}
            >
              {busy ? t('wataalam.complete.saving', 'Inahifadhi…') : t('wataalam.complete.cta', 'Maliza na hifadhi')}
            </button>
            <button onClick={() => nav('/wataalam')} style={buttonStyle(JEWEL.tealDeep, false)}>
              {t('wataalam.complete.cancel', 'Ghairi')}
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: TEXT.muted, fontWeight: 700, marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ color: TEXT.body, fontSize: 14, fontWeight: 600 }}>{value}</div>
    </div>
  )
}
