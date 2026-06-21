import type React from 'react'
import { useState } from 'react'
import { Card, Table, Td } from '../../_shared/Layout'
import { BRAND, CREAM, TZ_FLAG, hexToRgba, RADII, TEXT } from '../../../lib/glass'

type Lang = 'sw' | 'en' | 'sw_mtaa'

const MODULES = ['mimi', 'rafiki', 'wataalam', 'gundua', 'huduma', 'miradi', 'maalum', 'shuleplus', 'wafanyakazi', 'mashirika', 'utafiti', 'sera', 'pumzi', 'ndani']
const REGIONS = ['Dar es Salaam', 'Mwanza', 'Arusha', 'Dodoma', 'Mbeya', 'Kilimanjaro', 'Tabora', 'Iringa', 'Kagera', 'Mara']

interface CrisisRule { id: string; trigger: string; route: string }
const DEFAULT_RULES: CrisisRule[] = [
  { id: 'cr-1', trigger: 'PHQ-9 item 9 ≥ 1',                   route: 'Stanley-Brown safety plan + Mhudumu wa karibu' },
  { id: 'cr-2', trigger: 'C-SSRS High risk',                   route: 'Lifeline 0800 110014 + DSM team' },
  { id: 'cr-3', trigger: 'IPV indicator (HITS ≥ 10)',          route: 'TAMWA helpline + female responder' },
  { id: 'cr-4', trigger: 'Child abuse keyword',                 route: 'MoH Child Protection (mandatory)' },
  { id: 'cr-5', trigger: 'Psychosis screen positive',          route: 'Muhimbili psych ED + family circle' },
]

interface EmailTemplate { id: string; label: string; subject: string; body: string }
const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: 'welcome',
    label: 'Karibu — usajili mpya',
    subject: 'Karibu Tumaini',
    body: 'Habari {jina}, karibu kwenye Tumaini. Akaunti yako ipo tayari. Ukihitaji msaada, bonyeza Rafiki.\n\nNa upendo, timu ya Tumaini.',
  },
  {
    id: 'appt',
    label: 'Kumbusho la miadi',
    subject: 'Kumbusho — miadi yako kesho',
    body: 'Habari {jina}, una miadi kesho {wakati} pamoja na {mhudumu}. Kama unahitaji kubadilisha, jibu ujumbe huu.',
  },
  {
    id: 'followup',
    label: 'Ufuatiliaji wa baada ya kipindi',
    subject: 'Umefanya vizuri',
    body: 'Habari {jina}, asante kwa kuhudhuria kipindi chako. Tutakukumbusha kuendelea na zoezi la kupumua mara mbili kwa wiki. Kwa salama, Rafiki yupo nawe.',
  },
]

export default function Config(): React.JSX.Element {
  const [modFlags, setModFlags] = useState<Record<string, boolean>>(() => Object.fromEntries(MODULES.map((m) => [m, true])))
  const [regionFlags, setRegionFlags] = useState<Record<string, boolean>>(() => Object.fromEntries(REGIONS.map((r) => [r, true])))
  const [langs, setLangs] = useState<Record<Lang, boolean>>({ sw: true, en: true, sw_mtaa: true })
  const [rules, setRules] = useState<CrisisRule[]>(DEFAULT_RULES)
  const [templates, setTemplates] = useState<EmailTemplate[]>(DEFAULT_TEMPLATES)
  const [tplSel, setTplSel] = useState<string>('welcome')
  const [policyVer, setPolicyVer] = useState({ privacy: '2026.06', tos: '2026.06' })

  const tpl = templates.find((t) => t.id === tplSel)

  return (
    <>
      <Card title="Mipangilio ya jukwaa">
        <p style={{ marginTop: 0 }}>
          Vifungo vya vipengele kwa kila moduli na kila mkoa, lugha zinazotumika, sheria za njia
          ya dharura, miunganiko ya malipo, gateway ya SMS, vielelezo vya barua pepe, na udhibiti
          wa toleo la sera ya faragha na masharti ya matumizi.
        </p>
      </Card>

      <Card title="Feature flags kwa moduli">
        <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          {MODULES.map((m) => (
            <Toggle key={m} label={m} on={!!modFlags[m]} onChange={(v) => setModFlags((s) => ({ ...s, [m]: v }))} />
          ))}
        </div>
      </Card>

      <Card title="Feature flags kwa mkoa">
        <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          {REGIONS.map((r) => (
            <Toggle key={r} label={r} on={!!regionFlags[r]} onChange={(v) => setRegionFlags((s) => ({ ...s, [r]: v }))} />
          ))}
        </div>
      </Card>

      <Card title="Lugha zinazotumika">
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {(['sw', 'en', 'sw_mtaa'] as Lang[]).map((l) => (
            <Toggle key={l}
              label={l === 'sw' ? 'Kiswahili (sw)' : l === 'en' ? 'English (en)' : 'Kiswahili cha mtaa (sw_mtaa)'}
              on={langs[l]}
              onChange={(v) => setLangs((s) => ({ ...s, [l]: v }))} />
          ))}
        </div>
      </Card>

      <Card title="Sheria za njia ya dharura">
        <p style={{ marginTop: 0, fontSize: 13, color: TEXT.muted }}>
          Inategemea Columbia Suicide Severity Rating Scale (Posner et al., 2011) na mwongozo wa
          WHO mhGAP 2.0.
        </p>
        <Table headers={['Kichocheo', 'Njia ya kupelekwa', 'Hatua']}>
          {rules.map((r) => (
            <tr key={r.id}>
              <Td><strong>{r.trigger}</strong></Td>
              <Td>{r.route}</Td>
              <Td>
                <button aria-label={`Ondoa sheria ${r.trigger}`}
                  onClick={() => setRules((rs) => rs.filter((x) => x.id !== r.id))}
                  style={chipBtn(BRAND.yellow, BRAND.ink)}>Ondoa</button>
              </Td>
            </tr>
          ))}
        </Table>
      </Card>

      <Card title="Hali ya muunganiko wa malipo">
        <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <IntegrationRow name="M-Pesa (Vodacom)"     status="connected" />
          <IntegrationRow name="Airtel Money"         status="connected" />
          <IntegrationRow name="Tigo Pesa"            status="degraded"  />
          <IntegrationRow name="HaloPesa"             status="not_connected" />
          <IntegrationRow name="CRDB Bank API"        status="connected" />
          <IntegrationRow name="NMB API"              status="connected" />
        </div>
      </Card>

      <Card title="Gateway ya SMS">
        <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <ConfigField label="Provider" value="Africa's Talking" />
          <ConfigField label="Sender ID" value="TUMAINI" />
          <ConfigField label="Throughput" value="120 msg/sek" />
          <ConfigField label="Failover" value="Beem Africa" />
        </div>
      </Card>

      <Card title="Vielelezo vya barua pepe">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {templates.map((t) => (
            <button key={t.id} onClick={() => setTplSel(t.id)}
              aria-label={`Chagua kielelezo ${t.label}`}
              style={chipBtn(
                tplSel === t.id ? BRAND.green : 'transparent',
                tplSel === t.id ? TEXT.onJewel : TEXT.body,
              )}>
              {t.label}
            </button>
          ))}
        </div>
        {tpl ? (
          <div style={{ display: 'grid', gap: 10 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={lbl}>Mada</span>
              <input value={tpl.subject}
                aria-label="Mada ya kielelezo"
                onChange={(e) => setTemplates((ts) => ts.map((x) => x.id === tpl.id ? { ...x, subject: e.target.value } : x))}
                style={inputCream} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={lbl}>Maandishi</span>
              <textarea rows={6} value={tpl.body}
                aria-label="Maandishi ya kielelezo"
                onChange={(e) => setTemplates((ts) => ts.map((x) => x.id === tpl.id ? { ...x, body: e.target.value } : x))}
                style={{ ...inputCream, resize: 'vertical' as const, fontFamily: 'inherit' }} />
            </label>
          </div>
        ) : null}
      </Card>

      <Card title="Toleo la sera">
        <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={lbl}>Sera ya faragha</span>
            <input value={policyVer.privacy}
              aria-label="Toleo la sera ya faragha"
              onChange={(e) => setPolicyVer({ ...policyVer, privacy: e.target.value })}
              style={inputCream} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={lbl}>Masharti ya matumizi</span>
            <input value={policyVer.tos}
              aria-label="Toleo la masharti ya matumizi"
              onChange={(e) => setPolicyVer({ ...policyVer, tos: e.target.value })}
              style={inputCream} />
          </label>
        </div>
        <p style={{ fontSize: 12, color: TEXT.muted, marginTop: 10 }}>
          Kila toleo linahifadhiwa kwenye audit log. Watumiaji wa zamani wataona "sasisha" kabla ya
          kuendelea.
        </p>
      </Card>
    </>
  )
}

function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }): React.JSX.Element {
  return (
    <label style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10,
      padding: '10px 12px', borderRadius: RADII.chip,
      background: on ? hexToRgba(TZ_FLAG.green, 0.16) : 'rgba(11,9,8,0.04)',
      border: `1px solid rgba(11,9,8,0.10)`,
      cursor: 'pointer',
    }}>
      <span style={{ fontSize: 13, color: TEXT.body }}>{label}</span>
      <input type="checkbox" checked={on} onChange={(e) => onChange(e.target.checked)}
        aria-label={`Wezesha ${label}`} />
    </label>
  )
}

function IntegrationRow({ name, status }: { name: string; status: 'connected' | 'degraded' | 'not_connected' }): React.JSX.Element {
  const map = {
    connected:     { bg: TZ_FLAG.green,  fg: '#fff',    label: 'Imeunganishwa' },
    degraded:      { bg: TZ_FLAG.yellow, fg: BRAND.ink, label: 'Ina matatizo' },
    not_connected: { bg: BRAND.ink,      fg: '#fff',    label: 'Haijaunganishwa' },
  } as const
  const t = map[status]
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 14px', borderRadius: RADII.card,
      background: hexToRgba(BRAND.green, 0.08),
      border: `1px solid rgba(11,9,8,0.10)`,
    }}>
      <span style={{ color: TEXT.body, fontSize: 13 }}>{name}</span>
      <span style={{
        padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
        background: t.bg, color: t.fg, letterSpacing: 0.4,
      }}>{t.label}</span>
    </div>
  )
}

function ConfigField({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div>
      <div style={lbl}>{label}</div>
      <div style={{ fontSize: 14, color: TEXT.body, marginTop: 4 }}>{value}</div>
    </div>
  )
}

const lbl: React.CSSProperties = {
  fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase',
  color: TEXT.muted, fontWeight: 700,
}

const inputCream: React.CSSProperties = {
  padding: '8px 12px', borderRadius: RADII.chip,
  background: CREAM.milk, color: BRAND.ink, fontSize: 13,
  border: `1px solid ${hexToRgba(BRAND.ink, 0.12)}`, outline: 'none',
}

function chipBtn(bg: string, fg: string): React.CSSProperties {
  return {
    padding: '6px 12px', borderRadius: RADII.chip,
    background: bg, color: fg,
    border: bg === 'transparent' ? `1px solid rgba(11,9,8,0.20)` : 'none',
    fontSize: 12, fontWeight: 600, cursor: 'pointer',
  }
}
