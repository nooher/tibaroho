import type React from 'react'
import { useState } from 'react'
import { Card, Table, Td } from '../../_shared/Layout'
import { BRAND, CREAM, NEUTRAL, RADII, TEXT, hexToRgba } from '../../../lib/glass'

const ink = (a = 1) => hexToRgba(NEUTRAL.ink, a)

const PROTOCOL_VERSIONS = [
  { id: 'TR-001', name: 'PhD primary outcome — Hybrid Type 2', v: 'v3.2', muhas: 'IRB-2026-04-PSY-018', uams: 'IRB-26-04-1129', status: 'Active', expires: '2027-04-12' },
  { id: 'TR-002', name: 'Implementation / CFIR', v: 'v2.1', muhas: 'IRB-2026-04-PSY-019', uams: 'IRB-26-04-1130', status: 'Active', expires: '2027-04-12' },
  { id: 'TR-003', name: 'Cost-effectiveness sub-study', v: 'v1.0', muhas: 'Pending', uams: 'Submitted 2026-06-01', status: 'Review', expires: '—' },
]

const CONSENTS = [
  { kind: 'Adult — research participation', sw: 'idhini_mtu_mzima_sw.pdf', en: 'adult_consent_en.pdf' },
  { kind: 'Minor (12–17) — assent', sw: 'idhini_kijana_sw.pdf', en: 'minor_assent_en.pdf' },
  { kind: 'Caregiver — proxy', sw: 'idhini_mlezi_sw.pdf', en: 'caregiver_proxy_en.pdf' },
  { kind: 'Research data re-use', sw: 'idhini_data_sw.pdf', en: 'data_reuse_en.pdf' },
]

const DSA_LOG = [
  { date: '2026-03-12', actor: 'MUHAS IRB', action: 'Approved TR-001 protocol v3.2' },
  { date: '2026-04-01', actor: 'UAMS IRB', action: 'Reliance agreement countersigned' },
  { date: '2026-05-22', actor: 'Laetoli DPO', action: 'DSA executed with MUHAS for de-identified extracts' },
  { date: '2026-06-15', actor: 'Researcher (cohort lead)', action: 'Extract pulled — TR-001 wk-12 (n=521)' },
]

const AMENDMENTS = [
  { id: 'A-001', protocol: 'TR-001', desc: 'Add Mwanza facility (n+100)', filed: '2026-04-20', status: 'Approved' },
  { id: 'A-002', protocol: 'TR-001', desc: 'Switch C-SSRS to short-form', filed: '2026-05-08', status: 'Approved' },
  { id: 'A-003', protocol: 'TR-002', desc: 'Add fidelity supervisor interview', filed: '2026-06-10', status: 'Pending' },
]

const KEY_AE = 'tumaini.utafiti.irb.adverse'

interface AE { id: string; date: string; participant: string; severity: 'AE' | 'SAE'; description: string }

export default function IRB(): React.JSX.Element {
  const [aes, setAes] = useState<AE[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY_AE) || '[]') as AE[] } catch { return [] }
  })
  const [form, setForm] = useState<AE>({ id: '', date: new Date().toISOString().slice(0,10), participant: '', severity: 'AE', description: '' })

  const submit = (): void => {
    if (!form.participant || !form.description) return
    const next = [...aes, { ...form, id: `AE-${Date.now()}` }]
    setAes(next)
    // TODO: sync to Supabase tr_adverse_events.
    try { localStorage.setItem(KEY_AE, JSON.stringify(next)) } catch {}
    setForm({ id: '', date: new Date().toISOString().slice(0,10), participant: '', severity: 'AE', description: '' })
  }

  return (
    <>
      <Card title="Protocol version control — MUHAS + UAMS dual IRB" accent={BRAND.green}>
        <Table headers={['Itifaki', 'Toleo', 'MUHAS', 'UAMS', 'Hali', 'Expiry']}>
          {PROTOCOL_VERSIONS.map((p) => (
            <tr key={p.id}>
              <Td style={{ color: TEXT.body }}><strong>{p.id}</strong> — {p.name}</Td>
              <Td style={{ color: TEXT.body }}>{p.v}</Td>
              <Td style={{ color: TEXT.muted }}><code style={{ fontSize: 11 }}>{p.muhas}</code></Td>
              <Td style={{ color: TEXT.muted }}><code style={{ fontSize: 11 }}>{p.uams}</code></Td>
              <Td style={{ color: p.status === 'Active' ? BRAND.green : BRAND.yellow, fontWeight: 600 }}>{p.status}</Td>
              <Td style={{ color: TEXT.muted }}>{p.expires}</Td>
            </tr>
          ))}
        </Table>
      </Card>

      <Card title="Consent template library" accent={BRAND.blue}>
        <Table headers={['Aina', 'Kiswahili', 'English']}>
          {CONSENTS.map((c) => (
            <tr key={c.kind}>
              <Td style={{ color: TEXT.body }}>{c.kind}</Td>
              <Td><code style={{ fontSize: 11, color: TEXT.muted }}>{c.sw}</code></Td>
              <Td><code style={{ fontSize: 11, color: TEXT.muted }}>{c.en}</code></Td>
            </tr>
          ))}
        </Table>
      </Card>

      <Card title="Amendment tracker" accent={BRAND.yellow}>
        <Table headers={['#', 'Itifaki', 'Mabadiliko', 'Tarehe', 'Hali']}>
          {AMENDMENTS.map((a) => (
            <tr key={a.id}>
              <Td style={{ color: TEXT.body }}><strong>{a.id}</strong></Td>
              <Td style={{ color: TEXT.body }}>{a.protocol}</Td>
              <Td style={{ color: TEXT.muted }}>{a.desc}</Td>
              <Td style={{ color: TEXT.muted }}>{a.filed}</Td>
              <Td style={{ color: a.status === 'Approved' ? BRAND.green : BRAND.yellow, fontWeight: 600 }}>{a.status}</Td>
            </tr>
          ))}
        </Table>
      </Card>

      <Card title="DSA + Ethics Review Log" accent={BRAND.blue}>
        <Table headers={['Tarehe', 'Mhusika', 'Hatua']}>
          {DSA_LOG.map((e, i) => (
            <tr key={i}>
              <Td style={{ color: TEXT.muted }}>{e.date}</Td>
              <Td style={{ color: TEXT.body }}>{e.actor}</Td>
              <Td style={{ color: TEXT.body }}>{e.action}</Td>
            </tr>
          ))}
        </Table>
      </Card>

      <Card title="Adverse Event reporting (AE / SAE)" accent={NEUTRAL.ink}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 12 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: TEXT.muted }}>
            Tarehe
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
              style={{ padding: '8px 10px', borderRadius: 8, background: CREAM.milk, border: `1px solid ${ink(0.22)}`, color: TEXT.body, fontSize: 13 }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: TEXT.muted }}>
            Kitambulisho cha mhusika
            <input type="text" value={form.participant} placeholder="TR-001-PT-####" onChange={(e) => setForm({ ...form, participant: e.target.value })}
              style={{ padding: '8px 10px', borderRadius: 8, background: CREAM.milk, border: `1px solid ${ink(0.22)}`, color: TEXT.body, fontSize: 13 }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: TEXT.muted }}>
            Ukali
            <select value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value as 'AE' | 'SAE' })}
              style={{ padding: '8px 10px', borderRadius: 8, background: CREAM.milk, border: `1px solid ${ink(0.15)}`, color: NEUTRAL.ink, fontSize: 13 }}>
              <option value="AE">AE — Adverse Event</option>
              <option value="SAE">SAE — Serious AE</option>
            </select>
          </label>
        </div>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Maelezo kamili ya tukio, hatua zilizochukuliwa, na ufuatiliaji…" rows={3}
          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, background: CREAM.milk,
            border: `1px solid ${ink(0.22)}`, color: TEXT.body, fontSize: 13, marginBottom: 10, outline: 'none', resize: 'vertical' }} />
        <button onClick={submit} style={{
          padding: '10px 16px', borderRadius: RADII.chip, background: BRAND.green,
          color: TEXT.onJewel, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>Wasilisha ripoti</button>

        {aes.length > 0 ? (
          <div style={{ marginTop: 16 }}>
            <Table headers={['Tarehe', 'Mhusika', 'Ukali', 'Maelezo']}>
              {aes.map((a) => (
                <tr key={a.id}>
                  <Td style={{ color: TEXT.muted }}>{a.date}</Td>
                  <Td style={{ color: TEXT.body }}>{a.participant}</Td>
                  <Td style={{ color: a.severity === 'SAE' ? TEXT.heading : BRAND.yellow, fontWeight: 700 }}>{a.severity}</Td>
                  <Td style={{ color: TEXT.body }}>{a.description}</Td>
                </tr>
              ))}
            </Table>
          </div>
        ) : null}
      </Card>
    </>
  )
}
