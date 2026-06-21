import { useState } from 'react'
import { JEWEL, TYPE, TEXT, hexToRgba } from '../../../lib/glass'
import { CROSS_PRODUCTS, type CrossProduct } from '../../../lib/crossProducts'
import { db, hasBackend } from '../../../lib/db'
import { getMyProviderId, getMeId } from '../../../lib/me'

interface Referral {
  id: string
  ts: number
  patient: string
  reasonSw: string
  toProvider: string
  crossProducts: CrossProduct[]
  status: 'sent'
}

function saveLocal(r: Referral): void {
  try {
    const KEY = 'tumaini.wataalam.referrals.sent'
    const raw = localStorage.getItem(KEY)
    const list: Referral[] = raw ? (JSON.parse(raw) as Referral[]) : []
    list.push(r)
    localStorage.setItem(KEY, JSON.stringify(list.slice(-500)))
  } catch { /* ignore */ }
}

/**
 * Persist a referral to tr_referrals when there's a backend session.
 *
 * The user enters the recipient as a free-text "Jina au ID"; if it's a uuid we
 * treat it as a tr_providers.id, otherwise we drop it into to_facility (free
 * text). Same logic for patient → tr_users.id vs. free-text label that goes
 * into reason as a prefix.
 */
async function persistReferral(r: Referral): Promise<void> {
  if (!hasBackend) return
  const meProviderId = await getMyProviderId()
  const mePatientId  = await getMeId() // referrals require patient_id NOT NULL

  const looksLikeUuid = (s: string): boolean => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s.trim())

  const patient_id = looksLikeUuid(r.patient) ? r.patient.trim() : mePatientId
  const to_provider_id = looksLikeUuid(r.toProvider) ? r.toProvider.trim() : null
  const to_facility = looksLikeUuid(r.toProvider) ? null : r.toProvider

  const reasonExtras: string[] = []
  if (!looksLikeUuid(r.patient)) reasonExtras.push(`Mgonjwa: ${r.patient}`)
  if (r.crossProducts.length) reasonExtras.push(`Cross-apps: ${r.crossProducts.join(', ')}`)
  const reason = [r.reasonSw, ...reasonExtras].join('\n\n')

  try {
    await db.insert('tr_referrals', {
      patient_id,
      from_provider_id: meProviderId ?? undefined,
      to_provider_id: to_provider_id ?? undefined,
      to_facility: to_facility ?? undefined,
      reason,
      urgency: 'routine',
      status: 'open',
    })
    await db.audit('referral.send', 'tr_referrals', undefined, { cross: r.crossProducts })
  } catch { /* graceful — RLS / offline */ }
}

export default function ReferralsSend() {
  const [patient, setPatient] = useState('')
  const [toProvider, setToProvider] = useState('')
  const [reason, setReason] = useState('')
  const [cross, setCross] = useState<Record<CrossProduct, boolean>>({ TibaFigo: false, TibaAfya: false, TibaMama: false, THOS: false })
  const [done, setDone] = useState(false)
  const [sending, setSending] = useState(false)

  async function submit(): Promise<void> {
    if (!patient || !toProvider || !reason || sending) return
    setSending(true)
    const r: Referral = {
      id: `ref_${Date.now()}`,
      ts: Date.now(),
      patient, reasonSw: reason, toProvider,
      crossProducts: CROSS_PRODUCTS.filter((p) => cross[p]),
      status: 'sent',
    }
    saveLocal(r)
    await persistReferral(r)
    setDone(true)
    setSending(false)
    setPatient(''); setToProvider(''); setReason('')
    setCross({ TibaFigo: false, TibaAfya: false, TibaMama: false, THOS: false })
  }

  return (
    <div style={{ padding: '24px 22px 80px', fontFamily: TYPE.sans }}>
      <h1 style={{ fontFamily: TYPE.serif, fontWeight: 800, color: JEWEL.tealDeep, fontSize: 30 }}>Tuma rufaa</h1>
      <p style={{ color: TEXT.muted }}>Rufaa ya hatua moja kwenda kwa mtaalamu mwingine au programu nyingine ya Laetoli.</p>

      <div style={{ background: '#FAF5E5', padding: 18, borderRadius: 18, border: `1px solid ${hexToRgba('#000', 0.08)}`, display: 'grid', gap: 12, marginTop: 16 }}>
        <label><div style={{ fontWeight: 600 }}>Mgonjwa</div>
          <input value={patient} onChange={(e) => setPatient(e.target.value)} placeholder="Jina au ID" aria-label="Mgonjwa" style={inp()} />
        </label>
        <label><div style={{ fontWeight: 600 }}>Mtaalamu anayepokea</div>
          <input value={toProvider} onChange={(e) => setToProvider(e.target.value)} placeholder="Jina au ID" aria-label="Mtaalamu anayepokea" style={inp()} />
        </label>
        <label><div style={{ fontWeight: 600 }}>Sababu</div>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={4} placeholder="Eleza kwa kifupi" aria-label="Sababu" style={inp()} />
        </label>
        <fieldset style={{ border: 'none', padding: 0 }}>
          <legend style={{ fontWeight: 600, marginBottom: 6 }}>Tuma pia kupitia programu nyingine ya Laetoli</legend>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            {CROSS_PRODUCTS.map((p) => (
              <label key={p} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input type="checkbox" checked={cross[p]} onChange={(e) => setCross({ ...cross, [p]: e.target.checked })} />
                <span>{p}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <button onClick={() => void submit()} disabled={sending} style={{ padding: '10px 22px', borderRadius: 999, background: JEWEL.tealMwenza, color: '#FAF5E5', border: 'none', fontWeight: 700, cursor: sending ? 'wait' : 'pointer', opacity: sending ? 0.7 : 1 }}>{sending ? 'Inatuma…' : 'Tuma rufaa'}</button>
        {done && <div style={{ color: JEWEL.tealMwenza, fontWeight: 600 }}>Rufaa imetumwa.</div>}
      </div>
    </div>
  )
}

function inp(): React.CSSProperties {
  return { width: '100%', padding: 10, borderRadius: 10, border: `1px solid ${hexToRgba('#000', 0.12)}`, background: '#FAF5E5', fontFamily: TYPE.sans, marginTop: 4 }
}
