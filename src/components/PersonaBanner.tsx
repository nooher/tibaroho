import { useLocation } from 'react-router-dom'
import { BRAND, CREAM, NEUTRAL, TEXT, hexToRgba } from '../lib/glass'
import { clearPersona, usePersona } from '../lib/personas'

/**
 * Slim demo-mode banner — sits between the flag bar and the app content.
 * Hidden on /welcome and /chagua-akaunti so marketing surfaces stay clean.
 */
export function PersonaBanner() {
  const persona = usePersona()
  const loc = useLocation()

  if (!persona) return null
  if (loc.pathname === '/welcome' || loc.pathname === '/chagua-akaunti') {
    return null
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Demo mode — Karibu kama ${persona.name}`}
      style={{
        position: 'sticky',
        top: 64,
        zIndex: 750,
        background: hexToRgba(BRAND.creamOrange, 0.14),
        borderBottom: `1px solid ${hexToRgba(NEUTRAL.ink, 0.1)}`,
        padding: '6px 0',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontSize: 12,
          fontWeight: 600,
          color: NEUTRAL.ink,
        }}
      >
        <span
          aria-hidden
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 22,
            height: 22,
            borderRadius: 999,
            background: persona.accent,
            color: CREAM.milk,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.02em',
          }}
        >
          {persona.initials}
        </span>
        <span>
          Demo mode &middot; Karibu kama{' '}
          <strong style={{ color: BRAND.green }}>{persona.name}</strong>
          <span
            style={{
              color: TEXT.hint,
              marginLeft: 8,
              fontWeight: 500,
            }}
          >
            ({persona.role})
          </span>
        </span>
        <div style={{ flex: 1 }} />
        <button
          type="button"
          onClick={() => clearPersona()}
          aria-label="Toka kwenye demo mode"
          style={{
            background: 'transparent',
            border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.25)}`,
            color: NEUTRAL.ink,
            padding: '4px 12px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Toka
        </button>
      </div>
    </div>
  )
}

export default PersonaBanner
