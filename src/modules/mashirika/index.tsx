import type React from 'react'
import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Card, ModuleShell, Table, Td, type SubNav } from '../_shared/Layout'
import { CREAM, TEXT, RADII } from '../../lib/glass'

const HOTLINES_DEFAULT = [
  { name: 'Dharura ya jumla', number: '112', verified: true },
  { name: 'Dharura ya afya', number: '199', verified: true },
  { name: 'Mtoto Hotline (Tanzania)', number: '116', verified: true },
  { name: 'TACAIDS HIV', number: '0800110123', verified: true },
  { name: 'CCBRT', number: '+255222802000', verified: true },
  { name: 'ORCI Cancer', number: '+255222151591', verified: true },
  { name: 'UNHCR Tanzania', number: '+255222197200', verified: true },
  { name: 'CHRAGG (haki)', number: '+255222135747', verified: true },
]

function FieldRow({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }): React.JSX.Element {
  return (
    <label style={{ display: 'block', marginBottom: 12 }}>
      <div style={{ fontSize: 12, color: TEXT.muted, marginBottom: 4 }}>{label}</div>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', padding: '10px 14px', borderRadius: RADII.chip,
          background: CREAM.milk,
          border: `1px solid rgba(11,9,8,0.22)`,
          color: TEXT.body, fontSize: 14, outline: 'none' }} />
    </label>
  )
}

function ThosBridge(): React.JSX.Element {
  const [url, setUrl] = useState('https://thos.go.tz/fhir')
  const [client, setClient] = useState('')
  const [scopes, setScopes] = useState('launch openid fhirUser patient/Observation.rw patient/Condition.rw')
  return (
    <Card title="THOS SMART-on-FHIR Bridge">
      <p>Unganisha TBHOS na THOS (Tanzania Health Operating System) kwa kushiriki PHQ-9, GAD-7, na rufaa za afya ya akili kwenye historia ya mgonjwa.</p>
      <FieldRow label="THOS FHIR base URL" value={url} onChange={setUrl} />
      <FieldRow label="SMART client_id" value={client} onChange={setClient} placeholder="tibaroho-prod" />
      <FieldRow label="Scopes" value={scopes} onChange={setScopes} />
      <p style={{ fontSize: 12, color: TEXT.muted }}>
        Data inayoshirikiwa: tathmini za PHQ-9/GAD-7, rufaa za afya ya akili. Sio: rekodi ya journal, sauti za AI.
      </p>
    </Card>
  )
}

function NhifConfig(): React.JSX.Element {
  const [carrier, setCarrier] = useState('NHIF')
  const [endpoint, setEndpoint] = useState('https://api.nhif.go.tz/claims/v1')
  const [apiKey, setApiKey] = useState('')
  return (
    <Card title="NHIF + Bima — API">
      <p>Tuma claims za kifedha za vikao vya wahudumu wa kibinafsi. Mgonjwa habebwi gharama yoyote kwenye TBHOS.</p>
      <FieldRow label="Carrier" value={carrier} onChange={setCarrier} />
      <FieldRow label="Endpoint" value={endpoint} onChange={setEndpoint} />
      <FieldRow label="API key (siri)" value={apiKey} onChange={setApiKey} placeholder="sk_…" />
      <Table headers={['Bima', 'Inaunganishwa', 'Hali']}>
        {['NHIF', 'Jubilee', 'Strategis', 'AAR', 'Britam'].map((c) => (
          <tr key={c}><Td>{c}</Td><Td>{c === carrier ? 'Iko config' : 'Sio config'}</Td><Td>{c === carrier ? '✓' : '—'}</Td></tr>
        ))}
      </Table>
    </Card>
  )
}

function MpesaConfig(): React.JSX.Element {
  const [shortcode, setShortcode] = useState('')
  const [key, setKey] = useState('')
  const [secret, setSecret] = useState('')
  return (
    <Card title="M-Pesa Payout (kwa wahudumu pekee)">
      <p>Wahudumu wanaopata malipo kutoka bima au mwajiri hupokea kupitia M-Pesa Business. Mgonjwa hatumii M-Pesa kwa huduma yoyote TBHOS.</p>
      <FieldRow label="Business shortcode" value={shortcode} onChange={setShortcode} placeholder="174379" />
      <FieldRow label="Consumer key" value={key} onChange={setKey} />
      <FieldRow label="Consumer secret" value={secret} onChange={setSecret} />
    </Card>
  )
}

function MohLink(): React.JSX.Element {
  return (
    <Card title="MoH portal">
      <p>TBHOS hutumwa ripoti za jumla kwa Wizara ya Afya — bila utambulisho wa mgonjwa yeyote.</p>
      <ul>
        <li><a href="https://moh.go.tz" target="_blank" rel="noreferrer" style={{ color: TEXT.link }}>Wizara ya Afya</a></li>
        <li><a href="https://hmis.go.tz" target="_blank" rel="noreferrer" style={{ color: TEXT.link }}>HMIS</a></li>
        <li><a href="https://icd.who.int" target="_blank" rel="noreferrer" style={{ color: TEXT.link }}>ICD-11 (WHO)</a></li>
      </ul>
    </Card>
  )
}

function HotlineEditor(): React.JSX.Element {
  const [rows, setRows] = useState(HOTLINES_DEFAULT)
  return (
    <Card title="Mhariri wa simu za dharura">
      <Table headers={['Jina', 'Namba', 'Imethibitishwa']}>
        {rows.map((r, i) => (
          <tr key={i}>
            <Td><input value={r.name} onChange={(e) => setRows(rows.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} style={inputStyle} /></Td>
            <Td><input value={r.number} onChange={(e) => setRows(rows.map((x, j) => j === i ? { ...x, number: e.target.value } : x))} style={inputStyle} /></Td>
            <Td>{r.verified ? '✓' : '—'}</Td>
          </tr>
        ))}
      </Table>
    </Card>
  )
}

const inputStyle = {
  background: CREAM.milk, border: `1px solid rgba(11,9,8,0.22)`,
  borderRadius: 4, color: TEXT.body, padding: '4px 8px', fontSize: 13, width: '100%',
}

function Overview(): React.JSX.Element {
  return (
    <Card title="Mashirika — Mwongozo">
      <p>Hapa ndipo TBHOS hutangamana na mfumo wa afya na fedha wa Tanzania: THOS (interop), NHIF na bima, M-Pesa (kwa wahudumu), MoH portal, ICD-11 (WHO), na directory ya simu za dharura.</p>
    </Card>
  )
}

const SUBS: SubNav[] = [
  { to: '.', label: 'Mwongozo' },
  { to: 'thos', label: 'THOS' },
  { to: 'nhif', label: 'NHIF + Bima' },
  { to: 'mpesa', label: 'M-Pesa' },
  { to: 'moh', label: 'MoH + WHO' },
  { to: 'simu', label: 'Simu za dharura' },
]

export default function Mashirika(): React.JSX.Element {
  return (
    <ModuleShell slug="mashirika" subs={SUBS}>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="thos" element={<ThosBridge />} />
        <Route path="nhif" element={<NhifConfig />} />
        <Route path="mpesa" element={<MpesaConfig />} />
        <Route path="moh" element={<MohLink />} />
        <Route path="simu" element={<HotlineEditor />} />
      </Routes>
    </ModuleShell>
  )
}
