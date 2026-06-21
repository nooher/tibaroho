import { useNavigate } from 'react-router-dom'
import { BRAND, CREAM, NEUTRAL, RADII, TEXT, TYPE, hexToRgba, glass } from '../../lib/glass'
import { PERSONAS, setPersona, type Persona } from '../../lib/personas'

/**
 * /chagua-akaunti — CargoLink-style persona selector.
 *
 * 9 cards in a responsive grid. Click → setPersona() → navigate to the
 * persona's startRoute. Cold-start persona routes to /karibu wizard.
 */
export default function Personas() {
  const nav = useNavigate()

  function choose(p: Persona) {
    const result = setPersona(p.id)
    if (result) nav(result.startRoute)
  }

  return (
    <main
      className="fade-in"
      style={{
        paddingTop: 48,
        paddingBottom: 120,
        background: CREAM.milk,
        minHeight: '100vh',
      }}
    >
      <section className="container" style={{ maxWidth: 1080 }}>
        <header style={{ textAlign: 'center', marginBottom: 40 }}>
          <div
            style={{
              display: 'inline-block',
              padding: '6px 14px',
              borderRadius: 999,
              background: CREAM.ivory,
              color: BRAND.green,
              fontSize: 12,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              fontWeight: 700,
              border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.12)}`,
              marginBottom: 18,
            }}
          >
            Demo &middot; Chagua akaunti
          </div>
          <h1
            style={{
              fontFamily: TYPE.serif,
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: 800,
              color: BRAND.creamOrange,
              letterSpacing: TYPE.tighterTrack,
              margin: 0,
              lineHeight: TYPE.headLeading,
            }}
          >
            Karibu kwenye Tumaini
          </h1>
          <p
            style={{
              maxWidth: 640,
              margin: '14px auto 0',
              fontSize: 16,
              lineHeight: TYPE.bodyLeading,
              color: TEXT.muted,
            }}
          >
            Chagua persona ya demo ili kuona Tumaini kupitia macho ya mtumiaji
            halisi &mdash; mgonjwa, daktari, mshauri, mwajiri, au wizara.
          </p>
        </header>

        <div
          role="list"
          aria-label="Personas tisa za demo"
          style={{
            display: 'grid',
            gap: 18,
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          }}
        >
          {PERSONAS.map((p) => (
            <article
              key={p.id}
              role="listitem"
              style={{
                ...glass(p.accent, 0.1),
                padding: '22px 20px',
                borderRadius: RADII.sheet,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span
                  aria-hidden
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 999,
                    background: p.accent,
                    color: CREAM.milk,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: TYPE.serif,
                    fontWeight: 800,
                    fontSize: 16,
                    letterSpacing: '0.02em',
                  }}
                >
                  {p.initials}
                </span>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <strong
                    style={{
                      fontFamily: TYPE.serif,
                      fontSize: 17,
                      color: NEUTRAL.ink,
                      letterSpacing: TYPE.tightTrack,
                    }}
                  >
                    {p.name}
                  </strong>
                  <span
                    style={{
                      fontSize: 12,
                      color: TEXT.muted,
                      fontWeight: 600,
                    }}
                  >
                    {p.role}
                  </span>
                </div>
              </div>

              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: TEXT.body,
                  flex: 1,
                }}
              >
                {p.description}
              </p>

              <button
                type="button"
                onClick={() => choose(p)}
                aria-label={`Karibu kama ${p.name} (${p.english})`}
                style={{
                  marginTop: 4,
                  background: p.accent,
                  color: CREAM.milk,
                  border: 'none',
                  borderRadius: 999,
                  padding: '10px 16px',
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                  cursor: 'pointer',
                  transition: 'transform 160ms cubic-bezier(.25,.46,.45,.94)',
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                Karibu kama {p.name.split(' ')[0]}
              </button>
            </article>
          ))}
        </div>

        <p
          style={{
            textAlign: 'center',
            marginTop: 32,
            fontSize: 12,
            color: TEXT.hint,
          }}
        >
          Personas zote ni demo. Data zote ni mfano &mdash; hakuna jina la
          mgonjwa halisi.
        </p>
      </section>
    </main>
  )
}
