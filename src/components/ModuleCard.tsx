import { Link } from 'react-router-dom'
import type { CSSProperties } from 'react'
import { BRAND, CREAM, NEUTRAL, RADII, TEXT, TYPE, hexToRgba } from '../lib/glass'
import type { ModuleDef } from '../lib/modules'

export function ModuleCard({ module }: { module: ModuleDef }) {
  // Yellow accent needs ink glyph for contrast; others sit on dark+cream.
  const glyphInk = module.accent === BRAND.yellow ? NEUTRAL.ink : TEXT.onJewel

  const card: CSSProperties = {
    position: 'relative',
    padding: '24px 22px 20px',
    borderRadius: RADII.sheet,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    minHeight: 200,
    background: CREAM.ivory,
    border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.10)}`,
    boxShadow: '0 1px 0 rgba(11,9,8,0.04), 0 10px 28px rgba(11,9,8,0.06)',
    overflow: 'hidden',
    transition: 'transform 220ms cubic-bezier(.25,.46,.45,.94), box-shadow 220ms',
  }

  return (
    <Link
      to={`/${module.slug}`}
      aria-label={`Fungua ${module.name} — ${module.english}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
      onMouseEnter={(e) => {
        const el = e.currentTarget.firstElementChild as HTMLElement | null
        if (el) {
          el.style.transform = 'translateY(-2px)'
          el.style.boxShadow = `0 1px 0 rgba(11,9,8,0.04), 0 18px 36px rgba(11,9,8,0.10), 0 0 0 1px ${hexToRgba(module.accent, 0.35)}`
        }
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget.firstElementChild as HTMLElement | null
        if (el) {
          el.style.transform = 'translateY(0)'
          el.style.boxShadow = '0 1px 0 rgba(11,9,8,0.04), 0 10px 28px rgba(11,9,8,0.06)'
        }
      }}
    >
      <div style={card}>
        {/* Accent stripe */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: module.accent,
          }}
        />

        {/* Glyph disc */}
        <div
          aria-hidden
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: module.accent,
            display: 'grid',
            placeItems: 'center',
            color: glyphInk,
            fontFamily: TYPE.serif,
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: '-0.5px',
          }}
        >
          {module.glyph}
        </div>

        <div>
          <h3
            style={{
              margin: 0,
              fontFamily: TYPE.serif,
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: '-0.4px',
              color: TEXT.heading,
              lineHeight: 1.15,
            }}
          >
            {module.name}
          </h3>
          <div
            style={{
              marginTop: 4,
              fontSize: 11,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              color: TEXT.muted,
              fontWeight: 700,
            }}
          >
            {module.english}
          </div>
        </div>

        <p
          style={{
            margin: 0,
            fontSize: 13.5,
            lineHeight: 1.55,
            color: TEXT.body,
            flex: 1,
          }}
        >
          {module.description}
        </p>

        <div
          style={{
            marginTop: 4,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            fontWeight: 700,
            color: module.accent === BRAND.yellow ? BRAND.green : module.accent,
            letterSpacing: '0.01em',
          }}
        >
          Fungua <span aria-hidden>→</span>
        </div>
      </div>
    </Link>
  )
}

export default ModuleCard
