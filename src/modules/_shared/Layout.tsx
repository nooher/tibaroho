import type React from 'react'
import type { ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { BRAND, CREAM, NEUTRAL, RADII, TEXT, TYPE, hexToRgba } from '../../lib/glass'
import { MODULES } from '../../lib/modules'
import { ArchitectureBadge } from '../../components/ArchitectureBadge'

/**
 * Shared chrome for fully-implemented modules — cream surfaces, solid TEXT
 * tokens, accent-tinted chip + stripe carrying the module identity.
 */
export interface SubNav { to: string; label: string }

export function ModuleShell({
  slug,
  subs,
  children,
  showArchitecture = true,
}: {
  slug: string
  subs?: SubNav[]
  children: ReactNode
  showArchitecture?: boolean
}): React.JSX.Element {
  const m = MODULES.find((x) => x.slug === slug)
  if (!m) return <main className="container">Moduli haipatikani.</main>
  const chipInk = m.accent === BRAND.yellow ? NEUTRAL.ink : TEXT.onJewel
  return (
    <main style={{ paddingTop: 24, paddingBottom: 120, background: CREAM.milk, minHeight: '100vh' }}>
      <section className="container" style={{ padding: '20px 24px 12px' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 12, color: TEXT.muted, fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            textDecoration: 'none', marginBottom: 18,
          }}
        >
          <span aria-hidden>←</span> Toka
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <h1
            className="serif"
            style={{
              margin: 0, fontSize: 'clamp(32px, 4.6vw, 48px)',
              letterSpacing: '-0.5px', color: TEXT.heading, lineHeight: 1.05,
              fontWeight: 800,
            }}
          >
            {m.name}
          </h1>
          <span
            style={{
              padding: '4px 10px', borderRadius: 999,
              background: m.accent, color: chipInk,
              fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
              fontWeight: 700,
            }}
          >
            {m.english}
          </span>
        </div>
        {showArchitecture && (
          <div style={{ marginTop: 10 }}>
            <ArchitectureBadge moduleSlug={slug} />
          </div>
        )}
      </section>

      {subs && subs.length > 0 ? (
        <nav
          className="container"
          aria-label={m.name}
          style={{
            display: 'flex', flexWrap: 'wrap', gap: 8, padding: 8,
            marginTop: 8, marginBottom: 16,
          }}
        >
          {subs.map((s) => (
            <NavLink
              key={s.to}
              to={s.to}
              end={s.to === '.' || s.to === ''}
              style={({ isActive }) => ({
                padding: '10px 16px',
                borderRadius: RADII.chip,
                fontSize: 13, letterSpacing: 0.2, fontWeight: isActive ? 700 : 600,
                background: isActive ? m.accent : CREAM.ivory,
                color: isActive ? (m.accent === BRAND.yellow ? NEUTRAL.ink : TEXT.onJewel) : TEXT.body,
                border: `1px solid ${isActive ? m.accent : hexToRgba(NEUTRAL.ink, 0.12)}`,
                textDecoration: 'none',
                transition: '160ms cubic-bezier(.25,.46,.45,.94)',
              })}
            >
              {s.label}
            </NavLink>
          ))}
        </nav>
      ) : null}

      <section className="container">{children}</section>
    </main>
  )
}

/** Card primitive — cream ivory surface, accent top stripe. */
export function Card({
  title, children, accent = BRAND.green,
}: { title?: string; children: ReactNode; accent?: string }): React.JSX.Element {
  return (
    <section
      style={{
        background: CREAM.ivory,
        border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.10)}`,
        borderTop: `3px solid ${accent}`,
        borderRadius: RADII.sheet,
        padding: 22,
        marginBottom: 16,
        boxShadow: '0 1px 0 rgba(11,9,8,0.04), 0 8px 22px rgba(11,9,8,0.05)',
      }}
    >
      {title ? (
        <h2 className="serif" style={{
          margin: '0 0 12px', fontSize: 20, letterSpacing: TYPE.tightTrack,
          color: TEXT.heading, fontWeight: 800,
        }}>
          {title}
        </h2>
      ) : null}
      <div style={{ color: TEXT.body, lineHeight: TYPE.bodyLeading, fontSize: 14.5 }}>
        {children}
      </div>
    </section>
  )
}

/** Filterable input on cream. */
export function Filter({
  value, onChange, placeholder,
}: { value: string; onChange: (v: string) => void; placeholder?: string }): React.JSX.Element {
  return (
    <div style={{ marginBottom: 16 }}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '12px 16px', borderRadius: RADII.chip,
          background: CREAM.milk,
          border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.22)}`,
          color: TEXT.body, fontSize: 14, outline: 'none',
        }}
      />
    </div>
  )
}

/** Lightweight table on cream. */
export function Table({ headers, children }: { headers: string[]; children: ReactNode }): React.JSX.Element {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, color: TEXT.body }}>
        <thead>
          <tr>{headers.map((h) => (
            <th key={h} style={{
              textAlign: 'left', padding: '10px 12px', fontSize: 11,
              letterSpacing: '0.10em', textTransform: 'uppercase',
              color: TEXT.muted, fontWeight: 700,
              borderBottom: `1px solid ${hexToRgba(NEUTRAL.ink, 0.14)}`,
            }}>{h}</th>
          ))}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export function Td({ children, style }: { children: ReactNode; style?: React.CSSProperties }): React.JSX.Element {
  return <td style={{
    padding: '12px', verticalAlign: 'top',
    borderBottom: `1px solid ${hexToRgba(NEUTRAL.ink, 0.08)}`,
    color: TEXT.body,
    ...style,
  }}>{children}</td>
}
