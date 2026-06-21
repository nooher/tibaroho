import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { TanzaniaFlagBar } from './components/TanzaniaFlagBar'
import { TopNav } from './components/TopNav'
import { RafikiBrain } from './components/RafikiBrain'
import { AndikaFAB } from './components/AndikaFAB'
import { CommandPalette } from './components/CommandPalette'
import { PersonaBanner } from './components/PersonaBanner'
import ToastHost from './components/ToastHost'
import { JEWEL } from './lib/glass'
import { SIGNATURE } from './lib/_signature'

/** Routes where global chrome is hidden — the product entrance feels like
 * a product, not a website. Nav appears only after you sign in. */
const CHROMELESS_PATHS = new Set(['/', '/chagua-akaunti'])

const WelcomeHome  = lazy(() => import('./modules/WelcomeHome'))
const Landing      = lazy(() => import('./modules/Landing'))
const Karibu       = lazy(() => import('./modules/karibu'))
const Trackers     = lazy(() => import('./modules/Mimi/trackers'))
const Mimi         = lazy(() => import('./modules/Mimi'))
const Rafiki       = lazy(() => import('./modules/rafiki'))
const Wataalam     = lazy(() => import('./modules/wataalam'))
const Gundua       = lazy(() => import('./modules/Gundua'))
const Huduma       = lazy(() => import('./modules/huduma'))
const Miradi       = lazy(() => import('./modules/miradi'))
const Maalum       = lazy(() => import('./modules/maalum'))
const ShulePlus    = lazy(() => import('./modules/shuleplus'))
const Wafanyakazi  = lazy(() => import('./modules/wafanyakazi'))
const Mashirika    = lazy(() => import('./modules/mashirika'))
const Utafiti      = lazy(() => import('./modules/utafiti'))
const Ndani        = lazy(() => import('./modules/ndani'))
const Sera         = lazy(() => import('./modules/sera'))
const Pumzi        = lazy(() => import('./modules/pumzi'))
const Welcome      = lazy(() => import('./modules/welcome'))
const Personas     = lazy(() => import('./modules/personas'))
const Press        = lazy(() => import('./modules/welcome/screens/Press'))
const Investor     = lazy(() => import('./modules/welcome/screens/Investor'))
const NotFound     = lazy(() => import('./modules/NotFound'))

function PageFallback() {
  return (
    <div
      style={{
        minHeight: '50vh',
        display: 'grid',
        placeItems: 'center',
        color: JEWEL.tealMwenza,
        fontFamily: "'Georgia', serif",
        fontStyle: 'normal',
        opacity: 0.7,
      }}
    >
      Inapakia…
    </div>
  )
}

function KaribuGate() {
  const nav = useNavigate()
  const loc = useLocation()
  useEffect(() => {
    try {
      const done = localStorage.getItem('tumaini.karibu.v1.complete') === 'true'
      const publicPaths = ['/', '/karibu', '/welcome', '/chagua-akaunti', '/press', '/investor', '/dashibodi']
      if (!done && !publicPaths.includes(loc.pathname)) {
        nav('/karibu', { replace: true })
      }
    } catch {
      /* noop */
    }
  }, [loc.pathname, nav])
  return null
}

export default function App() {
  const loc = useLocation()
  const chromeless = CHROMELESS_PATHS.has(loc.pathname)
  return (
    <>
      {!chromeless && <TanzaniaFlagBar position="top" />}

      <div style={{ minHeight: '100vh', paddingTop: chromeless ? 0 : 6, paddingBottom: chromeless ? 0 : 6 }}>
        {!chromeless && <TopNav />}
        {!chromeless && <PersonaBanner />}
        <KaribuGate />
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<WelcomeHome />} />
            <Route path="/dashibodi" element={<Landing />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/chagua-akaunti" element={<WelcomeHome />} />
            <Route path="/press" element={<Press />} />
            <Route path="/investor" element={<Investor />} />
            <Route path="/karibu" element={<Karibu />} />
            <Route path="/mimi/trackers" element={<Trackers />} />
            <Route path="/mimi/*" element={<Mimi />} />
            <Route path="/rafiki/*" element={<Rafiki />} />
            <Route path="/wataalam/*" element={<Wataalam />} />
            <Route path="/gundua/*" element={<Gundua />} />
            <Route path="/huduma/*" element={<Huduma />} />
            <Route path="/miradi/*" element={<Miradi />} />
            <Route path="/maalum/*" element={<Maalum />} />
            <Route path="/shuleplus/*" element={<ShulePlus />} />
            <Route path="/wafanyakazi/*" element={<Wafanyakazi />} />
            <Route path="/mashirika/*" element={<Mashirika />} />
            <Route path="/utafiti/*" element={<Utafiti />} />
            <Route path="/ndani/*" element={<Ndani />} />
            <Route path="/sera/*" element={<Sera />} />
            <Route path="/pumzi/*" element={<Pumzi />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>

      {!chromeless && <RafikiBrain />}
      {!chromeless && <AndikaFAB />}
      <CommandPalette />
      <ToastHost />
      {!chromeless && <TanzaniaFlagBar position="bottom" />}

      {/* Hidden authorship watermark — DOM-only, code-side signature.
          Renders nothing visible; aria-hidden + off-screen. */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          left: -9999,
          top: -9999,
          width: 1,
          height: 1,
          overflow: 'hidden',
        }}
        data-author={SIGNATURE.author}
        data-imprint={SIGNATURE.imprint}
        data-watermark={SIGNATURE.watermark}
      />
    </>
  )
}
