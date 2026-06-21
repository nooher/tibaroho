import { Routes, Route, Navigate } from 'react-router-dom'
import WorkspaceShell from './components/WorkspaceShell'
import Dashboard from './screens/Dashboard'
import Onboarding from './screens/Onboarding'
import Schedule from './screens/Schedule'
import Telehealth from './screens/Telehealth'
import Intake from './screens/Intake'
import CarePlanTemplates from './screens/CarePlanTemplates'
import Coding from './screens/Coding'
import Claims from './screens/Claims'
import Notes from './screens/Notes'
import Outcomes from './screens/Outcomes'
import Supervision from './screens/Supervision'
import Referrals from './screens/Referrals'
import Profile from './screens/Profile'
import Education from './screens/Education'
import JitsiSession from './telehealth/JitsiSession'
import ProviderAvailability from './scheduling'
import ProviderMessages from './messages'
import ReferralsSend from './referrals/Send'
import ReferralsInbox from './referrals/Inbox'

/**
 * Wataalam — provider workspace. Mounted at /wataalam/* by App.tsx.
 *
 * `/wataalam/karibu` is the onboarding wizard (no shell — full-bleed
 * focus). Everything else lives inside the persistent WorkspaceShell.
 */
export default function Wataalam() {
  return (
    <Routes>
      <Route path="karibu" element={<Onboarding />} />
      <Route element={<WorkspaceShell />}>
        <Route index element={<Dashboard />} />
        <Route path="ratiba" element={<Schedule />} />
        <Route path="video" element={<Telehealth />} />
        <Route path="video/:roomId" element={<JitsiSession />} />
        <Route path="upatikanaji" element={<ProviderAvailability />} />
        <Route path="ujumbe" element={<ProviderMessages />} />
        <Route path="rufaa-tuma" element={<ReferralsSend />} />
        <Route path="rufaa-pokea" element={<ReferralsInbox />} />
        <Route path="intake" element={<Intake />} />
        <Route path="mipango" element={<CarePlanTemplates />} />
        <Route path="kodi" element={<Coding />} />
        <Route path="madai" element={<Claims />} />
        <Route path="kumbukumbu" element={<Notes />} />
        <Route path="matokeo" element={<Outcomes />} />
        <Route path="usimamizi" element={<Supervision />} />
        <Route path="rufaa" element={<Referrals />} />
        <Route path="wasifu" element={<Profile />} />
        <Route path="elimu" element={<Education />} />
      </Route>
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  )
}
