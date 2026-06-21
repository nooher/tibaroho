import { lazy, Suspense } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { CREAM, JEWEL, NEUTRAL, TEXT, hexToRgba, glass } from '../../lib/glass'
import { PUMZI_SESSIONS } from './data/sessions'
import { ArchitectureBadge } from '../../components/ArchitectureBadge'

const Player = lazy(() => import('./screens/Player'))

function Landing() {
  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 48 }}>
      <header style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: 40,
            lineHeight: 1.05,
            color: JEWEL.tealDeep,
            margin: 0,
            letterSpacing: '-0.6px',
            fontWeight: 800,
            fontStyle: 'normal',
          }}
        >
          Pumzi
        </h1>
        <p
          style={{
            marginTop: 6,
            fontSize: 16,
            color: TEXT.muted,
            fontStyle: 'normal',
          }}
        >
          Pumzi yako, utulivu wako. Mafunzo manane yaliyothibitishwa kisayansi.
        </p>
        <div style={{ marginTop: 12 }}>
          <ArchitectureBadge moduleSlug="pumzi" />
        </div>
      </header>

      <div
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        }}
      >
        {PUMZI_SESSIONS.map((s) => {
          const summary = s.pattern.seconds.join('-')
          return (
            <Link
              key={s.id}
              to={`/pumzi/${s.id}`}
              style={{
                ...glass(JEWEL.tealMwenza, 0.04),
                padding: 18,
                textDecoration: 'none',
                color: NEUTRAL.ink,
                display: 'block',
                fontStyle: 'normal',
              }}
            >
              <div
                style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: JEWEL.tealDeep,
                  letterSpacing: '-0.3px',
                  fontStyle: 'normal',
                }}
              >
                {s.name_sw}
              </div>
              <div
                style={{
                  marginTop: 4,
                  fontSize: 12,
                  color: TEXT.hint,
                  fontStyle: 'normal',
                }}
              >
                {s.name_en}
              </div>
              <div
                style={{
                  marginTop: 12,
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                  fontSize: 13,
                  color: NEUTRAL.ink,
                  fontStyle: 'normal',
                }}
              >
                <span
                  style={{
                    padding: '3px 10px',
                    borderRadius: 999,
                    background: CREAM.cream,
                    border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.12)}`,
                    fontWeight: 700,
                    fontStyle: 'normal',
                  }}
                >
                  {summary}
                </span>
                <span style={{ color: TEXT.hint }}>
                  {Math.round(s.duration_s / 60) || 1} dakika · mizunguko {s.pattern.rounds}
                </span>
              </div>
              <div
                style={{
                  marginTop: 14,
                  fontSize: 12,
                  color: TEXT.hint,
                  borderTop: `1px solid ${hexToRgba(NEUTRAL.ink, 0.06)}`,
                  paddingTop: 10,
                  fontStyle: 'normal',
                }}
              >
                {s.evidence_citation}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default function Pumzi() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '40vh',
            display: 'grid',
            placeItems: 'center',
            color: JEWEL.tealMwenza,
            fontStyle: 'normal',
          }}
        >
          Inapakia…
        </div>
      }
    >
      <Routes>
        <Route index element={<Landing />} />
        <Route path=":id" element={<Player />} />
      </Routes>
    </Suspense>
  )
}
