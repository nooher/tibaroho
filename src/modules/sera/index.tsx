import type React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ModuleShell, type SubNav } from '../_shared/Layout'
import SeraDashboard from './screens/Dashboard'
import SeraRegions from './screens/Regions'
import SeraFramework from './screens/Framework'
import SeraReports from './screens/Reports'
import SeraParliament from './screens/Parliament'

const SUBS: SubNav[] = [
  { to: '', label: 'Dashibodi' },
  { to: 'mikoa', label: 'Mikoa' },
  { to: 'mfumo', label: 'Mfumo wa Kitaifa' },
  { to: 'ripoti', label: 'Ripoti' },
  { to: 'bunge', label: 'Bunge' },
]

export default function SeraRouter(): React.JSX.Element {
  return (
    <ModuleShell slug="sera" subs={SUBS}>
      <Routes>
        <Route path="/" element={<SeraDashboard />} />
        <Route path="mikoa" element={<SeraRegions />} />
        <Route path="mfumo" element={<SeraFramework />} />
        <Route path="ripoti" element={<SeraReports />} />
        <Route path="bunge" element={<SeraParliament />} />
      </Routes>
    </ModuleShell>
  )
}
