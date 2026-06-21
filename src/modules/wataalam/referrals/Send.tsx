import { useState } from 'react'
import { JEWEL, TYPE, TEXT, hexToRgba } from '../../../lib/glass'
import { CROSS_PRODUCTS, type CrossProduct } from '../../../lib/crossProducts'

interface Referral {
  id: string
  ts: number
  patient: string
  reasonSw: string
  toProvider: string
  crossProducts: CrossProduct[]
  status: 'sent'
}

function save(r: Referral): void {
  try {
    const KEY = 'tumaini.wataalam.referrals.sent'
    const raw = localStorage.getItem(KEY)
    const list: Referral[] = raw ? (JSON.parse(raw) as Referral[]) : []
    list.push(r)
    localStorage.setItem(KEY, JSON.stringify(list.slice(-500)))
  } catch { /* ignore */ }
}

export default function ReferralsSend() {
  const [patient, setPatient] = useState('')
  const [toProvider, setToProvider] = useState('')
  const [reason, setReason] = useState('')
  const [cross, setCross] = useState<Record<CrossProduct, boolean>>({ TibaFigo: false, TibaAfya: false, TibaMama: false, THOS: false })
  const [done, setDone] = useState(false)

  function submit(): void {
    if (!patient || !toProvider || !reason) return
    const r: Referral = {
      id: `ref_${Date.now()}`,
      ts: Date.now(),
      patient, reasonSw: reason, toProvider,
      crossProducts: CROSS_PRODUCTS.filter((p) => cross[p]),
      status: 'sent',
    }
    save(r)
    setDone(true)
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
        <button onClick={submit} style={{ padding: '10px 22px', borderRadius: 999, background: JEWEL.tealMwenza, color: '#FAF5E5', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Tuma rufaa</button>
        {done && <div style={{ color: JEWEL.tealMwenza, fontWeight: 600 }}>Rufaa imetumwa.</div>}
      </div>
    </div>
  )
}

function inp(): React.CSSProperties {
  return { width: '100%', padding: 10, borderRadius: 10, border: `1px solid ${hexToRgba('#000', 0.12)}`, background: '#FAF5E5', fontFamily: TYPE.sans, marginTop: 4 }
}
