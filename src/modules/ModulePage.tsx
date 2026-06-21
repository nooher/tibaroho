import { Link } from 'react-router-dom'
import { JEWEL, hexToRgba, RADII } from '../lib/glass'
import type { ModuleDef } from '../lib/modules'

/**
 * Shared stub layout used by all 12 module pages until the
 * respective module agents implement their full content.
 */
export default function ModulePage({ module }: { module: ModuleDef }) {
  return (
    <main className="fade-in" style={{ paddingTop: 40, paddingBottom: 120 }}>
      <section className="container" style={{ padding: '32px 24px 24px' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 13,
            color: 'rgba(244,234,201,0.7)',
            textDecoration: 'none',
            marginBottom: 24,
          }}
        >
          <span aria-hidden>←</span> Rudi nyumbani
        </Link>

        <div
          style={{
            display: 'inline-block',
            padding: '6px 14px',
            borderRadius: 999,
            background: hexToRgba(module.accent, 0.22),
            color: JEWEL.cream,
            fontSize: 12,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            fontWeight: 700,
            border: `1px solid ${hexToRgba(module.accent, 0.55)}`,
            marginBottom: 18,
          }}
        >
          {module.english}
        </div>

        <h1
          style={{
            margin: 0,
            fontFamily: "'Tinos', Georgia, serif",
            fontSize: 'clamp(40px, 6vw, 68px)',
            letterSpacing: '-0.6px',
            color: JEWEL.cream,
            lineHeight: 1.04,
          }}
        >
          {module.name}
        </h1>
        <p
          style={{
            marginTop: 12,
            fontFamily: "'Tinos', Georgia, serif",
            fontSize: 'clamp(18px, 2vw, 22px)',
            color: hexToRgba(JEWEL.goldSoft, 0.95),
          }}
        >
          {module.tagline}
        </p>
        <p
          style={{
            marginTop: 16,
            maxWidth: 680,
            fontSize: 'clamp(15px, 1.4vw, 17px)',
            lineHeight: 1.6,
            color: 'rgba(244,234,201,0.82)',
          }}
        >
          {module.description}
        </p>
      </section>

      <section
        className="container"
        aria-label={`Vipengele vya ${module.name}`}
        style={{ marginTop: 36 }}
      >
        <h2
          style={{
            margin: '0 0 18px',
            fontFamily: "'Tinos', Georgia, serif",
            fontSize: 22,
            letterSpacing: '-0.3px',
            color: JEWEL.cream,
          }}
        >
          Vipengele vya msingi
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 14,
          }}
        >
          {module.features.map((f, i) => (
            <div
              key={i}
              style={{
                padding: '18px 18px 16px',
                borderRadius: RADII.card,
                background: hexToRgba(module.accent, 0.16),
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <span
                style={{
                  alignSelf: 'flex-start',
                  fontSize: 10,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: JEWEL.goldSoft,
                  padding: '3px 8px',
                  borderRadius: 999,
                  border: `1px solid ${hexToRgba(JEWEL.goldSoft, 0.4)}`,
                  fontWeight: 700,
                }}
              >
                Hai
              </span>
              <div
                style={{
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: JEWEL.cream,
                }}
              >
                {f}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
