import type React from 'react'
import { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Card, ModuleShell, type SubNav } from '../_shared/Layout'
import { BRAND, NEUTRAL, RADII, TEXT, hexToRgba } from '../../lib/glass'
import Dashboard from './screens/Dashboard'
import CFIR from './screens/CFIR'
import REAIM from './screens/REAIM'
import CEA from './screens/CEA'
import Equity from './screens/Equity'
import Fidelity from './screens/Fidelity'
import IRB from './screens/IRB'
import Studies from './screens/Studies'
import Researchers from './screens/Researchers'
import ExportScreen from './screens/Export'
import PaperPipeline from './screens/PaperPipeline'

const ink = (a = 1) => hexToRgba(NEUTRAL.ink, a)
const APPROVAL_KEY = 'tumaini.utafiti.researcher.approved'

function ResearcherGate({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [approved, setApproved] = useState<boolean>(false)

  useEffect(() => {
    try { setApproved(localStorage.getItem(APPROVAL_KEY) === 'true') } catch {}
  }, [])

  const approve = (): void => {
    // TODO: replace with real MoU + IRB letter upload + Ndani team review.
    try { localStorage.setItem(APPROVAL_KEY, 'true') } catch {}
    setApproved(true)
  }

  if (approved) return <>{children}</>

  return (
    <Card title="Hitaji Idhini ya Utafiti" accent={BRAND.green}>
      <p style={{ margin: '0 0 14px', fontSize: 14, color: TEXT.body, lineHeight: 1.6 }}>
        Konsoli hii ni ya watafiti waliokubaliwa na MUHAS IRB + UAMS IRB pekee. Data zote ni de-identified na zinatii Data Protection Act (Tanzania, 2022).
      </p>
      <p style={{ margin: '0 0 14px', fontSize: 13, color: TEXT.muted, lineHeight: 1.6 }}>
        Ili kupata ufikiaji, mtafiti anatakiwa kuwasilisha: <strong style={{ color: TEXT.body }}>MoU</strong>, <strong style={{ color: TEXT.body }}>barua ya IRB</strong>, na <strong style={{ color: TEXT.body }}>itifaki ya utafiti</strong>. Maombi yanapitishwa na timu ya Ndani ndani ya siku 10 za kazi.
      </p>
      <button onClick={approve} style={{
        padding: '10px 18px', borderRadius: RADII.chip, background: BRAND.green,
        color: TEXT.onJewel, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
      }}>Omba kama mtafiti (demo)</button>
      <div style={{ marginTop: 10, fontSize: 11, color: TEXT.muted }}>
        Demo: kubonyeza kunaweka flag ya local approval. Production itahitaji upakuaji wa nyaraka + ukaguzi wa Ndani.
      </div>
    </Card>
  )
}

const SUBS: SubNav[] = [
  { to: '', label: 'Dashibodi' },
  { to: 'cfir', label: 'CFIR' },
  { to: 'reaim', label: 'RE-AIM' },
  { to: 'cea', label: 'CEA' },
  { to: 'equity', label: 'Equity' },
  { to: 'fidelity', label: 'Fidelity' },
  { to: 'irb', label: 'IRB' },
  { to: 'studies', label: 'Studies' },
  { to: 'watafiti', label: 'Watafiti' },
  { to: 'hamishia', label: 'Hamishia' },
  { to: 'karatasi', label: 'Karatasi' },
]

export default function Utafiti(): React.JSX.Element {
  return (
    <ModuleShell slug="utafiti" subs={SUBS}>
      <ResearcherGate>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="cfir" element={<CFIR />} />
          <Route path="reaim" element={<REAIM />} />
          <Route path="cea" element={<CEA />} />
          <Route path="equity" element={<Equity />} />
          <Route path="fidelity" element={<Fidelity />} />
          <Route path="irb" element={<IRB />} />
          <Route path="studies" element={<Studies />} />
          <Route path="watafiti" element={<Researchers />} />
          <Route path="hamishia" element={<ExportScreen />} />
          <Route path="karatasi" element={<PaperPipeline />} />
        </Routes>
      </ResearcherGate>
    </ModuleShell>
  )
}
