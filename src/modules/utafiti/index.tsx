import type React from 'react'
import { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Card, ModuleShell, type SubNav } from '../_shared/Layout'
import { BRAND, NEUTRAL, RADII, TEXT, hexToRgba } from '../../lib/glass'
import { getMeRole } from '../../lib/me'
import { useLang } from '../../lib/i18n/Provider'
import { auditEvent } from '../ndani/audit'
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
  const { t } = useLang()
  const [approved, setApproved] = useState<boolean>(false)

  useEffect(() => {
    // First-paint from cached approval flag.
    try { setApproved(localStorage.getItem(APPROVAL_KEY) === 'true') } catch { /* ignore */ }
    // Live check: if the signed-in user is a researcher or admin, auto-approve.
    let mounted = true
    void getMeRole().then((r) => {
      if (!mounted) return
      if (r === 'researcher' || r === 'admin') {
        try { localStorage.setItem(APPROVAL_KEY, 'true') } catch { /* ignore */ }
        setApproved(true)
        void auditEvent('utafiti.gate.auto_approve', 'utafiti', undefined, { role: r })
      }
    }).catch(() => undefined)
    return () => { mounted = false }
  }, [])

  const approve = (): void => {
    try { localStorage.setItem(APPROVAL_KEY, 'true') } catch { /* ignore */ }
    setApproved(true)
    void auditEvent('utafiti.gate.manual_approve', 'utafiti')
  }

  if (approved) return <>{children}</>

  return (
    <Card title={t('utafiti.gate.title', 'Hitaji Idhini ya Utafiti')} accent={BRAND.green}>
      <p style={{ margin: '0 0 14px', fontSize: 14, color: TEXT.body, lineHeight: 1.6 }}>
        {t('utafiti.gate.body1', 'Konsoli hii ni ya watafiti waliokubaliwa na MUHAS IRB + UAMS IRB pekee. Data zote ni de-identified na zinatii Data Protection Act (Tanzania, 2022).')}
      </p>
      <p style={{ margin: '0 0 14px', fontSize: 13, color: TEXT.muted, lineHeight: 1.6 }}>
        {t('utafiti.gate.body2', 'Ili kupata ufikiaji, mtafiti anatakiwa kuwasilisha MoU, barua ya IRB, na itifaki ya utafiti. Maombi yanapitishwa na timu ya Ndani ndani ya siku 10 za kazi.')}
      </p>
      <button onClick={approve} style={{
        padding: '10px 18px', borderRadius: RADII.chip, background: BRAND.green,
        color: TEXT.onJewel, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
      }}>{t('utafiti.gate.cta', 'Omba kama mtafiti (demo)')}</button>
      <div style={{ marginTop: 10, fontSize: 11, color: TEXT.muted }}>
        {t('utafiti.gate.demo_note', 'Demo: kubonyeza kunaweka flag ya local approval. Production itahitaji upakuaji wa nyaraka + ukaguzi wa Ndani.')}
      </div>
    </Card>
  )
}

export default function Utafiti(): React.JSX.Element {
  const { t } = useLang()
  const SUBS: SubNav[] = [
    { to: '', label: t('utafiti.nav.dashboard', 'Dashibodi') },
    { to: 'cfir', label: t('utafiti.nav.cfir', 'CFIR') },
    { to: 'reaim', label: t('utafiti.nav.reaim', 'RE-AIM') },
    { to: 'cea', label: t('utafiti.nav.cea', 'CEA') },
    { to: 'equity', label: t('utafiti.nav.equity', 'Equity') },
    { to: 'fidelity', label: t('utafiti.nav.fidelity', 'Fidelity') },
    { to: 'irb', label: t('utafiti.nav.irb', 'IRB') },
    { to: 'studies', label: t('utafiti.nav.studies', 'Studies') },
    { to: 'watafiti', label: t('utafiti.nav.researchers', 'Watafiti') },
    { to: 'hamishia', label: t('utafiti.nav.export', 'Hamishia') },
    { to: 'karatasi', label: t('utafiti.nav.papers', 'Karatasi') },
  ]
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
