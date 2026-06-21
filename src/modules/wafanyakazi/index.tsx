import type React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Card, ModuleShell, Table, Td, type SubNav } from '../_shared/Layout'
import { JEWEL, TEXT, hexToRgba, RADII } from '../../lib/glass'

const HR_AGG = {
  seats: 320, active_30d: 184, utilization_pct: 58,
  nps: 47, top_programs: ['PM+', 't-CBT', 'MBSR-Lite'],
  by_modality: { virtual: 71, in_person: 18, hybrid: 11 },
}

const MGR_MODULES = [
  { id: 'm1', name: 'Kutambua dalili za dhiki kazini', mins: 20 },
  { id: 'm2', name: 'Mazungumzo magumu — namna ya kuanza', mins: 25 },
  { id: 'm3', name: 'Kuongoza timu inayopona', mins: 30 },
  { id: 'm4', name: 'Mipaka — kazi vs maisha binafsi', mins: 15 },
  { id: 'm5', name: 'Kupunguza unyanyapaa wa afya ya akili', mins: 20 },
]

function Stat({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div style={{ padding: 16, borderRadius: RADII.card, background: hexToRgba(JEWEL.indigoWisdom, 0.18) }}>
      <div style={{ fontSize: 26, fontFamily: "'Tinos', serif", color: TEXT.heading }}>{value}</div>
      <div style={{ fontSize: 12, color: TEXT.muted, marginTop: 4 }}>{label}</div>
    </div>
  )
}

function Overview(): React.JSX.Element {
  return (
    <Card title="EAP ya TBHOS">
      <p>
        Kampuni hulipia usajili; mfanyakazi anapata huduma bila malipo na bila
        kufichuliwa. Kampuni haoni data binafsi — inaona vipimo vya jumla pekee
        (utilization, NPS, mada kuu). Hii ndiyo inayofanya watu kweli watumie.
      </p>
    </Card>
  )
}

function EmpAccess(): React.JSX.Element {
  return (
    <Card title="Kifaa cha mfanyakazi">
      <p>Mfanyakazi anaingia kwa kutumia barua-pepe ya kampuni au msimbo wa kampuni — bila jina la mfanyakazi kuingia kwenye log ya HR.</p>
      <ul>
        <li>Tathmini binafsi (PHQ-9, GAD-7, AUDIT)</li>
        <li>Vikao na mhudumu wa siri (virtual au ana kwa ana)</li>
        <li>Mipango: PM+, t-CBT, MI, MBSR-Lite</li>
        <li>Mwenza — mwenza wa AI wa Kiswahili</li>
        <li>Hakuna data binafsi inayoonyeshwa kwa kampuni</li>
      </ul>
    </Card>
  )
}

function HrDash(): React.JSX.Element {
  return (
    <>
      <Card title="Dashboard ya HR (jumla pekee)">
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
          <Stat label="Viti vya usajili" value={HR_AGG.seats.toString()} />
          <Stat label="Wanaotumia (siku 30)" value={HR_AGG.active_30d.toString()} />
          <Stat label="Utilization" value={`${HR_AGG.utilization_pct}%`} />
          <Stat label="NPS" value={`+${HR_AGG.nps}`} />
        </div>
      </Card>
      <Card title="Mipango maarufu">
        <ol>{HR_AGG.top_programs.map((p) => <li key={p}>{p}</li>)}</ol>
      </Card>
      <Card title="Modaliti">
        <p>Virtual: {HR_AGG.by_modality.virtual}% · Ana kwa ana: {HR_AGG.by_modality.in_person}% · Mchanganyiko: {HR_AGG.by_modality.hybrid}%</p>
      </Card>
      <Card title="Faragha">
        <p>HR haioni jina, idara, au yoyote ya mfanyakazi binafsi. Mwajiri akiomba data ya mtu binafsi, ombi linakataliwa kiotomatiki.</p>
      </Card>
    </>
  )
}

function Programs(): React.JSX.Element {
  return (
    <Card title="Mipango inayopatikana kwa mfanyakazi">
      <ul>
        <li>PM+ Kiswahili (vikao 5)</li>
        <li>t-CBT (vikao 8)</li>
        <li>MI — substance brief (vikao 4)</li>
        <li>MBSR-Lite (wiki 6)</li>
        <li>PST — kutatua matatizo (vikao 6)</li>
      </ul>
    </Card>
  )
}

function ManagerTraining(): React.JSX.Element {
  return (
    <Card title="Mafunzo ya wasimamizi">
      <Table headers={['Moduli', 'Muda', 'Hali']}>
        {MGR_MODULES.map((m) => (
          <tr key={m.id}>
            <Td>{m.name}</Td>
            <Td>{m.mins} dakika</Td>
            <Td><span style={{ padding: '2px 8px', borderRadius: 999, background: JEWEL.tealRoho, color: TEXT.onJewel, fontSize: 11 }}>Inapatikana</span></Td>
          </tr>
        ))}
      </Table>
    </Card>
  )
}

const SUBS: SubNav[] = [
  { to: '.', label: 'Mwongozo' },
  { to: 'mfanyakazi', label: 'Mfanyakazi' },
  { to: 'hr', label: 'HR Dashboard' },
  { to: 'mipango', label: 'Mipango' },
  { to: 'wasimamizi', label: 'Wasimamizi' },
]

export default function Wafanyakazi(): React.JSX.Element {
  return (
    <ModuleShell slug="wafanyakazi" subs={SUBS}>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="mfanyakazi" element={<EmpAccess />} />
        <Route path="hr" element={<HrDash />} />
        <Route path="mipango" element={<Programs />} />
        <Route path="wasimamizi" element={<ManagerTraining />} />
      </Routes>
    </ModuleShell>
  )
}
