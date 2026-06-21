import type { CSSProperties, ReactNode } from 'react'
import { BRAND, CREAM, JEWEL, NEUTRAL, RADII, TEXT, TYPE, hexToRgba } from '../../../lib/glass'

interface CardProps {
  title?: string
  english?: string
  children: ReactNode
  accent?: string
  style?: CSSProperties
}

/**
 * WATAALAM shared card — solid ivory surface, accent-tinted stripe + border.
 * All text uses solid TEXT tokens for readability on cream backgrounds.
 */
export function Card({ title, english, children, accent = BRAND.green, style }: CardProps) {
  return (
    <section
      style={{
        background: CREAM.ivory,
        border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.10)}`,
        borderTop: `3px solid ${accent}`,
        borderRadius: RADII.sheet,
        padding: 20,
        color: TEXT.body,
        boxShadow: '0 1px 0 rgba(11,9,8,0.04), 0 8px 22px rgba(11,9,8,0.05)',
        ...style,
      }}
    >
      {title && (
        <header style={{ marginBottom: 14 }}>
          <h2
            style={{
              fontFamily: TYPE.serif,
              fontSize: 17,
              letterSpacing: TYPE.tightTrack,
              margin: 0,
              color: TEXT.heading,
              fontWeight: 800,
            }}
          >
            {title}
            {english && (
              <span
                style={{
                  fontSize: 11,
                  color: TEXT.muted,
                  marginLeft: 10,
                  fontFamily: TYPE.sans,
                  letterSpacing: '0.10em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                {english}
              </span>
            )}
          </h2>
        </header>
      )}
      {children}
    </section>
  )
}

export function H1({ children, english }: { children: ReactNode; english?: string }) {
  return (
    <h1
      style={{
        fontFamily: TYPE.serif,
        fontSize: 'clamp(24px, 3vw, 32px)',
        letterSpacing: TYPE.tighterTrack,
        margin: '0 0 18px',
        lineHeight: TYPE.headLeading,
        color: TEXT.heading,
        fontWeight: 800,
      }}
    >
      {children}
      {english && (
        <span
          style={{
            fontSize: 13,
            color: TEXT.muted,
            marginLeft: 10,
            fontFamily: TYPE.sans,
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          · {english}
        </span>
      )}
    </h1>
  )
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        display: 'block',
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: TEXT.muted,
        fontWeight: 700,
        marginBottom: 4,
      }}
    >
      {children}
    </span>
  )
}

export function fieldStyle(): CSSProperties {
  return {
    width: '100%',
    padding: '10px 13px',
    borderRadius: RADII.chip,
    background: CREAM.milk,
    border: `1px solid ${hexToRgba(NEUTRAL.ink, 0.22)}`,
    color: TEXT.body,
    fontFamily: TYPE.sans,
    fontSize: 13,
    outline: 'none',
  }
}

export function buttonStyle(jewel: string, primary = false): CSSProperties {
  return {
    padding: '10px 18px',
    borderRadius: RADII.chip,
    background: primary ? jewel : 'transparent',
    border: `1px solid ${primary ? jewel : hexToRgba(NEUTRAL.ink, 0.28)}`,
    color: primary
      ? jewel === BRAND.yellow
        ? NEUTRAL.ink
        : TEXT.onJewel
      : TEXT.body,
    fontFamily: TYPE.sans,
    fontSize: 13,
    fontWeight: primary ? 700 : 600,
    cursor: 'pointer',
  }
}

// JEWEL retained as an import to avoid breaking callers that reach into shared module.
void JEWEL
