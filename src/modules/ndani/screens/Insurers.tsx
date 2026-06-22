import type React from 'react'
import { useState } from 'react'
import { Card, Table, Td } from '../../_shared/Layout'
import { BRAND, CREAM, TZ_FLAG, hexToRgba, RADII, TEXT } from '../../../lib/glass'
import { useLang } from '../../../lib/i18n/Provider'

type SettlementStatus = 'current' | 'delayed' | 'paused'
type ReconciliationStatus = 'reconciled' | 'partial' | 'open'

interface Insurer {
  id: string
  name: string
  shortName: string
  settlement: SettlementStatus
  claimsOpen: number
  claimsPaid30d: number
  recon: ReconciliationStatus
  apiKey: string             // shown masked
  copay: { inPersonPct: number; teleHealthPct: number; selfPayCap: number }
}

const SEED: Insurer[] = [
  { id: 'i-nhif',    name: 'National Health Insurance Fund', shortName: 'NHIF',       settlement: 'current', claimsOpen: 184, claimsPaid30d: 921, recon: 'reconciled', apiKey: 'nhif_live_3f29c0fa8a07b7e1', copay: { inPersonPct: 10, teleHealthPct: 5,  selfPayCap: 30000 } },
  { id: 'i-aar',     name: 'AAR Insurance Tanzania',         shortName: 'AAR',        settlement: 'current', claimsOpen:  41, claimsPaid30d: 277, recon: 'partial',    apiKey: 'aar_live_77d12c4b6e8a1d80',  copay: { inPersonPct: 20, teleHealthPct: 10, selfPayCap: 25000 } },
  { id: 'i-jubilee', name: 'Jubilee Insurance',              shortName: 'Jubilee',    settlement: 'delayed', claimsOpen: 112, claimsPaid30d: 318, recon: 'open',       apiKey: 'jub_live_5e0a9c4f2b3187dd',   copay: { inPersonPct: 15, teleHealthPct: 10, selfPayCap: 35000 } },
  { id: 'i-reso',    name: 'Resolution Insurance Tanzania',  shortName: 'Resolution', settlement: 'current', claimsOpen:  27, claimsPaid30d: 162, recon: 'reconciled', apiKey: 'res_live_1c79bb09f4ce2a48',  copay: { inPersonPct: 20, teleHealthPct: 10, selfPayCap: 22000 } },
  { id: 'i-strg',    name: 'Strategis Insurance',            shortName: 'Strategis',  settlement: 'current', claimsOpen:  19, claimsPaid30d:  88, recon: 'partial',    apiKey: 'str_live_402dd1f6b9eebd11',  copay: { inPersonPct: 25, teleHealthPct: 12, selfPayCap: 20000 } },
  { id: 'i-britam',  name: 'Britam Insurance Tanzania',      shortName: 'Britam',     settlement: 'paused',  claimsOpen:   8, claimsPaid30d:  44, recon: 'open',       apiKey: 'bri_live_98b2d7e3c44a9170',  copay: { inPersonPct: 30, teleHealthPct: 15, selfPayCap: 18000 } },
]

function maskKey(k: string): string {
  if (k.length <= 8) return '••••'
  return k.slice(0, 4) + '••••••••••••' + k.slice(-4)
}

function SettlementChip({ s }: { s: SettlementStatus }): React.JSX.Element {
  const map: Record<SettlementStatus, { bg: string; fg: string; label: string }> = {
    current: { bg: TZ_FLAG.green,  fg: '#fff',     label: 'Kawaida' },
    delayed: { bg: TZ_FLAG.yellow, fg: BRAND.ink,  label: 'Imechelewa' },
    paused:  { bg: BRAND.ink,      fg: '#fff',     label: 'Imesimama' },
  }
  const t = map[s]
  return <span style={pillStyle(t.bg, t.fg)}>{t.label}</span>
}
function ReconChip({ r }: { r: ReconciliationStatus }): React.JSX.Element {
  const map: Record<ReconciliationStatus, { bg: string; fg: string; label: string }> = {
    reconciled: { bg: TZ_FLAG.green,  fg: '#fff',    label: 'Imelinganishwa' },
    partial:    { bg: TZ_FLAG.yellow, fg: BRAND.ink, label: 'Sehemu' },
    open:       { bg: TZ_FLAG.blue,   fg: '#fff',    label: 'Wazi' },
  }
  const t = map[r]
  return <span style={pillStyle(t.bg, t.fg)}>{t.label}</span>
}

function pillStyle(bg: string, fg: string): React.CSSProperties {
  return {
    display: 'inline-block', padding: '3px 10px', borderRadius: 999,
    background: bg, color: fg, fontSize: 11, fontWeight: 700, letterSpacing: 0.4,
  }
}

export default function Insurers(): React.JSX.Element {
  const { t } = useLang()
  const [rows, setRows] = useState<Insurer[]>(SEED)
  const [sel, setSel] = useState<Insurer | null>(null)
  const [reveal, setReveal] = useState<Record<string, boolean>>({})
  const [copayDraft, setCopayDraft] = useState<{ inPersonPct: string; teleHealthPct: string; selfPayCap: string }>({ inPersonPct: '', teleHealthPct: '', selfPayCap: '' })

  function pickInsurer(i: Insurer): void {
    setSel(i)
    setCopayDraft({
      inPersonPct: String(i.copay.inPersonPct),
      teleHealthPct: String(i.copay.teleHealthPct),
      selfPayCap: String(i.copay.selfPayCap),
    })
  }

  function saveCopay(): void {
    if (!sel) return
    const next = {
      inPersonPct: Number(copayDraft.inPersonPct),
      teleHealthPct: Number(copayDraft.teleHealthPct),
      selfPayCap: Number(copayDraft.selfPayCap),
    }
    if (!Object.values(next).every((n) => Number.isFinite(n) && n >= 0)) return
    setRows((rs) => rs.map((r) => (r.id === sel.id ? { ...r, copay: next } : r)))
    setSel({ ...sel, copay: next })
  }

  return (
    <>
      <Card title={t('ndani.ins.overview_title', 'Bima — usimamizi wa madai')}>
        <p style={{ marginTop: 0 }}>
          {t('ndani.ins.overview_body', 'Wabima wote wanaolipia huduma za afya ya akili kwenye TABHOS. Tunafuatilia hali ya malipo, idadi ya madai yaliyo wazi, na ulinganifu wa malipo ya kila mwezi. Ada za mteja (co-pay) zinatumia mwongozo wa NHIF na MoH 2024.')}
        </p>
      </Card>

      <Card title={t('ndani.ins.list_title', 'Wabima walioungana')}>
        <Table headers={[t('ndani.ins.col.insurer', 'Bima'), t('ndani.ins.col.settlement', 'Hali ya malipo'), t('ndani.ins.col.open_claims', 'Madai wazi'), t('ndani.ins.col.paid_30d', 'Yaliyolipwa siku 30'), t('ndani.ins.col.recon', 'Ulinganifu'), t('ndani.ins.col.action', 'Hatua')]}>
          {rows.map((r) => (
            <tr key={r.id}>
              <Td><strong>{r.shortName}</strong><div style={{ fontSize: 11, color: TEXT.muted }}>{r.name}</div></Td>
              <Td><SettlementChip s={r.settlement} /></Td>
              <Td>{r.claimsOpen}</Td>
              <Td>{r.claimsPaid30d}</Td>
              <Td><ReconChip r={r.recon} /></Td>
              <Td>
                <button onClick={() => pickInsurer(r)} aria-label={`${t('ndani.ins.open_aria', 'Fungua maelezo ya')} ${r.shortName}`}
                  style={btn(BRAND.green, CREAM.cream)}>
                  {t('ndani.ins.open', 'Fungua')}
                </button>
              </Td>
            </tr>
          ))}
        </Table>
      </Card>

      {sel ? (
        <Card title={`${sel.shortName} ${t('ndani.ins.config_suffix', '— usanidi')}`}>
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            <section>
              <Label>{t('ndani.ins.api_key', 'API key (siri)')}</Label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <code style={{
                  flex: 1, padding: '8px 12px', borderRadius: RADII.chip,
                  background: CREAM.milk, color: BRAND.ink,
                  border: `1px solid ${hexToRgba(BRAND.ink, 0.12)}`, fontSize: 13,
                }}>
                  {reveal[sel.id] ? sel.apiKey : maskKey(sel.apiKey)}
                </code>
                <button onClick={() => setReveal((r) => ({ ...r, [sel.id]: !r[sel.id] }))}
                  aria-label={reveal[sel.id] ? t('ndani.ins.hide_key_aria', 'Ficha API key') : t('ndani.ins.show_key_aria', 'Onyesha API key')}
                  style={btn(BRAND.blue, CREAM.cream)}>
                  {reveal[sel.id] ? t('ndani.ins.hide', 'Ficha') : t('ndani.ins.show', 'Onyesha')}
                </button>
              </div>
              <p style={{ fontSize: 12, color: TEXT.muted, marginTop: 6 }}>
                {t('ndani.ins.vault_note', 'Hifadhiwa kwenye vault — siyo kwenye repository.')}
              </p>
            </section>

            <section>
              <Label>{t('ndani.ins.copay_title', 'Ratiba ya ada (co-pay)')}</Label>
              <div style={{ display: 'grid', gap: 8 }}>
                <Field label={t('ndani.ins.copay.in_person', 'Ana kwa ana (%)')} value={copayDraft.inPersonPct} onChange={(v) => setCopayDraft({ ...copayDraft, inPersonPct: v })} />
                <Field label={t('ndani.ins.copay.telehealth', 'Telehealth (%)')}  value={copayDraft.teleHealthPct} onChange={(v) => setCopayDraft({ ...copayDraft, teleHealthPct: v })} />
                <Field label={t('ndani.ins.copay.cap', 'Self-pay cap (TZS)')} value={copayDraft.selfPayCap} onChange={(v) => setCopayDraft({ ...copayDraft, selfPayCap: v })} />
                <button onClick={saveCopay} aria-label={t('ndani.ins.copay.save_aria', 'Hifadhi ratiba ya ada')}
                  style={{ ...btn(BRAND.green, CREAM.cream), alignSelf: 'flex-start' }}>
                  {t('ndani.ins.save', 'Hifadhi')}
                </button>
              </div>
            </section>
          </div>
        </Card>
      ) : null}
    </>
  )
}

function Label({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <div style={{
      fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase',
      color: TEXT.muted, fontWeight: 700, marginBottom: 8,
    }}>{children}</div>
  )
}
function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }): React.JSX.Element {
  return (
    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 12, color: TEXT.body }}>{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} inputMode="numeric"
        aria-label={label}
        style={{
          padding: '6px 10px', borderRadius: RADII.chip, width: 110,
          background: CREAM.milk, color: BRAND.ink, fontSize: 13,
          border: `1px solid ${hexToRgba(BRAND.ink, 0.12)}`, outline: 'none', textAlign: 'right',
        }} />
    </label>
  )
}
function btn(bg: string, fg: string): React.CSSProperties {
  return {
    padding: '8px 14px', borderRadius: RADII.chip,
    background: bg, color: fg, border: 'none',
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
  }
}
