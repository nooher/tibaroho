import { Routes, Route } from 'react-router-dom'
import Home from './screens/Home'
import ScreenPage from './screens/Screen'
import CarePlanPage from './screens/CarePlan'
import JournalPage from './screens/Journal'
import CalendarPage from './screens/Calendar'
import CirclePage from './screens/Circle'
import DocsPage from './screens/Docs'
import EmergencyPage from './screens/Emergency'

import LabsHub from './labs'
import LabsUpload from './labs/Upload'
import LabsResult from './labs/Result'
import SmartwatchConnect from './smartwatch/Connect'
import Notifications from './Notifications'
import MimiMessages from './messages'
import MimiBook from './scheduling/Book'
import MyCalendar from './scheduling/MyCalendar'

/**
 * MIMI — patient-facing module of TBHOS.
 * Sub-routes are mounted under /mimi/* by the app shell.
 */
export default function Mimi() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="vipimo" element={<ScreenPage />} />
      <Route path="vipimo/:id" element={<ScreenPage />} />
      <Route path="mpango" element={<CarePlanPage />} />
      <Route path="shajara" element={<JournalPage />} />
      <Route path="kalenda" element={<CalendarPage />} />
      <Route path="familia" element={<CirclePage />} />
      <Route path="hifadhi" element={<DocsPage />} />
      <Route path="dharura" element={<EmergencyPage />} />

      <Route path="vipimo-vya-maabara" element={<LabsHub />} />
      <Route path="vipimo-vya-maabara/pakia" element={<LabsUpload />} />
      <Route path="vipimo-vya-maabara/matokeo/:id" element={<LabsResult />} />
      <Route path="saa-mahiri" element={<SmartwatchConnect />} />
      <Route path="arifa" element={<Notifications />} />
      <Route path="mazungumzo" element={<MimiMessages />} />
      <Route path="ratiba" element={<MyCalendar />} />
      <Route path="ratiba/weka" element={<MimiBook />} />
    </Routes>
  )
}
